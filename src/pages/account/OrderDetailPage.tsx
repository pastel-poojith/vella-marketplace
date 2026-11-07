import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { AccountLayout } from './AccountLayout';
import { formatCurrency } from '../../lib/utils';
import { ArrowLeft, Truck, Clock, ShieldCheck } from 'lucide-react';
import { ORDER_STATUS_DETAILS, PAYMENT_STATUS_DETAILS } from '../../lib/constants';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders, settings } = useStore();

  const order = orders.find((o) => o.id === id || o.order_number === id);

  if (!order) {
    return (
      <AccountLayout>
        <div className="bg-white p-8 rounded-xl border border-sand-200 text-center space-y-4">
          <h2 className="font-serif text-2xl font-bold text-ink-900">Order Not Located</h2>
          <p className="text-xs text-sand-600">The referenced order identifier is invalid or does not exist.</p>
          <Link
            to="/account/orders"
            className="inline-flex items-center gap-1.5 text-xs uppercase font-semibold text-accent-700 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Orders
          </Link>
        </div>
      </AccountLayout>
    );
  }

  const statusCfg = ORDER_STATUS_DETAILS[order.order_status] || ORDER_STATUS_DETAILS.pending;
  const payCfg = PAYMENT_STATUS_DETAILS[order.payment_status] || PAYMENT_STATUS_DETAILS.unpaid;

  return (
    <AccountLayout>
      <div className="space-y-6">
        <Link
          to="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs text-sand-600 hover:text-ink-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Order Directory
        </Link>

        <div className="bg-white p-6 sm:p-8 rounded-xl border border-sand-200 shadow-sm space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sand-200 gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-sand-500 font-semibold block">
                Acquisition Summary
              </span>
              <h2 className="font-serif text-3xl font-bold text-ink-900">
                Order {order.order_number}
              </h2>
              <p className="text-xs text-sand-500 mt-0.5">
                Placed on {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusCfg.bg} ${statusCfg.color}`}>
                Fulfillment: {statusCfg.label}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${payCfg.bg} ${payCfg.color}`}>
                Payment: {payCfg.label}
              </span>
            </div>
          </div>

          {/* Tracking Bar */}
          {order.tracking_number && (
            <div className="bg-sand-50 p-4 rounded-xl border border-sand-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-accent-700 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-ink-900">Carrier Priority Consignment</p>
                  <p className="text-sand-600 font-mono text-sm">{order.tracking_number}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sand-600">
                <Clock className="w-3.5 h-3.5 text-accent-600" />
                <span>Standard transit: 2-4 business days</span>
              </div>
            </div>
          )}

          {/* Items Table */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-ink-900">Package Items</h3>
            <div className="divide-y divide-sand-200 border-t border-b border-sand-200">
              {order.items?.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product_image_url}
                      alt={item.product_title}
                      className="w-14 h-16 object-cover rounded border border-sand-200"
                    />
                    <div>
                      <h4 className="font-serif text-base font-bold text-ink-900">
                        {item.product_title}
                      </h4>
                      <p className="text-sand-500">
                        Unit: {formatCurrency(item.product_price, settings.currency_symbol)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-serif text-base font-bold text-ink-900">
                    {formatCurrency(item.total_price, settings.currency_symbol)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Address and Financials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 text-xs">
            <div className="bg-sand-50/60 p-5 rounded-xl border border-sand-200 space-y-2">
              <h4 className="font-semibold text-ink-900 uppercase tracking-wider">
                Consignee Delivery Address
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
              <p className="text-sand-600 pt-1 font-mono">Tel: {order.shipping_address.phone}</p>
              {order.notes && (
                <p className="pt-2 text-sand-500 italic">"Note: {order.notes}"</p>
              )}
            </div>

            <div className="bg-sand-50/60 p-5 rounded-xl border border-sand-200 space-y-2.5">
              <h4 className="font-semibold text-ink-900 uppercase tracking-wider">
                Financial Breakdown
              </h4>
              <div className="flex justify-between text-sand-600">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal, settings.currency_symbol)}</span>
              </div>
              <div className="flex justify-between text-sand-600">
                <span>Shipping Fee</span>
                <span>
                  {order.shipping_fee === 0 ? 'Complimentary' : formatCurrency(order.shipping_fee, settings.currency_symbol)}
                </span>
              </div>
              <div className="flex justify-between text-sand-600">
                <span>Sales Tax</span>
                <span>{formatCurrency(order.tax_amount, settings.currency_symbol)}</span>
              </div>
              <div className="pt-2 border-t border-sand-200 flex justify-between font-bold text-sm text-ink-900">
                <span>Total Settled</span>
                <span className="font-serif text-lg">
                  {formatCurrency(order.total_amount, settings.currency_symbol)}
                </span>
              </div>
              <div className="pt-2 text-[11px] text-sand-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Payment Method: {order.payment_method.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
};
