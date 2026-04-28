import { Router } from "express";
import { db, notificationsTable, usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

function param(p: string | string[]): string {
  return Array.isArray(p) ? p[0]! : p;
}

router.get("/notifications", requireAuth, async (req, res): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const rows = await db
      .select({
        id: notificationsTable.id,
        type: notificationsTable.type,
        entityId: notificationsTable.entityId,
        read: notificationsTable.read,
        createdAt: notificationsTable.createdAt,
        actor: {
          id: usersTable.id,
          username: usersTable.username,
          displayName: usersTable.displayName,
          avatarUrl: usersTable.avatarUrl,
        },
      })
      .from(notificationsTable)
      .innerJoin(usersTable, eq(usersTable.id, notificationsTable.actorId))
      .where(eq(notificationsTable.recipientId, userId))
      .orderBy(desc(notificationsTable.createdAt))
      .limit(50);
    res.json(rows);
  } catch (err) {
    req.log.error(err, "notifications error");
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/notifications/unread-count", requireAuth, async (req, res): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const rows = await db
      .select({ id: notificationsTable.id, read: notificationsTable.read })
      .from(notificationsTable)
      .where(eq(notificationsTable.recipientId, userId));
    const unreadCount = rows.filter((r) => !r.read).length;
    res.json({ unreadCount, total: rows.length });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/notifications/read-all", requireAuth, async (req, res): Promise<void> => {
  try {
    const userId = req.user!.userId;
    await db
      .update(notificationsTable)
      .set({ read: true })
      .where(eq(notificationsTable.recipientId, userId));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/notifications/:id/read", requireAuth, async (req, res): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const id = param(req.params.id);
    const [row] = await db
      .select({ recipientId: notificationsTable.recipientId })
      .from(notificationsTable)
      .where(eq(notificationsTable.id, id));
    if (!row || row.recipientId !== userId) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    await db.update(notificationsTable).set({ read: true }).where(eq(notificationsTable.id, id));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
