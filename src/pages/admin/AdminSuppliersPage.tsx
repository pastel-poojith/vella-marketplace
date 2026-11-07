import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { AdminLayout } from './AdminLayout';
import { formatCurrency, calculateProfitMargin } from '../../lib/utils';
import {
  Plus,
  TrendingUp,
  Building,
  Edit2,
  Check,
  X,
  Package,
} from 'lucide-react';
import { ProductSupplier } from '../../lib/types';

export const AdminSuppliersPage: React.FC = () => {
  const { suppliers, products, productSuppliers, settings, addSupplier, updateProductSupplier } = useStore();

  const [addSupplierModal, setAddSupplierModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [notes, setNotes] = useState('');

  const [editingCostProductId, setEditingCostProductId] = useState<string | null>(null);
  const [newCostPrice, setNewCostPrice] = useState<number>(0);

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    await addSupplier({
      name,
      email,
      phone,
      address,
      website,
      notes,
    });
    setAddSupplierModal(false);
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setWebsite('');
    setNotes('');
  };

  const handleSaveCost = async (productId: string, currentPs: ProductSupplier | undefined) => {
    await updateProductSupplier({
      id: currentPs?.id || `ps-${Date.now()}`,
      product_id: productId,
      supplier_id: currentPs?.supplier_id || suppliers[0]?.id || 'sup-primary',
      supplier_sku: currentPs?.supplier_sku || `SUP-${productId}`,
      lead_time_days: currentPs?.lead_time_days || 3,
      cost_price: Number(newCostPrice),
    });
    setEditingCostProductId(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Suppliers Directory Cards */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-sand-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sand-200 gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-ink-900">Partner Studios & Dropship Suppliers</h2>
              <p className="text-xs text-sand-500">
                Authorized manufacturers and fulfillment centers. No fake or unverified integrations.
              </p>
            </div>
            <button
              onClick={() => setAddSupplierModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-ink-900 text-sand-50 rounded text-xs uppercase font-semibold tracking-wider hover:bg-accent-600 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Add Partner Supplier
            </button>
          </div>

          {suppliers.length === 0 ? (
            <div className="p-8 text-center bg-sand-50 rounded-xl border border-dashed border-sand-300 space-y-2">
              <Building className="w-8 h-8 text-sand-400 mx-auto" />
              <h3 className="font-serif text-base font-bold text-ink-900">No Supplier Profiles Registered</h3>
              <p className="text-xs text-sand-500 max-w-sm mx-auto">
                Per Phase 9 cleanup, demo suppliers have been removed. Click "Add Partner Supplier" above to register your authenticated dropshipping vendor.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {suppliers.map((s) => (
                <div key={s.id} className="p-5 rounded-xl border border-sand-200 bg-sand-50/50 space-y-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-accent-700" />
                    <h3 className="font-serif text-lg font-bold text-ink-900">{s.name}</h3>
                  </div>
                  <div className="space-y-1 text-sand-600">
                    <p>Email: <span className="font-mono text-ink-800">{s.email}</span></p>
                    <p>Phone: <span className="font-mono text-ink-800">{s.phone}</span></p>
                    {s.address && <p>Location: {s.address}</p>}
                  </div>
                  {s.notes && (
                    <p className="p-2.5 bg-white rounded border border-sand-200 text-sand-500 italic text-[11px]">
                      "{s.notes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dropshipping & Margin Analysis Table */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-sand-200 shadow-sm space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink-900">Product Profit Margin & COGS Ledger</h2>
            <p className="text-xs text-sand-500">Retail price versus manufacturer wholesale cost with live margin tracking.</p>
          </div>

          {products.length === 0 ? (
            <div className="p-8 text-center bg-sand-50 rounded-xl border border-dashed border-sand-300 space-y-2">
              <Package className="w-8 h-8 text-sand-400 mx-auto" />
              <h3 className="font-serif text-base font-bold text-ink-900">Catalog Ledger Empty</h3>
              <p className="text-xs text-sand-500 max-w-sm mx-auto">
                Add products in the Product Catalog to audit cost-of-goods-sold and unit margins.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-sand-50 text-sand-600 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-3">Catalog Item</th>
                    <th className="py-3 px-3">Design Studio / Supplier</th>
                    <th className="py-3 px-3">Supplier SKU</th>
                    <th className="py-3 px-3">Cost Price (COGS)</th>
                    <th className="py-3 px-3">Retail Price</th>
                    <th className="py-3 px-3">Unit Gross Profit</th>
                    <th className="py-3 px-3">Profit Margin</th>
                    <th className="py-3 px-3">Dispatch Lead Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-200">
                  {products.map((p) => {
                    const ps = productSuppliers.find((item) => item.product_id === p.id);
                    const supplier = suppliers.find((s) => s.id === ps?.supplier_id);
                    const cost = ps?.cost_price || Math.round(p.price * 0.45);
                    const { profit, marginPercent } = calculateProfitMargin(p.price, cost);

                    return (
                      <tr key={p.id} className="hover:bg-sand-50/50">
                        <td className="py-3.5 px-3">
                          <p className="font-semibold text-ink-900 text-sm truncate max-w-xs">{p.title}</p>
                          <p className="text-[10px] text-sand-500 font-mono">Store SKU: {p.sku}</p>
                        </td>

                        <td className="py-3.5 px-3 font-medium text-ink-800">
                          {supplier?.name || 'Primary Supplier'}
                        </td>

                        <td className="py-3.5 px-3 font-mono text-sand-600 text-[11px]">
                          {ps?.supplier_sku || `SUP-${p.sku}`}
                        </td>

                        <td className="py-3.5 px-3">
                          {editingCostProductId === p.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={newCostPrice}
                                onChange={(e) => setNewCostPrice(Number(e.target.value))}
                                className="w-20 bg-sand-50 border border-sand-300 rounded p-1 text-xs"
                              />
                              <button
                                onClick={() => handleSaveCost(p.id, ps)}
                                className="p-1 bg-ink-900 text-white rounded"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => setEditingCostProductId(null)}
                                className="p-1 text-sand-400"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingCostProductId(p.id);
                                setNewCostPrice(cost);
                              }}
                              className="text-sand-800 hover:text-ink-900 font-medium flex items-center gap-1 group cursor-pointer"
                              title="Click to edit cost"
                            >
                              {formatCurrency(cost, settings.currency_symbol)}
                              <Edit2 className="w-3 h-3 text-sand-400 group-hover:text-ink-900" />
                            </button>
                          )}
                        </td>

                        <td className="py-3.5 px-3 font-semibold text-ink-900">
                          {formatCurrency(p.price, settings.currency_symbol)}
                        </td>

                        <td className="py-3.5 px-3 font-serif font-bold text-sm text-emerald-700">
                          +{formatCurrency(profit, settings.currency_symbol)}
                        </td>

                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[11px] ${
                              marginPercent >= 50
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            <TrendingUp className="w-3 h-3" />
                            {marginPercent}%
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-sand-600 font-medium">
                          {ps?.lead_time_days || 3} days
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Supplier Modal */}
        {addSupplierModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-sand-200">
                <h3 className="font-serif text-xl font-bold text-ink-900">Add Manufacturing Supplier</h3>
                <button onClick={() => setAddSupplierModal(false)}>
                  <X className="w-5 h-5 text-sand-400" />
                </button>
              </div>

              <form onSubmit={handleAddSupplier} className="space-y-3 text-xs">
                <div>
                  <label className="block uppercase font-semibold text-sand-600 mb-1">Company / Studio Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-sand-50 border border-sand-300 rounded p-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase font-semibold text-sand-600 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-sand-50 border border-sand-300 rounded p-2"
                    />
                  </div>
                  <div>
                    <label className="block uppercase font-semibold text-sand-600 mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-sand-50 border border-sand-300 rounded p-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block uppercase font-semibold text-sand-600 mb-1">HQ Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-sand-50 border border-sand-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block uppercase font-semibold text-sand-600 mb-1">Specialization Notes</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-sand-50 border border-sand-300 rounded p-2"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-sand-200">
                  <button
                    type="button"
                    onClick={() => setAddSupplierModal(false)}
                    className="px-4 py-2 border border-sand-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-ink-900 text-white rounded font-semibold uppercase"
                  >
                    Save Supplier
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
