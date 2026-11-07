import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { AdminLayout } from './AdminLayout';
import { formatCurrency } from '../../lib/utils';
import {
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { ORDER_STATUS_DETAILS } from '../../lib/constants';

export const AdminDashboardPage: React.FC = () => {
  const { orders, products, categories, settings } = useStore();

  const totalRevenue = orders.reduce((acc, o) => acc + o.total_amount, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const lowStockProducts = products.filter((p) => p.stock <= 10);
  const recentOrders = orders.slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-sand-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-sand-500 uppercase tracking-wider">
              <span>Gross Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-ink-900">
              {formatCurrency(totalRevenue, settings.currency_symbol)}
            </p>
            <p className="text-[11px] text-emerald-700 font-medium">All settled & pending orders</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-sand-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-sand-500 uppercase tracking-wider">
              <span>Orders Placed</span>
              <ShoppingBag className="w-4 h-4 text-accent-600" />
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-ink-900">
              {totalOrders}
            </p>
            <p className="text-[11px] text-sand-500">Across all customer accounts</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-sand-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-sand-500 uppercase tracking-wider">
              <span>Average Order Value</span>
              <DollarSign className="w-4 h-4 text-accent-600" />
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-ink-900">
              {formatCurrency(avgOrderValue, settings.currency_symbol)}
            </p>
            <p className="text-[11px] text-sand-500">AOV per client transaction</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-sand-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-sand-500 uppercase tracking-wider">
              <span>Catalog SKUs</span>
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-ink-900">
              {products.length}
            </p>
            <p className="text-[11px] text-sand-500">In {categories.length} departments</p>
          </div>
        </div>

        {/* Low Stock Alerts */}
        {lowStockProducts.length > 0 && (
          <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>Inventory Threshold Warning ({lowStockProducts.length} items low)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="bg-white p-3 rounded-lg border border-amber-200 flex items-center justify-between gap-2 shadow-xs">
                  <div className="truncate">
                    <p className="font-semibold text-ink-900 truncate">{p.title}</p>
                    <p className="text-[10px] text-sand-500">SKU: {p.sku}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${p.stock === 0 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                    {p.stock === 0 ? 'Sold Out' : `${p.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Orders Overview */}
        <div className="bg-white p-6 rounded-xl border border-sand-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sand-200">
            <div>
              <h3 className="font-serif text-xl font-bold text-ink-900">Recent Customer Orders</h3>
              <p className="text-xs text-sand-500">Latest transactions requiring fulfillment and verification.</p>
            </div>
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-1.5 text-xs uppercase font-semibold text-accent-700 hover:text-ink-900"
            >
              All Orders
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-50 text-sand-600 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Order Number</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {recentOrders.map((ord) => {
                  const cfg = ORDER_STATUS_DETAILS[ord.order_status] || ORDER_STATUS_DETAILS.pending;
                  return (
                    <tr key={ord.id} className="hover:bg-sand-50/50">
                      <td className="py-3 px-3 font-serif font-bold text-ink-900 text-sm">
                        {ord.order_number}
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-medium text-ink-900">{ord.customer_name}</p>
                        <p className="text-[10px] text-sand-500">{ord.customer_email}</p>
                      </td>
                      <td className="py-3 px-3 font-semibold text-ink-900">
                        {formatCurrency(ord.total_amount, settings.currency_symbol)}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${cfg.bg} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 uppercase text-[11px] font-medium text-sand-700">
                        {ord.payment_method} ({ord.payment_status})
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          to={`/account/orders/${ord.id}`}
                          className="text-accent-700 hover:underline font-semibold"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
