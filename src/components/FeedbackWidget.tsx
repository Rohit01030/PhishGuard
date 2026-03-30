import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface FeedbackWidgetProps {
  analysisId: string;
  emailContent: string;
  currentRiskLevel: string;
  onFeedbackSubmitted?: () => void;
}

export function FeedbackWidget({
  analysisId,
  emailContent,
  currentRiskLevel,
  onFeedbackSubmitted,
}: FeedbackWidgetProps) {
  const [feedback, setFeedback] = useState<'phishing' | 'legitimate' | null>(null);
  const [confidence, setConfidence] = useState(100);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!feedback || !user) return;

    setSubmitting(true);
    try {
      const isPhishing = feedback === 'phishing' ? 1 : 0;

      const { error } = await supabase.from('email_features').insert({
        analysis_id: analysisId,
        is_phishing: isPhishing === 1,
        confidence,
        features: {
          riskLevel: currentRiskLevel,
          emailLength: emailContent.length,
          timestamp: new Date().toISOString(),
        },
      });

      if (error) throw error;
      setSubmitted(true);
      onFeedbackSubmitted?.();

      setTimeout(() => {
        setFeedback(null);
        setSubmitted(false);
        setConfidence(100);
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Help Train Our AI</h4>
          <p className="text-sm text-gray-700 mb-3">
            Is this email actually phishing? Your feedback helps improve detection accuracy.
          </p>

          {!submitted && feedback ? (
            <div className="mb-3">
              <label className="flex items-center space-x-2 text-sm text-gray-700">
                <span>Confidence Level:</span>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={confidence}
                  onChange={(e) => setConfidence(Number(e.target.value))}
                  className="w-24"
                />
                <span className="font-semibold">{confidence}%</span>
              </label>
            </div>
          ) : null}
        </div>

        <div className="flex items-center space-x-2">
          {submitted ? (
            <div className="text-green-600 font-semibold flex items-center space-x-2">
              <span>✓ Thank you!</span>
            </div>
          ) : (
            <>
              <button
                onClick={() => setFeedback('phishing')}
                disabled={submitting}
                className={`p-2 rounded-lg transition-all ${
                  feedback === 'phishing'
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-red-600 border border-red-300 hover:bg-red-50'
                }`}
                title="Mark as phishing"
              >
                <ThumbsDown size={20} />
              </button>
              <button
                onClick={() => setFeedback('legitimate')}
                disabled={submitting}
                className={`p-2 rounded-lg transition-all ${
                  feedback === 'legitimate'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-green-600 border border-green-300 hover:bg-green-50'
                }`}
                title="Mark as legitimate"
              >
                <ThumbsUp size={20} />
              </button>

              {feedback && (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit</span>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
