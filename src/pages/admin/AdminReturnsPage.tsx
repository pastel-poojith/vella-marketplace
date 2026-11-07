import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { AdminLayout } from './AdminLayout';
import { formatCurrency } from '../../lib/utils';
import { ClaimStatus } from '../../lib/types';
import { CLAIM_STATUS_DETAILS, CLAIM_ISSUE_LABELS } from '../../lib/constants';
import {
  CheckCircle2,
  XCircle,
  Truck,
  ExternalLink,
  Search,
} from 'lucide-react';

export const AdminReturnsPage: React.FC = () => {
  const { claims, orders, settings, updateClaimStatus } = useStore();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);

  // Resolution form state
  const [newStatus, setNewStatus] = useState<ClaimStatus>('under_review');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [replacementTracking, setReplacementTracking] = useState('');
  const [refundRef, setRefundRef] = useState('');

  const filteredClaims = claims.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRef = c.claim_reference.toLowerCase().includes(q);
      const matchCust = c.customer_name.toLowerCase().includes(q);
      const matchEmail = c.customer_email.toLowerCase().includes(q);
      if (!matchRef && !matchCust && !matchEmail) return false;
    }
    return true;
  });

  const activeClaim = claims.find((c) => c.id === selectedClaimId);
  const activeOrder = activeClaim ? orders.find((o) => o.id === activeClaim.order_id) : null;
  const activeItem = activeOrder?.items?.find((i) => i.id === activeClaim?.order_item_id);

  const handleOpenReview = (cId: string) => {
    const claim = claims.find((c) => c.id === cId);
    if (claim) {
      setSelectedClaimId(cId);
      setNewStatus(claim.status);
      setResolutionNotes(claim.resolution_notes || '');
      setReplacementTracking(claim.replacement_tracking_number || '');
      setRefundRef(claim.refund_reference || '');
    }
  };

  const handleSaveResolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClaimId) return;

    await updateClaimStatus(selectedClaimId, newStatus, {
      resolution_notes: resolutionNotes,
      replacement_tracking_number: replacementTracking || undefined,
      refund_reference: refundRef || undefined,
    });

    setSelectedClaimId(null);
  };

  return (
    <AdminLayout>
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-sand-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sand-200 gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink-900">
              Customer Claims & Returns Governance
            </h2>
            <p className="text-xs text-sand-500">
              Statutory redressal desk under Indian Consumer Protection (E-Commerce) Rules 2020.
            </p>
          </div>
          <span className="text-xs text-sand-600 font-semibold">
            {filteredClaims.length} {filteredClaims.length === 1 ? 'Claim' : 'Claims'} displayed
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5 p-1 bg-sand-100 rounded-lg text-xs">
            {['all', 'submitted', 'under_review', 'approved_replacement', 'approved_refund', 'rejected'].map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-md font-medium uppercase tracking-wider transition-colors ${
                    statusFilter === st
                      ? 'bg-ink-900 text-sand-50 font-semibold shadow-xs'
                      : 'text-sand-700 hover:text-ink-900'
                  }`}
                >
                  {st.replace(/_/g, ' ')}
                </button>
              )
            )}
          </div>

          <div className="relative max-w-xs w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, customer..."
              className="w-full bg-sand-50 border border-sand-300 rounded px-3 py-1.5 pl-8 text-xs text-ink-900 focus:outline-none focus:border-accent-500"
            />
            <Search className="w-3.5 h-3.5 text-sand-400 absolute left-2.5 top-2" />
          </div>
        </div>

        {/* Claims Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-sand-50 text-sand-600 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-3">Claim Reference</th>
                <th className="py-3 px-3">Customer & Order</th>
                <th className="py-3 px-3">Alleged Issue</th>
                <th className="py-3 px-3">Evidence</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200">
              {filteredClaims.map((c) => {
                const cfg = CLAIM_STATUS_DETAILS[c.status] || CLAIM_STATUS_DETAILS.submitted;
                const ord = orders.find((o) => o.id === c.order_id);
                const itm = ord?.items?.find((i) => i.id === c.order_item_id);

                return (
                  <tr key={c.id} className="hover:bg-sand-50/50">
                    <td className="py-3.5 px-3">
                      <p className="font-mono font-bold text-ink-900 text-xs">
                        {c.claim_reference}
                      </p>
                      <p className="text-[10px] text-sand-500">
                        {new Date(c.created_at).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-ink-900">{c.customer_name}</p>
                      <p className="text-[10px] text-sand-500">{c.customer_email}</p>
                      <p className="text-[10px] text-sand-600 font-mono mt-0.5">
                        Order #{ord?.order_number || 'N/A'} • {itm?.product_title || 'Item'}
                      </p>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-sand-100 text-sand-800 border border-sand-200">
                        {CLAIM_ISSUE_LABELS[c.issue_type]}
                      </span>
                      <p className="text-[11px] text-sand-600 truncate max-w-xs mt-1">
                        {c.description}
                      </p>
                    </td>

                    <td className="py-3.5 px-3">
                      {c.evidence_images && c.evidence_images.length > 0 ? (
                        <a
                          href={c.evidence_images[0]}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-accent-700 hover:underline font-medium text-[11px]"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Photo
                        </a>
                      ) : (
                        <span className="text-sand-400">None attached</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => handleOpenReview(c.id)}
                        className="px-3 py-1 bg-ink-900 hover:bg-accent-600 text-sand-50 rounded text-[11px] uppercase font-semibold transition-colors"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Adjudication Modal */}
        {selectedClaimId && activeClaim && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-sand-200">
                <div>
                  <h3 className="font-serif text-xl font-bold text-ink-900">
                    Review Claim {activeClaim.claim_reference}
                  </h3>
                  <p className="text-xs text-sand-500">
                    Filed by {activeClaim.customer_name} ({activeClaim.customer_email})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedClaimId(null)}
                  className="text-sand-400 hover:text-ink-900 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Claim Overview Card */}
              <div className="bg-sand-50 p-4 rounded-lg border border-sand-200 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-sand-500 font-semibold uppercase">Order Number:</span>{' '}
                    <span className="font-mono text-ink-900">{activeOrder?.order_number}</span>
                  </div>
                  <div>
                    <span className="text-sand-500 font-semibold uppercase">Product:</span>{' '}
                    <span className="font-semibold text-ink-900">{activeItem?.product_title}</span>
                  </div>
                  <div>
                    <span className="text-sand-500 font-semibold uppercase">Item Price:</span>{' '}
                    <span className="text-ink-900">
                      {formatCurrency(activeItem?.product_price || 0, settings.currency_symbol)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sand-500 font-semibold uppercase">Claim Type:</span>{' '}
                    <span className="font-semibold text-accent-700">
                      {CLAIM_ISSUE_LABELS[activeClaim.issue_type]}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-sand-200">
                  <span className="text-sand-500 font-semibold uppercase block mb-1">
                    Customer Statement:
                  </span>
                  <p className="text-sand-800 italic bg-white p-2.5 rounded border border-sand-200">
                    "{activeClaim.description}"
                  </p>
                </div>

                {activeClaim.evidence_images && activeClaim.evidence_images.length > 0 && (
                  <div className="pt-2">
                    <span className="text-sand-500 font-semibold uppercase block mb-1">
                      Submitted Photographic Proof:
                    </span>
                    <a
                      href={activeClaim.evidence_images[0]}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block"
                    >
                      <img
                        src={activeClaim.evidence_images[0]}
                        alt="Defect Evidence"
                        className="w-32 h-32 object-cover rounded border border-sand-300 shadow-xs hover:opacity-90"
                      />
                    </a>
                  </div>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSaveResolution} className="space-y-4 text-xs">
                <div>
                  <label className="block uppercase font-semibold text-sand-600 mb-1">
                    Decision & Lifecycle Status *
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ClaimStatus)}
                    className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900 font-semibold"
                  >
                    <option value="under_review">Under Studio Investigation</option>
                    <option value="approved_replacement">Approve Replacement Consignment</option>
                    <option value="approved_refund">Approve Discretionary Refund</option>
                    <option value="rejected">Reject Claim (Does Not Meet Statutory Criteria)</option>
                  </select>
                </div>

                {newStatus === 'approved_replacement' && (
                  <div>
                    <label className="block uppercase font-semibold text-sand-600 mb-1 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-accent-700" />
                      Replacement Consignment Tracking Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="TRK-REP-..."
                      value={replacementTracking}
                      onChange={(e) => setReplacementTracking(e.target.value)}
                      className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900 font-mono"
                    />
                  </div>
                )}

                {newStatus === 'approved_refund' && (
                  <div>
                    <label className="block uppercase font-semibold text-sand-600 mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Gateway Refund Transaction Reference ID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="RFND-RZP-..."
                      value={refundRef}
                      onChange={(e) => setRefundRef(e.target.value)}
                      className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900 font-mono"
                    />
                  </div>
                )}

                <div>
                  <label className="block uppercase font-semibold text-sand-600 mb-1">
                    Formal Concierge Resolution Notes (Communicated to Customer) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Provide official rationale, inspection conclusion, and next steps..."
                    className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-sand-200">
                  <button
                    type="button"
                    onClick={() => setSelectedClaimId(null)}
                    className="px-4 py-2 border border-sand-300 rounded text-ink-900 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-ink-900 hover:bg-accent-600 text-sand-50 rounded font-semibold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    {newStatus === 'rejected' ? (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                    Commit Decision
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
