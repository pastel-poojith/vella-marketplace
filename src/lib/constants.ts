import { OrderStatus, PaymentStatus, ClaimStatus, ClaimIssueType } from './types';

export const ORDER_STATUS_DETAILS: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending Payment', color: 'text-amber-800', bg: 'bg-amber-100 border-amber-200' },
  processing: { label: 'Processing & Sourcing', color: 'text-blue-800', bg: 'bg-blue-100 border-blue-200' },
  shipped: { label: 'In Transit', color: 'text-indigo-800', bg: 'bg-indigo-100 border-indigo-200' },
  delivered: { label: 'Delivered', color: 'text-emerald-800', bg: 'bg-emerald-100 border-emerald-200' },
  cancelled: { label: 'Cancelled', color: 'text-rose-800', bg: 'bg-rose-100 border-rose-200' },
};

export const PAYMENT_STATUS_DETAILS: Record<PaymentStatus, { label: string; color: string; bg: string }> = {
  unpaid: { label: 'Payment Awaiting', color: 'text-amber-800', bg: 'bg-amber-100 border-amber-200' },
  paid: { label: 'Verified & Paid Online', color: 'text-emerald-800', bg: 'bg-emerald-100 border-emerald-200' },
  failed: { label: 'Payment Failed', color: 'text-rose-800', bg: 'bg-rose-100 border-rose-200' },
  refunded: { label: 'Refund Processed', color: 'text-slate-800', bg: 'bg-slate-100 border-slate-200' },
};

export const CLAIM_STATUS_DETAILS: Record<ClaimStatus, { label: string; color: string; bg: string }> = {
  submitted: { label: 'Claim Submitted', color: 'text-amber-800', bg: 'bg-amber-100 border-amber-200' },
  under_review: { label: 'Under Verification', color: 'text-blue-800', bg: 'bg-blue-100 border-blue-200' },
  approved_replacement: { label: 'Replacement Approved & Dispatched', color: 'text-emerald-800', bg: 'bg-emerald-100 border-emerald-200' },
  approved_refund: { label: 'Refund Approved & Initiated', color: 'text-purple-800', bg: 'bg-purple-100 border-purple-200' },
  rejected: { label: 'Claim Rejected', color: 'text-rose-800', bg: 'bg-rose-100 border-rose-200' },
};

export const CLAIM_ISSUE_LABELS: Record<ClaimIssueType, string> = {
  damaged_in_transit: 'Item Arrived Damaged / Tampered in Transit',
  defective_product: 'Manufacturing Defect / Non-Functional',
  wrong_item_delivered: 'Wrong SKU / Item Delivered',
  materially_different: 'Materially Different from Description',
};

export const DEFAULT_STORE_SETTINGS = {
  id: 'vella-default-settings',
  store_name: 'VELLA',
  contact_email: 'support@vella.in',
  contact_phone: '+91 80 4718 9200',
  address: 'VELLA E-Commerce Pvt. Ltd., Prestige Tech Park, Marathahalli-Sarjapur Outer Ring Rd, Bengaluru, Karnataka 560103, India',
  currency: 'INR',
  currency_symbol: '₹',
  tax_rate_percent: 18.0, // Standard GST
  standard_shipping_fee: 99, // Mandatory shipping charged on all orders - never free
  razorpay_enabled: true,
  razorpay_key_id: '',
  razorpay_key_secret: '',
  announcement_bar_text: 'VELLA Curated Marketplace • Secure Online Gateway Payments Only • Authentic Dropshipped Craftsmanship',
  announcement_bar_enabled: true,
  // Phase 14: Mandatory Grievance Officer details under Consumer Protection (E-Commerce) Rules, 2020
  grievance_officer_name: 'S. R. Poojith',
  grievance_officer_email: 'grievance@vella.in',
  grievance_officer_phone: '+91 80 4718 9205',
  grievance_officer_address: 'Grievance Redressal Cell, VELLA E-Commerce, Prestige Tech Park, Bengaluru 560103, Karnataka, India',
};
