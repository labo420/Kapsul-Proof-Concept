import { Router } from "express";
import { db, eventsTable, photosTable, guestsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { randomUUID } from "crypto";
import multer from "multer";
import { objectStorageClient } from "../lib/objectStorage.js";

const PLAN_MAX_GUESTS: Record<string, number> = { free: 15, party: 50, pro: 9999 };

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

router.post("/events", async (req, res) => {
  try {
    const body = CreateEventBody.parse(req.body);
    const id = body.id ?? randomUUID();
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
        },
      })
      .returning();
    res.json(event);
  } catch (err) {
    req.log.error(err, "create event error");
    res.status(400).json({ error: "Invalid request" });
  }
});

router.get("/events", async (_req, res) => {
  try {
    const events = await db
      .select()
      .from(eventsTable)
      .orderBy(eventsTable.createdAt);
    res.json(events);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/events/:id", async (req, res): Promise<void> => {
  try {
    const id = param(req.params.id);
    const [event] = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, id));
    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }
    res.json(event);
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

    if (existing.length === 0) {
      const maxGuests = PLAN_MAX_GUESTS[event.plan] ?? 9999;
      if (event.guestCount >= maxGuests) {
        res.status(403).json({ error: "guest_limit_reached", max: maxGuests });
        return;
      }
      await db.insert(guestsTable).values({
        id: randomUUID(),
        eventId: id,
        guestId,
      });
      await db
        .update(eventsTable)
        .set({ guestCount: event.guestCount + 1 })
        .where(eq(eventsTable.id, id));
    }

    const [updated] = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, id));
    res.json({ event: updated });
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

router.get("/events/:id/photos", async (req, res): Promise<void> => {
  try {
    const id = param(req.params.id);
    const [event] = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, id));
    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }
    const photos = await db
      .select()
      .from(photosTable)
      .where(eq(photosTable.eventId, id))
      .orderBy(photosTable.createdAt);
    res.json(photos);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/events/:id/guests", async (req, res): Promise<void> => {
  try {
    const id = param(req.params.id);
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

    const [event] = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, eventId));
    if (!event) {
      res.status(404).json({ error: "Event not found" });
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

    await db
      .delete(guestsTable)
      .where(and(eq(guestsTable.eventId, eventId), eq(guestsTable.guestId, guestId)));

    await db
      .update(eventsTable)
      .set({
        guestCount: Math.max(0, event.guestCount - 1),
        photoCount: Math.max(0, event.photoCount - photos.length),
      })
      .where(eq(eventsTable.id, eventId));

    res.json({ removed: true, photosDeleted: photos.length });
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
