import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { Search, Truck, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ORDER_STATUS_DETAILS } from '../../lib/constants';
import { Order } from '../../lib/types';

export const TrackOrderPage: React.FC = () => {
  const { orders } = useStore();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const cleaned = query.trim().toUpperCase();
    const found = orders.find(
      (o) =>
        o.order_number.toUpperCase() === cleaned ||
        (o.tracking_number && o.tracking_number.toUpperCase() === cleaned)
    );
    setMatchedOrder(found || null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-accent-700 font-bold block">
          Carrier Consignment Search
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink-900">
          Track Your Consignment
        </h1>
        <p className="text-sm text-sand-700 font-light max-w-xl mx-auto">
          Enter your Order Reference Number (e.g. VEL-89412) or Carrier Tracking Code to inspect live dispatch progress.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto bg-white p-4 rounded-xl border border-sand-300 shadow-sm flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="VEL-89412 or TRK-..."
            className="w-full bg-sand-50 border border-sand-200 rounded px-3 py-2.5 pl-10 text-sm font-mono text-ink-900 uppercase focus:outline-none focus:border-accent-500"
          />
          <Search className="w-4 h-4 text-sand-400 absolute left-3.5 top-3.5" />
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 bg-ink-900 hover:bg-accent-600 text-sand-50 rounded text-xs uppercase font-semibold tracking-wider transition-colors"
        >
          Inspect Status
        </button>
      </form>

      {/* Search Result */}
      {searched && (
        <div className="animate-fade-in max-w-2xl mx-auto">
          {matchedOrder ? (
            <div className="bg-white rounded-xl border border-sand-200 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sand-200 gap-2">
                <div>
                  <span className="text-[10px] text-sand-500 uppercase tracking-widest font-semibold block">
                    Verified Consignment
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-ink-900">
                    {matchedOrder.order_number}
                  </h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    ORDER_STATUS_DETAILS[matchedOrder.order_status]?.bg
                  } ${ORDER_STATUS_DETAILS[matchedOrder.order_status]?.color}`}
                >
                  {ORDER_STATUS_DETAILS[matchedOrder.order_status]?.label}
                </span>
              </div>

              {matchedOrder.tracking_number && (
                <div className="p-4 bg-sand-50 rounded-lg flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-accent-700" />
                    <span>Tracking Number: <strong className="font-mono text-ink-900">{matchedOrder.tracking_number}</strong></span>
                  </div>
                  <span className="text-sand-600">Carrier Priority Ground</span>
                </div>
              )}

              {/* Step indicator */}
              <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-semibold text-sand-600 pt-2">
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p>Order Placed</p>
                </div>
                <div className="space-y-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                    matchedOrder.order_status !== 'pending' ? 'bg-emerald-600 text-white' : 'bg-sand-200 text-sand-500'
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p>Packed at Studio</p>
                </div>
                <div className="space-y-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                    matchedOrder.order_status === 'shipped' || matchedOrder.order_status === 'delivered'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-sand-200 text-sand-500'
                  }`}>
                    <Truck className="w-4 h-4" />
                  </div>
                  <p>In Carrier Transit</p>
                </div>
                <div className="space-y-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                    matchedOrder.order_status === 'delivered' ? 'bg-emerald-600 text-white' : 'bg-sand-200 text-sand-500'
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p>Delivered</p>
                </div>
              </div>

              <div className="pt-4 border-t border-sand-200 flex justify-between items-center text-xs">
                <div>
                  <p className="text-sand-500">Destination Recipient</p>
                  <p className="font-semibold text-ink-900">{matchedOrder.customer_name}</p>
                </div>
                <Link
                  to={`/account/orders/${matchedOrder.id}`}
                  className="font-semibold text-accent-700 hover:underline inline-flex items-center gap-1"
                >
                  Full Receipt Details
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-rose-50 border border-rose-200 p-6 rounded-xl text-center space-y-2 text-xs text-rose-800">
              <AlertCircle className="w-6 h-6 text-rose-600 mx-auto" />
              <p className="font-semibold text-sm">Consignment Record Not Found</p>
              <p className="text-sand-600">
                Please ensure you have entered the exact order prefix (e.g., <code className="font-mono">VEL-89412</code>).
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
