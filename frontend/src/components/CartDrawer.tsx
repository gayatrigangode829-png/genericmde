import React, { useState } from 'react';
import { MedicineOffer } from '../types';

export interface CartItem {
  offer: MedicineOffer;
  medicineKey: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (offerId: string, quantity: number) => void;
  onClearCart: () => void;
  onOrderPlaced: (orderId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onClearCart,
  onOrderPlaced,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod' | 'card'>('upi');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderCompleteId, setOrderCompleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.offer.discountedPrice * item.quantity, 0);
  const originalTotal = items.reduce((sum, item) => sum + item.offer.originalPrice * item.quantity, 0);
  const savings = originalTotal - subtotal;
  const deliveryFee = subtotal > 150 ? 0 : 25;
  const finalTotal = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      const newOrderId = `GM-${Math.floor(10000 + Math.random() * 90000)}`;
      setOrderCompleteId(newOrderId);
      onOrderPlaced(newOrderId);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-end z-50">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
        {/* Cart Header */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-2xl">shopping_bag</span>
            <h2 className="font-headline font-bold text-slate-900 text-base">Your Generic Basket</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Order Success State */}
        {orderCompleteId ? (
          <div className="p-6 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-slate-900 text-xl">Order Confirmed!</h3>
              <p className="text-sm font-mono font-bold text-blue-700 mt-1">#{orderCompleteId}</p>
              <p className="text-xs text-slate-500 mt-2">
                Dispatched by <span className="font-semibold text-slate-800">Metro Generic Chemist (#TN-044)</span>.
                Rider assigned via Shadowfax Express.
              </p>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
              You saved ₹{savings.toFixed(2)} compared to branded retail!
            </div>

            <button
              onClick={() => {
                setOrderCompleteId(null);
                onClearCart();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center space-y-3 my-auto">
            <span className="material-symbols-outlined text-5xl text-slate-300">shopping_cart</span>
            <h3 className="font-headline font-bold text-slate-700 text-base">Your cart is empty</h3>
            <p className="text-xs text-slate-400">Search generic medicines to compare prices and save up to 80%.</p>
          </div>
        ) : (
          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            {/* Dispensary banner */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-blue-600">store</span>
                <span>Fulfilling Store: <strong>Metro Generic Chemist (0.8 km)</strong></span>
              </div>
              <span className="font-mono text-[11px] font-bold">#TN-044</span>
            </div>

            {/* Cart Items List */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.offer.id}
                  className="p-3 rounded-xl border border-slate-200 bg-white space-y-2 text-xs shadow-2xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900">{item.offer.brandName}</h4>
                      <p className="text-[11px] text-slate-500">{item.offer.manufacturer}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 font-mono">
                        ₹{(item.offer.discountedPrice * item.quantity).toFixed(2)}
                      </span>
                      <span className="text-[10px] text-emerald-600 block font-semibold">
                        Saved ₹{((item.offer.originalPrice - item.offer.discountedPrice) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400">Strip of 15 • 100% Bio-EQ</span>
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        onClick={() => onUpdateQuantity(item.offer.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-slate-600 hover:bg-slate-200 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 font-mono font-semibold text-slate-800">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.offer.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-slate-600 hover:bg-slate-200 font-bold text-blue-600"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery address */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between items-center text-slate-500">
                <span className="font-semibold text-slate-800">Delivery Address</span>
                <button className="text-blue-600 font-medium">Change</button>
              </div>
              <p className="text-slate-700">Flat 402, Sea Green Apts, Senapati Bapat Marg, Dadar, Mumbai 400028</p>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wider block">Payment Method</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'upi', label: 'UPI (GPay)', icon: 'payments' },
                  { id: 'cod', label: 'Cash on Delivery', icon: 'local_atm' },
                  { id: 'card', label: 'Debit / Card', icon: 'credit_card' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                      paymentMethod === m.id
                        ? 'bg-blue-50 border-blue-500 text-blue-800 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{m.icon}</span>
                    <span className="text-[10px]">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bill Details */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span className="font-mono">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Generic Savings (vs Branded):</span>
                <span className="font-mono">-₹{savings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Partner Fee:</span>
                <span className="font-mono">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 pt-1.5 border-t border-slate-200 text-sm">
                <span>To Pay:</span>
                <span className="font-mono text-blue-700">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Button */}
        {items.length > 0 && !orderCompleteId && (
          <div className="p-4 border-t border-slate-200 bg-white">
            <button
              onClick={handlePlaceOrder}
              disabled={isCheckingOut}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              {isCheckingOut ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                  <span>Confirming with Dispensary...</span>
                </>
              ) : (
                <>
                  <span>Pay ₹{finalTotal.toFixed(2)} & Place Order</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
