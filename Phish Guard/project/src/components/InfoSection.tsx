import { Shield, Eye, Lock, Zap, TrendingUp, AlertCircle, Github } from 'lucide-react';

export function InfoSection() {
  const statistics = [
    {
      number: '3.4B',
      label: 'Phishing emails sent daily',
      description: 'Billions of phishing attempts occur every single day worldwide',
    },
    {
      number: '90%',
      label: 'Data breaches involve phishing',
      description: 'Phishing is the leading attack vector for security incidents',
    },
    {
      number: '30-40%',
      label: 'Click-through rate',
      description: 'About 1 in 3 people click malicious links in phishing emails',
    },
    {
      number: '$3.9M',
      label: 'Average breach cost',
      description: 'Organizations lose millions from successful phishing attacks',
    },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Advanced Detection',
      description: 'Analyzes 10+ phishing indicators including suspicious links, urgent language, and credential requests',
    },
    {
      icon: Eye,
      title: 'Real-time Analysis',
      description: 'Get instant results with detailed risk scores and actionable recommendations',
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Your emails are analyzed securely and never stored without your permission',
    },
    {
      icon: Zap,
      title: 'Smart Scoring',
      description: 'AI-powered risk assessment that learns from analyzed emails',
    },
  ];

  const indicators = [
    'Suspicious or shortened URLs',
    'Urgent or threatening language',
    'Requests for credentials or personal info',
    'Spoofed sender addresses',
    'Generic greetings and poor grammar',
    'Dangerous file attachments',
    'Prize or money offers',
    'Mismatched URLs and link text',
    'Failed authentication (SPF, DKIM, DMARC)',
    'Suspicious hosting infrastructure',
  ];

  return (
    <div className="space-y-12">
      <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 rounded-2xl p-8 border border-blue-200">
        <div className="flex items-center space-x-3 mb-6">
          <AlertCircle className="text-blue-600" size={28} />
          <h2 className="text-3xl font-bold text-gray-900">What is Phishing?</h2>
        </div>
        <div className="space-y-4 text-gray-800">
          <p className="leading-relaxed">
            <strong>Phishing</strong> is a cybercriminal technique where attackers impersonate legitimate organizations to trick people into revealing sensitive information or downloading malware. The term comes from "fishing" - criminals cast out baited hooks (fake emails) hoping someone will take the bait.
          </p>
          <p className="leading-relaxed">
            Phishing emails typically appear to come from trusted sources like your bank, PayPal, Amazon, or your workplace. They often create a sense of urgency or fear to make you act quickly without thinking. For example, they might claim your account is locked, you've won a prize, or there's suspicious activity on your account.
          </p>
          <p className="leading-relaxed">
            <strong>Why is phishing so effective?</strong> Phishing exploits human psychology rather than technical vulnerabilities. Attackers spend time researching their targets to make emails look authentic. They use social engineering tactics, urgency, and emotional manipulation to bypass our natural defenses.
          </p>
          <p className="leading-relaxed">
            <strong>Common phishing goals:</strong> Stealing login credentials, credit card information, personal data, or accessing corporate networks. Once attackers have this information, they can commit identity theft, financial fraud, or launch larger attacks on organizations.
          </p>
          <p className="leading-relaxed">
            <strong>Key warning signs:</strong> Urgent language, requests for passwords or personal information, suspicious links or attachments, poor grammar and spelling, mismatched sender addresses, and too-good-to-be-true offers.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Phishing Attack Statistics</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statistics.map((stat, index) => (
            <div key={index} className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-3">
                <TrendingUp className="text-red-600" size={24} />
                <span className="text-red-100 text-sm font-semibold">STAT</span>
              </div>
              <div className="text-3xl font-bold text-red-600 mb-2">{stat.number}</div>
              <h4 className="font-semibold text-gray-900 mb-1 text-sm">{stat.label}</h4>
              <p className="text-gray-600 text-xs leading-relaxed">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Use PhishGuard</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="bg-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
              1
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1 text-lg">Open the Email</h4>
              <p className="text-gray-700 text-sm">Open the suspicious email in your email client</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
              2
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1 text-lg">View Original Source</h4>
              <p className="text-gray-700 text-sm">
                Look for "Show Original", "View Source", or "Download Original" option in your email client
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
              3
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1 text-lg">Paste and Analyze</h4>
              <p className="text-gray-700 text-sm">Copy the full email content and paste it into PhishGuard analyzer</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
              4
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1 text-lg">Review Results</h4>
              <p className="text-gray-700 text-sm">
                Check the risk score, detected indicators, and follow our recommendations
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Detection Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-blue-600" size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">How We Detect Phishing</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {indicators.map((indicator, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="bg-green-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span className="text-gray-800 text-sm leading-relaxed">{indicator}</span>
            </div>
          ))}
        </div>
        <div className="p-4 bg-green-600 bg-opacity-10 rounded-lg border border-green-300">
          <p className="text-sm text-gray-800">
            <strong>Machine Learning Enhancement:</strong> Our system learns from every email you analyze. The more emails are scanned, the smarter our detection becomes, allowing us to identify new and evolving phishing techniques.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-6">How to Stay Safe Online</h2>
        <ul className="space-y-3">
          <li className="flex items-start space-x-3">
            <span className="bg-white bg-opacity-30 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold">!</span>
            <span>Never click links in suspicious emails - visit websites directly instead</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="bg-white bg-opacity-30 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold">!</span>
            <span>Legitimate companies never ask for passwords or sensitive data via email</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="bg-white bg-opacity-30 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold">!</span>
            <span>Verify sender addresses carefully - phishers use similar-looking domains</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="bg-white bg-opacity-30 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold">!</span>
            <span>When in doubt, contact the organization directly using known contact information</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="bg-white bg-opacity-30 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold">!</span>
            <span>Enable two-factor authentication on important accounts for extra protection</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="bg-white bg-opacity-30 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold">!</span>
            <span>Keep your software and antivirus programs updated with latest security patches</span>
          </li>
        </ul>
      </div>

      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300 mb-2">Made by</p>
            <a
              href="https://www.linkedin.com/in/rohit-kumar-122bcmcthbu/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-lg font-bold text-white hover:text-blue-400 transition-colors group"
            >
              <span>Rohit Kumar</span>
              <Github size={20} className="group-hover:scale-110 transition-transform" />
            </a>
            <p className="text-xs text-gray-400 mt-1">Security Researcher & Developer</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-300">PhishGuard - Phishing Detection Platform</p>
            <p className="text-xs text-gray-400 mt-1">Making the web safer, one email at a time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
