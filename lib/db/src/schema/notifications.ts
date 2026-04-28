import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const notificationsTable = pgTable("notifications", {
  id: text("id").primaryKey(),
  recipientId: text("recipient_id").notNull(),
  actorId: text("actor_id").notNull(),
  type: text("type").notNull(),
  entityId: text("entity_id"),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Notification = typeof notificationsTable.$inferSelect;
