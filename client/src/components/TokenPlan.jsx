import { useEffect, useState } from 'react';
import { Activity, RefreshCw } from 'lucide-react';

function formatCountdown(targetTime) {
  if (!targetTime) return '--';
  const now = new Date();
  const diff = new Date(targetTime) - now;
  if (diff <= 0) return 'RESET';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function formatTokens(num) {
  if (!num) return '0';
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

const COLORS = ['#00ff88', '#00d4ff', '#ffaa00', '#ff4444', '#7c3aed', '#06b6d4', '#84cc16'];

function PieChart({ data }) {
  if (!data || Object.keys(data).length === 0) return null;

  const total = Object.values(data).reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);

  let currentDeg = 0;
  const items = sorted.map(([model, tokens], index) => {
    const percent = (tokens / total) * 100;
    const angle = percent * 3.6;
    const color = COLORS[index % COLORS.length];
    const startDeg = currentDeg;
    currentDeg += angle;
    const endDeg = currentDeg;
    return { model, tokens, percent, color, startDeg, endDeg };
  });

  const gradientStr = items.map(g => `${g.color} ${g.startDeg}deg ${g.endDeg}deg`).join(', ');

  return (
    <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400">月度用量 (总/M3)</span>
        <span className="text-xs text-accent-primary font-medium">
          {formatTokens(total)} / {formatTokens(data['MiniMax-M3-512k'] || 0)}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div
          className="w-16 h-16 rounded-full flex-shrink-0"
          style={{ background: `conic-gradient(${gradientStr})` }}
        />
        <div className="flex-1 space-y-1 max-h-20 overflow-y-auto">
          {items.slice(0, 4).map((g) => (
            <div key={g.model} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: g.color }} />
              <span className="text-gray-400 truncate flex-1">{g.model}</span>
              <span className="text-gray-300">{g.percent.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TokenPlan() {
  const [data, setData] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(true);

  useEffect(() => {
    fetchTokenPlan();
    fetchDetail();

    const interval = setInterval(fetchTokenPlan, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchTokenPlan = async () => {
    try {
      const res = await fetch('/api/token/token_plan');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (error) {
      console.error('Failed to fetch token plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetail = async () => {
    try {
      const res = await fetch('/api/token/token_plan_detail');
      const json = await res.json();
      if (json.success) {
        setDetail(json);
      }
    } catch (error) {
      console.error('Failed to fetch detail:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-4 w-[280px] h-[200px] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data?.success) {
    return (
      <div className="glass-card p-4 w-[280px]">
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <Activity className="w-4 h-4" />
          <span>Token Plan 未配置</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 w-[280px] space-y-3">
      <div className="flex items-center gap-2 text-accent-primary">
        <Activity className="w-4 h-4" />
        <span className="text-sm font-medium">Token Plan</span>
        <RefreshCw className="w-3 h-3 text-gray-500 ml-auto" />
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">5H窗口</span>
            <span className="text-accent-primary font-medium">{data.fiveHour.percent}%</span>
          </div>
          <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full transition-all duration-500"
              style={{ width: `${Math.min(data.fiveHour.percent, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-gray-500">{formatTokens(data.fiveHour.used)} / {formatTokens(data.fiveHour.total)}</span>
            <span className="text-cyan-400">{formatCountdown(data.fiveHour.resetTime)}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">周窗口</span>
            <span className="text-yellow-400 font-medium">{data.weekly.percent}%</span>
          </div>
          <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(data.weekly.percent, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-gray-500">{formatTokens(data.weekly.used)} / {formatTokens(data.weekly.total)}</span>
            <span className="text-cyan-400">{formatCountdown(data.weekly.resetTime)}</span>
          </div>
        </div>
      </div>

      {detailLoading ? (
        <div className="flex items-center justify-center py-2">
          <div className="w-4 h-4 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <PieChart data={detail?.modelBreakdown} />
      )}
    </div>
  );
}