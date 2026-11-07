import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { AdminLayout } from './AdminLayout';
import { formatCurrency } from '../../lib/utils';
import { OrderStatus, PaymentStatus, OrderDropshipStatus } from '../../lib/types';
import { ORDER_STATUS_DETAILS, PAYMENT_STATUS_DETAILS } from '../../lib/constants';
import { Search, Truck, Check } from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const {
    orders,
    settings,
    updateOrderStatus,
    updatePaymentStatus,
    updateTrackingNumber,
    updateOrderDropshipStatus,
  } = useStore();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTrackingId, setEditingTrackingId] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState('');

  // Dropship supplier reference editor
  const [editingDropshipId, setEditingDropshipId] = useState<string | null>(null);
  const [supplierRefInput, setSupplierRefInput] = useState('');

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.order_status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = o.order_number.toLowerCase().includes(q);
      const matchCust = o.customer_name.toLowerCase().includes(q);
      const matchEmail = o.customer_email.toLowerCase().includes(q);
      if (!matchNum && !matchCust && !matchEmail) return false;
    }
    return true;
  });

  const handleSaveTracking = async (orderId: string) => {
    await updateTrackingNumber(orderId, trackingInput);
    setEditingTrackingId(null);
    setTrackingInput('');
  };

  const handleSaveSupplierRef = async (orderId: string, currentStatus?: OrderDropshipStatus) => {
    await updateOrderDropshipStatus(
      orderId,
      currentStatus || 'ordered_from_supplier',
      supplierRefInput
    );
    setEditingDropshipId(null);
    setSupplierRefInput('');
  };

  return (
    <AdminLayout>
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-sand-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sand-200 gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink-900">
              Order Fulfillment & Dropship Operations
            </h2>
            <p className="text-xs text-sand-500">
              Update consignment progress, assign tracking numbers, audit 100% online payments, and manage supplier dropship dispatches.
            </p>
          </div>
          <span className="text-xs text-sand-600 font-semibold">
            {filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'} displayed
          </span>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-sand-100 rounded-lg text-xs">
            {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-md font-medium uppercase tracking-wider transition-colors ${
                  statusFilter === st
                    ? 'bg-ink-900 text-sand-50 font-semibold shadow-xs'
                    : 'text-sand-700 hover:text-ink-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order #, customer, email..."
              className="w-full bg-sand-50 border border-sand-300 rounded px-3 py-1.5 pl-8 text-xs text-ink-900 focus:outline-none focus:border-accent-500"
            />
            <Search className="w-3.5 h-3.5 text-sand-400 absolute left-2.5 top-2" />
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-sand-50 text-sand-600 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-3">Order Number & Date</th>
                <th className="py-3 px-3">Customer & Destination</th>
                <th className="py-3 px-3">Total Amount</th>
                <th className="py-3 px-3">Payment Status</th>
                <th className="py-3 px-3">Fulfillment Status</th>
                <th className="py-3 px-3">Dropship Status</th>
                <th className="py-3 px-3">Courier Tracking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200">
              {filteredOrders.map((ord) => {
                const statusCfg = ORDER_STATUS_DETAILS[ord.order_status] || ORDER_STATUS_DETAILS.pending;
                const payCfg = PAYMENT_STATUS_DETAILS[ord.payment_status] || PAYMENT_STATUS_DETAILS.unpaid;
                const dropshipStatus = ord.dropship_status || 'unassigned';

                return (
                  <tr key={ord.id} className="hover:bg-sand-50/50">
                    <td className="py-3.5 px-3">
                      <p className="font-serif font-bold text-ink-900 text-sm">
                        {ord.order_number}
                      </p>
                      <p className="text-[10px] text-sand-500">
                        {new Date(ord.created_at).toLocaleDateString()} at{' '}
                        {new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-ink-900">{ord.customer_name}</p>
                      <p className="text-[10px] text-sand-500">{ord.customer_email}</p>
                      <p className="text-[10px] text-sand-600 truncate max-w-xs">
                        {ord.shipping_address.city}, {ord.shipping_address.state} PIN {ord.shipping_address.postal_code}
                      </p>
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-serif text-base font-bold text-ink-900">
                        {formatCurrency(ord.total_amount, settings.currency_symbol)}
                      </p>
                      <p className="text-[10px] text-emerald-700 font-semibold uppercase">
                        {ord.payment_method}
                      </p>
                    </td>

                    {/* Payment Status Dropdown */}
                    <td className="py-3.5 px-3">
                      <select
                        value={ord.payment_status}
                        onChange={(e) => updatePaymentStatus(ord.id, e.target.value as PaymentStatus)}
                        className={`text-[11px] font-semibold rounded px-2 py-1 border cursor-pointer ${payCfg.bg} ${payCfg.color}`}
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid (Verified)</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>

                    {/* Fulfillment Status Dropdown */}
                    <td className="py-3.5 px-3">
                      <select
                        value={ord.order_status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className={`text-[11px] font-semibold rounded px-2 py-1 border cursor-pointer ${statusCfg.bg} ${statusCfg.color}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Dropship Status & Supplier Reference */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-1">
                        <select
                          value={dropshipStatus}
                          onChange={(e) => updateOrderDropshipStatus(ord.id, e.target.value as OrderDropshipStatus, ord.supplier_order_reference)}
                          className="text-[10px] bg-sand-100 font-medium rounded px-1.5 py-0.5 border border-sand-300 cursor-pointer"
                        >
                          <option value="unassigned">Unassigned</option>
                          <option value="ordered_from_supplier">Ordered from Supplier</option>
                          <option value="shipped_by_supplier">Shipped by Supplier</option>
                          <option value="delivered">Delivered to Patron</option>
                        </select>

                        {editingDropshipId === ord.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={supplierRefInput}
                              onChange={(e) => setSupplierRefInput(e.target.value)}
                              placeholder="Supplier Ref..."
                              className="bg-white border border-sand-300 rounded px-1.5 py-0.5 text-[10px] font-mono w-24"
                            />
                            <button
                              onClick={() => handleSaveSupplierRef(ord.id, dropshipStatus)}
                              className="p-0.5 bg-ink-900 text-white rounded"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingDropshipId(ord.id);
                              setSupplierRefInput(ord.supplier_order_reference || '');
                            }}
                            className="text-[10px] text-accent-700 hover:underline block font-mono"
                          >
                            {ord.supplier_order_reference ? `Ref: ${ord.supplier_order_reference}` : '+ Add Supplier Ref'}
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Tracking Number Editor */}
                    <td className="py-3.5 px-3">
                      {editingTrackingId === ord.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={trackingInput}
                            onChange={(e) => setTrackingInput(e.target.value)}
                            placeholder="TRK-..."
                            className="bg-sand-50 border border-sand-300 rounded px-2 py-1 text-xs font-mono w-28"
                          />
                          <button
                            onClick={() => handleSaveTracking(ord.id)}
                            className="p-1 bg-ink-900 text-white rounded hover:bg-accent-600"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingTrackingId(ord.id);
                            setTrackingInput(ord.tracking_number || '');
                          }}
                          className="font-mono text-[11px] text-accent-700 hover:underline flex items-center gap-1"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          {ord.tracking_number || '+ Add Tracking'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
