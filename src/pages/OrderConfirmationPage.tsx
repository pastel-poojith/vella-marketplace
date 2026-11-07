import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { formatCurrency } from '../lib/utils';
import { CheckCircle2, Package, ArrowRight, Truck, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { ORDER_STATUS_DETAILS } from '../lib/constants';

export const OrderConfirmationPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { orders, settings } = useStore();

  const order = orders.find((o) => o.order_number === orderNumber) || orders[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      {/* Success Hero */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs uppercase tracking-widest text-accent-700 font-bold block">
          Payment Verified & Order Confirmed
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink-900">
          Thank you for your acquisition.
        </h1>
        <p className="text-sm text-sand-700 max-w-lg mx-auto leading-relaxed font-light">
          Your order has been authorized through our secure online payment gateway. An official dispatch receipt has been queued to{' '}
          <strong className="text-ink-900">{order?.customer_email || 'your email'}</strong>.
        </p>
      </div>

      {/* Order Meta Box */}
      {order && (
        <div className="bg-white rounded-xl border border-sand-200 shadow-sm overflow-hidden divide-y divide-sand-200">
          {/* Header Stats */}
          <div className="p-6 bg-sand-50/70 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-sand-500 block uppercase tracking-wider font-semibold">
                Order Reference
              </span>
              <span className="font-serif text-base font-bold text-ink-900">
                {order.order_number}
              </span>
            </div>
            <div>
              <span className="text-sand-500 block uppercase tracking-wider font-semibold">
                Date Settled
              </span>
              <span className="font-medium text-ink-900">
                {new Date(order.created_at).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div>
              <span className="text-sand-500 block uppercase tracking-wider font-semibold">
                Consignment Status
              </span>
              <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${ORDER_STATUS_DETAILS[order.order_status]?.bg} ${ORDER_STATUS_DETAILS[order.order_status]?.color}`}>
                {ORDER_STATUS_DETAILS[order.order_status]?.label}
              </span>
            </div>
            <div>
              <span className="text-sand-500 block uppercase tracking-wider font-semibold">
                Payment Channel
              </span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Online Verified
              </span>
            </div>
          </div>

          {/* Statutory 48-Hour Inspection Banner */}
          <div className="p-4 bg-amber-50/80 border-b border-amber-200 flex items-start gap-3 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold">Statutory Inspection Notice (Consumer Protection Act 2019):</p>
              <p className="text-[11px] text-amber-800 leading-relaxed font-light">
                Please examine parcel packaging upon courier handover. While VELLA does not permit change-of-mind returns, any transit breakage, material defects, or missing items reported within <strong>48 hours</strong> of delivery with unboxing photographs are covered by our guaranteed replacement protocol.{' '}
                <Link to="/claims" className="underline font-semibold hover:text-ink-900">
                  Claims Portal →
                </Link>
              </p>
            </div>
          </div>

          {/* Carrier Tracking Banner */}
          {order.tracking_number && (
            <div className="p-6 bg-accent-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-accent-700 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-ink-900">Priority Courier Tracking Number</p>
                  <p className="text-sand-600 font-mono text-sm">{order.tracking_number}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sand-600">
                <Clock className="w-4 h-4 text-accent-600" />
                <span>Estimated dispatch: 2-4 business days</span>
              </div>
            </div>
          )}

          {/* Items Purchased List */}
          <div className="p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-ink-900">Acquired Items</h3>
            <div className="divide-y divide-sand-100">
              {order.items?.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product_image_url}
                      alt={item.product_title}
                      className="w-12 h-14 object-cover rounded border border-sand-200"
                    />
                    <div>
                      <p className="font-semibold text-ink-900 text-sm">{item.product_title}</p>
                      <p className="text-sand-500">
                        Qty: {item.quantity} × {formatCurrency(item.product_price, settings.currency_symbol)}
                      </p>
                      {(item.selected_size || item.selected_color) && (
                        <p className="text-[10px] text-accent-800 mt-0.5">
                          {item.selected_size ? `Size: ${item.selected_size}` : ''}
                          {item.selected_size && item.selected_color ? ' • ' : ''}
                          {item.selected_color ? `Color: ${item.selected_color}` : ''}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-serif text-base font-bold text-ink-900">
                    {formatCurrency(item.total_price, settings.currency_symbol)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals & Delivery Address */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-sand-50/40 text-xs">
            <div>
              <h4 className="font-semibold text-ink-900 uppercase tracking-wider mb-2">
                Insured Delivery Address
              </h4>
              <p className="font-medium text-ink-900">{order.shipping_address.full_name}</p>
              <p className="text-sand-600">{order.shipping_address.address_line1}</p>
              {order.shipping_address.address_line2 && (
                <p className="text-sand-600">{order.shipping_address.address_line2}</p>
              )}
              <p className="text-sand-600">
                {order.shipping_address.city}, {order.shipping_address.state}{' '}
                {order.shipping_address.postal_code}
              </p>
              <p className="text-sand-600">{order.shipping_address.country}</p>
              <p className="text-sand-600 pt-1">Tel: {order.shipping_address.phone}</p>
            </div>

            <div className="space-y-2 sm:border-l sm:border-sand-200 sm:pl-6">
              <h4 className="font-semibold text-ink-900 uppercase tracking-wider mb-2">
                Settlement Statement
              </h4>
              <div className="flex justify-between text-sand-600">
                <span>Merchandise Subtotal</span>
                <span>{formatCurrency(order.subtotal, settings.currency_symbol)}</span>
              </div>
              <div className="flex justify-between text-sand-600">
                <span>Insured Standard Shipping</span>
                <span className="font-medium text-ink-900">
                  {formatCurrency(order.shipping_fee, settings.currency_symbol)}
                </span>
              </div>
              <div className="flex justify-between text-sand-600">
                <span>Applicable GST / Tax</span>
                <span>{formatCurrency(order.tax_amount, settings.currency_symbol)}</span>
              </div>
              <div className="pt-2 border-t border-sand-200 flex justify-between font-bold text-sm text-ink-900">
                <span>Total Paid</span>
                <span className="font-serif text-lg text-emerald-800">
                  {formatCurrency(order.total_amount, settings.currency_symbol)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/shop"
          className="w-full sm:w-auto px-8 py-3.5 bg-ink-900 hover:bg-accent-600 text-sand-50 rounded text-xs uppercase font-semibold tracking-wider transition-colors text-center"
        >
          Continue Shopping
        </Link>
        <Link
          to="/account/orders"
          className="w-full sm:w-auto px-8 py-3.5 bg-white border border-sand-300 hover:bg-sand-100 text-ink-900 rounded text-xs uppercase font-semibold tracking-wider transition-colors text-center flex items-center justify-center gap-2"
        >
          <Package className="w-4 h-4" />
          View In Order History
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
