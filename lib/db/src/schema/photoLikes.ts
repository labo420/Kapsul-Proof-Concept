import { pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";

export const photoLikesTable = pgTable(
  "photo_likes",
  {
    id: text("id").primaryKey(),
    photoId: text("photo_id").notNull(),
    userId: text("user_id").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [unique("uq_photo_like").on(t.photoId, t.userId)]
);

export type PhotoLike = typeof photoLikesTable.$inferSelect;
