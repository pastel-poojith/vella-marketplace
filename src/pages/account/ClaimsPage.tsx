import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../lib/utils';
import {
  ShieldAlert,
  Plus,
  Clock,
  ArrowRight,
  Upload,
  AlertCircle,
  HelpCircle,
  Package,
} from 'lucide-react';
import { ClaimIssueType } from '../../lib/types';
import { CLAIM_STATUS_DETAILS, CLAIM_ISSUE_LABELS } from '../../lib/constants';

export const ClaimsPage: React.FC = () => {
  const { claims, orders, settings, createClaim } = useStore();
  const { user, profile } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<string>('');
  const [issueType, setIssueType] = useState<ClaimIssueType>('damaged_in_transit');
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  // Filter orders eligible for claim (delivered or recent orders belonging to customer)
  const customerOrders = orders.filter((o) => {
    if (!user) return true; // Preview mode fallback
    return o.user_id === user.id || o.customer_email === user.email;
  });

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);
  const selectedItem = selectedOrder?.items?.find((i) => i.id === selectedOrderItemId);

  const handleOpenClaimModal = () => {
    if (customerOrders.length > 0) {
      const firstOrd = customerOrders[0];
      setSelectedOrderId(firstOrd.id);
      if (firstOrd.items && firstOrd.items.length > 0) {
        setSelectedOrderItemId(firstOrd.items[0].id);
      }
    }
    setModalOpen(true);
  };

  const handleOrderChange = (ordId: string) => {
    setSelectedOrderId(ordId);
    const ord = orders.find((o) => o.id === ordId);
    if (ord && ord.items && ord.items.length > 0) {
      setSelectedOrderItemId(ord.items[0].id);
    } else {
      setSelectedOrderItemId('');
    }
  };

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !selectedItem) {
      alert('Please select an order and item to file a replacement claim.');
      return;
    }

    const newClaim = await createClaim({
      order_id: selectedOrder.id,
      order_item_id: selectedItem.id,
      user_id: user?.id || 'guest',
      customer_name: profile?.full_name || selectedOrder.customer_name,
      customer_email: user?.email || selectedOrder.customer_email,
      issue_type: issueType,
      description,
      evidence_images: evidenceUrl ? [evidenceUrl] : [],
    });

    setModalOpen(false);
    setDescription('');
    setEvidenceUrl('');
    setSubmittedMessage(
      `Claim reference ${newClaim.claim_reference} registered successfully. Our Grievance Desk will review within 48 hours.`
    );
    setTimeout(() => setSubmittedMessage(null), 8000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-sand-200 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-accent-700 font-bold block mb-1">
            Consumer Protection & Quality Redressal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-900">
            Replacement & Defect Claims
          </h1>
          <p className="text-xs text-sand-600 mt-1 max-w-2xl font-light">
            In compliance with the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>, VELLA does not offer returns for change of mind. However, items verified as damaged in transit, defective, or incorrect are eligible for free replacement upon review.
          </p>
        </div>

        <button
          onClick={handleOpenClaimModal}
          disabled={customerOrders.length === 0}
          className={`flex items-center gap-2 px-5 py-3 rounded text-xs uppercase font-semibold tracking-wider transition-colors shadow-xs ${
            customerOrders.length === 0
              ? 'bg-sand-300 text-sand-500 cursor-not-allowed'
              : 'bg-ink-900 text-sand-50 hover:bg-accent-600'
          }`}
        >
          <Plus className="w-4 h-4" />
          File Replacement Claim
        </button>
      </div>

      {submittedMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs text-emerald-900 animate-fade-in">
          <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">{submittedMessage}</p>
            <p className="text-[11px] text-emerald-700">
              Per statutory mandates, our designated Grievance Officer acknowledges receipt within 48 hours and provides definitive resolution within 30 days.
            </p>
          </div>
        </div>
      )}

      {/* Statutory Rules Card */}
      <div className="bg-sand-100/60 p-6 rounded-xl border border-sand-300 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-sand-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-serif text-sm font-bold text-ink-900">
            <Clock className="w-4 h-4 text-accent-700" />
            48-Hour Claim Window
          </div>
          <p className="text-sand-600 leading-relaxed font-light">
            Claims for parcel transit breakage or manufacturing defects must be lodged within <strong>48 hours</strong> of courier delivery confirmation with photographic proof.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 font-serif text-sm font-bold text-ink-900">
            <ShieldAlert className="w-4 h-4 text-accent-700" />
            No Change-of-Mind Returns
          </div>
          <p className="text-sand-600 leading-relaxed font-light">
            VELLA operates an exclusive atelier catalog. Subjective returns (e.g. buyer preference changes) are strictly inadmissible once dispatched.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 font-serif text-sm font-bold text-ink-900">
            <HelpCircle className="w-4 h-4 text-accent-700" />
            Grievance Redressal
          </div>
          <p className="text-sand-600 leading-relaxed font-light">
            Escalate unresolved matters directly to our statutory Grievance Officer: <strong>{settings.grievance_officer_name}</strong> at <span className="font-mono text-ink-900">{settings.grievance_officer_email}</span>.
          </p>
        </div>
      </div>

      {/* Claims List Table */}
      <div className="bg-white rounded-xl border border-sand-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-sand-200 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-ink-900">
            Your Filed Claims ({claims.length})
          </h2>
          <Link
            to="/returns-policy"
            className="text-xs uppercase font-semibold text-accent-700 hover:text-ink-900 flex items-center gap-1"
          >
            Read Statutory Policy
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {claims.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-sand-100 rounded-full flex items-center justify-center mx-auto text-sand-500">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-ink-900">No Active or Historical Claims</h3>
            <p className="text-xs text-sand-500 max-w-sm mx-auto">
              You haven't filed any replacement or transit defect claims. All fulfilled orders are performing within factory specifications.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-50 text-sand-600 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Reference & Date</th>
                  <th className="py-3 px-4">Order ID & Item</th>
                  <th className="py-3 px-4">Reported Issue</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Investigation & Resolution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {claims.map((c) => {
                  const cfg = CLAIM_STATUS_DETAILS[c.status] || CLAIM_STATUS_DETAILS.submitted;
                  const ord = orders.find((o) => o.id === c.order_id);
                  const item = ord?.items?.find((i) => i.id === c.order_item_id);

                  return (
                    <tr key={c.id} className="hover:bg-sand-50/50">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-ink-900 text-xs block">
                          {c.claim_reference}
                        </span>
                        <span className="text-[10px] text-sand-500">
                          {new Date(c.created_at).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-ink-900">{ord?.order_number || 'Order'}</p>
                        <p className="text-[11px] text-sand-600 truncate max-w-xs">
                          {item?.product_title || 'Selected Item'}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-sand-100 text-sand-800 border border-sand-200">
                          {CLAIM_ISSUE_LABELS[c.issue_type]}
                        </span>
                        <p className="text-[11px] text-sand-600 mt-1 truncate max-w-xs">
                          {c.description}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-semibold border ${cfg.bg} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-sand-700">
                        {c.resolution_notes ? (
                          <p className="italic bg-sand-50 p-2 rounded border border-sand-200">
                            "{c.resolution_notes}"
                          </p>
                        ) : (
                          <span className="text-sand-400">Awaiting concierge assessment</span>
                        )}
                        {c.replacement_tracking_number && (
                          <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                            Replacement Tracking: <span className="font-mono">{c.replacement_tracking_number}</span>
                          </p>
                        )}
                        {c.refund_reference && (
                          <p className="text-[11px] text-blue-800 font-semibold mt-1">
                            Refund Ref: <span className="font-mono">{c.refund_reference}</span>
                          </p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Claim Submission Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-sand-200">
              <div>
                <h3 className="font-serif text-xl font-bold text-ink-900">
                  Lodge Replacement / Defect Claim
                </h3>
                <p className="text-[11px] text-sand-500">
                  Statutory redressal under Indian Consumer Protection (E-Commerce) Rules 2020.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-sand-400 hover:text-ink-900 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitClaim} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-semibold text-sand-600 mb-1">
                  1. Select Dispatched Order *
                </label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => handleOrderChange(e.target.value)}
                  required
                  className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900"
                >
                  {customerOrders.map((ord) => (
                    <option key={ord.id} value={ord.id}>
                      {ord.order_number} ({new Date(ord.created_at).toLocaleDateString()}) — {formatCurrency(ord.total_amount, settings.currency_symbol)}
                    </option>
                  ))}
                </select>
              </div>

              {selectedOrder && selectedOrder.items && (
                <div>
                  <label className="block uppercase font-semibold text-sand-600 mb-1">
                    2. Select Defective Item *
                  </label>
                  <select
                    value={selectedOrderItemId}
                    onChange={(e) => setSelectedOrderItemId(e.target.value)}
                    required
                    className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900"
                  >
                    {selectedOrder.items.map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.product_title} (Qty: {it.quantity})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block uppercase font-semibold text-sand-600 mb-1">
                  3. Reason for Claim *
                </label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value as ClaimIssueType)}
                  required
                  className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900"
                >
                  <option value="damaged_in_transit">Damaged in Transit / Crushed Packaging</option>
                  <option value="defective_product">Defective / Manufacturing Flaw</option>
                  <option value="wrong_item_delivered">Incorrect Item Delivered</option>
                  <option value="materially_different">Materially Different from Studio Specification</option>
                </select>
              </div>

              <div>
                <label className="block uppercase font-semibold text-sand-600 mb-1">
                  4. Photographic Evidence URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/... or cloud image URL of unboxing/defect"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900 font-mono text-xs"
                />
                <p className="text-[10px] text-sand-500 mt-1 flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  Clear unboxing video or photographs of the damage are required to authorize replacement.
                </p>
              </div>

              <div>
                <label className="block uppercase font-semibold text-sand-600 mb-1">
                  5. Detailed Description of the Defect *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the exact nature of the damage or defect upon opening the package..."
                  className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2 text-amber-900 text-[11px]">
                <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <p>
                  False or misleading claims violate the Terms of Service. Under Rule 5 of the Consumer Protection (E-Commerce) Rules, 2020, genuine replacement will be dispatched after our verification desk examines courier transit seals.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-sand-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-sand-300 rounded text-ink-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-ink-900 hover:bg-accent-600 text-sand-50 rounded font-semibold uppercase tracking-wider"
                >
                  Register Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
