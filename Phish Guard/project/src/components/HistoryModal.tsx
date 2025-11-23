import { useEffect, useState } from 'react';
import { X, Clock, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase, EmailAnalysis } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  const [analyses, setAnalyses] = useState<EmailAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && user) {
      loadHistory();
    }
  }, [isOpen, user]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setAnalyses(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analysis History</h2>
            <p className="text-gray-600 text-sm mt-1">Your recent email security scans</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-gray-600 mt-4">Loading history...</p>
            </div>
          ) : analyses.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">No analysis history yet</p>
              <p className="text-gray-500 text-sm mt-2">Analyzed emails will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === analysis.id ? null : analysis.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getRiskColor(analysis.risk_level)}`}>
                            {analysis.risk_level}
                          </span>
                          <span className="text-2xl font-bold text-gray-900">{analysis.risk_score}%</span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {analysis.email_content.substring(0, 150)}...
                        </p>
                        <p className="text-gray-400 text-xs mt-2 flex items-center space-x-1">
                          <Clock size={14} />
                          <span>{formatDate(analysis.created_at)}</span>
                        </p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 ml-4">
                        {expandedId === analysis.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                  </div>

                  {expandedId === analysis.id && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Summary</h4>
                        <p className="text-gray-700 text-sm">{analysis.analysis_result.summary}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Detected Indicators</h4>
                        <div className="space-y-2">
                          {analysis.analysis_result.indicators
                            .filter((i) => i.found)
                            .map((indicator, index) => (
                              <div key={index} className="flex items-start space-x-2 text-sm">
                                <AlertTriangle className="text-orange-500 flex-shrink-0 mt-0.5" size={16} />
                                <div>
                                  <span className="font-medium text-gray-900">{indicator.category}</span>
                                  <span className="text-gray-600"> - {indicator.description}</span>
                                </div>
                              </div>
                            ))}
                          {analysis.analysis_result.indicators.filter((i) => i.found).length === 0 && (
                            <p className="text-gray-500 text-sm">No indicators detected</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
                        <ul className="space-y-1">
                          {analysis.analysis_result.recommendations.map((rec, index) => (
                            <li key={index} className="text-gray-700 text-sm flex items-start space-x-2">
                              <span className="text-blue-600">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
