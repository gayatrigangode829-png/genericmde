import React, { useState } from 'react';
import { INITIAL_DISPENSARY_ORDERS } from '../data/initialData';

export const OrdersDispatchView: React.FC = () => {
  const [selectedOrderId, setSelectedOrderId] = useState('GM-99420');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const ordersList = [
    {
      id: 'GM-99420',
      time: '10:14 AM',
      customer: 'Aarav Sharma',
      tenant: 'Metro Generic Chemist (#TN-044)',
      items: 'Paracip 650mg (x2), Metfor-G 500 ER (x1)',
      amount: 51.00,
      partner: 'Shadowfax Express',
      status: 'In-Transit',
      slaCountdown: '12m ETA',
    },
    {
      id: 'GM-99418',
      time: '10:08 AM',
      customer: 'Priya Mehra',
      tenant: 'Metro Generic Chemist (#TN-044)',
      items: 'Lipicure Generic 10mg (x3)',
      amount: 114.00,
      partner: 'Dunzo Direct',
      status: 'Preparing',
      slaCountdown: '04:10 mins left',
    },
    {
      id: 'GM-99415',
      time: '09:54 AM',
      customer: 'Rohan Deshmukh',
      tenant: 'Metro Generic Chemist (#TN-044)',
      items: 'Paracip 650mg (x1), Pantocid-G 40mg (x2)',
      amount: 70.50,
      partner: 'Porter Express',
      status: 'Packing',
      slaCountdown: '08:45 mins left',
    },
    {
      id: 'GM-99411',
      time: '09:41 AM',
      customer: 'Vikrant Rao',
      tenant: 'Apollo Pharmacy Hub (#TN-012)',
      items: 'Amoxy-Clav 625 (x2)',
      amount: 164.00,
      partner: 'Shadowfax Express',
      status: 'Dispatched',
      slaCountdown: 'Completed',
    },
    {
      id: 'GM-99408',
      time: '09:30 AM',
      customer: 'Sunita Nair',
      tenant: 'Apex Healthcare (#TN-008)',
      items: 'Metformin SR 500 (x2)',
      amount: 44.00,
      partner: 'Self-Pickup',
      status: 'Delivered',
      slaCountdown: 'Completed',
    },
  ];

  const handleOverrideAction = (action: string) => {
    setToastMsg(`Executive Action Executed: ${action} for order #${selectedOrderId}.`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              <span className="material-symbols-outlined text-2xl">local_shipping</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline font-bold text-slate-900 text-lg sm:text-xl">
                  Order Management & Dispatch Operations
                </h1>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-mono font-medium border border-emerald-200">
                  48 Tenants Live • SSE 0ms
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Real-time delivery fulfillment, logistics partner API dispatch, and escrow ledger tracking.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Batch manifest generated for Shadowfax and Dunzo riders.')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-300 transition"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Batch Manifest</span>
            </button>
            <button
              onClick={() => {
                setToastMsg('Manual B2B / Clinic order creation interface activated.');
                setTimeout(() => setToastMsg(null), 2500);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>+ Create Manual Order</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Active Pipeline</span>
            <span className="text-2xl font-bold font-headline text-slate-900 mt-1 block">1,842</span>
            <span className="text-[10px] text-emerald-600 font-mono">142 In-Transit</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">On-Time Dispatch SLA</span>
            <span className="text-2xl font-bold font-headline text-emerald-700 mt-1 block">96.4%</span>
            <span className="text-[10px] text-slate-500 font-mono">Tier-1 Threshold 95%</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Dispute & Exception Rate</span>
            <span className="text-2xl font-bold font-headline text-slate-900 mt-1 block">0.82%</span>
            <span className="text-[10px] text-emerald-600 font-mono">Below 1.5% target</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Platform GMV Today</span>
            <span className="text-2xl font-bold font-headline text-blue-700 mt-1 block">₹4,86,250</span>
            <span className="text-[10px] text-slate-500 font-mono">9% Escrow Take</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Orders Table & Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Orders Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 justify-between">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-base">search</span>
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter by Order ID (#GM-99420), customer, dispensary..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-100 rounded-xl text-xs text-slate-700 border-none focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="all">All Order Statuses</option>
                <option value="In-Transit">In-Transit</option>
                <option value="Preparing">Preparing / Needs Acceptance</option>
                <option value="Packing">Packing</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Order ID / Time</th>
                    <th className="py-2.5 px-3">Customer & Tenant</th>
                    <th className="py-2.5 px-3">Items</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ordersList
                    .filter((o) => {
                      const matchesSearch =
                        o.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
                        o.customer.toLowerCase().includes(searchFilter.toLowerCase()) ||
                        o.tenant.toLowerCase().includes(searchFilter.toLowerCase());
                      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
                      return matchesSearch && matchesStatus;
                    })
                    .map((ord) => {
                      const isSelected = selectedOrderId === ord.id;
                      return (
                        <tr
                          key={ord.id}
                          onClick={() => setSelectedOrderId(ord.id)}
                          className={`cursor-pointer transition ${
                            isSelected ? 'bg-blue-50/70 border-l-4 border-l-blue-600' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-3 px-3">
                            <span className="font-mono font-bold text-slate-900 block">#{ord.id}</span>
                            <span className="text-[10px] text-slate-400">{ord.time}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-semibold text-slate-900 block">{ord.customer}</span>
                            <span className="text-[10px] text-slate-500">{ord.tenant}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-medium text-slate-700 max-w-[200px] truncate block">{ord.items}</span>
                            <span className="text-[10px] text-blue-600 font-mono">Courier: {ord.partner}</span>
                          </td>
                          <td className="py-3 px-3 font-bold font-headline text-slate-900">
                            ₹{ord.amount.toFixed(2)}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                ord.status === 'In-Transit'
                                  ? 'bg-blue-100 text-blue-800'
                                  : ord.status === 'Preparing'
                                  ? 'bg-amber-100 text-amber-800'
                                  : ord.status === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrderId(ord.id);
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

        {/* Right 1 Col: Live Order Inspector */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Live Dispatch Telemetry
                </span>
                <h3 className="font-headline font-bold text-slate-900 text-base mt-1">
                  Order #{selectedOrderId}
                </h3>
                <span className="text-xs text-slate-500">Customer: Aarav Sharma (+91 98201 •••••)</span>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                In-Transit (12m ETA)
              </span>
            </div>

            {/* Courier Rider Status */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-slate-900">Rahul K.</span>
                  <p className="text-slate-500 text-[11px]">Shadowfax Express • Vehicle MH-01-EQ-9811</p>
                </div>
                <span className="font-mono font-bold text-emerald-700 text-sm">OTP: 8842</span>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => alert('Dialing courier Rahul K. (+91 98402 11982)...')}
                  className="flex-1 py-1 rounded-lg bg-slate-800 text-white font-medium text-[11px] flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">call</span>
                  <span>Hot-Dial Rider</span>
                </button>
                <button
                  onClick={() => alert('GPS Live Map view: Rider at Senapati Bapat Marg junction (0.8km away).')}
                  className="flex-1 py-1 rounded-lg border border-slate-300 text-slate-700 font-medium text-[11px] hover:bg-slate-100 flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">map</span>
                  <span>Track GPS</span>
                </button>
              </div>
            </div>

            {/* Fulfillment Milestones Stepper */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Fulfillment Milestones
              </span>
              <div className="space-y-2 text-xs border-l-2 border-emerald-500 pl-3 ml-2">
                <div>
                  <span className="font-bold text-slate-800 block">Order Placed & Salt Normalized</span>
                  <span className="text-[10px] text-slate-400">10:14 AM • SHA256 canonical match</span>
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">Accepted by Vikram Joshi (R.Ph)</span>
                  <span className="text-[10px] text-slate-400">10:16 AM • Metro Generic Chemist #TN-044</span>
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">Batch Verified: CIP-2409-A2</span>
                  <span className="text-[10px] text-slate-400">10:19 AM • Exp: 11/27 • WHO-GMP Batch</span>
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">Handover to Courier Complete</span>
                  <span className="text-[10px] text-emerald-600 font-medium">10:24 AM • OTP 8842 verified</span>
                </div>
              </div>
            </div>

            {/* Escrow Ledger Breakdown */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <span className="font-semibold text-slate-800 block">Escrow Ledger Breakdown</span>
              <div className="flex justify-between text-slate-600">
                <span>Customer Paid:</span>
                <span className="font-mono font-bold text-slate-900">₹51.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Platform Commission (9%):</span>
                <span className="font-mono text-blue-700">-₹4.59</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shadowfax Delivery Fee:</span>
                <span className="font-mono text-emerald-600">₹0.00 (Subsidized)</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
                <span>Dispensary Net Payable:</span>
                <span className="font-mono text-emerald-700">₹46.41</span>
              </div>
            </div>

            {/* Executive Overrides */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">
                Executive Operations Overrides
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleOverrideAction('Auto-Reroute to Apex Chemist')}
                  className="p-2 rounded-xl border border-amber-300 text-amber-800 hover:bg-amber-50 font-medium transition text-[11px]"
                >
                  Force Auto-Reroute
                </button>
                <button
                  onClick={() => handleOverrideAction('Instant Customer Wallet Refund')}
                  className="p-2 rounded-xl border border-rose-300 text-rose-800 hover:bg-rose-50 font-medium transition text-[11px]"
                >
                  Instant Refund
                </button>
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
