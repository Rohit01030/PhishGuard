/*
  # Security Fixes - RLS Optimization & Index Cleanup

  1. RLS Policy Optimization
    - Replace `auth.uid()` with `(select auth.uid())` for better performance
    - This prevents re-evaluation of auth functions for each row
    - Applies to: email_analyses, email_features tables
  
  2. Unused Index Removal
    - Remove idx_email_analyses_created_at (not used in queries)
    - Remove idx_email_features_analysis_id (covered by FK)
    - Remove idx_email_features_is_phishing (rarely filtered alone)
    - Remove idx_ml_model_metrics_version (low query volume)
  
  3. ML Model Metrics Security
    - Enable RLS on ml_model_metrics table
    - Create restrictive policies for authenticated users (SELECT only)
    - Model metrics are read-only to prevent tampering
  
  4. Security Benefits
    - Better query performance with optimized RLS policies
    - Reduced database load and faster authentication checks
    - Improved security posture with RLS on all sensitive tables
    - Cleaner database without unused indexes
*/

DO $$
BEGIN
  -- Drop unused indexes
  IF EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' AND indexname = 'idx_email_analyses_created_at'
  ) THEN
    DROP INDEX idx_email_analyses_created_at;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' AND indexname = 'idx_email_features_analysis_id'
  ) THEN
    DROP INDEX idx_email_features_analysis_id;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' AND indexname = 'idx_email_features_is_phishing'
  ) THEN
    DROP INDEX idx_email_features_is_phishing;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' AND indexname = 'idx_ml_model_metrics_version'
  ) THEN
    DROP INDEX idx_ml_model_metrics_version;
  END IF;
END $$;

DROP POLICY IF EXISTS "Users can insert own analyses" ON email_analyses;
DROP POLICY IF EXISTS "Users can view own analyses" ON email_analyses;
DROP POLICY IF EXISTS "Users can update own analyses" ON email_analyses;

CREATE POLICY "Users can insert own analyses"
  ON email_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can view own analyses"
  ON email_analyses
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can update own analyses"
  ON email_analyses
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert features for own analyses" ON email_features;
DROP POLICY IF EXISTS "Users can view own features" ON email_features;

CREATE POLICY "Users can insert features for own analyses"
  ON email_features
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM email_analyses
      WHERE email_analyses.id = analysis_id
      AND email_analyses.user_id = (select auth.uid())
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
      AND email_analyses.user_id = (select auth.uid())
    )
  );

ALTER TABLE ml_model_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view model metrics"
  ON ml_model_metrics
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public can view model metrics"
  ON ml_model_metrics
  FOR SELECT
  TO anon
  USING (true);

REVOKE ALL ON ml_model_metrics FROM public;
REVOKE ALL ON ml_model_metrics FROM authenticated;
GRANT SELECT ON ml_model_metrics TO authenticated;
GRANT SELECT ON ml_model_metrics TO anon;