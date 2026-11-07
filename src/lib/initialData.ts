import { Category, Product, Supplier, ProductSupplier, Order, ReturnClaim } from './types';

// Foundational department categories for the marketplace
export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-fashion',
    name: 'Fashion & Apparel',
    slug: 'fashion',
    description: 'Curated luxury apparel, tailored silhouettes, and handcrafted essentials crafted with heirloom integrity.',
    image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'cat-electronics',
    name: 'Audio & Electronics',
    slug: 'electronics',
    description: 'Precision-engineered acoustic equipment, personal audio tech, and minimalist smart devices.',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'cat-home-living',
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Artisan homeware, warm architectural illumination, and hand-finished ceramics for elevated interiors.',
    image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
  },
];

// PHASE 9 COMPLIANCE: Zero demo products in production catalog
// All genuine products are created and managed via the Admin Dashboard.
export const INITIAL_PRODUCTS: Product[] = [];

// Zero demo suppliers in production - to be configured with genuine vendor partners
export const INITIAL_SUPPLIERS: Supplier[] = [];

// Zero demo supplier associations in production
export const INITIAL_PRODUCT_SUPPLIERS: ProductSupplier[] = [];

// Zero demo orders or revenue in production
export const INITIAL_ORDERS: Order[] = [];

// Zero demo return claims in production
export const INITIAL_RETURN_CLAIMS: ReturnClaim[] = [];
