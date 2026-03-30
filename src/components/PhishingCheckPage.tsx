import { ArrowLeft } from 'lucide-react';
import { EmailAnalyzer } from './EmailAnalyzer';

interface PhishingCheckPageProps {
  onBack: () => void;
  onAuthRequired: () => void;
}

export function PhishingCheckPage({ onBack, onAuthRequired }: PhishingCheckPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 mb-8 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-semibold"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>

        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Check for Phishing</h1>
          <p className="text-xl text-gray-600">
            Paste your suspicious email content below and get instant analysis with detailed risk assessment.
          </p>
        </div>

        <EmailAnalyzer onAuthRequired={onAuthRequired} />

        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Steps to Stay Safe</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Never Trust Sender Address Alone</h4>
                  <p className="text-gray-600 text-sm">Attackers can spoof email addresses. Look at the full email headers and check authentication records.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Verify URLs Before Clicking</h4>
                  <p className="text-gray-600 text-sm">Hover over links to see actual destination. Phishing emails often hide malicious links behind legitimate-looking text.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Check for Urgency Tactics</h4>
                  <p className="text-gray-600 text-sm">Phishers create panic ("Act Now!", "Account Suspended"). Take time to verify through official channels.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Never Share Sensitive Info</h4>
                  <p className="text-gray-600 text-sm">Legitimate organizations never ask for passwords, SSNs, or credit card info via email or unsecured channels.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  5
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Contact Organizations Directly</h4>
                  <p className="text-gray-600 text-sm">If unsure, call the organization using the number on their official website or your card - never use info from the email.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  6
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Report Suspicious Emails</h4>
                  <p className="text-gray-600 text-sm">Mark as spam or report to your IT team. Help organizations block phishing campaigns by reporting threats.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border border-red-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Red Flags to Watch For</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="text-red-600 font-bold text-lg">✕</span>
                <span className="text-gray-800">Requests for passwords or personal information</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-red-600 font-bold text-lg">✕</span>
                <span className="text-gray-800">Suspicious sender domains or misspelled names</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-red-600 font-bold text-lg">✕</span>
                <span className="text-gray-800">Urgent language with threats or too-good offers</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-red-600 font-bold text-lg">✕</span>
                <span className="text-gray-800">Generic greetings like "Dear User" or "Dear Customer"</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-red-600 font-bold text-lg">✕</span>
                <span className="text-gray-800">Spelling and grammar errors in official emails</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-red-600 font-bold text-lg">✕</span>
                <span className="text-gray-800">Links that don't match the displayed URL text</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-red-600 font-bold text-lg">✕</span>
                <span className="text-gray-800">Attachments from unexpected senders</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-red-600 font-bold text-lg">✕</span>
                <span className="text-gray-800">Failed email authentication (SPF/DKIM/DMARC)</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-red-600 font-bold text-lg">✕</span>
                <span className="text-gray-800">Unusual requests or emotional manipulation tactics</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-red-600 font-bold text-lg">✕</span>
                <span className="text-gray-800">Emails from cloud hosting IPs instead of company servers</span>
              </div>
            </div>

            <div className="mt-8 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
              <p className="text-sm text-gray-800">
                <strong>Pro Tip:</strong> When in doubt, always verify through official channels. It's better to be cautious than to fall for a sophisticated phishing attempt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
