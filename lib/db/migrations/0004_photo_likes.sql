CREATE TABLE "photo_likes" (
  "id" text PRIMARY KEY NOT NULL,
  "photo_id" text NOT NULL,
  "user_id" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "uq_photo_like" UNIQUE("photo_id","user_id")
);
