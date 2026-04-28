CREATE TABLE "photo_comments" (
  "id" text PRIMARY KEY NOT NULL,
  "photo_id" text NOT NULL,
  "user_id" text NOT NULL,
  "text" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
