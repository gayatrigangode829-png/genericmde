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

export type TimeframeMode = 'daily' | 'weekly' | 'monthly';

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

const WEEKLY_METRICS: TelemetryMetric[] = [
  { timeLabel: 'Wk 30', subLabel: 'Jul 20-26', volume: 245, latency: 26.1, targetSla: 30, gmv: 168000, onTimePercent: 98.7 },
  { timeLabel: 'Wk 31', subLabel: 'Jul 27-Aug 2', volume: 268, latency: 25.4, targetSla: 30, gmv: 182400, onTimePercent: 98.9 },
  { timeLabel: 'Wk 32', subLabel: 'Aug 3-9', volume: 290, latency: 24.2, targetSla: 30, gmv: 198500, onTimePercent: 99.2 },
  { timeLabel: 'Wk 33', subLabel: 'Aug 10-16', volume: 282, latency: 24.7, targetSla: 30, gmv: 192000, onTimePercent: 99.0 },
  { timeLabel: 'Wk 34', subLabel: 'Aug 17-23', volume: 315, latency: 23.5, targetSla: 30, gmv: 214600, onTimePercent: 99.3 },
  { timeLabel: 'Wk 35', subLabel: 'Aug 24-30', volume: 304, latency: 23.1, targetSla: 30, gmv: 207200, onTimePercent: 99.4 },
  { timeLabel: 'Wk 36', subLabel: 'Aug 31-Sep 6', volume: 328, latency: 22.4, targetSla: 30, gmv: 225300, onTimePercent: 99.5 },
  { timeLabel: 'Wk 37 (Cur)', subLabel: 'Sep 7-13', volume: 308, latency: 22.0, targetSla: 30, gmv: 210540, onTimePercent: 99.6 },
];

const MONTHLY_METRICS: TelemetryMetric[] = [
  { timeLabel: 'Apr 2026', subLabel: 'FY26 Q1', volume: 980, latency: 25.8, targetSla: 30, gmv: 672000, onTimePercent: 98.4 },
  { timeLabel: 'May 2026', subLabel: 'FY26 Q1', volume: 1120, latency: 24.6, targetSla: 30, gmv: 768000, onTimePercent: 98.8 },
  { timeLabel: 'Jun 2026', subLabel: 'FY26 Q1', volume: 1240, latency: 23.9, targetSla: 30, gmv: 849000, onTimePercent: 99.1 },
  { timeLabel: 'Jul 2026', subLabel: 'FY26 Q2', volume: 1310, latency: 23.2, targetSla: 30, gmv: 896000, onTimePercent: 99.3 },
  { timeLabel: 'Aug 2026', subLabel: 'FY26 Q2', volume: 1390, latency: 22.7, targetSla: 30, gmv: 952000, onTimePercent: 99.4 },
  { timeLabel: 'Sep (MTD)', subLabel: 'FY26 Q2', volume: 1280, latency: 22.1, targetSla: 30, gmv: 878000, onTimePercent: 99.6 },
];

