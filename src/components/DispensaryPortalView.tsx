import React, { useState } from 'react';
import { INITIAL_DISPENSARY_ORDERS, INITIAL_INVENTORY_ITEMS } from '../data/initialData';
import { DispensaryOrder, DispensaryInventoryItem } from '../types';
import { DispensaryMetricsChart } from './DispensaryMetricsChart';

export const DispensaryPortalView: React.FC = () => {
  const [storeStatus, setStoreStatus] = useState<'online' | 'busy' | 'offline'>('online');
  const [activeTab, setActiveTab] = useState<'needs_acceptance' | 'picking_packing' | 'ready_dispatch' | 'completed' | 'disputed'>('needs_acceptance');
  const [orders, setOrders] = useState<DispensaryOrder[]>(INITIAL_DISPENSARY_ORDERS);
  const [inventory, setInventory] = useState<DispensaryInventoryItem[]>(INITIAL_INVENTORY_ITEMS);
  const [otpInput, setOtpInput] = useState('');
  const [otpSuccessMessage, setOtpSuccessMessage] = useState<string | null>(null);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvSyncSuccess, setCsvSyncSuccess] = useState(false);
  const [inventorySearch, setInventorySearch] = useState('');
  const [showMetricsChart, setShowMetricsChart] = useState(true);

  // Handle order status transition
  const handleAcceptOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId ? { ...ord, status: 'picking_packing' } : ord
      )
    );
  };

  const handlePackOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId ? { ...ord, status: 'ready_dispatch' } : ord
      )
    );
  };

  const handleVerifyOtp = (targetOrderId: string, expectedOtp: string) => {
    if (otpInput === expectedOtp || otpInput === '8842') {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === targetOrderId ? { ...ord, status: 'completed' } : ord
        )
      );
      setOtpSuccessMessage(`Order #${targetOrderId} verified & handed over to Shadowfax Logistics!`);
      setOtpInput('');
      setTimeout(() => setOtpSuccessMessage(null), 4000);
    } else {
      alert('Invalid OTP. Please check the 4-digit code presented by the rider.');
    }
  };

  const handleStockChange = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStock = Math.max(0, item.stock + delta);
          return {
            ...item,
            stock: newStock,
            status: newStock === 0 ? 'out_of_stock' : newStock <= item.threshold ? 'low_stock' : 'in_stock',
          };
        }
        return item;
      })
    );
  };

  const filteredOrders = orders.filter((o) => o.status === activeTab);
  const needsAcceptanceCount = orders.filter((o) => o.status === 'needs_acceptance').length;
  const pickingCount = orders.filter((o) => o.status === 'picking_packing').length;
  const readyCount = orders.filter((o) => o.status === 'ready_dispatch').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Dispensary Header & Context */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              <span className="material-symbols-outlined text-2xl">local_pharmacy</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline font-bold text-slate-900 text-lg sm:text-xl">
                  Metro Generic Chemist
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-mono font-medium border border-slate-200">
                  #TN-044
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  SLA 99.4% Tier-1
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <span>Dadar West, Mumbai 400028</span>
                <span>•</span>
                <span className="text-slate-700 font-medium">Vikram Joshi (Reg. Pharmacist #61092)</span>
                <span>•</span>
                <span className="text-emerald-700 font-medium">CDSCO Form 20B/21B Valid</span>
              </p>
            </div>
          </div>

          {/* Operational Controls & Status Toggle */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Store Status Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setStoreStatus('online')}
                className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                  storeStatus === 'online'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
                <span>Online (Accepting)</span>
              </button>
              <button
                onClick={() => setStoreStatus('busy')}
                className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                  storeStatus === 'busy'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-300"></span>
                <span>Busy (+15m SLA)</span>
              </button>
              <button
                onClick={() => setStoreStatus('offline')}
                className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                  storeStatus === 'offline'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-300"></span>
                <span>Offline</span>
              </button>
            </div>

            <button
              onClick={() => setShowMetricsChart(!showMetricsChart)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shadow-xs transition border ${
                showMetricsChart
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {showMetricsChart ? 'monitoring' : 'show_chart'}
              </span>
              <span>{showMetricsChart ? 'Metrics Active' : 'Show Metrics Chart'}</span>
            </button>

            <button
              onClick={() => setShowCsvModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold shadow-xs transition"
            >
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              <span>CSV Stock Sync</span>
            </button>
          </div>
        </div>

        {/* Real-time KPI Metric Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <span className="text-[11px] font-medium text-slate-500 block">Dispatch SLA Avg</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-headline text-slate-900">28 mins</span>
              <span className="text-[11px] text-emerald-600 font-semibold">-4m vs target</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <span className="text-[11px] font-medium text-slate-500 block">Fulfillment Rate</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-headline text-emerald-700">99.2%</span>
              <span className="text-[11px] text-slate-500 font-mono">Tier-1</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <span className="text-[11px] font-medium text-slate-500 block">Today's Dispatched</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-headline text-slate-900">42 Orders</span>
              <span className="text-[11px] text-slate-600 font-mono">₹28,640</span>
            </div>
          </div>

          <div className="bg-rose-50 rounded-xl p-3 border border-rose-200">
            <span className="text-[11px] font-semibold text-rose-700 block flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-rose-600">alarm</span>
              Action Urgent
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-headline text-rose-800">{needsAcceptanceCount} Pending</span>
              <span className="text-[11px] text-rose-600 font-mono font-bold animate-pulse">SLA 03:42</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Order Volume & Fulfillment Latency Recharts Visualization */}
      {showMetricsChart && <DispensaryMetricsChart />}

      {/* Main Workdesk Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Order Workdesk Queue */}
        <div className="lg:col-span-2 space-y-4">
          {/* Workdesk Tabs */}
          <div className="flex items-center gap-1 border-b border-slate-200 pb-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'needs_acceptance', label: 'Needs Acceptance', count: needsAcceptanceCount, alert: needsAcceptanceCount > 0 },
              { id: 'picking_packing', label: 'Picking & Packing', count: pickingCount },
              { id: 'ready_dispatch', label: 'Ready for Dispatch', count: readyCount },
              { id: 'completed', label: 'Completed Today', count: completedCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-t-xl text-xs font-semibold transition border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-700 bg-white shadow-xs'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    tab.alert
                      ? 'bg-rose-600 text-white'
                      : activeTab === tab.id
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Orders Cards List */}
          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
                <span className="material-symbols-outlined text-4xl text-slate-300">task_alt</span>
                <p className="text-sm font-medium mt-2">No orders in this queue right now.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-sm">#{order.id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                          {order.deliveryType}
                        </span>
                        <span className="text-xs text-slate-400">• {order.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Customer: <span className="font-medium text-slate-800">{order.customerName}</span> ({order.customerPhoneMasked})
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold font-headline text-slate-900">
                        Dispensary Payout: ₹{order.payoutAmount.toFixed(2)}
                      </div>
                      <span className="text-[11px] text-slate-400">Order Total: ₹{order.totalAmount.toFixed(2)} (inc. 9% fee)</span>
                    </div>
                  </div>

                  {/* Order Items Table / Summary */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1.5 text-xs">
                    {order.itemsList.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-slate-700">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-blue-700 font-bold">{item.quantity}x</span>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-slate-400 text-[11px]">({item.salt})</span>
                        </div>
                        <span className="font-mono font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Order Action Buttons according to stage */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="material-symbols-outlined text-[15px] text-slate-400">verified</span>
                      <span>Bioequivalence auto-verified</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.status === 'needs_acceptance' && (
                        <>
                          <button
                            onClick={() => alert(`Reported shortage for order #${order.id}. Auto-rerouting to Apex Chemist.`)}
                            className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition"
                          >
                            Shortage / Reject
                          </button>
                          <button
                            onClick={() => handleAcceptOrder(order.id)}
                            className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
                          >
                            <span className="material-symbols-outlined text-[16px]">check</span>
                            <span>Accept & Generate Picklist</span>
                          </button>
                        </>
                      )}

                      {order.status === 'picking_packing' && (
                        <button
                          onClick={() => handlePackOrder(order.id)}
                          className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
                        >
                          <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                          <span>Mark Packed & Ready for Rider</span>
                        </button>
                      )}

                      {order.status === 'ready_dispatch' && order.rider && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-emerald-700 font-medium">Rider Waiting at Bay</span>
                          <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded border font-bold">
                            OTP: {order.rider.otp}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Courier Bay & Financial Settlements */}
        <div className="space-y-4">
          {/* Active Courier Bay Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-headline font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span className="material-symbols-outlined text-blue-600 text-lg">two_wheeler</span>
                Rider Pickup Bay
              </h3>
              <span className="text-[11px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Live Bay Active
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-slate-900">Rahul K.</span>
                  <p className="text-slate-500 text-[11px]">Shadowfax Logistics • MH-01-EQ-9811</p>
                </div>
                <span className="font-mono font-bold text-slate-700">Order #GM-99388</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                <span>Contact: +91 98402 11982</span>
                <span className="text-emerald-700 font-semibold">Arrived at counter</span>
              </div>

              {/* OTP Input & Handover Verification */}
              <div className="pt-2">
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  Enter 4-Digit Rider Handover OTP (Try 8842)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="8842"
                    className="w-28 text-center font-mono font-bold text-sm tracking-widest px-2 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                  <button
                    onClick={() => handleVerifyOtp('GM-99388', '8842')}
                    className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition"
                  >
                    Confirm Handover
                  </button>
                </div>
              </div>

              {otpSuccessMessage && (
                <div className="p-2 rounded bg-emerald-100 text-emerald-800 text-[11px] font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>{otpSuccessMessage}</span>
                </div>
              )}
            </div>
          </div>

          {/* Next Settlement Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-md space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-slate-400">Scheduled Escrow Settlement</span>
                <div className="text-2xl font-extrabold font-headline text-white mt-0.5">
                  ₹34,180.00
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
                Tomorrow 10:00 AM
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-700/60 pt-2.5">
              <div className="flex justify-between">
                <span>Completed Orders (32)</span>
                <span className="font-mono text-white">₹37,560.00</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Platform Commission (9%)</span>
                <span className="font-mono text-rose-400">-₹3,380.00</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-700 font-semibold text-white">
                <span>Bank: HDFC Bank •••• 9102</span>
                <span className="text-emerald-400 font-mono">Auto-Payout</span>
              </div>
            </div>
          </div>

          {/* Compliance & Cold Chain Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2 text-xs">
            <h4 className="font-headline font-bold text-slate-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-600 text-base">verified_user</span>
              Regulatory Custody & Quality
            </h4>
            <div className="space-y-1.5 text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>Cold Chain Sensor</span>
                <span className="font-mono font-bold text-emerald-700">4.2°C (Optimal)</span>
              </div>
              <div className="flex justify-between">
                <span>CDSCO Retail License</span>
                <span className="font-mono text-slate-800">MH-MZ2-441829</span>
              </div>
              <div className="flex justify-between">
                <span>Pharmacist On Duty</span>
                <span className="text-slate-800 font-medium">Vikram Joshi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dispensary Drug Catalogue & Stock Manager */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-headline font-bold text-slate-900 text-base flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-lg">inventory</span>
              Dispensary Drug Catalogue & Live Stock Sync
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Updates propagate to consumer search within 300ms.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-base">search</span>
              <input
                type="text"
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                placeholder="Search SKU or salt..."
                className="pl-8 pr-3 py-1.5 bg-slate-100 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
              <tr>
                <th className="py-2.5 px-3">SKU / Generic Drug</th>
                <th className="py-2.5 px-3">Active Chemical Salt</th>
                <th className="py-2.5 px-3">Batch & Expiry</th>
                <th className="py-2.5 px-3">Selling Price</th>
                <th className="py-2.5 px-3">Stock Units</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Live Stock Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventory
                .filter(
                  (item) =>
                    item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                    item.salt.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                    item.sku.toLowerCase().includes(inventorySearch.toLowerCase())
                )
                .map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-slate-900 block">{item.name}</span>
                      <span className="font-mono text-[10px] text-slate-400">{item.sku}</span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{item.salt}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px]">
                      {item.batchNumber} • <span className="text-slate-500">{item.expiryDate}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-slate-900">₹{item.sellingPrice.toFixed(2)}</span>
                      <span className="text-slate-400 line-through text-[10px] ml-1">₹{item.mrp.toFixed(2)}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800 text-sm">
                      {item.stock}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          item.status === 'in_stock'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.status === 'low_stock'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {item.status === 'in_stock' ? 'In Stock' : item.status === 'low_stock' ? 'Low Stock' : 'Depleted'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="inline-flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                        <button
                          onClick={() => handleStockChange(item.id, -5)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                          title="Decrease 5"
                        >
                          -
                        </button>
                        <span className="px-2 font-mono font-semibold text-xs text-slate-800">{item.stock}</span>
                        <button
                          onClick={() => handleStockChange(item.id, 5)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100 font-bold text-blue-600"
                          title="Add 5"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Stock Sync Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center">
              <h3 className="font-headline font-bold text-slate-900 text-base">Bulk CSV Stock Ingestion</h3>
              <button
                onClick={() => {
                  setShowCsvModal(false);
                  setCsvSyncSuccess(false);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Upload your dispensary inventory export (Marg ERP, Retailio, or Excel). Salts and batch numbers will be normalized automatically.
            </p>

            <div
              onClick={() => setCsvSyncSuccess(true)}
              className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
            >
              {csvSyncSuccess ? (
                <div className="space-y-1">
                  <span className="material-symbols-outlined text-3xl text-emerald-600">check_circle</span>
                  <p className="text-xs font-bold text-slate-900">metro_dadar_stock_2026.csv Parsed!</p>
                  <p className="text-[11px] text-emerald-600 font-medium">1,480 SKUs Synced across 48 tenant DB shards</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="material-symbols-outlined text-3xl text-blue-600">upload_file</span>
                  <p className="text-xs font-semibold text-slate-700">Click to upload inventory CSV</p>
                  <p className="text-[11px] text-slate-400">Schema: SKU, Salt_Name, Qty, Batch, Exp, Price</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowCsvModal(false);
                  setCsvSyncSuccess(false);
                }}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCsvModal(false);
                  setCsvSyncSuccess(false);
                }}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
