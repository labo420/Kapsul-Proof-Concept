import { Router } from "express";
import { z } from "zod";
import { randomUUID } from "crypto";
import { db, usersTable, followsTable, eventsTable, photosTable, notificationsTable, photoLikesTable, guestsTable } from "@workspace/db";
import { eq, and, ne, sql, desc, inArray } from "drizzle-orm";
import { requireAuth, optionalAuth } from "../middlewares/auth.js";

const router = Router();

function param(p: string | string[]): string {
  return Array.isArray(p) ? p[0]! : p;
}

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
    const followedId = param(req.params.userId);
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
    const result = await db.insert(followsTable).values({ id: randomUUID(), followerId, followedId }).onConflictDoNothing().returning();
    if (result.length > 0) {
      await db.insert(notificationsTable).values({
        id: randomUUID(),
        recipientId: followedId,
        actorId: followerId,
        type: "follow",
        entityId: followerId,
      }).onConflictDoNothing();
    }
    res.json({ following: true });
  } catch (err) {
    req.log.error(err, "follow error");
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/social/follow/:userId", requireAuth, async (req, res): Promise<void> => {
  try {
    const followedId = param(req.params.userId);
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
    const userId = param(req.params.userId);
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
    const userId = param(req.params.userId);
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
    const userId = param(req.params.userId);
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

    const idList = sql.join(followingIds.map((id) => sql`${id}`), sql`, `);

    const rawRows = await db.execute(sql`
      SELECT 'photo' AS type, id, object_path AS "objectPath",
             guest_id AS "authorId", event_id AS "eventId",
             NULL::text AS title, created_at AS "createdAt"
      FROM photos
      WHERE is_public = true AND guest_id IN (${idList})
      UNION ALL
      SELECT 'event' AS type, id, cover_image_path AS "objectPath",
             creator_id AS "authorId", id AS "eventId",
             name AS title, created_at AS "createdAt"
      FROM events
      WHERE is_public = true AND creator_id IN (${idList})
      ORDER BY "createdAt" DESC
      LIMIT ${limit} OFFSET ${offset}
    `);

    const allItems = rawRows.rows as Array<{
      type: string;
      id: string;
      objectPath: string | null;
      authorId: string;
      eventId: string;
      title: string | null;
      createdAt: Date;
    }>;

    const uniqueAuthorIds = [...new Set(allItems.map((p) => p.authorId).filter(Boolean) as string[])];
    const itemAuthors = uniqueAuthorIds.length > 0
      ? await db.select().from(usersTable).where(inArray(usersTable.id, uniqueAuthorIds))
      : [];

    const authorMap = Object.fromEntries(itemAuthors.map((u) => [u.id, safeUser(u)]));

    const items = allItems.map((p) => ({
      ...p,
      author: p.authorId ? (authorMap[p.authorId] ?? null) : null,
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
    const photoId = param(req.params.photoId);
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
    const { isPublic, hostToken } = z.object({
      isPublic: z.boolean(),
      hostToken: z.string().optional(),
    }).parse(req.body);

    const eventId = param(req.params.eventId);
    const currentUserId = req.user!.userId;

    const [event] = await db
      .select({ id: eventsTable.id, hostToken: eventsTable.hostToken, creatorId: eventsTable.creatorId })
      .from(eventsTable)
      .where(eq(eventsTable.id, eventId));

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    const isOwner = event.creatorId === currentUserId || event.hostToken === hostToken;
    if (!isOwner) {
      res.status(403).json({ error: "Not authorized to update this event" });
      return;
    }

    await db.update(eventsTable).set({ isPublic }).where(eq(eventsTable.id, eventId));
    res.json({ id: eventId, isPublic });
  } catch (err) {
    req.log.error(err, "event privacy error");
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/social/myphotos", requireAuth, async (req, res): Promise<void> => {
  try {
    const currentUserId = req.user!.userId;
    const photos = await db
      .select()
      .from(photosTable)
      .where(eq(photosTable.guestId, currentUserId))
      .orderBy(desc(photosTable.createdAt))
      .limit(50);
    res.json(photos);
  } catch (err) {
    req.log.error(err, "myphotos error");
    res.status(500).json({ error: "Server error" });
  }
});

async function canAccessPhoto(photoId: string, userId: string | undefined): Promise<boolean> {
  const [photo] = await db
    .select({ eventId: photosTable.eventId, isPublic: photosTable.isPublic })
    .from(photosTable)
    .where(eq(photosTable.id, photoId));
  if (!photo) return false;

  const [event] = await db
    .select({ isPublic: eventsTable.isPublic, creatorId: eventsTable.creatorId })
    .from(eventsTable)
    .where(eq(eventsTable.id, photo.eventId));
  if (!event) return false;

  if (event.isPublic) return true;
  if (!userId) return false;
  if (event.creatorId === userId) return true;

  const [membership] = await db
    .select({ id: guestsTable.id })
    .from(guestsTable)
    .where(and(eq(guestsTable.eventId, photo.eventId), eq(guestsTable.guestId, userId)));
  return !!membership;
}

router.post("/social/photos/:photoId/like", requireAuth, async (req, res): Promise<void> => {
  try {
    const photoId = param(req.params.photoId);
    const userId = req.user!.userId;

    if (!(await canAccessPhoto(photoId, userId))) {
      res.status(403).json({ error: "Cannot access this photo" });
      return;
    }

    const [photo] = await db.select({ guestId: photosTable.guestId }).from(photosTable).where(eq(photosTable.id, photoId));

    await db
      .insert(photoLikesTable)
      .values({ id: randomUUID(), photoId, userId })
      .onConflictDoNothing();

    if (photo?.guestId && photo.guestId !== userId) {
      await db.insert(notificationsTable).values({
        id: randomUUID(),
        recipientId: photo.guestId,
        actorId: userId,
        type: "like",
        entityId: photoId,
      }).onConflictDoNothing();
    }

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(photoLikesTable)
      .where(eq(photoLikesTable.photoId, photoId));

    res.json({ liked: true, likeCount: count });
  } catch (err) {
    req.log.error(err, "like photo error");
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/social/photos/:photoId/like", requireAuth, async (req, res): Promise<void> => {
  try {
    const photoId = param(req.params.photoId);
    const userId = req.user!.userId;

    if (!(await canAccessPhoto(photoId, userId))) {
      res.status(403).json({ error: "Cannot access this photo" });
      return;
    }

    await db
      .delete(photoLikesTable)
      .where(and(eq(photoLikesTable.photoId, photoId), eq(photoLikesTable.userId, userId)));

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(photoLikesTable)
      .where(eq(photoLikesTable.photoId, photoId));

    res.json({ liked: false, likeCount: count });
  } catch (err) {
    req.log.error(err, "unlike photo error");
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/social/photos/:photoId/likes", optionalAuth, async (req, res): Promise<void> => {
  try {
    const photoId = param(req.params.photoId);
    const userId = req.user?.userId;

    if (!(await canAccessPhoto(photoId, userId))) {
      res.status(403).json({ error: "Cannot access this photo" });
      return;
    }

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(photoLikesTable)
      .where(eq(photoLikesTable.photoId, photoId));

    let liked = false;
    if (userId) {
      const [existing] = await db
        .select()
        .from(photoLikesTable)
        .where(and(eq(photoLikesTable.photoId, photoId), eq(photoLikesTable.userId, userId)));
      liked = !!existing;
    }

    res.json({ likeCount: count, liked });
  } catch (err) {
    req.log.error(err, "get likes error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
