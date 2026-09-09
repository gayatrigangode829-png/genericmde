/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ViewMode, MedicineOffer, UserAccount } from './types';
import { SYSTEM_USERS } from './data/initialData';
import { NavigationHeader } from './components/NavigationHeader';
import { CustomerAppView } from './components/CustomerAppView';
import { DispensaryPortalView } from './components/DispensaryPortalView';
import { OpsConsoleView } from './components/OpsConsoleView';
import { MasterFormularyView } from './components/MasterFormularyView';
import { OrdersDispatchView } from './components/OrdersDispatchView';
import { IAMView } from './components/IAMView';
import { SuperAdminView } from './components/SuperAdminView';
import { ArchitectureView } from './components/ArchitectureView';
import { AuthScreen } from './components/AuthScreen';
import { CartDrawer, CartItem } from './components/CartDrawer';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('customer');
  const [mobileFrameMode, setMobileFrameMode] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('genericmed_auth_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return SYSTEM_USERS[4]; // Default to Aarav Sharma (Customer/Patient)
  });
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      offer: {
        id: 'offer-1',
        storeName: 'Metro Generic Chemist',
        storeCode: 'TN-044',
        storeRating: 4.9,
        reviewsCount: 312,
        distanceKm: 0.8,
        deliveryEstimate: 'Express in 45 mins',
        deliveryType: 'express',
        brandName: 'Paracip 650 mg',
        manufacturer: 'Cipla Ltd (Generic Div.)',
        originalPrice: 38.00,
        discountedPrice: 14.50,
        perTabletPrice: 0.96,
        savingsPercent: 61,
        inStock: true,
        stockCount: 142,
        badge: 'Rank #1 Lowest Price',
        isLowest: true,
      },
      medicineKey: 'paracetamol',
      quantity: 1,
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderToast, setOrderToast] = useState<string | null>(null);

  const handleLoginSuccess = (user: UserAccount, targetView?: ViewMode) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('genericmed_auth_user', JSON.stringify(user));
    } catch {
      // ignore
    }
    setOrderToast(`Welcome, ${user.name}! Signed in as ${user.role}.`);
    setTimeout(() => setOrderToast(null), 5000);
    if (targetView) {
      setCurrentView(targetView);
    }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('genericmed_auth_user');
    } catch {
      // ignore
    }
    setOrderToast('Signed out successfully. Switched to Guest session.');
    setTimeout(() => setOrderToast(null), 4000);
  };

  const handleAddToCart = (offer: MedicineOffer, medicineKey: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.offer.id === offer.id);
      if (existing) {
        return prev.map((item) =>
          item.offer.id === offer.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { offer, medicineKey, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (offerId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.offer.id !== offerId));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.offer.id === offerId ? { ...item, quantity } : item))
      );
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOrderPlaced = (orderId: string) => {
    setOrderToast(`Order #${orderId} successfully sent to Metro Generic Chemist (#TN-044)!`);
    setTimeout(() => setOrderToast(null), 5000);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Application Bar with Screen Switcher */}
      <NavigationHeader
        currentView={currentView}
        onViewChange={setCurrentView}
        mobileFrameMode={mobileFrameMode}
        onToggleMobileFrame={() => setMobileFrameMode(!mobileFrameMode)}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />

      {/* Screen View Rendering */}
      <main className="flex-1">
        {currentView === 'customer' && (
          <CustomerAppView
            mobileFrameMode={mobileFrameMode}
            onAddToCart={handleAddToCart}
            cartCount={totalCartCount}
            onOpenCart={() => setIsCartOpen(true)}
            currentUser={currentUser}
            onOpenAuth={() => setCurrentView('auth')}
          />
        )}

        {currentView === 'dispensary' && <DispensaryPortalView />}

        {currentView === 'ops' && <OpsConsoleView />}

        {currentView === 'formulary' && <MasterFormularyView />}

        {currentView === 'orders' && <OrdersDispatchView />}

        {currentView === 'iam' && <IAMView />}

        {currentView === 'superadmin' && <SuperAdminView />}

        {currentView === 'architecture' && <ArchitectureView />}

        {currentView === 'auth' && (
          <AuthScreen
            currentUser={currentUser}
            onLoginSuccess={handleLoginSuccess}
            onSignOut={handleSignOut}
            onNavigate={setCurrentView}
          />
        )}
      </main>

      {/* Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Persistent Bottom Regulatory Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-800">genericmed</span>
            <span>•</span>
            <span>CDSCO Compliant Generic Medicine Marketplace</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono">
            <span>Drug Rules 1945 Form 20B/21B</span>
            <span>•</span>
            <span>48 Isolated DB Schemas</span>
            <span>•</span>
            <span>PostgreSQL Row-Level Security</span>
          </div>
        </div>
      </footer>

      {/* Global Order Notification Toast */}
      {orderToast && (
        <div className="fixed bottom-6 left-6 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-medium z-50 flex items-center gap-2 border border-slate-700 animate-slide-up">
          <span className="material-symbols-outlined text-emerald-400 text-base">verified</span>
          <span>{orderToast}</span>
        </div>
      )}
    </div>
  );
}
