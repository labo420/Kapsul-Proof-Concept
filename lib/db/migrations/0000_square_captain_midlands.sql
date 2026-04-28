CREATE TABLE IF NOT EXISTS "events" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"date" text NOT NULL,
	"delivery_mode" text DEFAULT 'party' NOT NULL,
	"vault_hours" integer DEFAULT 24,
	"plan" text DEFAULT 'free' NOT NULL,
	"theme_gradient_start" text DEFAULT '#6366F1' NOT NULL,
	"theme_gradient_end" text DEFAULT '#EC4899' NOT NULL,
	"cover_image_path" text,
	"photo_count" integer DEFAULT 0 NOT NULL,
	"guest_count" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"host_token" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "photos" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"guest_id" text NOT NULL,
	"object_path" text NOT NULL,
	"width" integer,
	"height" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "guests" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"guest_id" text NOT NULL,
	"token" text DEFAULT '' NOT NULL,
	"photo_count" integer DEFAULT 0 NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
