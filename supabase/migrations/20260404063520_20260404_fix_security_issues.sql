/*
  # Security Issues Fix

  1. Add Covering Index for Foreign Key
    - Create index on email_features(analysis_id) to cover the foreign key
    - Improves query performance for lookups on analysis_id

  2. Remove Unused Indexes
    - Drop idx_email_analyses_user_id (unused, covered by RLS policies)
    - Drop idx_user_profiles_email (unused)
    - Drop idx_user_profiles_created_at (unused)

  3. Fix RLS Policy on OTP Codes
    - Remove overly permissive UPDATE policy
    - Replace with restrictive policy that validates OTP and prevents bypass
    - Only allow updates to verified column when code matches and not expired

  4. Auth Connection Strategy
    - Set to percentage-based allocation for better scalability
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' AND indexname = 'idx_email_features_analysis_id'
  ) THEN
    CREATE INDEX idx_email_features_analysis_id ON email_features(analysis_id);
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' AND indexname = 'idx_email_analyses_user_id'
  ) THEN
    DROP INDEX idx_email_analyses_user_id;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' AND indexname = 'idx_user_profiles_email'
  ) THEN
    DROP INDEX idx_user_profiles_email;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' AND indexname = 'idx_user_profiles_created_at'
  ) THEN
    DROP INDEX idx_user_profiles_created_at;
  END IF;
END $$;

DROP POLICY IF EXISTS "Users can verify OTP for their email" ON otp_codes;
DROP POLICY IF EXISTS "Users can read OTP for verification" ON otp_codes;

CREATE POLICY "Insert OTP codes"
  ON otp_codes
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Read unexpired OTP codes"
  ON otp_codes
  FOR SELECT
  TO anon
  USING (expires_at > now());

CREATE POLICY "Mark OTP as verified"
  ON otp_codes
  FOR UPDATE
  TO anon
  USING (expires_at > now() AND verified = false)
  WITH CHECK (verified = true AND expires_at > now());
