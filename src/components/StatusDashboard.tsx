import { useEffect, useState } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HealthLog {
  id: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  database_status: string;
  database_response_time: number;
  api_status: string;
  api_response_time: number;
  created_at: string;
}

export function StatusDashboard() {
  const [logs, setLogs] = useState<HealthLog[]>([]);
  const [stats, setStats] = useState({
    uptime: 0,
    avgResponseTime: 0,
    lastCheck: new Date(),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data, error } = await supabase
          .from('system_health_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(288); // 24 hours of 5-minute checks

        if (error) throw error;

        if (data) {
          setLogs(data);

          // Calculate stats
          const healthyCount = data.filter(
            (log) => log.status === 'healthy'
          ).length;
          const uptime = data.length > 0 ? (healthyCount / data.length) * 100 : 0;

          const avgDb = data.reduce(
            (sum, log) => sum + (log.database_response_time || 0),
            0
          ) / (data.length || 1);

          setStats({
            uptime: Math.round(uptime * 100) / 100,
            avgResponseTime: Math.round(avgDb),
            lastCheck: new Date(data[0]?.created_at || new Date()),
          });
        }
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50';
      case 'unhealthy':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Uptime</p>
              <p className="text-3xl font-bold text-green-600">{stats.uptime.toFixed(2)}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-3xl font-bold text-blue-600">{stats.avgResponseTime}ms</p>
            </div>
            <Activity className="w-8 h-8 text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Last Check</p>
            <p className="text-sm font-mono text-gray-900 mt-2">
              {stats.lastCheck.toLocaleTimeString()}
            </p>
            <p className="text-xs text-gray-500">
              {Math.round(
                (Date.now() - stats.lastCheck.getTime()) / 1000
              )}{' '}
              seconds ago
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Recent Health Checks</h3>
          <p className="text-sm text-gray-600">Last 24 hours of monitoring data</p>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center text-gray-500">Loading...</div>
        ) : logs.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            No health data available yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-900">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-900">
                    Database
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-900">
                    Analysis API
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-900">
                    Response Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.slice(0, 20).map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-900">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          log.status
                        )}`}
                      >
                        {getStatusIcon(log.status)}
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          log.database_status === 'up'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {log.database_status}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          log.api_status === 'up'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {log.api_status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-900">
                      {log.database_response_time}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
