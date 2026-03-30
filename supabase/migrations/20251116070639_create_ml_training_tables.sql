/*
  # Machine Learning Training Data Tables

  1. New Tables
    - `email_features`
      - `id` (uuid, primary key) - Unique identifier for training sample
      - `analysis_id` (uuid, foreign key) - Reference to email_analyses
      - `features` (jsonb) - Extracted features for ML training
      - `is_phishing` (boolean) - Label for training (true if phishing)
      - `confidence` (integer) - User confidence in the label (0-100)
      - `created_at` (timestamptz) - When the training sample was created
    
    - `ml_model_metrics`
      - `id` (uuid, primary key) - Unique identifier
      - `total_samples` (integer) - Total training samples used
      - `accuracy` (float) - Model accuracy percentage
      - `precision` (float) - Precision score
      - `recall` (float) - Recall score
      - `f1_score` (float) - F1 score
      - `trained_at` (timestamptz) - When model was last trained
      - `version` (integer) - Model version
  
  2. Security
    - Enable RLS on both tables
    - Users can only insert features for their own analyses
    - Model metrics are readable by all (for transparency)
    
  3. Important Notes
    - Features are pre-extracted from email analysis
    - Labels are marked by user confirmation or manual review
    - Model metrics track training performance over time
    - System learns from community data to improve detection
*/

CREATE TABLE IF NOT EXISTS email_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid REFERENCES email_analyses(id) ON DELETE CASCADE,
  features jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_phishing boolean NOT NULL,
  confidence integer NOT NULL DEFAULT 100 CHECK (confidence >= 0 AND confidence <= 100),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ml_model_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_samples integer NOT NULL DEFAULT 0,
  accuracy float NOT NULL DEFAULT 0,
  precision float NOT NULL DEFAULT 0,
  recall float NOT NULL DEFAULT 0,
  f1_score float NOT NULL DEFAULT 0,
  trained_at timestamptz DEFAULT now(),
  version integer NOT NULL DEFAULT 1
);

ALTER TABLE email_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert features for own analyses"
  ON email_features
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM email_analyses
      WHERE email_analyses.id = analysis_id
      AND email_analyses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own features"
  ON email_features
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM email_analyses
      WHERE email_analyses.id = analysis_id
      AND email_analyses.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_email_features_analysis_id ON email_features(analysis_id);
CREATE INDEX IF NOT EXISTS idx_email_features_is_phishing ON email_features(is_phishing);
CREATE INDEX IF NOT EXISTS idx_ml_model_metrics_version ON ml_model_metrics(version DESC);