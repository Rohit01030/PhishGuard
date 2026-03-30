/*
  # Email Analysis System Schema

  1. New Tables
    - `email_analyses`
      - `id` (uuid, primary key) - Unique identifier for each analysis
      - `user_id` (uuid, foreign key) - Reference to auth.users
      - `email_content` (text) - Original email content analyzed
      - `risk_score` (integer) - Phishing risk score (0-100)
      - `risk_level` (text) - Risk classification (low/medium/high/critical)
      - `analysis_result` (jsonb) - Detailed analysis results
      - `created_at` (timestamptz) - Timestamp of analysis
    
  2. Security
    - Enable RLS on `email_analyses` table
    - Add policy for authenticated users to insert their own analyses
    - Add policy for authenticated users to read their own analyses
    
  3. Important Notes
    - Risk score ranges from 0-100 where higher values indicate greater phishing risk
    - Analysis results stored as JSON for flexibility
    - Users can only access their own analysis history
*/

CREATE TABLE IF NOT EXISTS email_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email_content text NOT NULL,
  risk_score integer NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level text NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  analysis_result jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE email_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own analyses"
  ON email_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own analyses"
  ON email_analyses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_email_analyses_user_id ON email_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_email_analyses_created_at ON email_analyses(created_at DESC);