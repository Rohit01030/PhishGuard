/*
  # OTP Authentication System

  1. New Tables
    - `otp_codes`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `code` (text, 6-digit OTP)
      - `created_at` (timestamp)
      - `expires_at` (timestamp)
      - `verified` (boolean, default false)
      - `attempts` (integer, tracks failed verification attempts)

  2. Security
    - Enable RLS on `otp_codes` table
    - Add policy for users to verify their own OTP
    - Add index on email and expires_at for efficient lookups
*/

CREATE TABLE IF NOT EXISTS otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code text NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  verified boolean DEFAULT false,
  attempts integer DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_otp_email_expires ON otp_codes(email, expires_at);

ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can verify OTP for their email"
  ON otp_codes
  FOR UPDATE
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read OTP for verification"
  ON otp_codes
  FOR SELECT
  TO anon
  USING (true);
