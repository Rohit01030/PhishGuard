import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface EmailAnalysis {
  id: string;
  user_id: string;
  email_content: string;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  analysis_result: {
    riskScore: number;
    riskLevel: string;
    indicators: Array<{
      category: string;
      severity: string;
      description: string;
      found: boolean;
    }>;
    summary: string;
    recommendations: string[];
  };
  created_at: string;
}
