ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "is_public" boolean DEFAULT true NOT NULL;
--> statement-breakpoint
ALTER TABLE "photos" ADD COLUMN IF NOT EXISTS "is_public" boolean DEFAULT true NOT NULL;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
        "id" text PRIMARY KEY NOT NULL,
        "email" text NOT NULL,
        "username" text NOT NULL,
        "display_name" text NOT NULL,
        "bio" text DEFAULT '' NOT NULL,
        "link" text DEFAULT '' NOT NULL,
        "avatar_url" text,
        "is_public" boolean DEFAULT true NOT NULL,
        "password_hash" text NOT NULL,
        "highlights" text[] DEFAULT '{}' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "users_email_unique" UNIQUE("email"),
        CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "follows" (
        "id" text PRIMARY KEY NOT NULL,
        "follower_id" text NOT NULL,
        "followed_id" text NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "unique_follow" UNIQUE("follower_id","followed_id")
);
