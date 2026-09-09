import React, { useState } from 'react';
import { SYSTEM_USERS } from '../data/initialData';
import { UserAccount } from '../types';

export const IAMView: React.FC = () => {
  const [users, setUsers] = useState<UserAccount[]>(SYSTEM_USERS);
  const [selectedUser, setSelectedUser] = useState<UserAccount>(SYSTEM_USERS[1]); // Vikram Joshi
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleTogglePermission = (permission: string) => {
    setSelectedUser((prev) => {
      const exists = prev.permissions.includes(permission);
      const updatedPermissions = exists
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission];
      const updated = { ...prev, permissions: updatedPermissions };
      setUsers((uList) => uList.map((u) => (u.id === prev.id ? updated : u)));
      return updated;
    });
    setToastMsg(`Updated permission for ${selectedUser.name}`);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleKillSession = () => {
    setToastMsg(`Session killed for ${selectedUser.name}. JWT invalidated on Edge.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline font-bold text-slate-900 text-lg sm:text-xl">
                  Enterprise Identity & Access Governance (IAM)
                </h1>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-mono font-medium border border-blue-200">
                  RLS Enforced
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                PostgreSQL Row-Level Security (RLS) tenant isolation and zero-trust persona management.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('All 3,842 user sessions verified against cryptographic WORM keys.')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-300 transition"
            >
              <span className="material-symbols-outlined text-[16px]">security</span>
              <span>Audit MFA Posture</span>
            </button>
            <button
              onClick={() => {
                setToastMsg('Provision new enterprise user dialog opened.');
                setTimeout(() => setToastMsg(null), 2500);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>+ Provision User</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Banners */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Total Provisioned Users</span>
            <span className="text-2xl font-bold font-headline text-slate-900 mt-1 block">3,842</span>
            <span className="text-[10px] text-emerald-600 font-mono">48 Dispensaries</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">MFA Enforcement Rate</span>
            <span className="text-2xl font-bold font-headline text-emerald-700 mt-1 block">98.6%</span>
            <span className="text-[10px] text-slate-500 font-mono">FIDO2 / WebAuthn</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Privileged Accounts</span>
            <span className="text-2xl font-bold font-headline text-blue-700 mt-1 block">24</span>
            <span className="text-[10px] text-slate-500 font-mono">Hardware Token Locked</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Active Live Sessions</span>
            <span className="text-2xl font-bold font-headline text-slate-900 mt-1 block">1,128</span>
            <span className="text-[10px] text-emerald-600 font-mono">Zero Session Drift</span>
          </div>
        </div>
      </div>

      {/* 5 Canonical Personas Summary Pill Bar */}
      <div className="bg-slate-100 p-3 rounded-2xl border border-slate-200 flex flex-wrap gap-2 text-xs">
        <span className="font-bold text-slate-700 px-2 py-1">Canonical Personas:</span>
        {[
          { label: 'Super Admin', desc: 'Global Scope / Root' },
          { label: 'Admin / Ops Lead', desc: 'Marketplace Exception' },
          { label: 'Pharmacist-in-Charge', desc: 'Tenant RLS Scoped' },
          { label: 'Support & Compliance', desc: 'Masked PII Access' },
          { label: 'Customer / Patient', desc: 'Isolated Consumer Data' },
        ].map((p, i) => (
          <div key={i} className="bg-white px-3 py-1 rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-2xs">
            <span className="font-semibold text-slate-900">{p.label}</span>
            <span className="text-[10px] text-slate-400">• {p.desc}</span>
          </div>
        ))}
      </div>

      {/* Main Grid: User Table & Right Permission Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: User Directory */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 justify-between">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-base">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter users by name, email, tenant schema..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 bg-slate-100 rounded-xl text-xs text-slate-700 border-none focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="all">All Persona Roles</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Pharmacist-in-Charge">Pharmacist-in-Charge</option>
                <option value="Admin / Ops Lead">Admin / Ops Lead</option>
                <option value="Support & Compliance">Support & Compliance</option>
                <option value="Customer / Patient">Customer / Patient</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Identity & Account</th>
                    <th className="py-2.5 px-3">Role & Persona</th>
                    <th className="py-2.5 px-3">Tenant Boundary</th>
                    <th className="py-2.5 px-3">MFA Status</th>
                    <th className="py-2.5 px-3 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users
                    .filter((u) => {
                      const matchesSearch =
                        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.tenantBound.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
                      return matchesSearch && matchesRole;
                    })
                    .map((user) => {
                      const isSelected = selectedUser.id === user.id;
                      return (
                        <tr
                          key={user.id}
                          onClick={() => setSelectedUser(user)}
                          className={`cursor-pointer transition ${
                            isSelected ? 'bg-blue-50/70 border-l-4 border-l-blue-600' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-900 block">{user.name}</span>
                            <span className="text-[11px] text-slate-400">{user.email}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-semibold text-slate-800 block">{user.role}</span>
                            <span className="text-[10px] text-slate-400">{user.lastLogin}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-mono text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              {user.tenantBound}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                                user.mfaEnabled
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[12px]">
                                {user.mfaEnabled ? 'verified_user' : 'warning'}
                              </span>
                              {user.mfaEnabled ? 'MFA Active' : 'Unenforced'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUser(user);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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

        {/* Right 1 Col: Permission Inspector */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  RLS Permission Inspector
                </span>
                <h3 className="font-headline font-bold text-slate-900 text-base mt-1">
                  {selectedUser.name}
                </h3>
                <span className="text-xs text-slate-500">{selectedUser.email}</span>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                {selectedUser.status}
              </span>
            </div>

            {/* Bound Schema Card */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Row-Level Boundary:</span>
                <span className="font-mono font-bold text-slate-900">{selectedUser.tenantBound}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Session Expiry:</span>
                <span className="font-mono text-emerald-700">04h 12m remaining</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>IP Origin:</span>
                <span className="font-mono text-slate-800">103.21.144.12 (Mumbai)</span>
              </div>
            </div>

            {/* Granted Capabilities Checkboxes */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Granted Capabilities
              </span>

              {[
                { key: 'dispense:accept', label: 'Order Acceptance', desc: 'Accept orders for bound tenant' },
                { key: 'inventory:sync', label: 'Inventory Stock Sync', desc: 'Modify stock and batch levels' },
                { key: 'batch:validate', label: 'Batch Quality Release', desc: 'CDSCO compliance verification' },
                { key: 'handover:otp_verify', label: 'Rider Handover OTP', desc: 'Verify courier pickup PIN' },
                { key: 'schema:migrate', label: 'DDL Schema Migration', desc: 'Modify PostgreSQL table definitions' },
                { key: 'escrow:disburse', label: 'Escrow Fund Disbursement', desc: 'Authorize bank clearing' },
              ].map((perm) => {
                const isGranted = selectedUser.permissions.includes(perm.key);
                return (
                  <div
                    key={perm.key}
                    onClick={() => handleTogglePermission(perm.key)}
                    className="p-2 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 transition cursor-pointer flex items-start gap-2 text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={isGranted}
                      onChange={() => {}}
                      className="mt-0.5 w-4 h-4 text-blue-600 rounded"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-slate-800 block">{perm.label}</span>
                      <span className="text-[11px] text-slate-500">{perm.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <button
                onClick={handleKillSession}
                className="w-full py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-semibold transition"
              >
                Kill Active Session
              </button>
              <button
                onClick={() => alert(`MFA re-challenge sent to ${selectedUser.email}`)}
                className="w-full py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 text-xs font-semibold transition"
              >
                Force WebAuthn Challenge
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
