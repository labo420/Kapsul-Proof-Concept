import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const photoCommentsTable = pgTable("photo_comments", {
  id: text("id").primaryKey(),
  photoId: text("photo_id").notNull(),
  userId: text("user_id").notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type PhotoComment = typeof photoCommentsTable.$inferSelect;
