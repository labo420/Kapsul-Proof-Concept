-- Migrate legacy delivery_mode values to new schema
UPDATE events SET delivery_mode = 'now' WHERE delivery_mode = 'party';
UPDATE events SET delivery_mode = 'morning_after' WHERE delivery_mode = 'vault';

-- Add check constraint to enforce allowed values
ALTER TABLE events ADD CONSTRAINT events_delivery_mode_check CHECK (delivery_mode IN ('now', 'morning_after'));
