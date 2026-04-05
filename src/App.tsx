import { useState } from 'react';
import { Header } from './components/Header';
import { InfoSection } from './components/InfoSection';
import { PhishingCheckPage } from './components/PhishingCheckPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'check'>('home');

  if (currentPage === 'check') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <PhishingCheckPage onBack={() => setCurrentPage('home')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

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
