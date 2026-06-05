import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export default function MinimaxUsage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsage = async () => {
    try {
      const response = await fetch('/api/minimax/usage');
      const result = await response.json();
      if (result.success) {
        setData(result);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
    const interval = setInterval(fetchUsage, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTokens = (num) => {
    if (!num) return '0';
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getCountdown = (resetTime) => {
    if (!resetTime) return '--';
    const now = new Date();
    const diff = new Date(resetTime) - now;
    if (diff <= 0) return 'RESET';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  if (loading) {
    return (
      <div className="glass-card p-4 w-fit flex items-center justify-center">
        <RefreshCw className="w-5 h-5 text-gray-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="glass-card p-4 w-fit">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-white">MiniMax 用量</span>
        <button onClick={fetchUsage} className="p-1 text-gray-400 hover:text-white transition-colors">
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">5小时窗口</span>
            <span className="text-xs text-accent-primary font-medium">
              {data?.percentages?.fiveHour || 0}%
            </span>
          </div>
          <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full transition-all duration-500"
              style={{ width: `${100 - (data?.percentages?.fiveHour || 0)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">
              {formatTokens(data?.current?.fiveHour)} / {formatTokens(data?.totals?.fiveHour)}
            </span>
            <span className="text-xs text-cyan-400">
              {getCountdown(data?.resets?.fiveHour)}
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">周窗口</span>
            <span className="text-xs text-yellow-500 font-medium">
              {data?.percentages?.weekly || 0}%
            </span>
          </div>
          <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${100 - (data?.percentages?.weekly || 0)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">
              {formatTokens(data?.current?.weekly)} / {formatTokens(data?.totals?.weekly)}
            </span>
            <span className="text-xs text-cyan-400">
              {getCountdown(data?.resets?.week)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}