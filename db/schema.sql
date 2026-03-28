-- Schema for persistent Shopify session storage (Neon/Postgres)
-- Creates a `shopify_sessions` table that stores serialized session objects in JSONB.
-- Run with: psql "$DATABASE_URL" -f db/schema.sql

CREATE TABLE IF NOT EXISTS shopify_sessions (
  id TEXT PRIMARY KEY,
  shop TEXT,
  is_online BOOLEAN,
  expires_at TIMESTAMP WITH TIME ZONE,
  scope TEXT,
  session_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_shopify_sessions_shop ON shopify_sessions (shop);

-- Trigger to keep `updated_at` current
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON shopify_sessions;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON shopify_sessions
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated_at();
