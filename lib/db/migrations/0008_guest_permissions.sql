ALTER TABLE events ADD COLUMN IF NOT EXISTS guests_can_view boolean NOT NULL DEFAULT true;
ALTER TABLE events ADD COLUMN IF NOT EXISTS guests_can_download boolean NOT NULL DEFAULT true;
