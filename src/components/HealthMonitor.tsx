import { useEffect, useState } from 'react';
import { Activity, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    database: {
      status: 'up' | 'down';
      responseTime: number;
    };
    analyzeEmail: {
      status: 'up' | 'down';
      responseTime: number;
    };
  };
  uptime: string;
}

export function HealthMonitor() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkHealth = async () => {
    try {
      setLoading(true);
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${supabaseUrl}/functions/v1/health-check`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${anonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setHealth(data);
        setLastChecked(new Date());
      }
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  if (!health) {
    return null;
  }

  const statusColors = {
    healthy: 'bg-green-50 border-green-200',
    degraded: 'bg-yellow-50 border-yellow-200',
    unhealthy: 'bg-red-50 border-red-200',
  };

  const statusIcons = {
    healthy: <CheckCircle className="w-5 h-5 text-green-600" />,
    degraded: <AlertCircle className="w-5 h-5 text-yellow-600" />,
    unhealthy: <AlertCircle className="w-5 h-5 text-red-600" />,
  };

  const statusText = {
    healthy: 'All systems operational',
    degraded: 'Some services degraded',
    unhealthy: 'Critical issues detected',
  };

  return (
    <div className={`border rounded-lg p-4 ${statusColors[health.status]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {statusIcons[health.status]}
          <div>
            <p className="font-semibold text-gray-900">{statusText[health.status]}</p>
            <p className="text-sm text-gray-600">
              Last checked: {lastChecked?.toLocaleTimeString() || 'Never'}
            </p>
          </div>
        </div>
        <button
          onClick={checkHealth}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Check Now'}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Database</span>
          </div>
          <div className="text-sm text-gray-600">
            <p>Status: <span className="font-medium">{health.services.database.status}</span></p>
            <p>Response: {health.services.database.responseTime}ms</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium">Analysis Engine</span>
          </div>
          <div className="text-sm text-gray-600">
            <p>Status: <span className="font-medium">{health.services.analyzeEmail.status}</span></p>
            <p>Response: {health.services.analyzeEmail.responseTime}ms</p>
          </div>
        </div>
      </div>
    </div>
  );
}
