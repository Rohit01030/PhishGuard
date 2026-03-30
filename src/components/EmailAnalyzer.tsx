import { useState } from 'react';
import { Mail, AlertTriangle, Send, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { FeedbackWidget } from './FeedbackWidget';

interface AnalysisResult {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  indicators: Array<{
    category: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    found: boolean;
  }>;
  summary: string;
  recommendations: string[];
}

interface EmailAnalyzerProps {
  onAuthRequired: () => void;
}

export function EmailAnalyzer({ onAuthRequired }: EmailAnalyzerProps) {
  const [emailContent, setEmailContent] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const { user } = useAuth();

  const handleAnalyze = async () => {
    if (!emailContent.trim()) {
      setError('Please paste email content to analyze');
      return;
    }

    setAnalyzing(true);
    setError('');
    setResult(null);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-email`;
      const session = await supabase.auth.getSession();

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (session.data.session?.access_token) {
        headers['Authorization'] = `Bearer ${session.data.session.access_token}`;
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ emailContent }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const analysisResult: AnalysisResult = await response.json();
      setResult(analysisResult);

      if (user) {
        const { data, error: insertError } = await supabase.from('email_analyses').insert({
          user_id: user.id,
          email_content: emailContent,
          risk_score: analysisResult.riskScore,
          risk_level: analysisResult.riskLevel,
          analysis_result: analysisResult,
        }).select('id').maybeSingle();

        if (data?.id) {
          setAnalysisId(data.id);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze email');
    } finally {
      setAnalyzing(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Mail className="text-blue-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">Analyze Email</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Paste the original email content below. To get this, open the email and look for "Show Original" or "View Source" option.
        </p>

        <textarea
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          placeholder="Paste the full email content here, including headers if available..."
          className="w-full h-64 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none font-mono text-sm"
        />

        {error && (
          <div className="mt-4 text-red-600 text-sm bg-red-50 p-3 rounded-lg flex items-center space-x-2">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {!user && (
          <div className="mt-4 bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-blue-900 text-sm">
              <strong>Tip:</strong> Sign in to save your analysis history and access it anytime.{' '}
              <button onClick={onAuthRequired} className="underline font-semibold hover:text-blue-700">
                Sign in now
              </button>
            </p>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={analyzing || !emailContent.trim()}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {analyzing ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Send size={20} />
              <span>Analyze Email</span>
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">Analysis Results</h3>
            <div className={`px-6 py-2 rounded-full border-2 ${getRiskColor(result.riskLevel)} font-bold text-lg uppercase`}>
              {result.riskLevel} Risk
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-semibold">Phishing Probability</span>
              <span className="text-3xl font-bold text-blue-900">{result.riskScore}%</span>
            </div>
            <div className="w-full bg-white rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  result.riskScore < 25
                    ? 'bg-green-500'
                    : result.riskScore < 50
                    ? 'bg-yellow-500'
                    : result.riskScore < 75
                    ? 'bg-orange-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${result.riskScore}%` }}
              />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-3">Summary</h4>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{result.summary}</p>
          </div>

          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-3">Detected Indicators</h4>
            <div className="space-y-3">
              {result.indicators.filter(i => i.found).map((indicator, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <AlertTriangle className="text-orange-500 flex-shrink-0 mt-1" size={20} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-gray-900">{indicator.category}</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(indicator.severity)}`}>
                        {indicator.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{indicator.description}</p>
                  </div>
                </div>
              ))}

              {result.indicators.filter(i => i.found).length === 0 && (
                <p className="text-gray-500 text-center py-4">No suspicious indicators detected</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-3">Recommendations</h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-blue-600 font-bold flex-shrink-0 mt-1">•</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {user && analysisId && (
            <FeedbackWidget
              analysisId={analysisId}
              emailContent={emailContent}
              currentRiskLevel={result.riskLevel}
              onFeedbackSubmitted={() => {
                setEmailContent('');
                setResult(null);
                setAnalysisId(null);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
