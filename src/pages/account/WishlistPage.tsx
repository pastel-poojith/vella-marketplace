import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import { useStore } from '../../contexts/StoreContext';
import { AccountLayout } from './AccountLayout';
import { formatCurrency } from '../../lib/utils';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

import { Product } from '../../lib/types';

export const WishlistPage: React.FC = () => {
  const { items, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { settings } = useStore();

  const handleMoveToCart = (product: Product) => {
    addToCart(product, 1);
    toggleWishlist(product);
  };

  return (
    <AccountLayout>
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-sand-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-sand-200">
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink-900">Your Private Wishlist</h2>
            <p className="text-xs text-sand-500">Saved designs and curated accents for future seasons.</p>
          </div>
          <span className="text-xs text-sand-600 font-semibold">
            {items.length} {items.length === 1 ? 'Design' : 'Designs'}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Heart className="w-12 h-12 text-sand-300 mx-auto" />
            <p className="text-sm text-sand-700">Your wishlist is currently empty.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-ink-900 text-sand-50 rounded text-xs uppercase font-semibold tracking-wider hover:bg-accent-600 transition-colors"
            >
              Browse Curated Catalog
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(({ id, product }) => {
              const img =
                product.images?.[0]?.image_url ||
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80';

              return (
                <div
                  key={id}
                  className="rounded-xl border border-sand-200 overflow-hidden bg-sand-50/40 flex flex-col group"
                >
                  <Link
                    to={`/product/${product.slug}`}
                    className="aspect-[4/5] bg-sand-100 overflow-hidden relative block"
                  >
                    <img
                      src={img}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 text-rose-600 rounded-full hover:bg-white shadow-xs"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Link>

                  <div className="p-4 flex flex-col flex-1 space-y-3">
                    <Link
                      to={`/product/${product.slug}`}
                      className="font-serif text-base font-bold text-ink-900 hover:text-accent-600 line-clamp-1"
                    >
                      {product.title}
                    </Link>

                    <div className="flex items-baseline justify-between text-xs">
                      <span className="font-semibold text-ink-900 text-sm">
                        {formatCurrency(product.price, settings.currency_symbol)}
                      </span>
                      <span className="text-sand-500">
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleMoveToCart(product)}
                      disabled={product.stock === 0}
                      className="w-full py-2 px-3 bg-ink-900 hover:bg-accent-600 disabled:bg-sand-300 text-sand-50 rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 mt-auto"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Move to Bag
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AccountLayout>
  );
};
