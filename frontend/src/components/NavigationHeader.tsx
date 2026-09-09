import React from 'react';
import { ViewMode, UserAccount } from '../types';

interface NavigationHeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  mobileFrameMode: boolean;
  onToggleMobileFrame: () => void;
  cartCount: number;
  onOpenCart?: () => void;
  currentUser: UserAccount | null;
  onSignOut: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentView,
  onViewChange,
  mobileFrameMode,
  onToggleMobileFrame,
  cartCount,
  onOpenCart,
  currentUser,
  onSignOut,
}) => {
  const views: { id: ViewMode; label: string; icon: string; badge?: string; roleTag?: string }[] = [
    { id: 'customer', label: 'Customer App', icon: 'smartphone', badge: 'Mobile', roleTag: 'Patient' },
    { id: 'dispensary', label: 'Dispensary Portal', icon: 'local_pharmacy', badge: 'TN-044', roleTag: 'Pharmacist' },
    { id: 'ops', label: 'Ops Console', icon: 'dashboard', badge: 'FR-CORE', roleTag: 'Ops Lead' },
    { id: 'formulary', label: 'Drug Formulary', icon: 'medication', badge: 'Salt Engine', roleTag: 'Clinical' },
    { id: 'orders', label: 'Orders & Dispatch', icon: 'local_shipping', badge: '48 Tenants', roleTag: 'Logistics' },
    { id: 'iam', label: 'IAM & Governance', icon: 'badge', badge: 'Enterprise', roleTag: 'Security' },
    { id: 'superadmin', label: 'Super Admin Fleet', icon: 'lan', badge: 'Shard Fleet', roleTag: 'Root Trust' },
    { id: 'architecture', label: 'Architecture & PRD', icon: 'account_tree', badge: 'Blueprint', roleTag: 'System' },
    {
      id: 'auth',
      label: currentUser ? 'My Account' : 'Login / Register',
      icon: 'account_circle',
      badge: currentUser ? currentUser.role.split(' ')[0] : 'Sign In',
      roleTag: 'Access',
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#002441] text-white border-b border-blue-900/60 shadow-md">
      {/* Top micro-bar */}
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between text-xs text-blue-200 border-b border-blue-900/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-white font-semibold">genericmed</span>
            <span className="text-blue-300/80">|</span>
            <span className="text-slate-300 font-mono text-[11px]">asia-south1 (Mumbai)</span>
          </div>
          <span className="hidden md:inline px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/60 text-[10px] font-mono">
            48 Isolated Tenants • 42 DB Shards • 100% Bio-EQ Engine
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Account / Session Pill in Top Bar */}
          {currentUser ? (
            <div className="flex items-center gap-1 bg-blue-950/70 border border-blue-800/80 rounded-full px-2 py-0.5 text-[11px]">
              <button
                onClick={() => onViewChange('auth')}
                className="flex items-center gap-1.5 hover:text-white transition"
                title="Manage Account / Switch User"
              >
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white font-bold text-[9px] flex items-center justify-center">
                  {currentUser.name.charAt(0)}
                </span>
                <span className="font-semibold text-white truncate max-w-[90px] sm:max-w-[130px]">
                  {currentUser.name}
                </span>
                <span className="hidden sm:inline text-[9px] px-1.5 py-0.2 bg-blue-900 text-blue-200 rounded-full">
                  {currentUser.role.split(' ')[0]}
                </span>
              </button>
              <button
                onClick={onSignOut}
                className="text-slate-400 hover:text-red-400 transition p-0.5 rounded-full"
                title="Sign Out"
              >
                <span className="material-symbols-outlined text-[14px]">logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => onViewChange('auth')}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-[11px] transition shadow-xs"
            >
              <span className="material-symbols-outlined text-xs">login</span>
              <span>Sign In / Register</span>
            </button>
          )}

          {currentView === 'customer' && (
            <button
              onClick={onToggleMobileFrame}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-800/60 hover:bg-blue-700/60 text-white transition text-[11px] border border-blue-600/40"
              title="Toggle mobile device frame"
            >
              <span className="material-symbols-outlined text-sm">
                {mobileFrameMode ? 'fullscreen' : 'stay_current_portrait'}
              </span>
              <span className="hidden sm:inline">{mobileFrameMode ? 'Wide View' : 'Phone Frame'}</span>
            </button>
          )}

          {currentView === 'customer' && onOpenCart && (
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] transition"
            >
              <span className="material-symbols-outlined text-sm">shopping_bag</span>
              <span>Cart ({cartCount})</span>
            </button>
          )}

          <div className="hidden lg:flex items-center gap-1.5 text-slate-300 text-[11px]">
            <span className="material-symbols-outlined text-xs text-emerald-400">verified_user</span>
            <span>CDSCO Form 20B/21B</span>
          </div>
        </div>
      </div>

      {/* Primary Switcher Tabs */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto no-scrollbar py-2">
        <div className="flex items-center gap-1.5 min-w-max">
          {views.map((v) => {
            const isActive = currentView === v.id;
            return (
              <button
                key={v.id}
                onClick={() => onViewChange(v.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400/40'
                    : 'text-slate-300 hover:text-white hover:bg-blue-900/40'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">{v.icon}</span>
                <span>{v.label}</span>
                {v.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono tracking-wider uppercase ${
                      isActive ? 'bg-blue-800 text-blue-100' : 'bg-blue-950 text-blue-300'
                    }`}
                  >
                    {v.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
