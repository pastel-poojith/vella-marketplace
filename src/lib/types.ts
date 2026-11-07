export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  created_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string;
  sort_order: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string; // e.g. "Size" or "Color"
  options: string[]; // e.g. ["S", "M", "L", "XL"] or ["Oatmeal", "Charcoal"]
  sku_suffix?: string;
  price_modifier?: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number | null;
  category_id: string;
  category?: Category;
  stock: number;
  sku: string;
  is_featured: boolean;
  is_bestseller: boolean;
  rating: number;
  reviews_count: number;
  images?: ProductImage[];
  variants?: ProductVariant[];
  created_at?: string;
  updated_at?: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  website?: string;
  address?: string;
  contact_person?: string;
  notes?: string;
  created_at?: string;
}

export interface ProductSupplier {
  id: string;
  product_id: string;
  supplier_id: string;
  supplier_sku: string;
  cost_price: number;
  lead_time_days: number;
  supplier?: Supplier;
  product?: Product;
  created_at?: string;
}

export interface StoreSettings {
  id: string;
  store_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  currency: string;
  currency_symbol: string;
  tax_rate_percent: number;
  standard_shipping_fee: number; // Flat fee charged on every order - no free shipping
  razorpay_enabled: boolean;
  razorpay_key_id: string;
  razorpay_key_secret?: string;
  announcement_bar_text: string;
  announcement_bar_enabled: boolean;
  grievance_officer_name: string;
  grievance_officer_email: string;
  grievance_officer_phone: string;
  grievance_officer_address: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: 'admin' | 'customer';
  created_at?: string;
  updated_at?: string;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string; // PIN code
  country: string;
  phone: string;
  is_default: boolean;
  created_at?: string;
}

export interface CartItem {
  id: string;
  user_id?: string;
  product_id: string;
  quantity: number;
  selected_size?: string;
  selected_color?: string;
  product: Product;
  created_at?: string;
  updated_at?: string;
}

export interface WishlistItem {
  id: string;
  user_id?: string;
  product_id: string;
  product: Product;
  created_at?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'razorpay' | 'online_gateway';

export interface OrderItem {
  id: string;
  order_id?: string;
  product_id: string;
  product_title: string;
  product_price: number;
  quantity: number;
  selected_size?: string;
  selected_color?: string;
  total_price: number;
  product_image_url: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string | null;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: {
    full_name: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string; // PIN Code
    country: string;
    phone: string;
  };
  subtotal: number;
  shipping_fee: number; // Mandatory shipping fee on every order
  tax_amount: number;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_id?: string | null; // Razorpay Payment ID or Gateway Reference
  order_status: OrderStatus;
  supplier_order_reference?: string | null;
  dropship_status?: 'unassigned' | 'ordered_from_supplier' | 'shipped_by_supplier' | 'delivered';
  tracking_number?: string | null;
  policy_acknowledged: boolean; // Affirmative agreement to No-Change-of-Mind Replacement Policy
  notes?: string | null;
  items?: OrderItem[];
  created_at: string;
  updated_at?: string;
}

// Phase 14: Return & Replacement Claims under Consumer Protection Act 2019
export type ClaimIssueType =
  | 'damaged_in_transit'
  | 'defective_product'
  | 'wrong_item_delivered'
  | 'materially_different';

export type ClaimStatus =
  | 'submitted'
  | 'under_review'
  | 'approved_replacement'
  | 'approved_refund'
  | 'rejected';

export interface ReturnClaim {
  id: string;
  claim_number: string; // e.g. CLM-89421
  order_id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  product_id: string;
  product_title: string;
  issue_type: ClaimIssueType;
  description: string;
  evidence_urls: string[];
  status: ClaimStatus;
  admin_notes?: string;
  supplier_responsible?: boolean;
  replacement_tracking_number?: string;
  refund_reference_id?: string;
  resolution_date?: string;
  created_at: string;
  updated_at?: string;
}
