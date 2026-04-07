import { Shield } from 'lucide-react';
import { HealthMonitor } from './HealthMonitor';

interface HeaderProps {
  onStatusClick?: () => void;
}

export function Header({ onStatusClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">PhishGuard</h1>
              <p className="text-xs text-gray-500">Email Security Scanner</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {onStatusClick && (
              <button
                onClick={onStatusClick}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                System Status
              </button>
            )}
            <div className="hidden sm:block">
              <HealthMonitor />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