export const DispensaryMetricsChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<TimeframeMode>('daily');

  const currentDataset =
    timeframe === 'daily'
      ? DAILY_METRICS
      : timeframe === 'weekly'
      ? WEEKLY_METRICS
      : MONTHLY_METRICS;

  const totalVolume = currentDataset.reduce((sum, d) => sum + d.volume, 0);
  const avgLatency = (
    currentDataset.reduce((sum, d) => sum + d.latency, 0) / currentDataset.length
  ).toFixed(1);
  const totalGmv = currentDataset.reduce((sum, d) => sum + (d.gmv || 0), 0);
  const avgOnTime = (
    currentDataset.reduce((sum, d) => sum + (d.onTimePercent || 99), 0) / currentDataset.length
  ).toFixed(1);

  const rangeDescription =
    timeframe === 'daily'
      ? 'Daily Order Breakdown (Last 7 Days)'
      : timeframe === 'weekly'
      ? 'Weekly Aggregated Volume (Last 8 Weeks)'
      : 'Monthly Historical Run-Rate (Last 6 Months)';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as TelemetryMetric;
      return (
        <div className="bg-white/95 backdrop-blur-xs p-3 rounded-xl shadow-xl border border-slate-200 text-xs space-y-1.5 min-w-[190px]">
          <div className="flex justify-between items-center border-b border-slate-100 pb-1">
            <span className="font-bold text-slate-900 font-headline">{label}</span>
            {data.subLabel && <span className="text-[10px] text-slate-400 font-mono">{data.subLabel}</span>}
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
              <span>Avg Latency:</span>
            </span>
            <span className="font-bold font-mono text-blue-700">{data.latency} mins</span>
          </div>
          <div className="flex justify-between items-center text-slate-500 text-[10px]">
            <span>Target SLA:</span>
            <span className="font-mono text-slate-700">{data.targetSla} mins max</span>
          </div>
          {data.onTimePercent && (
            <div className="flex justify-between items-center text-slate-500 text-[10px]">
              <span>On-Time Rate:</span>
              <span className="font-mono text-emerald-700 font-semibold">{data.onTimePercent}%</span>
            </div>
          )}
          {data.gmv && (
            <div className="flex justify-between items-center text-slate-600 pt-1 border-t border-slate-100">
              <span>Period GMV:</span>
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">monitoring</span>
            </div>
            <h3 className="font-headline font-bold text-slate-900 text-base">
              Order Volume & Dispatch Latency Telemetry
            </h3>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-mono font-semibold border border-emerald-200">
              {timeframe.toUpperCase()} VIEW
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {rangeDescription} — monitored against strict 30-minute delivery SLA threshold.
          </p>
        </div>

        {/* Range Selector & Dropdown UI Controls */}
        <div className="flex items-center gap-2.5">
          {/* Dropdown Selector (Standard Select Element) */}
          <div className="relative">
            <label htmlFor="granularity-select" className="sr-only">
              Select Time Range
            </label>
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus-within:ring-2 focus-within:ring-blue-600">
              <span className="material-symbols-outlined text-slate-400 text-base mr-1.5">calendar_month</span>
              <select
                id="granularity-select"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as TimeframeMode)}
                className="bg-transparent font-semibold text-slate-800 text-xs focus:outline-none cursor-pointer pr-2"
              >
                <option value="daily">Daily View (Last 7 Days)</option>
                <option value="weekly">Weekly View (Last 8 Weeks)</option>
                <option value="monthly">Monthly View (Last 6 Months)</option>
              </select>
            </div>
          </div>

          {/* Segmented Range Selector (Button Pills) */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setTimeframe('daily')}
              className={`px-3 py-1 rounded-lg font-medium transition flex items-center gap-1 ${
                timeframe === 'daily'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Daily</span>
            </button>
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-3 py-1 rounded-lg font-medium transition flex items-center gap-1 ${
                timeframe === 'weekly'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Weekly</span>
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-3 py-1 rounded-lg font-medium transition flex items-center gap-1 ${
                timeframe === 'monthly'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Monthly</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Highlights Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-1 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium block">
            {timeframe === 'daily'
              ? '7-Day Order Volume'
              : timeframe === 'weekly'
              ? '8-Week Total Orders'
              : '6-Month Cumulative Orders'}
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-lg font-bold font-headline text-slate-900">
              {totalVolume.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-emerald-600 font-mono font-semibold">
              {timeframe === 'daily' ? '+14.2%' : timeframe === 'weekly' ? '+25.7%' : '+38.4%'}
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium block">Avg Fulfillment Latency</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-lg font-bold font-headline text-blue-700">{avgLatency} mins</span>
            <span className="text-[10px] text-emerald-600 font-mono font-semibold">
              -{(30 - parseFloat(avgLatency)).toFixed(1)}m under SLA
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium block">On-Time Dispatch Rate</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-lg font-bold font-headline text-emerald-700">{avgOnTime}%</span>
            <span className="text-[10px] text-slate-500 font-mono">Tier-1 Node</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium block">
            {timeframe === 'daily'
              ? 'Period Clearing GMV'
              : timeframe === 'weekly'
              ? '8-Week Gross GMV'
              : '6-Month Settled GMV'}
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-lg font-bold font-headline text-slate-900">
              ₹{(totalGmv >= 100000 ? (totalGmv / 100000).toFixed(2) + ' Lakh' : totalGmv.toLocaleString('en-IN'))}
            </span>
            <span className="text-[10px] text-emerald-600 font-mono font-semibold">Escrow Verified</span>
          </div>
        </div>
      </div>

      {/* Chart Visualizer */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={currentDataset}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
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
                offset: 20,
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
                offset: 20,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              formatter={(value) => {
                if (value === 'volume') {
                  return `${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Order Volume (left axis)`;
                }
                if (value === 'latency') return 'Avg Dispatch Latency in mins (right axis)';
                if (value === 'targetSla') return 'Target SLA Ceiling (30m)';
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
              maxBarSize={timeframe === 'monthly' ? 48 : timeframe === 'weekly' ? 38 : 34}
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
