import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, WishlistItem } from '../lib/types';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface WishlistContextType {
  items: WishlistItem[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadWishlist = async () => {
      if (isSupabaseConfigured && user) {
        try {
          const { data } = await supabase
            .from('wishlist_items')
            .select('*, product:products(*, images:product_images(*))')
            .eq('user_id', user.id);
          if (data) {
            setItems(data as WishlistItem[]);
            return;
          }
        } catch (err) {
          console.warn('Error loading wishlist from Supabase:', err);
        }
      }

      const storageKey = user ? `vella_wishlist_${user.id}` : 'vella_wishlist_guest';
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch {
          setItems([]);
        }
      }
    };

    loadWishlist();
  }, [user]);

  const persistWishlist = (newItems: WishlistItem[]) => {
    setItems(newItems);
    const storageKey = user ? `vella_wishlist_${user.id}` : 'vella_wishlist_guest';
    localStorage.setItem(storageKey, JSON.stringify(newItems));
  };

  const isInWishlist = (productId: string): boolean => {
    return items.some((i) => i.product_id === productId);
  };

  const toggleWishlist = (product: Product) => {
    const exists = isInWishlist(product.id);
    let updated: WishlistItem[];

    if (exists) {
      updated = items.filter((i) => i.product_id !== product.id);
    } else {
      const newItem: WishlistItem = {
        id: `wish-${Date.now()}`,
        user_id: user?.id,
        product_id: product.id,
        product,
      };
      updated = [newItem, ...items];
    }

    persistWishlist(updated);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        toggleWishlist,
        isInWishlist,
        wishlistCount: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
