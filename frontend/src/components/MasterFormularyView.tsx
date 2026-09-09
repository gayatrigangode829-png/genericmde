import React, { useState } from 'react';
import { FORMULARY_SALTS } from '../data/initialData';
import { FormularySalt } from '../types';

export const MasterFormularyView: React.FC = () => {
  const [salts, setSalts] = useState<FormularySalt[]>(FORMULARY_SALTS);
  const [selectedSalt, setSelectedSalt] = useState<FormularySalt>(FORMULARY_SALTS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [autoSuggestEnabled, setAutoSuggestEnabled] = useState(true);
  const [strictBioMatch, setStrictBioMatch] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filteredSalts = salts.filter((s) => {
    const matchesSearch =
      s.saltName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.canonicalKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.therapeuticClass.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'all' || s.therapeuticClass.toLowerCase().includes(selectedClass.toLowerCase());
    return matchesSearch && matchesClass;
  });

  const handleUpdateGuardrail = () => {
    setToastMsg(`Guardrails updated for ${selectedSalt.canonicalKey}: Auto-suggest ${autoSuggestEnabled ? 'ENABLED' : 'DISABLED'}`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              <span className="material-symbols-outlined text-2xl">medication</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline font-bold text-slate-900 text-lg sm:text-xl">
                  Master Drug Formulary & Equivalence Engine
                </h1>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-mono font-medium border border-blue-200">
                  FR-CORE-01 / FR-ADM-02
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Chemical salt normalization engine matching disparate tenant inventory to CDSCO standards.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Ingestion daemon active: 142,850 SKUs mapped across 48 tenant schemas with 0 unallocated items.')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-300 transition"
            >
              <span className="material-symbols-outlined text-[16px]">terminal</span>
              <span>Worker Daemon Telemetry</span>
            </button>
            <button
              onClick={() => {
                setToastMsg('New chemical salt modal triggered.');
                setTimeout(() => setToastMsg(null), 2500);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>+ Add Standard Salt</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Banners */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Total Standardized Salts</span>
            <span className="text-2xl font-bold font-headline text-slate-900 mt-1 block">4,820</span>
            <span className="text-[10px] text-slate-500 font-mono">100% CDSCO Index</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Tenant Ingested SKUs</span>
            <span className="text-2xl font-bold font-headline text-blue-700 mt-1 block">142,850</span>
            <span className="text-[10px] text-emerald-600 font-mono">48 Active Tenants</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Lowest-Price Margin</span>
            <span className="text-2xl font-bold font-headline text-emerald-700 mt-1 block">62.4%</span>
            <span className="text-[10px] text-slate-500 font-mono">vs Branded MRP</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Exception Queue</span>
            <span className="text-2xl font-bold font-headline text-amber-600 mt-1 block">28 Flagged</span>
            <span className="text-[10px] text-amber-700 font-mono">Requires Review</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Formulations List & Formulation Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Formulations Matrix */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            {/* Search & Filter Toolbar */}
            <div className="flex flex-col sm:flex-row gap-2 justify-between">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-base">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by chemical name, canonical ID, class..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 bg-slate-100 rounded-xl text-xs text-slate-700 border-none focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="all">All Therapeutic Classes</option>
                <option value="analgesics">Analgesics & Antipyretics</option>
                <option value="diabetic">Anti-Diabetic</option>
                <option value="cardio">Cardiovascular</option>
                <option value="antibiotics">Antibiotics</option>
                <option value="gastro">Gastrointestinal</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Canonical Key / Salt</th>
                    <th className="py-2.5 px-3">Active Bids</th>
                    <th className="py-2.5 px-3">Branded Benchmark</th>
                    <th className="py-2.5 px-3">Lowest Generic</th>
                    <th className="py-2.5 px-3">Savings</th>
                    <th className="py-2.5 px-3 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSalts.map((salt) => {
                    const isSelected = selectedSalt.id === salt.id;
                    return (
                      <tr
                        key={salt.id}
                        onClick={() => setSelectedSalt(salt)}
                        className={`cursor-pointer transition ${
                          isSelected ? 'bg-blue-50/70 border-l-4 border-l-blue-600' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 block">{salt.saltName} {salt.strength}</span>
                          <span className="font-mono text-[10px] text-blue-700">{salt.canonicalKey}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-mono font-semibold text-slate-800">{salt.activeSkusCount} SKUs</span>
                          <span className="text-[10px] text-slate-400 block">{salt.cdscoCategory}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-slate-700">₹{salt.brandedPrice.toFixed(2)}</span>
                          <span className="text-[10px] text-slate-400 block">{salt.brandedBenchmark}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-emerald-700 text-sm">₹{salt.lowestGenericPrice.toFixed(2)}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                            {salt.savingsMargin}%
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSalt(salt);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Active Formulation Inspector */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Formulation Inspector
                </span>
                <h3 className="font-headline font-bold text-slate-900 text-base mt-1">
                  {selectedSalt.saltName} {selectedSalt.strength}
                </h3>
                <span className="font-mono text-xs text-slate-500">{selectedSalt.canonicalKey}</span>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  selectedSalt.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {selectedSalt.status}
              </span>
            </div>

            {/* Regulatory Classification */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <span className="font-semibold text-slate-800 block">CDSCO Regulatory Profile</span>
              <div className="flex justify-between text-slate-600">
                <span>Classification:</span>
                <span className="font-medium text-slate-900">{selectedSalt.cdscoCategory}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Formulation Hash:</span>
                <span className="font-mono text-[11px] text-slate-700">SHA256: 81f49b...29b</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Minimum Bio-EQ Score:</span>
                <span className="font-mono font-bold text-emerald-700">98.0%</span>
              </div>
            </div>

            {/* Ranked Tenant SKU Bids */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Ranked Pharmacy SKU Bids ({selectedSalt.activeSkusCount})
              </span>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-emerald-50/60 border border-emerald-200 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 block">Paracip 650 (Cipla)</span>
                    <span className="text-[11px] text-slate-500">Metro Chemist (#TN-044)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 text-sm">₹14.50</span>
                    <span className="text-[10px] text-emerald-800 font-semibold block">Rank #1 (Win)</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="font-medium text-slate-900 block">Dolo-Safe 650 (Micro Labs)</span>
                    <span className="text-[11px] text-slate-500">Apex Chemist (#TN-008)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-800">₹16.00</span>
                    <span className="text-[10px] text-slate-500 block">Rank #2</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="font-medium text-slate-900 block">Pacimol 650 (IPCA)</span>
                    <span className="text-[11px] text-slate-500">Wellness Forever (#TN-015)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-800">₹18.00</span>
                    <span className="text-[10px] text-slate-500 block">Rank #3</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Automated Guardrail Controls */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <span className="font-semibold text-slate-800 block">Automated Algorithmic Guardrails</span>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-slate-800 block">Auto-Suggest Generic</span>
                  <span className="text-[10px] text-slate-500">Promote whenever user queries brand name</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoSuggestEnabled}
                  onChange={(e) => setAutoSuggestEnabled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-slate-800 block">Strict Strength Verification</span>
                  <span className="text-[10px] text-slate-500">Disallow cross-dosage substitutions</span>
                </div>
                <input
                  type="checkbox"
                  checked={strictBioMatch}
                  onChange={(e) => setStrictBioMatch(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>

              <button
                onClick={handleUpdateGuardrail}
                className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition"
              >
                Save Guardrail Rules
              </button>
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
