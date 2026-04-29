-- Migrate legacy delivery_mode values to new schema
UPDATE events SET delivery_mode = 'now' WHERE delivery_mode = 'party';
UPDATE events SET delivery_mode = 'morning_after' WHERE delivery_mode = 'vault';

-- Set new database-level default
ALTER TABLE events ALTER COLUMN delivery_mode SET DEFAULT 'morning_after';

-- Add check constraint (drop first to avoid errors on re-run)
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_delivery_mode_check;
ALTER TABLE events ADD CONSTRAINT events_delivery_mode_check CHECK (delivery_mode IN ('now', 'morning_after'));
