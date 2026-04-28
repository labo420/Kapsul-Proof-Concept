import { Router } from "express";
import { db, eventsTable, photosTable, guestsTable } from "@workspace/db";
import { eq, and, or } from "drizzle-orm";
import { z } from "zod";
import { randomUUID } from "crypto";
import multer from "multer";
import { objectStorageClient } from "../lib/objectStorage.js";
import { optionalAuth } from "../middlewares/auth.js";

const PLAN_MAX_GUESTS: Record<string, number> = { free: 15, party: 50, pro: 9999 };

const publicEventFields = {
  id: eventsTable.id,
  name: eventsTable.name,
  date: eventsTable.date,
  deliveryMode: eventsTable.deliveryMode,
  vaultHours: eventsTable.vaultHours,
  plan: eventsTable.plan,
  themeGradientStart: eventsTable.themeGradientStart,
  themeGradientEnd: eventsTable.themeGradientEnd,
  coverImagePath: eventsTable.coverImagePath,
  photoCount: eventsTable.photoCount,
  guestCount: eventsTable.guestCount,
  isActive: eventsTable.isActive,
  isPublic: eventsTable.isPublic,
  creatorId: eventsTable.creatorId,
  createdAt: eventsTable.createdAt,
} as const;

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

function getBucket() {
  const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
  if (!bucketId) throw new Error("DEFAULT_OBJECT_STORAGE_BUCKET_ID not set");
  return objectStorageClient.bucket(bucketId);
}

function param(p: string | string[]): string {
  return Array.isArray(p) ? p[0]! : p;
}

const CreateEventBody = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  date: z.string(),
  deliveryMode: z.enum(["party", "morning_after", "vault"]).default("party"),
  vaultHours: z.number().optional(),
  plan: z.enum(["free", "party", "pro"]).default("free"),
  themeGradientStart: z.string().default("#6366F1"),
  themeGradientEnd: z.string().default("#EC4899"),
});

router.post("/events", optionalAuth, async (req, res) => {
  try {
    const body = CreateEventBody.parse(req.body);
    const id = body.id ?? randomUUID();
    const hostToken = randomUUID();
    const creatorId = req.user?.userId ?? null;
    const [event] = await db
      .insert(eventsTable)
      .values({
        id,
        name: body.name,
        date: body.date,
        deliveryMode: body.deliveryMode,
        vaultHours: body.vaultHours ?? 24,
        plan: body.plan,
        themeGradientStart: body.themeGradientStart,
        themeGradientEnd: body.themeGradientEnd,
        hostToken,
        creatorId,
      })
      .onConflictDoUpdate({
        target: eventsTable.id,
        set: {
          name: body.name,
          date: body.date,
          deliveryMode: body.deliveryMode,
          vaultHours: body.vaultHours ?? 24,
          plan: body.plan,
          themeGradientStart: body.themeGradientStart,
          themeGradientEnd: body.themeGradientEnd,
          ...(creatorId ? { creatorId } : {}),
        },
      })
      .returning();
    res.json(event);
  } catch (err) {
    req.log.error(err, "create event error");
    res.status(400).json({ error: "Invalid request" });
  }
});

