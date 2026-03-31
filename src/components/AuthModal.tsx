import { useState } from 'react';
import { X, Loader2, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { sendOTP, verifyOTP } = useAuth();

  if (!isOpen) return null;

  const handleSendOTP = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    const result = await sendOTP(email);
    if (result.success) {
      setStep('otp');
      setError('');
    } else {
      setError(result.error || 'Failed to send OTP');
    }

    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      setError('Please enter the OTP code');
      return;
    }

    setLoading(true);
    setError('');

    const result = await verifyOTP(email, otp);
    if (result.success) {
      onClose();
      setStep('email');
      setEmail('');
      setOtp('');
    } else {
      setError(result.error || 'Invalid OTP code');
    }

    setLoading(false);
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');

    const result = await sendOTP(email);
    if (result.success) {
      setError('');
      setOtp('');
    } else {
      setError(result.error || 'Failed to resend OTP');
    }

    setLoading(false);
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtp('');
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Sign In to PhishGuard
        </h2>
        <p className="text-gray-600 mb-8">
          {step === 'email'
            ? 'Enter your email to receive a one-time password'
            : 'Enter the code we sent to your email'}
        </p>

        {error && (
          <div className="text-sm p-4 rounded-lg mb-6 text-red-600 bg-red-50 border border-red-200">
            {error}
          </div>
        )}

        {step === 'email' ? (
          <div className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSendOTP()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold transition-all bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send OTP</span>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                Check your email <strong>{email}</strong> for the 6-digit code
              </p>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleVerifyOTP()}
                maxLength={6}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl tracking-widest text-center"
              />
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.length !== 6}
              className="w-full py-3 rounded-lg font-semibold transition-all bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify Code</span>
              )}
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleBackToEmail}
                className="flex-1 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Change email
              </button>
              <button
                onClick={handleResendOTP}
                disabled={loading}
                className="flex-1 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-xs mt-6 text-gray-500">
          Your data is encrypted and secure. We never share your information with third parties.
        </p>
      </div>
    </div>
  );
}
