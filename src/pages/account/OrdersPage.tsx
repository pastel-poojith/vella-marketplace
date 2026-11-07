import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { useAuth } from '../../contexts/AuthContext';
import { AccountLayout } from './AccountLayout';
import { formatCurrency } from '../../lib/utils';
import { Package, ArrowRight, Truck } from 'lucide-react';
import { ORDER_STATUS_DETAILS } from '../../lib/constants';

export const OrdersPage: React.FC = () => {
  const { orders, settings } = useStore();
  const { user } = useAuth();

  // Show orders placed by this user or demo orders if guest/demo
  const userOrders = orders.filter((o) => !o.user_id || o.user_id === user?.id);

  return (
    <AccountLayout>
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-sand-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-sand-200">
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink-900">Your Acquisitions & Orders</h2>
            <p className="text-xs text-sand-500">Track shipments, download receipts, and view fulfillment milestones.</p>
          </div>
          <span className="text-xs text-sand-600 font-semibold">
            {userOrders.length} {userOrders.length === 1 ? 'Order' : 'Orders'}
          </span>
        </div>

        {userOrders.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Package className="w-12 h-12 text-sand-400 mx-auto" />
            <p className="text-sm text-sand-700">You have no recorded orders yet.</p>
            <Link
              to="/shop"
              className="inline-block px-5 py-2.5 bg-ink-900 text-sand-50 rounded text-xs uppercase font-semibold tracking-wider hover:bg-accent-600 transition-colors"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders.map((order) => {
              const statusCfg = ORDER_STATUS_DETAILS[order.order_status] || ORDER_STATUS_DETAILS.pending;

              return (
                <div
                  key={order.id}
                  className="p-5 rounded-xl border border-sand-200 bg-sand-50/50 hover:bg-sand-50 transition-colors space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sand-200 text-xs">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-sand-500 uppercase tracking-wider text-[10px] block">Order</span>
                        <strong className="text-sm font-serif font-bold text-ink-900">{order.order_number}</strong>
                      </div>
                      <span className="text-sand-300">•</span>
                      <div>
                        <span className="text-sand-500 uppercase tracking-wider text-[10px] block">Date</span>
                        <span className="text-sand-700 font-medium">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusCfg.bg} ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                      <Link
                        to={`/account/orders/${order.id}`}
                        className="inline-flex items-center gap-1 font-semibold text-accent-700 hover:text-ink-900 transition-colors"
                      >
                        Inspect Details
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 overflow-x-auto py-1">
                      {order.items?.map((item) => (
                        <img
                          key={item.id}
                          src={item.product_image_url}
                          alt={item.product_title}
                          className="w-12 h-14 object-cover rounded border border-sand-200"
                          title={`${item.product_title} (${item.quantity})`}
                        />
                      ))}
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-[11px] text-sand-500 uppercase block">Total Amount</span>
                      <span className="font-serif text-lg font-bold text-ink-900">
                        {formatCurrency(order.total_amount, settings.currency_symbol)}
                      </span>
                    </div>
                  </div>

                  {order.tracking_number && (
                    <div className="flex items-center gap-2 text-xs text-sand-600 bg-white p-2.5 rounded border border-sand-200">
                      <Truck className="w-4 h-4 text-accent-600" />
                      <span>Tracking: <strong className="font-mono text-ink-900">{order.tracking_number}</strong></span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AccountLayout>
  );
};
