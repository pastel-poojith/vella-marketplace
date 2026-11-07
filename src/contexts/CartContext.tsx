import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../lib/types';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    selectedSize?: string,
    selectedColor?: string
  ) => { success: boolean; message?: string };
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadCart = async () => {
      if (isSupabaseConfigured && user) {
        try {
          const { data } = await supabase
            .from('cart_items')
            .select('*, product:products(*, images:product_images(*))')
            .eq('user_id', user.id);
          if (data) {
            setItems(data as CartItem[]);
            return;
          }
        } catch (err) {
          console.warn('Error loading cart from Supabase:', err);
        }
      }

      const storageKey = user ? `vella_cart_${user.id}` : 'vella_cart_guest';
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch {
          setItems([]);
        }
      }
    };

    loadCart();
  }, [user]);

  const persistItems = (newItems: CartItem[]) => {
    setItems(newItems);
    const storageKey = user ? `vella_cart_${user.id}` : 'vella_cart_guest';
    localStorage.setItem(storageKey, JSON.stringify(newItems));
  };

  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedSize?: string,
    selectedColor?: string
  ): { success: boolean; message?: string } => {
    if (product.stock <= 0) {
      return { success: false, message: 'This item is currently out of stock.' };
    }

    const existingIndex = items.findIndex(
      (i) =>
        i.product_id === product.id &&
        (i.selected_size || '') === (selectedSize || '') &&
        (i.selected_color || '') === (selectedColor || '')
    );

    let updated: CartItem[];

    if (existingIndex >= 0) {
      const existing = items[existingIndex];
      const newQty = existing.quantity + quantity;
      if (newQty > product.stock) {
        return {
          success: false,
          message: `Only ${product.stock} units are currently available in stock.`,
        };
      }
      updated = [...items];
      updated[existingIndex] = { ...existing, quantity: newQty };
    } else {
      if (quantity > product.stock) {
        return {
          success: false,
          message: `Only ${product.stock} units are currently available in stock.`,
        };
      }
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        user_id: user?.id,
        product_id: product.id,
        quantity,
        selected_size: selectedSize,
        selected_color: selectedColor,
        product,
      };
      updated = [newItem, ...items];
    }

    persistItems(updated);
    return { success: true };
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    const item = items.find((i) => i.id === cartItemId);
    if (!item) return;

    const finalQty = Math.min(quantity, item.product.stock);
    const updated = items.map((i) =>
      i.id === cartItemId ? { ...i, quantity: finalQty } : i
    );
    persistItems(updated);
  };

  const removeFromCart = (cartItemId: string) => {
    const updated = items.filter((i) => i.id !== cartItemId);
    persistItems(updated);
  };

  const clearCart = () => {
    persistItems([]);
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
