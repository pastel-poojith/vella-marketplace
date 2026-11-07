import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Category,
  Product,
  StoreSettings,
  Supplier,
  ProductSupplier,
  Order,
  OrderStatus,
  PaymentStatus,
  ReturnClaim,
  ClaimStatus,
} from '../lib/types';
import { DEFAULT_STORE_SETTINGS } from '../lib/constants';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SUPPLIERS,
  INITIAL_PRODUCT_SUPPLIERS,
  INITIAL_ORDERS,
  INITIAL_RETURN_CLAIMS,
} from '../lib/initialData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { generateOrderNumber, generateClaimNumber } from '../lib/utils';

interface StoreContextType {
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  categories: Category[];
  products: Product[];
  suppliers: Supplier[];
  productSuppliers: ProductSupplier[];
  orders: Order[];
  claims: ReturnClaim[];
  isLoading: boolean;
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<Category>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<Supplier>;
  updateSupplier: (id: string, updates: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  updateProductSupplier: (ps: ProductSupplier) => Promise<void>;
  createOrder: (orderData: Omit<Order, 'id' | 'order_number' | 'created_at'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  updatePaymentStatus: (orderId: string, status: PaymentStatus, paymentId?: string) => Promise<void>;
  updateTrackingNumber: (orderId: string, trackingNumber: string) => Promise<void>;
  createClaim: (claimData: Omit<ReturnClaim, 'id' | 'claim_number' | 'created_at' | 'status'>) => Promise<ReturnClaim>;
  updateClaimStatus: (
    claimId: string,
    status: ClaimStatus,
    adminNotes?: string,
    replacementTracking?: string,
    refundRef?: string
  ) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [productSuppliers, setProductSuppliers] = useState<ProductSupplier[]>(INITIAL_PRODUCT_SUPPLIERS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [claims, setClaims] = useState<ReturnClaim[]>(INITIAL_RETURN_CLAIMS);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and load persistent store data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Clear obsolete legacy demo cache if present to enforce Phase 9
        const cachedProducts = localStorage.getItem('vella_products');
        if (cachedProducts && cachedProducts.includes('prod-lumina-headphones')) {
          localStorage.removeItem('vella_products');
          localStorage.removeItem('vella_orders');
        }

        if (isSupabaseConfigured) {
          // Fetch real store settings
          const { data: setts } = await supabase.from('store_settings').select('*').limit(1).single();
          if (setts) setSettings({ ...DEFAULT_STORE_SETTINGS, ...setts });

          // Fetch categories
          const { data: cats } = await supabase.from('categories').select('*').order('name');
          if (cats && cats.length > 0) setCategories(cats);

          // Fetch genuine products with images & variants
          const { data: prods } = await supabase.from('products').select('*, images:product_images(*), variants:product_variants(*)');
          if (prods) setProducts(prods);

          // Fetch suppliers
          const { data: sups } = await supabase.from('suppliers').select('*');
          if (sups) setSuppliers(sups);

          // Fetch orders
          const { data: ords } = await supabase.from('orders').select('*, items:order_items(*)').order('created_at', { ascending: false });
          if (ords) setOrders(ords);

          // Fetch claims
          const { data: clms } = await supabase.from('return_claims').select('*').order('created_at', { ascending: false });
          if (clms) setClaims(clms);
        } else {
          // Load from localStorage
          const savedSettings = localStorage.getItem('vella_store_settings');
          if (savedSettings) setSettings(JSON.parse(savedSettings));

          const savedProducts = localStorage.getItem('vella_products');
          if (savedProducts) setProducts(JSON.parse(savedProducts));

          const savedCategories = localStorage.getItem('vella_categories');
          if (savedCategories) setCategories(JSON.parse(savedCategories));

          const savedSuppliers = localStorage.getItem('vella_suppliers');
          if (savedSuppliers) setSuppliers(JSON.parse(savedSuppliers));

          const savedOrders = localStorage.getItem('vella_orders');
          if (savedOrders) setOrders(JSON.parse(savedOrders));

          const savedClaims = localStorage.getItem('vella_claims');
          if (savedClaims) setClaims(JSON.parse(savedClaims));
        }
      } catch (err) {
        console.warn('StoreContext loading warning:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('vella_store_settings', JSON.stringify(updated));

    if (isSupabaseConfigured) {
      await supabase.from('store_settings').upsert({ id: settings.id, ...newSettings });
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'created_at'>): Promise<Product> => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
      created_at: new Date().toISOString(),
      images: productData.images || [],
      variants: productData.variants || [],
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem('vella_products', JSON.stringify(updated));

    if (isSupabaseConfigured) {
      await supabase.from('products').insert([newProduct]);
    }
    return newProduct;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p));
    setProducts(updated);
    localStorage.setItem('vella_products', JSON.stringify(updated));

    if (isSupabaseConfigured) {
      await supabase.from('products').update(updates).eq('id', id);
    }
  };

  const deleteProduct = async (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem('vella_products', JSON.stringify(updated));

    if (isSupabaseConfigured) {
      await supabase.from('products').delete().eq('id', id);
    }
  };

  const addCategory = async (categoryData: Omit<Category, 'id'>): Promise<Category> => {
    const newId = `cat-${Date.now()}`;
    const newCategory: Category = { ...categoryData, id: newId };
    const updated = [...categories, newCategory];
    setCategories(updated);
    localStorage.setItem('vella_categories', JSON.stringify(updated));

    if (isSupabaseConfigured) {
      await supabase.from('categories').insert([categoryData]);
    }
    return newCategory;
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const updated = categories.map((c) => (c.id === id ? { ...c, ...updates } : c));
    setCategories(updated);
    localStorage.setItem('vella_categories', JSON.stringify(updated));

    if (isSupabaseConfigured) {
      await supabase.from('categories').update(updates).eq('id', id);
    }
  };

  const deleteCategory = async (id: string) => {
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    localStorage.setItem('vella_categories', JSON.stringify(updated));

    if (isSupabaseConfigured) {
      await supabase.from('categories').delete().eq('id', id);
    }
  };

  const addSupplier = async (supplierData: Omit<Supplier, 'id'>): Promise<Supplier> => {
    const newId = `sup-${Date.now()}`;
    const newSupplier: Supplier = { ...supplierData, id: newId };
    const updated = [...suppliers, newSupplier];
    setSuppliers(updated);
    localStorage.setItem('vella_suppliers', JSON.stringify(updated));

    if (isSupabaseConfigured) {
      await supabase.from('suppliers').insert([newSupplier]);
    }
    return newSupplier;
  };

  const updateSupplier = async (id: string, updates: Partial<Supplier>) => {
    const updated = suppliers.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setSuppliers(updated);
    localStorage.setItem('vella_suppliers', JSON.stringify(updated));

    if (isSupabaseConfigured) {
      await supabase.from('suppliers').update(updates).eq('id', id);
    }
  };

  const deleteSupplier = async (id: string) => {
    const updated = suppliers.filter((s) => s.id !== id);
    setSuppliers(updated);
    localStorage.setItem('vella_suppliers', JSON.stringify(updated));

    if (isSupabaseConfigured) {
      await supabase.from('suppliers').delete().eq('id', id);
    }
  };

  const updateProductSupplier = async (ps: ProductSupplier) => {
    const index = productSuppliers.findIndex((item) => item.product_id === ps.product_id);
    let updated: ProductSupplier[];
    if (index >= 0) {
      updated = [...productSuppliers];
      updated[index] = ps;
    } else {
      updated = [...productSuppliers, ps];
    }
    setProductSuppliers(updated);
  };

  const createOrder = async (
    orderData: Omit<Order, 'id' | 'order_number' | 'created_at'>
  ): Promise<Order> => {
    // Phase 2: Strictly prohibit Cash on Delivery orders
    if ((orderData.payment_method as string) === 'cod') {
      throw new Error('Cash on Delivery is discontinued. Please select an authorized online payment method.');
    }

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      order_number: generateOrderNumber(),
      created_at: new Date().toISOString(),
      dropship_status: 'unassigned',
    };

    // Deduct stock from genuine catalog products
    if (newOrder.items) {
      const updatedProducts = products.map((prod) => {
        const matchingItem = newOrder.items?.find((item) => item.product_id === prod.id);
        if (matchingItem) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - matchingItem.quantity),
          };
        }
        return prod;
      });
      setProducts(updatedProducts);
      localStorage.setItem('vella_products', JSON.stringify(updatedProducts));
    }

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('vella_orders', JSON.stringify(updatedOrders));

    if (isSupabaseConfigured) {
      try {
        await supabase.from('orders').insert([newOrder]);
      } catch (err) {
        console.warn('Supabase order insert notice:', err);
      }
    }

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, order_status: status, updated_at: new Date().toISOString() } : o));
    setOrders(updated);
    localStorage.setItem('vella_orders', JSON.stringify(updated));

    if (isSupabaseConfigured) {
      await supabase.from('orders').update({ order_status: status }).eq('id', orderId);
    }
  };

  const updatePaymentStatus = async (orderId: string, status: PaymentStatus, paymentId?: string) => {
    const updated = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            payment_status: status,
            payment_id: paymentId || o.payment_id,
            updated_at: new Date().toISOString(),
          }
        : o
    );
    setOrders(updated);
    localStorage.setItem('vella_orders', JSON.stringify(updated));

    if (isSupabaseConfigured) {
      await supabase.from('orders').update({ payment_status: status, payment_id: paymentId }).eq('id', orderId);
    }
  };

  const updateTrackingNumber = async (orderId: string, trackingNumber: string) => {
    const updated = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            tracking_number: trackingNumber,
            order_status: o.order_status === 'pending' || o.order_status === 'processing' ? 'shipped' : o.order_status,
            updated_at: new Date().toISOString(),
          }
        : o
    );
    setOrders(updated);
    localStorage.setItem('vella_orders', JSON.stringify(updated));

    if (isSupabaseConfigured) {
      await supabase.from('orders').update({ tracking_number: trackingNumber }).eq('id', orderId);
    }
  };

  // Phase 14: Customer Returns & Claims Filing
  const createClaim = async (
    claimData: Omit<ReturnClaim, 'id' | 'claim_number' | 'created_at' | 'status'>
  ): Promise<ReturnClaim> => {
    const newClaim: ReturnClaim = {
      ...claimData,
      id: `clm-${Date.now()}`,
      claim_number: generateClaimNumber(),
      status: 'submitted',
      created_at: new Date().toISOString(),
    };

    const updated = [newClaim, ...claims];
    setClaims(updated);
    localStorage.setItem('vella_claims', JSON.stringify(updated));

    if (isSupabaseConfigured) {
      await supabase.from('return_claims').insert([newClaim]);
    }
    return newClaim;
  };

  const updateClaimStatus = async (
    claimId: string,
    status: ClaimStatus,
    adminNotes?: string,
    replacementTracking?: string,
    refundRef?: string
  ) => {
    const updated = claims.map((c) =>
      c.id === claimId
        ? {
            ...c,
            status,
            admin_notes: adminNotes || c.admin_notes,
            replacement_tracking_number: replacementTracking || c.replacement_tracking_number,
            refund_reference_id: refundRef || c.refund_reference_id,
            resolution_date: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        : c
    );
    setClaims(updated);
    localStorage.setItem('vella_claims', JSON.stringify(updated));

    if (isSupabaseConfigured) {
      await supabase.from('return_claims').update({
        status,
        admin_notes: adminNotes,
        replacement_tracking_number: replacementTracking,
        refund_reference_id: refundRef,
        resolution_date: new Date().toISOString(),
      }).eq('id', claimId);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        settings,
        updateSettings,
        categories,
        products,
        suppliers,
        productSuppliers,
        orders,
        claims,
        isLoading,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        updateProductSupplier,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,
        updateTrackingNumber,
        createClaim,
        updateClaimStatus,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
