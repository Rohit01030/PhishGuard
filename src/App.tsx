import { useState } from 'react';
import { Header } from './components/Header';
import { InfoSection } from './components/InfoSection';
import { PhishingCheckPage } from './components/PhishingCheckPage';
import { StatusDashboard } from './components/StatusDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'check' | 'status'>('home');

  if (currentPage === 'check') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header onStatusClick={() => setCurrentPage('status')} />
        <PhishingCheckPage onBack={() => setCurrentPage('home')} />
      </div>
    );
  }

  if (currentPage === 'status') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header onStatusClick={() => setCurrentPage('status')} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <button
              onClick={() => setCurrentPage('home')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm mb-4"
            >
              ← Back to Home
            </button>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">System Status</h1>
            <p className="text-lg text-gray-600">
              Real-time monitoring and uptime statistics
            </p>
          </div>
          <StatusDashboard />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header onStatusClick={() => setCurrentPage('status')} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Protect Yourself from Phishing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Analyze suspicious emails instantly with our advanced AI-powered detection system.
            Get detailed risk scores and actionable security recommendations.
          </p>
          <button
            onClick={() => setCurrentPage('check')}
            className="mt-8 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Check for Phishing
          </button>
        </div>

        <div className="mt-16">
          <InfoSection />
        </div>
      </main>
    </div>
  );
}

export default App;
