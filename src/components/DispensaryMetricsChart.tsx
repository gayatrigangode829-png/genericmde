import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';

interface TelemetryMetric {
  timeLabel: string;
  subLabel?: string;
  volume: number;
  latency: number; // in minutes
  targetSla: number;
  gmv?: number;
  onTimePercent?: number;
}

const DAILY_METRICS: TelemetryMetric[] = [
  { timeLabel: 'Mon', subLabel: 'Sep 1', volume: 34, latency: 26.4, targetSla: 30, gmv: 21800, onTimePercent: 98.5 },
  { timeLabel: 'Tue', subLabel: 'Sep 2', volume: 38, latency: 24.8, targetSla: 30, gmv: 25400, onTimePercent: 99.1 },
  { timeLabel: 'Wed', subLabel: 'Sep 3', volume: 45, latency: 23.2, targetSla: 30, gmv: 31200, onTimePercent: 99.4 },
  { timeLabel: 'Thu', subLabel: 'Sep 4', volume: 41, latency: 25.1, targetSla: 30, gmv: 27900, onTimePercent: 98.8 },
  { timeLabel: 'Fri', subLabel: 'Sep 5', volume: 56, latency: 27.6, targetSla: 30, gmv: 39500, onTimePercent: 99.2 },
  { timeLabel: 'Sat', subLabel: 'Sep 6', volume: 52, latency: 22.8, targetSla: 30, gmv: 36100, onTimePercent: 99.6 },
  { timeLabel: 'Sun (Today)', subLabel: 'Sep 7', volume: 42, latency: 21.5, targetSla: 30, gmv: 28640, onTimePercent: 99.5 },
];

const HOURLY_METRICS: TelemetryMetric[] = [
  { timeLabel: '09:00', volume: 3, latency: 19.2, targetSla: 30 },
  { timeLabel: '10:00', volume: 5, latency: 21.4, targetSla: 30 },
  { timeLabel: '11:00', volume: 7, latency: 24.1, targetSla: 30 },
  { timeLabel: '12:00', volume: 8, latency: 26.5, targetSla: 30 },
  { timeLabel: '13:00', volume: 6, latency: 22.0, targetSla: 30 },
  { timeLabel: '14:00', volume: 4, latency: 18.6, targetSla: 30 },
  { timeLabel: '15:00', volume: 5, latency: 20.3, targetSla: 30 },
  { timeLabel: '16:00', volume: 4, latency: 23.0, targetSla: 30 },
];

export const DispensaryMetricsChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'7d' | 'today'>('7d');

  const totalVolume = DAILY_METRICS.reduce((sum, d) => sum + d.volume, 0);
  const avgLatency = (
    DAILY_METRICS.reduce((sum, d) => sum + d.latency, 0) / DAILY_METRICS.length
  ).toFixed(1);
  const totalGmv = DAILY_METRICS.reduce((sum, d) => sum + d.gmv, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-xs p-3 rounded-xl shadow-xl border border-slate-200 text-xs space-y-1.5 min-w-[170px]">
          <div className="flex justify-between items-center border-b border-slate-100 pb-1">
            <span className="font-bold text-slate-900 font-headline">{label}</span>
            {data.subLabel && <span className="text-[10px] text-slate-400">{data.subLabel}</span>}
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600"></span>
              <span>Order Volume:</span>
            </span>
            <span className="font-bold font-mono text-slate-900">{data.volume} orders</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span>Fulfillment Latency:</span>
            </span>
            <span className="font-bold font-mono text-blue-700">{data.latency} mins</span>
          </div>
          <div className="flex justify-between items-center text-slate-400 text-[10px]">
            <span>Target SLA:</span>
            <span className="font-mono">{data.targetSla} mins</span>
          </div>
          {data.gmv && (
            <div className="flex justify-between items-center text-slate-600 pt-1 border-t border-slate-100">
              <span>Day GMV:</span>
              <span className="font-mono font-semibold text-emerald-700">
                ₹{data.gmv.toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">monitoring</span>
            </div>
            <h3 className="font-headline font-bold text-slate-900 text-base">
              Daily Order Volume & Fulfillment Latency
            </h3>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-mono font-semibold border border-emerald-200">
              Live Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracking order dispatch frequency against the 30-minute strict delivery SLA threshold.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Timeframe selector */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs">
            <button
              onClick={() => setTimeframe('7d')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                timeframe === '7d'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7-Day Trend
            </button>
            <button
              onClick={() => setTimeframe('today')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                timeframe === 'today'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today Hourly
            </button>
          </div>
        </div>
      </div>

      {/* Metric Highlights Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-1 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium block">
            {timeframe === '7d' ? '7-Day Order Volume' : "Today's Volume"}
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-lg font-bold font-headline text-slate-900">
              {timeframe === '7d' ? totalVolume : 42}
            </span>
            <span className="text-[10px] text-emerald-600 font-mono font-semibold">+14.2%</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium block">Avg Fulfillment Latency</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-lg font-bold font-headline text-blue-700">
              {timeframe === '7d' ? avgLatency : '21.5'} mins
            </span>
            <span className="text-[10px] text-emerald-600 font-mono font-semibold">-8.5m vs 30m SLA</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium block">On-Time Dispatch Rate</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-lg font-bold font-headline text-emerald-700">99.4%</span>
            <span className="text-[10px] text-slate-500 font-mono">Tier-1</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium block">
            {timeframe === '7d' ? 'Period Clearing GMV' : "Today's GMV"}
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-lg font-bold font-headline text-slate-900">
              ₹{timeframe === '7d' ? (totalGmv / 1000).toFixed(1) + 'k' : '28,640'}
            </span>
            <span className="text-[10px] text-emerald-600 font-mono font-semibold">100% Reconciled</span>
          </div>
        </div>
      </div>

      {/* Chart Visualizer */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={timeframe === '7d' ? DAILY_METRICS : HOURLY_METRICS}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="timeLabel"
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            {/* Left Y-axis: Order Volume */}
            <YAxis
              yAxisId="left"
              tick={{ fill: '#059669', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              label={{
                value: 'Orders',
                angle: -90,
                position: 'insideLeft',
                fill: '#059669',
                fontSize: 10,
                offset: 25,
              }}
            />
            {/* Right Y-axis: Latency Minutes */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 40]}
              tick={{ fill: '#2563eb', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              label={{
                value: 'Latency (mins)',
                angle: 90,
                position: 'insideRight',
                fill: '#2563eb',
                fontSize: 10,
                offset: 25,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              formatter={(value) => {
                if (value === 'volume') return 'Order Volume (left axis)';
                if (value === 'latency') return 'Avg Latency in mins (right axis)';
                if (value === 'targetSla') return 'Target SLA Limit (30m)';
                return value;
              }}
            />
            {/* Reference Line for 30m SLA Target */}
            <ReferenceLine
              yAxisId="right"
              y={30}
              label={{
                value: 'Max 30m SLA Limit',
                fill: '#dc2626',
                fontSize: 10,
                position: 'insideTopRight',
              }}
              stroke="#ef4444"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            {/* Order Volume Bar */}
            <Bar
              yAxisId="left"
              dataKey="volume"
              name="volume"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
              maxBarSize={36}
            />
            {/* Fulfillment Latency Line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="latency"
              name="latency"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={{ fill: '#1d4ed8', r: 4, strokeWidth: 1.5, stroke: '#ffffff' }}
              activeDot={{ r: 6, fill: '#1d4ed8' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
