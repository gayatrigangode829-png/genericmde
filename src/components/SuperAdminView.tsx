import React, { useState } from 'react';
import { TENANT_NODES } from '../data/initialData';
import { TenantNode } from '../types';

export const SuperAdminView: React.FC = () => {
  const [tenants, setTenants] = useState<TenantNode[]>(TENANT_NODES);
  const [circuitBreakers, setCircuitBreakers] = useState({
    globalCheckoutPause: false,
    rateLimitThrottle: false,
    strictBioGate: true,
    priceGougingLock: true,
  });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const toggleCircuitBreaker = (key: keyof typeof circuitBreakers, name: string) => {
    const nextState = !circuitBreakers[key];
    setCircuitBreakers((prev) => ({ ...prev, [key]: nextState }));
    setToastMsg(`Circuit breaker "${name}" set to ${nextState ? 'ENGAGED' : 'DISENGAGED'}.`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Super Admin Top Control Bar */}
      <div className="bg-[#0b132b] text-white rounded-2xl p-5 border border-slate-700 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400 text-blue-300 flex items-center justify-center font-bold text-xl">
              <span className="material-symbols-outlined text-2xl">lan</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline font-bold text-white text-lg sm:text-xl">
                  Multi-Tenant Fleet Orchestrator & Shard Infrastructure
                </h1>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono">
                  Asia-South1 Master
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>48 Isolated Tenants</span>
                <span>•</span>
                <span>42 DB Nodes</span>
                <span>•</span>
                <span className="text-emerald-400 font-mono">100% Zero Data Leakage</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => alert('Initiating rolling schema upgrade to v4.2 across all 48 tenant shards...')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-blue-200 text-xs font-medium border border-blue-700/60 transition"
            >
              <span className="material-symbols-outlined text-[16px]">upgrade</span>
              <span>Global Schema Migration</span>
            </button>
            <button
              onClick={() => {
                setToastMsg('Tenant provisioning wizard initialized.');
                setTimeout(() => setToastMsg(null), 2500);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>+ Provision Tenant</span>
            </button>
          </div>
        </div>

        {/* 4 High Impact Cluster Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
          <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Tenant Ecosystem</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-headline text-white">48 Nodes</span>
              <span className="text-[11px] text-emerald-400 font-mono">100% Live</span>
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Platform Clearing MTD</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-headline text-emerald-400">₹84,92,450</span>
              <span className="text-[11px] text-slate-400 font-mono">Reconciled</span>
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Database Shard Fleet</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-headline text-blue-300">42 DBs</span>
              <span className="text-[11px] text-slate-400">12.8 TB Fleet</span>
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Regulatory & Root Trust</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-headline text-white">Grade A+</span>
              <span className="text-[11px] text-emerald-400 font-mono">CDSCO Passed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Orchestrator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Multi-Tenant Fleet Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-headline font-bold text-slate-900 text-base flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-lg">database</span>
                  Multi-Tenant Fleet & Schema Partitioning
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Independent PostgreSQL schemas guarantee zero cross-tenant data leaks and strict RLS.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Tenant / Node</th>
                    <th className="py-2.5 px-3">PostgreSQL Schema</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Active Pipeline</th>
                    <th className="py-2.5 px-3">Today GMV</th>
                    <th className="py-2.5 px-3">SLA Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tenants.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{t.name}</span>
                        <span className="font-mono text-[10px] text-slate-400">{t.id} • {t.region}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {t.schemaId}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{t.storageGb} GB Allocated</span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                            t.status === 'healthy'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {t.status === 'healthy' ? 'Healthy' : 'Migrating v4'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-slate-800">
                        {t.activeOrders} orders
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        ₹{t.todayGMV.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-emerald-700">{t.slaPercent}%</span>
                        <span className="text-[10px] text-slate-400 block">{t.lastHeartbeat}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Platform Clearinghouse Waterfall */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="font-headline font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-base">account_balance</span>
              Platform Clearinghouse & Escrow Settlement Waterfall (MTD)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">1. Gross Inflow</span>
                <span className="font-mono font-bold text-slate-900 text-base mt-1 block">₹84,92,450.00</span>
                <span className="text-[10px] text-slate-400">Total consumer payments</span>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-blue-700 text-[10px] uppercase font-bold block">2. Platform Take (9%)</span>
                <span className="font-mono font-bold text-blue-800 text-base mt-1 block">₹7,64,320.50</span>
                <span className="text-[10px] text-blue-600">Retained revenue</span>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-amber-800 text-[10px] uppercase font-bold block">3. Regulatory TDS (1%)</span>
                <span className="font-mono font-bold text-amber-900 text-base mt-1 block">₹84,924.50</span>
                <span className="text-[10px] text-amber-700">Govt tax clearing</span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-emerald-800 text-[10px] uppercase font-bold block">4. Net to Dispensaries</span>
                <span className="font-mono font-bold text-emerald-900 text-base mt-1 block">₹76,43,205.00</span>
                <span className="text-[10px] text-emerald-700">Bank automated payout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Emergency Circuit Breakers */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-headline font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span className="material-symbols-outlined text-rose-600 text-lg">electric_meter</span>
                Emergency Circuit Breakers
              </h3>
              <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-mono font-bold border border-rose-200">
                Root Access
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Immediate cluster-level protections that can be engaged without redeployment.
            </p>

            <div className="space-y-3">
              {[
                {
                  key: 'globalCheckoutPause' as const,
                  label: 'Global Checkout Pause',
                  desc: 'Halt all customer ordering platform-wide during extreme incidents.',
                  active: circuitBreakers.globalCheckoutPause,
                  danger: true,
                },
                {
                  key: 'rateLimitThrottle' as const,
                  label: 'Aggressive Rate-Limiter',
                  desc: 'Throttle search queries to 5 req/sec per IP to mitigate scraping.',
                  active: circuitBreakers.rateLimitThrottle,
                  danger: false,
                },
                {
                  key: 'strictBioGate' as const,
                  label: 'Bio-Matching Strict Gate',
                  desc: 'Disallow any generic match below 98% bioequivalence rating.',
                  active: circuitBreakers.strictBioGate,
                  danger: false,
                },
                {
                  key: 'priceGougingLock' as const,
                  label: 'Price-Gouging Auto Lock',
                  desc: 'Auto-quarantine any SKU deviating >40% from national NPPA median.',
                  active: circuitBreakers.priceGougingLock,
                  danger: false,
                },
              ].map((cb) => (
                <div
                  key={cb.key}
                  className={`p-3 rounded-xl border transition flex items-center justify-between gap-2 text-xs ${
                    cb.active
                      ? cb.danger
                        ? 'bg-rose-50 border-rose-300'
                        : 'bg-emerald-50 border-emerald-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex-1">
                    <span className="font-bold text-slate-900 block">{cb.label}</span>
                    <span className="text-[11px] text-slate-500">{cb.desc}</span>
                  </div>

                  <button
                    onClick={() => toggleCircuitBreaker(cb.key, cb.label)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-2xs ${
                      cb.active
                        ? cb.danger
                          ? 'bg-rose-600 text-white hover:bg-rose-700'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {cb.active ? 'ACTIVE' : 'OFF'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Shard Utilization Gauge */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="font-headline font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <span className="material-symbols-outlined text-blue-600 text-base">pie_chart</span>
              Fleet Shard Capacity
            </h4>

            <div className="space-y-2 text-xs text-slate-600">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Storage Utilization (12.8 / 50 TB)</span>
                  <span className="font-mono font-bold text-slate-900">25.6%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '25.6%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Connection Pool (410 / 2,000 conns)</span>
                  <span className="font-mono font-bold text-emerald-700">20.5%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '20.5%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-medium z-50 flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