router.get("/events", optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const events = await db
      .select(publicEventFields)
      .from(eventsTable)
      .where(
        userId
          ? or(eq(eventsTable.isPublic, true), eq(eventsTable.creatorId, userId))
          : eq(eventsTable.isPublic, true)
      )
      .orderBy(eventsTable.createdAt);
    res.json(events);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/events/:id", optionalAuth, async (req, res): Promise<void> => {
  try {
    const id = param(req.params.id);
    const { hostToken } = req.query as { hostToken?: string };
    const [full] = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, id));
    if (!full) {
      res.status(404).json({ error: "Event not found" });
      return;
    }
    if (!full.isPublic) {
      const isCreator = req.user && req.user.userId === full.creatorId;
      const hasHostToken = hostToken && full.hostToken === hostToken;
      if (!isCreator && !hasHostToken) {
        res.status(403).json({ error: "Private event" });
        return;
      }
    }
    const { hostToken: _ht, ...safe } = full;
    res.json({ ...safe, hostToken: req.user?.userId === full.creatorId ? full.hostToken : undefined });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/events/:id/join", async (req, res): Promise<void> => {
  try {
    const id = param(req.params.id);
    const { guestId } = z.object({ guestId: z.string() }).parse(req.body);
    const [event] = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, id));
    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    const existing = await db
      .select()
      .from(guestsTable)
      .where(
        and(
          eq(guestsTable.eventId, id),
          eq(guestsTable.guestId, guestId),
        )
      );

    let guestToken: string | undefined;
    if (existing.length === 0) {
      const maxGuests = PLAN_MAX_GUESTS[event.plan] ?? 9999;
      if (event.guestCount >= maxGuests) {
        res.status(403).json({ error: "guest_limit_reached", max: maxGuests });
        return;
      }
      guestToken = randomUUID();
      await db.insert(guestsTable).values({
        id: randomUUID(),
        eventId: id,
        guestId,
        token: guestToken,
      });
      await db
        .update(eventsTable)
        .set({ guestCount: event.guestCount + 1 })
        .where(eq(eventsTable.id, id));
    }

    const [updated] = await db
      .select(publicEventFields)
      .from(eventsTable)
      .where(eq(eventsTable.id, id));
    res.json({ event: updated, ...(guestToken != null ? { guestToken } : {}) });
  } catch (err) {
    req.log.error(err, "join event error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post(
  "/events/:id/photos",
  upload.single("photo"),
  async (req, res): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }
      const id = param(req.params.id);
      const { guestId } = z.object({ guestId: z.string() }).parse(req.body);

      const [event] = await db
        .select()
        .from(eventsTable)
        .where(eq(eventsTable.id, id));
      if (!event) {
        res.status(404).json({ error: "Event not found" });
        return;
      }

      const photoId = randomUUID();
      const ext = req.file.mimetype.includes("png") ? "png" : "jpg";
      const objectKey = `photos/${id}/${photoId}.${ext}`;

      const bucket = getBucket();
      const file = bucket.file(objectKey);
      await file.save(req.file.buffer, {
        contentType: req.file.mimetype,
        metadata: { eventId: id, guestId },
      });

      const objectPath = `/api/photos/${objectKey}`;
      await db.insert(photosTable).values({
        id: photoId,
        eventId: id,
        guestId,
        objectPath,
      });

      await db
        .update(eventsTable)
        .set({ photoCount: event.photoCount + 1 })
        .where(eq(eventsTable.id, id));

      await db
        .update(guestsTable)
        .set({})
        .where(
          and(
            eq(guestsTable.eventId, id),
            eq(guestsTable.guestId, guestId),
          )
        );

      res.json({ id: photoId, objectPath, eventId: id });
    } catch (err) {
      req.log.error(err, "photo upload error");
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.get("/events/:id/photos", optionalAuth, async (req, res): Promise<void> => {
  try {
    const id = param(req.params.id);
    const { hostToken, guestId } = req.query as { hostToken?: string; guestId?: string };

    const [event] = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, id));
    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    const isCreator = req.user && req.user.userId === event.creatorId;
    const isHost = hostToken && event.hostToken === hostToken;

    let isGuest = false;
    if (guestId) {
      const [guestRow] = await db
        .select({ guestId: guestsTable.guestId })
        .from(guestsTable)
        .where(and(eq(guestsTable.eventId, id), eq(guestsTable.guestId, guestId)));
      isGuest = !!guestRow;
    }

    const isMember = isCreator || isHost || isGuest;

    if (!event.isPublic && !isMember) {
      res.status(403).json({ error: "Private event" });
      return;
    }

    const photos = await db
      .select()
      .from(photosTable)
      .where(
        isMember
          ? eq(photosTable.eventId, id)
          : and(eq(photosTable.eventId, id), eq(photosTable.isPublic, true))
      )
      .orderBy(photosTable.createdAt);
    res.json(photos);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/events/:id/guests", async (req, res): Promise<void> => {
  try {
    const id = param(req.params.id);
    const { hostToken } = req.query as { hostToken?: string };

    const [event] = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, id));

    if (!event || !event.hostToken || event.hostToken !== hostToken) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const guests = await db
      .select()
      .from(guestsTable)
      .where(eq(guestsTable.eventId, id))
      .orderBy(guestsTable.joinedAt);

    const photos = await db
      .select()
      .from(photosTable)
      .where(eq(photosTable.eventId, id));

    const photoCounts: Record<string, number> = {};
    for (const photo of photos) {
      photoCounts[photo.guestId] = (photoCounts[photo.guestId] ?? 0) + 1;
    }

    res.json(
      guests.map((g) => ({
        guestId: g.guestId,
        joinedAt: g.joinedAt,
        photoCount: photoCounts[g.guestId] ?? 0,
      }))
    );
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/events/:id/guests/:guestId", async (req, res): Promise<void> => {
  try {
    const eventId = param(req.params.id);
    const guestId = param(req.params.guestId);

    const { token } = z
      .object({ token: z.string() })
      .parse(req.body);

    const [event] = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, eventId));
    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    const isHost = event.hostToken != null && token === event.hostToken;

    let isSelf = false;
    if (!isHost) {
      const [guestRecord] = await db
        .select()
        .from(guestsTable)
        .where(and(eq(guestsTable.eventId, eventId), eq(guestsTable.guestId, guestId)));
      isSelf = !!guestRecord?.token && token === guestRecord.token;
    }

    if (!isHost && !isSelf) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const photos = await db
      .select()
      .from(photosTable)
      .where(and(eq(photosTable.eventId, eventId), eq(photosTable.guestId, guestId)));

    const bucket = getBucket();
    await Promise.all(
      photos.map((photo) => {
        const objectKey = photo.objectPath.replace(/^\/api\/photos\//, "");
        return bucket.file(objectKey).delete().catch(() => {});
      })
    );

    if (photos.length > 0) {
      await db
        .delete(photosTable)
        .where(and(eq(photosTable.eventId, eventId), eq(photosTable.guestId, guestId)));
    }

    const deletedGuests = await db
      .delete(guestsTable)
      .where(and(eq(guestsTable.eventId, eventId), eq(guestsTable.guestId, guestId)))
      .returning();

    if (deletedGuests.length > 0) {
      await db
        .update(eventsTable)
        .set({
          guestCount: Math.max(0, event.guestCount - 1),
          photoCount: Math.max(0, event.photoCount - photos.length),
        })
        .where(eq(eventsTable.id, eventId));
    }

    res.json({ removed: deletedGuests.length > 0, photosDeleted: photos.length });
  } catch (err) {
    req.log.error(err, "remove guest error");
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/photos/{*objectPath}", async (req, res): Promise<void> => {
  try {
    const objectKey = param((req.params as unknown as Record<string, string>)["objectPath"] ?? "");
    if (!objectKey) {
      res.status(400).json({ error: "Missing path" });
      return;
    }
    const bucket = getBucket();
    const file = bucket.file(objectKey);
    const [exists] = await file.exists();
    if (!exists) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const [meta] = await file.getMetadata();
    res.setHeader(
      "Content-Type",
      (meta.contentType as string) || "image/jpeg"
    );
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    file.createReadStream().pipe(res);
  } catch (err) {
    req.log.error(err, "serve photo error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
