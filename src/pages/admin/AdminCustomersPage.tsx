import React from 'react';
import { useStore } from '../../contexts/StoreContext';
import { AdminLayout } from './AdminLayout';
import { formatCurrency } from '../../lib/utils';

export const AdminCustomersPage: React.FC = () => {
  const { orders, settings } = useStore();

  // Aggregate customers from orders and registered profiles
  const customerMap = new Map<string, { email: string; name: string; phone: string; ordersCount: number; totalSpent: number; lastOrderDate: string }>();

  orders.forEach((o) => {
    const key = o.customer_email.toLowerCase();
    const existing = customerMap.get(key);
    if (existing) {
      existing.ordersCount += 1;
      existing.totalSpent += o.total_amount;
      if (new Date(o.created_at) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = o.created_at;
      }
    } else {
      customerMap.set(key, {
        email: o.customer_email,
        name: o.customer_name,
        phone: o.customer_phone,
        ordersCount: 1,
        totalSpent: o.total_amount,
        lastOrderDate: o.created_at,
      });
    }
  });

  const customersList = Array.from(customerMap.values());

  return (
    <AdminLayout>
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-sand-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-sand-200">
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink-900">Registered Patrons & Customers</h2>
            <p className="text-xs text-sand-500">Directory of verified shoppers and their lifetime acquisition value.</p>
          </div>
          <span className="text-xs text-sand-600 font-semibold">
            {customersList.length} Patrons
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-sand-50 text-sand-600 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-3">Patron Name</th>
                <th className="py-3 px-3">Contact Email</th>
                <th className="py-3 px-3">Telephone</th>
                <th className="py-3 px-3">Acquisitions Count</th>
                <th className="py-3 px-3">Lifetime Value</th>
                <th className="py-3 px-3">Latest Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200">
              {customersList.map((c, idx) => (
                <tr key={idx} className="hover:bg-sand-50/50">
                  <td className="py-3.5 px-3">
                    <p className="font-semibold text-ink-900 text-sm">{c.name}</p>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium">
                      Verified Client
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-sand-700 font-mono text-[11px]">{c.email}</td>
                  <td className="py-3.5 px-3 text-sand-600 font-mono">{c.phone}</td>
                  <td className="py-3.5 px-3 font-semibold text-ink-900">
                    {c.ordersCount} {c.ordersCount === 1 ? 'order' : 'orders'}
                  </td>
                  <td className="py-3.5 px-3 font-serif font-bold text-base text-ink-900">
                    {formatCurrency(c.totalSpent, settings.currency_symbol)}
                  </td>
                  <td className="py-3.5 px-3 text-sand-500 text-[11px]">
                    {new Date(c.lastOrderDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
