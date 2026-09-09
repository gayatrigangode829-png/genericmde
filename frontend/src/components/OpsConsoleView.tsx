import React, { useState } from 'react';
import { FORMULARY_SALTS } from '../data/initialData';
import { FormularySalt } from '../types';

export const OpsConsoleView: React.FC = () => {
  const [salts, setSalts] = useState<FormularySalt[]>(FORMULARY_SALTS);
  const [selectedException, setSelectedException] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [exceptions, setExceptions] = useState([
    {
      id: 'EXC-4091',
      type: 'Pricing Anomaly',
      salt: 'Pantoprazole Sodium 40mg',
      severity: 'Critical',
      tenant: 'ten_029 (MedPlus Express)',
      desc: 'Price dump flag: SKU priced at ₹4.20 (-85% below market median ₹28.00). Suspected data feed glitch.',
      status: 'pending',
    },
    {
      id: 'EXC-4088',
      type: 'SLA Breach Threat',
      salt: 'Metformin HCl 500mg ER',
      severity: 'Medium',
      tenant: 'ten_008 (Apex Healthcare)',
      desc: 'Order unacknowledged after 7 mins (SLA threshold 5 mins). Auto-reroute scheduled.',
      status: 'pending',
    },
    {
      id: 'EXC-4085',
      type: 'Formulation Ambiguity',
      salt: 'Amoxicillin + Clav',
      severity: 'Low',
      tenant: 'ten_012 (Apollo Pharmacy)',
      desc: 'Tenant cataloged dry syrup variant under oral solid cluster. Normalized manually.',
      status: 'resolved',
    },
  ]);

  const handleQuarantine = (excId: string) => {
    setExceptions((prev) =>
      prev.map((e) => (e.id === excId ? { ...e, status: 'quarantined' } : e))
    );
    setToastMessage(`Exception ${excId} quarantined! SKU isolated from consumer search.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResolve = (excId: string) => {
    setExceptions((prev) =>
      prev.map((e) => (e.id === excId ? { ...e, status: 'resolved' } : e))
    );
    setToastMessage(`Exception ${excId} cleared and marked compliant.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header & Command Bar */}
      <div className="bg-[#002848] text-white rounded-2xl p-5 border border-blue-900/60 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center font-bold text-xl">
              <span className="material-symbols-outlined text-2xl">shield_person</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline font-bold text-white text-lg sm:text-xl">
                  Operations & Regulatory Governance Center
                </h1>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono">
                  Master Cluster Active
                </span>
              </div>
              <p className="text-xs text-blue-200/80 mt-1 flex items-center gap-2">
                <span>Dr. Rachel Vance (Chief Compliance & Platform Architect)</span>
                <span>•</span>
                <span className="text-slate-300">OpenSearch 0ms lag</span>
                <span>•</span>
                <span className="text-slate-300">48 Tenants Isolated</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('All active schemas validated against CDSCO Drug Rules 1945.')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-900/80 hover:bg-blue-800 text-white text-xs font-medium border border-blue-700/60 transition"
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Run Compliance Audit</span>
            </button>
            <button
              onClick={() => {
                setToastMessage('Forced cache flush & OpenSearch index refreshed across 48 shards.');
                setTimeout(() => setToastMessage(null), 3000);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition"
            >
              <span className="material-symbols-outlined text-[16px]">sync</span>
              <span>Re-sync Feed Engine</span>
            </button>
          </div>
        </div>

        {/* 4 Key Platform Telemetry Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-5 border-t border-blue-800/60">
          <div className="bg-blue-950/60 rounded-xl p-3 border border-blue-800/40">
            <span className="text-[11px] text-blue-300 block">Catalog Depth (Normalized)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-headline text-white">142,850</span>
              <span className="text-[11px] text-emerald-400 font-mono">+2.4k today</span>
            </div>
          </div>

          <div className="bg-blue-950/60 rounded-xl p-3 border border-blue-800/40">
            <span className="text-[11px] text-blue-300 block">PRD Metric FR-CORE-02</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-headline text-emerald-400">84.6%</span>
              <span className="text-[11px] text-slate-400">Lowest Price Win</span>
            </div>
          </div>

          <div className="bg-blue-950/60 rounded-xl p-3 border border-blue-800/40">
            <span className="text-[11px] text-blue-300 block">Quarantined SKUs</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-headline text-amber-400">14 SKUs</span>
              <span className="text-[11px] text-slate-400">Price Glitch Lock</span>
            </div>
          </div>

          <div className="bg-blue-950/60 rounded-xl p-3 border border-blue-800/40">
            <span className="text-[11px] text-blue-300 block">Platform GMV (Today)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-headline text-white">₹18,42,900</span>
              <span className="text-[11px] text-blue-300 font-mono">Escrow Held</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Ops Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Master Normalization Formulary & Clusters */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-headline font-bold text-slate-900 text-base flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-lg">mediation</span>
                  Active Chemical Salt Normalization Clusters
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  CDSCO bioequivalence standard: algorithms map disparate pharmacy SKUs to canonical salt keys.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Canonical Key / Salt</th>
                    <th className="py-2.5 px-3">Therapeutic Class</th>
                    <th className="py-2.5 px-3">Branded MRP</th>
                    <th className="py-2.5 px-3">Generic Win Price</th>
                    <th className="py-2.5 px-3">Savings</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {salts.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{s.saltName} {s.strength}</span>
                        <span className="font-mono text-[10px] text-blue-600">{s.canonicalKey}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-700 block">{s.therapeuticClass}</span>
                        <span className="text-[11px] text-slate-400">{s.dosageForm}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-500">₹{s.brandedPrice.toFixed(2)}</span>
                        <span className="text-[10px] text-slate-400 block">{s.brandedBenchmark}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-emerald-700 text-sm">₹{s.lowestGenericPrice.toFixed(2)}</span>
                        <span className="text-[10px] text-slate-500 block">{s.activeSkusCount} verified bids</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                          {s.savingsMargin}%
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${
                            s.status === 'active'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                          }`}
                        >
                          {s.status === 'active' ? 'Active In Feed' : 'Anomaly Flagged'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Core Architecture Telemetry */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="font-headline font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-base">speed</span>
              Cluster Telemetry & Health Gauges
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Edge Gateway</span>
                <span className="font-mono font-bold text-slate-900 text-base">42 ms</span>
                <span className="text-[10px] text-emerald-600 block">Cloudflare PoP Mumbai</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Redis L2 Cache</span>
                <span className="font-mono font-bold text-slate-900 text-base">99.98%</span>
                <span className="text-[10px] text-emerald-600 block">Salt query hit rate</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Tenant Schemas</span>
                <span className="font-mono font-bold text-slate-900 text-base">48 / 48</span>
                <span className="text-[10px] text-emerald-600 block">Strict RLS enforced</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Escrow Ledger</span>
                <span className="font-mono font-bold text-emerald-700 text-base">100% Balanced</span>
                <span className="text-[10px] text-slate-500 block">Zero unallocated drift</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Dispute & Exception Queue */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-headline font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span className="material-symbols-outlined text-rose-600 text-lg">warning</span>
                Real-Time Exception Queue
              </h3>
              <span className="text-[11px] font-mono text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-bold">
                {exceptions.filter((e) => e.status === 'pending').length} Active
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Automated circuit breakers flag suspicious pricing or SLA breaches.
            </p>

            <div className="space-y-2.5 pt-1">
              {exceptions.map((exc) => (
                <div
                  key={exc.id}
                  className={`p-3 rounded-xl border text-xs space-y-2 transition ${
                    exc.status === 'resolved'
                      ? 'bg-emerald-50/40 border-emerald-200 opacity-70'
                      : exc.status === 'quarantined'
                      ? 'bg-slate-100 border-slate-300'
                      : exc.severity === 'Critical'
                      ? 'bg-rose-50/60 border-rose-200'
                      : 'bg-amber-50/60 border-amber-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono font-bold text-slate-900">{exc.id}</span>
                      <span className="text-slate-500 text-[11px]"> • {exc.tenant}</span>
                    </div>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                        exc.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : exc.status === 'quarantined'
                          ? 'bg-slate-300 text-slate-700'
                          : exc.severity === 'Critical'
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {exc.status === 'resolved' ? 'Resolved' : exc.status === 'quarantined' ? 'Quarantined' : exc.severity}
                    </span>
                  </div>

                  <p className="text-slate-700 font-medium leading-relaxed text-[11px]">{exc.desc}</p>

                  {exc.status === 'pending' && (
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                      <button
                        onClick={() => handleQuarantine(exc.id)}
                        className="flex-1 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-semibold transition"
                      >
                        Quarantine Anomaly
                      </button>
                      <button
                        onClick={() => handleResolve(exc.id)}
                        className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-semibold transition"
                      >
                        Approve / Clear
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Immutable Audit Log Snapshot */}
          <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 shadow-md space-y-3">
            <h4 className="font-headline font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-blue-400 text-sm">history_edu</span>
              WORM Immutable Audit Vault
            </h4>

            <div className="space-y-2 text-[11px] font-mono text-slate-300">
              <div className="border-l-2 border-blue-500 pl-2 py-0.5">
                <span className="text-slate-400">10:44:12 UTC • </span>
                <span className="text-white">QUARANTINE_OVERRIDE</span>
                <p className="text-slate-400 text-[10px]">Actor: r.vance@genericmed (SHA256: 9b02...c41)</p>
              </div>
              <div className="border-l-2 border-emerald-500 pl-2 py-0.5">
                <span className="text-slate-400">10:41:00 UTC • </span>
                <span className="text-white">STALE_FEED_PRUNE</span>
                <p className="text-slate-400 text-[10px]">Pruned 24 expired batches from MedPlus</p>
              </div>
              <div className="border-l-2 border-amber-500 pl-2 py-0.5">
                <span className="text-slate-400">10:38:22 UTC • </span>
                <span className="text-white">ESCROW_RECONCILE</span>
                <p className="text-slate-400 text-[10px]">Matched ₹18,42,900 across 48 tenant nodes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-medium z-50 flex items-center gap-2 border border-slate-700">
          <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
