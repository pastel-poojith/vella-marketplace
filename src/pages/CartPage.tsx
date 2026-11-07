import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useStore } from '../contexts/StoreContext';
import { formatCurrency, calculateOrderTotals } from '../lib/utils';
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Truck,
  Tag,
  Check,
  Lock,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, itemCount } = useCart();
  const { settings } = useStore();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const discountAmount = Number(((subtotal * discountPercent) / 100).toFixed(2));
  const effectiveSubtotal = Math.max(0, subtotal - discountAmount);

  // Mandatory shipping charged on all orders - no free shipping
  const totals = calculateOrderTotals(
    effectiveSubtotal,
    settings.standard_shipping_fee,
    settings.tax_rate_percent
  );

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'VELLA10' || code === 'WELCOME10') {
      setDiscountPercent(10);
      setPromoSuccess('10% member discount applied!');
    } else if (code === 'PATRON20') {
      setDiscountPercent(20);
      setPromoSuccess('20% private patron discount applied!');
    } else {
      setPromoError('Invalid promotional voucher code. Try VELLA10 or PATRON20.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 bg-sand-200 text-sand-500 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-900">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-sm text-sand-600 max-w-md mx-auto leading-relaxed font-light">
          You have not added any pieces to your bag yet. Explore our curated collections of luxury tailoring, acoustic hardware, and interior objects.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-ink-900 hover:bg-accent-600 text-sand-50 text-xs uppercase font-semibold tracking-wider rounded shadow transition-colors"
        >
          Explore Catalog
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Clear */}
      <div className="flex items-baseline justify-between border-b border-sand-200 pb-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-900">
            Shopping Bag
          </h1>
          <p className="text-xs text-sand-500 mt-1">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your curation
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-sand-500 hover:text-rose-600 underline transition-colors cursor-pointer"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left Column: Items List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Policy Notice */}
          <div className="bg-sand-100 p-4 rounded-xl border border-sand-200 flex items-center justify-between text-xs text-ink-900">
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-accent-700 flex-shrink-0" />
              <span>
                Standard Insured Courier Delivery: <strong>{formatCurrency(settings.standard_shipping_fee, settings.currency_symbol)}</strong> per consignment.
              </span>
            </span>
            <span className="text-sand-500 text-[11px] font-medium hidden sm:inline">
              Mandatory transit insurance included
            </span>
          </div>

          {/* Cart Items Table */}
          <div className="bg-white rounded-xl border border-sand-200 divide-y divide-sand-200 shadow-sm overflow-hidden">
            {items.map((item) => {
              const primaryImg =
                item.product.images?.[0]?.image_url ||
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80';
              const lineTotal = item.product.price * item.quantity;

              return (
                <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  {/* Thumbnail */}
                  <Link
                    to={`/product/${item.product.slug}`}
                    className="w-20 h-24 sm:w-24 sm:h-28 rounded-lg overflow-hidden bg-sand-100 flex-shrink-0 border border-sand-200"
                  >
                    <img
                      src={primaryImg}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] text-sand-500 uppercase tracking-widest font-mono">
                      SKU: {item.product.sku}
                    </span>
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="font-serif text-lg font-bold text-ink-900 hover:text-accent-600 transition-colors block"
                    >
                      {item.product.title}
                    </Link>
                    {(item.selected_size || item.selected_color) && (
                      <p className="text-xs text-accent-800 font-medium">
                        {item.selected_size && <span>Size: {item.selected_size} </span>}
                        {item.selected_color && <span>• Color: {item.selected_color}</span>}
                      </p>
                    )}
                    <p className="text-xs text-sand-600">
                      Unit: {formatCurrency(item.product.price, settings.currency_symbol)}
                    </p>
                    {item.product.stock <= 5 && (
                      <p className="text-[11px] text-amber-700 font-medium">
                        Only {item.product.stock} units left in stock
                      </p>
                    )}
                  </div>

                  {/* Quantity selector */}
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center border border-sand-300 rounded bg-white overflow-hidden shadow-xs">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-sand-100 text-ink-700 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-ink-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-1.5 hover:bg-sand-100 text-ink-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-sand-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right sm:w-28">
                    <span className="font-serif text-lg font-bold text-ink-900">
                      {formatCurrency(lineTotal, settings.currency_symbol)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-sand-200 shadow-sm space-y-6">
            <h3 className="font-serif text-xl font-bold text-ink-900 pb-3 border-b border-sand-200">
              Order Summary
            </h3>

            {/* Calculations Breakdown */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-sand-700">
                <span>Items Subtotal</span>
                <span className="font-medium text-ink-900">
                  {formatCurrency(subtotal, settings.currency_symbol)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Voucher Discount ({discountPercent}%)</span>
                  <span>-{formatCurrency(discountAmount, settings.currency_symbol)}</span>
                </div>
              )}

              <div className="flex justify-between text-sand-700">
                <span>Insured Courier Shipping</span>
                <span className="font-medium text-ink-900">
                  {formatCurrency(totals.shippingFee, settings.currency_symbol)}
                </span>
              </div>

              <div className="flex justify-between text-sand-700">
                <span>GST ({settings.tax_rate_percent}%)</span>
                <span>{formatCurrency(totals.taxAmount, settings.currency_symbol)}</span>
              </div>

              <div className="pt-3 border-t border-sand-200 flex justify-between items-baseline">
                <span className="font-serif text-lg font-bold text-ink-900">Payable Total</span>
                <span className="font-serif text-2xl font-bold text-ink-900">
                  {formatCurrency(totals.totalAmount, settings.currency_symbol)}
                </span>
              </div>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="pt-2 border-t border-sand-200 space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Voucher code (e.g. VELLA10)"
                    className="w-full bg-sand-50 border border-sand-300 rounded px-3 py-2 text-xs uppercase font-medium text-ink-900 placeholder:normal-case focus:outline-none focus:border-accent-500"
                  />
                  <Tag className="w-3.5 h-3.5 text-sand-400 absolute right-2.5 top-2.5" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sand-200 hover:bg-sand-300 text-ink-900 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {promoSuccess && (
                <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  {promoSuccess}
                </p>
              )}
              {promoError && <p className="text-xs text-rose-600">{promoError}</p>}
            </form>

            {/* Checkout CTA */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-ink-900 hover:bg-accent-600 text-sand-50 rounded-lg text-xs font-semibold uppercase tracking-widest shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Proceed to Online Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 space-y-2 text-xs text-sand-500 text-center">
              <div className="flex items-center justify-center gap-2">
                <Lock className="w-4 h-4 text-emerald-700" />
                <span>100% Online Encrypted Gateway Transactions</span>
              </div>
              <p className="text-[11px]">
                Cash on Delivery is discontinued. Secure cards, UPI, and net banking only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
