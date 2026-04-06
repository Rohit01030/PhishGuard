/*
  # Create system monitoring tables

  1. New Tables
    - `system_health_logs`
      - `id` (uuid, primary key)
      - `status` (text: healthy/degraded/unhealthy)
      - `database_status` (text)
      - `database_response_time` (integer, milliseconds)
      - `api_status` (text)
      - `api_response_time` (integer, milliseconds)
      - `error_message` (text, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `system_health_logs` table
    - Allow public reads for monitoring dashboards
*/

CREATE TABLE IF NOT EXISTS system_health_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'unknown',
  database_status text NOT NULL DEFAULT 'unknown',
  database_response_time integer,
  api_status text NOT NULL DEFAULT 'unknown',
  api_response_time integer,
  error_message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE system_health_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read health logs"
  ON system_health_logs FOR SELECT
  USING (true);

CREATE INDEX IF NOT EXISTS idx_health_logs_created_at
  ON system_health_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_health_logs_status
  ON system_health_logs(status);
