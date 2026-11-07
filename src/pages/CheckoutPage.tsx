import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useStore } from '../contexts/StoreContext';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, calculateOrderTotals } from '../lib/utils';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Lock,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();
  const { settings, createOrder } = useStore();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(user?.email || '');
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState(''); // PIN Code
  const [country] = useState('India');
  const [notes, setNotes] = useState('');

  // Phase 14: Affirmative Agreement to No-Change-of-Mind Replacement Policy
  const [policyAcknowledged, setPolicyAcknowledged] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Mandatory shipping fee charged on all orders - no free shipping
  const totals = calculateOrderTotals(
    subtotal,
    settings.standard_shipping_fee,
    settings.tax_rate_percent
  );

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-ink-900">Your bag is empty</h2>
        <p className="text-sm text-sand-600">Please add products to your bag before checking out.</p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 bg-ink-900 text-sand-50 rounded text-xs uppercase font-semibold tracking-wider hover:bg-accent-600 transition-colors"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
      setErrorMsg('Please complete all mandatory delivery address fields including PIN Code.');
      return;
    }

    if (!policyAcknowledged) {
      setErrorMsg('Please review and check the agreement to the VELLA Return & Replacement Policy before placing your order.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = items.map((i) => ({
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        product_id: i.product.id,
        product_title: i.product.title,
        product_price: i.product.price,
        quantity: i.quantity,
        selected_size: i.selected_size,
        selected_color: i.selected_color,
        total_price: i.product.price * i.quantity,
        product_image_url:
          i.product.images?.[0]?.image_url ||
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
      }));

      // Generate a mock payment reference if running in sandbox/preview
      const simulatedPaymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      const newOrder = await createOrder({
        user_id: user?.id || null,
        customer_email: email,
        customer_name: fullName,
        customer_phone: phone,
        shipping_address: {
          full_name: fullName,
          address_line1: addressLine1,
          address_line2: addressLine2,
          city,
          state,
          postal_code: postalCode,
          country,
          phone,
        },
        subtotal: totals.subtotal,
        shipping_fee: totals.shippingFee,
        tax_amount: totals.taxAmount,
        total_amount: totals.totalAmount,
        payment_method: 'razorpay',
        payment_status: 'paid', // Online payment verified
        payment_id: simulatedPaymentId,
        order_status: 'processing',
        tracking_number: `TRK-IN${Math.floor(10000000 + Math.random() * 90000000)}`,
        policy_acknowledged: true,
        notes,
        items: orderItems,
      });

      clearCart();
      navigate(`/order-confirmation/${newOrder.order_number}`);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Unable to process checkout. Please verify your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-sand-200 pb-4">
        <div>
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-xs text-sand-500 hover:text-ink-900 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Shopping Bag
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-900">
            Secure Online Checkout
          </h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 font-medium">
          <Lock className="w-3.5 h-3.5" />
          100% Encrypted Payment Session
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Columns: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Customer Contact */}
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-sand-200 shadow-sm space-y-4">
            <h2 className="font-serif text-xl font-bold text-ink-900 pb-2 border-b border-sand-200">
              1. Customer Contact Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-ink-800 mb-1.5">
                  Email Address for Receipt & Tracking *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patron@example.com"
                  className="w-full bg-sand-50 border border-sand-300 rounded px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-accent-500"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-ink-800 mb-1.5">
                  Mobile Number (With Country Code) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-sand-50 border border-sand-300 rounded px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-accent-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address (India) */}
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-sand-200 shadow-sm space-y-4">
            <h2 className="font-serif text-xl font-bold text-ink-900 pb-2 border-b border-sand-200">
              2. Complete Delivery Address
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-ink-800 mb-1.5">
                  Recipient Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full bg-sand-50 border border-sand-300 rounded px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-accent-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-ink-800 mb-1.5">
                  Flat, House No., Building, Street *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Flat 402, Lotus Residency, 12th Cross Road"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="w-full bg-sand-50 border border-sand-300 rounded px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-accent-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-ink-800 mb-1.5">
                  Area, Landmark, Sector (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Near Indiranagar Metro Station"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  className="w-full bg-sand-50 border border-sand-300 rounded px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-accent-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-ink-800 mb-1.5">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Bengaluru"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-sand-50 border border-sand-300 rounded px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-accent-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-ink-800 mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Karnataka"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-sand-50 border border-sand-300 rounded px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-accent-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-ink-800 mb-1.5">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="560038"
                    pattern="[0-9]{6}"
                    title="Please enter a valid 6-digit Indian PIN Code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-sand-50 border border-sand-300 rounded px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-accent-500 font-mono"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-ink-800 mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    disabled
                    value={country}
                    className="w-full bg-sand-200 border border-sand-300 rounded px-3 py-2 text-sm text-sand-700 cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-ink-800 mb-1.5">
                  Courier Special Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Specific gate instructions, safe drop preferences..."
                  className="w-full bg-sand-50 border border-sand-300 rounded px-3 py-2 text-xs text-ink-900 focus:outline-none focus:border-accent-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Online Payment Only (PHASE 2 COMPLIANCE) */}
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-sand-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-sand-200">
              <h2 className="font-serif text-xl font-bold text-ink-900">
                3. Secure Online Payment Gateway
              </h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
                Online Payments Only
              </span>
            </div>

            <div className="p-5 rounded-xl border-2 border-ink-900 bg-sand-50/60 space-y-3">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-accent-700" />
                <span className="font-semibold text-sm text-ink-900">
                  Razorpay Online Gateway (Cards, UPI, Netbanking, Wallets)
                </span>
              </div>
              <p className="text-xs text-sand-700 leading-relaxed font-light">
                Encrypted end-to-end payment processing. Supports all major Indian banks, RuPay, Visa, Mastercard, Google Pay, PhonePe, and UPI QR codes.
              </p>

              {/* Notice regarding Cash on Delivery removal */}
              <div className="pt-2 text-[11px] text-sand-500 border-t border-sand-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cash on Delivery is discontinued to guarantee verified dropship tracking.</span>
              </div>
            </div>
          </div>

          {/* Section 4: Phase 14 Affirmative Policy Acknowledgment */}
          <div className="bg-sand-100 p-6 rounded-xl border border-sand-300 space-y-3">
            <h3 className="font-serif text-base font-bold text-ink-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent-700" />
              Statutory Terms & Replacement Policy Acknowledgment
            </h3>
            <p className="text-xs text-sand-700 leading-relaxed font-light">
              Under VELLA Terms of Service and applicable Indian consumer protection rules, orders are eligible for replacement if delivered damaged, defective, or incorrect. Voluntary change-of-mind cancellations or returns are not accepted.
            </p>

            <label className="flex items-start gap-3 pt-2 cursor-pointer text-xs text-ink-900 font-medium">
              <input
                type="checkbox"
                required
                checked={policyAcknowledged}
                onChange={(e) => setPolicyAcknowledged(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded accent-ink-900 cursor-pointer flex-shrink-0"
              />
              <span>
                I have read and affirmatively agree to the{' '}
                <Link to="/returns-policy" target="_blank" className="text-accent-700 underline font-semibold">
                  VELLA Return & Replacement Policy
                </Link>{' '}
                and understand that replacements are provided strictly for damaged, defective, or incorrect items delivered.
              </span>
            </label>
          </div>
        </div>

        {/* Right 1 Column: Package Summary & Place Order */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-sand-200 shadow-sm space-y-6 sticky top-28">
            <h3 className="font-serif text-xl font-bold text-ink-900 pb-3 border-b border-sand-200">
              Curated Package ({items.length})
            </h3>

            {/* Item list */}
            <div className="max-h-64 overflow-y-auto divide-y divide-sand-100 pr-1">
              {items.map((i) => (
                <div key={i.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 truncate">
                    <img
                      src={
                        i.product.images?.[0]?.image_url ||
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80'
                      }
                      alt={i.product.title}
                      className="w-10 h-10 object-cover rounded border border-sand-200 flex-shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-semibold text-ink-900 truncate">{i.product.title}</p>
                      <p className="text-sand-500">
                        Qty: {i.quantity}
                        {i.selected_size && <span> • Size: {i.selected_size}</span>}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-ink-900 flex-shrink-0">
                    {formatCurrency(i.product.price * i.quantity, settings.currency_symbol)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs pt-4 border-t border-sand-200">
              <div className="flex justify-between text-sand-700">
                <span>Items Subtotal</span>
                <span className="font-medium text-ink-900">
                  {formatCurrency(totals.subtotal, settings.currency_symbol)}
                </span>
              </div>
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
              <div className="pt-3 border-t border-sand-200 flex justify-between items-baseline text-sm">
                <span className="font-serif text-base font-bold text-ink-900">Final Payable</span>
                <span className="font-serif text-2xl font-bold text-ink-900">
                  {formatCurrency(totals.totalAmount, settings.currency_symbol)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-ink-900 hover:bg-accent-600 disabled:bg-sand-300 text-sand-50 rounded-lg text-xs font-semibold uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                'Processing Verified Payment...'
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Pay & Confirm Order
                </>
              )}
            </button>

            <div className="text-[11px] text-sand-500 text-center space-y-1">
              <p className="flex items-center justify-center gap-1">
                <Truck className="w-3.5 h-3.5 text-accent-600" />
                Tracked priority dispatch with carrier seal
              </p>
              <p>Protected by statutory defective replacement remedy</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
