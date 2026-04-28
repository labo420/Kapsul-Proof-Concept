import { Router } from "express";
import { z } from "zod";
import { randomUUID } from "crypto";
import { db, usersTable, followsTable, eventsTable, photosTable } from "@workspace/db";
import { eq, and, ne, sql, desc, inArray } from "drizzle-orm";
import { requireAuth, optionalAuth } from "../middlewares/auth.js";

const router = Router();

const safeUser = (u: typeof usersTable.$inferSelect) => ({
  id: u.id,
  username: u.username,
  displayName: u.displayName,
  avatarUrl: u.avatarUrl,
  isPublic: u.isPublic,
  bio: u.bio,
  link: u.link,
  highlights: u.highlights,
  createdAt: u.createdAt,
});

router.post("/social/follow/:userId", requireAuth, async (req, res): Promise<void> => {
  try {
    const followedId = req.params.userId;
    const followerId = req.user!.userId;
    if (followedId === followerId) {
      res.status(400).json({ error: "Cannot follow yourself" });
      return;
    }
    const [target] = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.id, followedId));
    if (!target) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    await db.insert(followsTable).values({ id: randomUUID(), followerId, followedId }).onConflictDoNothing();
    res.json({ following: true });
  } catch (err) {
    req.log.error(err, "follow error");
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/social/follow/:userId", requireAuth, async (req, res): Promise<void> => {
  try {
    const followedId = req.params.userId;
    const followerId = req.user!.userId;
    await db
      .delete(followsTable)
      .where(and(eq(followsTable.followerId, followerId), eq(followsTable.followedId, followedId)));
    res.json({ following: false });
  } catch (err) {
    req.log.error(err, "unfollow error");
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/social/followers/:userId", optionalAuth, async (req, res): Promise<void> => {
  try {
    const userId = req.params.userId;
    const rows = await db
      .select({ user: usersTable })
      .from(followsTable)
      .innerJoin(usersTable, eq(usersTable.id, followsTable.followerId))
      .where(eq(followsTable.followedId, userId));
    res.json(rows.map((r) => safeUser(r.user)));
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/social/following/:userId", optionalAuth, async (req, res): Promise<void> => {
  try {
    const userId = req.params.userId;
    const rows = await db
      .select({ user: usersTable })
      .from(followsTable)
      .innerJoin(usersTable, eq(usersTable.id, followsTable.followedId))
      .where(eq(followsTable.followerId, userId));
    res.json(rows.map((r) => safeUser(r.user)));
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/social/counts/:userId", optionalAuth, async (req, res): Promise<void> => {
  try {
    const userId = req.params.userId;
    const [followers] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(followsTable)
      .where(eq(followsTable.followedId, userId));
    const [following] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(followsTable)
      .where(eq(followsTable.followerId, userId));
    const [posts] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(photosTable)
      .where(eq(photosTable.guestId, userId));

    let isFollowing = false;
    if (req.user && req.user.userId !== userId) {
      const [f] = await db
        .select({ id: followsTable.id })
        .from(followsTable)
        .where(and(eq(followsTable.followerId, req.user.userId), eq(followsTable.followedId, userId)));
      isFollowing = !!f;
    }

    res.json({
      followers: followers?.count ?? 0,
      following: following?.count ?? 0,
      posts: posts?.count ?? 0,
      isFollowing,
    });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/social/suggestions", requireAuth, async (req, res): Promise<void> => {
  try {
    const currentUserId = req.user!.userId;
    const alreadyFollowing = await db
      .select({ followedId: followsTable.followedId })
      .from(followsTable)
      .where(eq(followsTable.followerId, currentUserId));
    const excludeIds = [currentUserId, ...alreadyFollowing.map((f) => f.followedId)];

    const suggestions = await db
      .select()
      .from(usersTable)
      .where(and(
        eq(usersTable.isPublic, true),
        ne(usersTable.id, currentUserId),
      ))
      .orderBy(sql`random()`)
      .limit(10);

    const filtered = suggestions.filter((u) => !excludeIds.includes(u.id)).slice(0, 6);
    res.json(filtered.map(safeUser));
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/social/feed", requireAuth, async (req, res): Promise<void> => {
  try {
    const currentUserId = req.user!.userId;
    const page = Math.max(1, Number(req.query.page ?? 1));
    const limit = 20;
    const offset = (page - 1) * limit;

    const following = await db
      .select({ followedId: followsTable.followedId })
      .from(followsTable)
      .where(eq(followsTable.followerId, currentUserId));
    const followingIds = following.map((f) => f.followedId);

    if (followingIds.length === 0) {
      res.json({ items: [], hasMore: false });
      return;
    }

    const photos = await db
      .select({
        type: sql<string>`'photo'`,
        id: photosTable.id,
        objectPath: photosTable.objectPath,
        authorId: photosTable.guestId,
        eventId: photosTable.eventId,
        createdAt: photosTable.createdAt,
      })
      .from(photosTable)
      .where(and(
        eq(photosTable.isPublic, true),
        inArray(photosTable.guestId, followingIds),
      ))
      .orderBy(desc(photosTable.createdAt))
      .limit(limit)
      .offset(offset);

    const uniqueAuthorIds = [...new Set(photos.map((p) => p.authorId))];
    const photoAuthors = uniqueAuthorIds.length > 0
      ? await db.select().from(usersTable).where(inArray(usersTable.id, uniqueAuthorIds))
      : [];

    const authorMap = Object.fromEntries(photoAuthors.map((u) => [u.id, safeUser(u)]));

    const items = photos.map((p) => ({
      ...p,
      author: authorMap[p.authorId] ?? null,
    }));

    res.json({ items, hasMore: items.length === limit });
  } catch (err) {
    req.log.error(err, "feed error");
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/social/photos/:photoId/privacy", requireAuth, async (req, res): Promise<void> => {
  try {
    const { isPublic } = z.object({ isPublic: z.boolean() }).parse(req.body);
    const photoId = req.params.photoId;
    const currentUserId = req.user!.userId;
    const [photo] = await db
      .select()
      .from(photosTable)
      .where(and(eq(photosTable.id, photoId), eq(photosTable.guestId, currentUserId)));
    if (!photo) {
      res.status(404).json({ error: "Photo not found or not yours" });
      return;
    }
    await db.update(photosTable).set({ isPublic }).where(eq(photosTable.id, photoId));
    res.json({ id: photoId, isPublic });
  } catch (err) {
    req.log.error(err, "photo privacy error");
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/social/events/:eventId/privacy", requireAuth, async (req, res): Promise<void> => {
  try {
    const { isPublic } = z.object({ isPublic: z.boolean() }).parse(req.body);
    const eventId = req.params.eventId;
    await db.update(eventsTable).set({ isPublic }).where(eq(eventsTable.id, eventId));
    res.json({ id: eventId, isPublic });
  } catch (err) {
    req.log.error(err, "event privacy error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
