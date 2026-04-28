import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const eventsTable = pgTable("events", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  date: text("date").notNull(),
  deliveryMode: text("delivery_mode").notNull().default("party"),
  vaultHours: integer("vault_hours").default(24),
  plan: text("plan").notNull().default("free"),
  themeGradientStart: text("theme_gradient_start").notNull().default("#6366F1"),
  themeGradientEnd: text("theme_gradient_end").notNull().default("#EC4899"),
  coverImagePath: text("cover_image_path"),
  photoCount: integer("photo_count").notNull().default(0),
  guestCount: integer("guest_count").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  isPublic: boolean("is_public").notNull().default(true),
  hostToken: text("host_token"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEventSchema = createInsertSchema(eventsTable).omit({ createdAt: true });
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof eventsTable.$inferSelect;
