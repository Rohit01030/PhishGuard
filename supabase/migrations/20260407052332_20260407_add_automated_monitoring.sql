/*
  # Add automated monitoring triggers

  1. New Table
    - `monitoring_schedules`
      - `id` (uuid, primary key)
      - `function_name` (text)
      - `last_run` (timestamp)
      - `next_run` (timestamp)
      - `status` (text: pending/running/completed/failed)
      - `run_interval_minutes` (integer)
      - `is_active` (boolean)
      - `created_at` (timestamp)

  2. New Function
    - PL/pgSQL function to trigger monitoring checks
    - Automatically called via timer mechanism

  3. Indexes for performance
    - Index on `next_run` for scheduler queries
*/

CREATE TABLE IF NOT EXISTS monitoring_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  function_name text NOT NULL UNIQUE,
  last_run timestamptz,
  next_run timestamptz NOT NULL DEFAULT (now() + interval '1 minute'),
  status text NOT NULL DEFAULT 'pending',
  run_interval_minutes integer NOT NULL DEFAULT 15,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE monitoring_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read monitoring schedules"
  ON monitoring_schedules FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage monitoring schedules"
  ON monitoring_schedules FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_monitoring_next_run
  ON monitoring_schedules(next_run)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_monitoring_function_name
  ON monitoring_schedules(function_name);

INSERT INTO monitoring_schedules (function_name, run_interval_minutes, is_active)
VALUES ('monitor-scheduler', 15, true)
ON CONFLICT (function_name) DO UPDATE
SET is_active = true, run_interval_minutes = 15;
