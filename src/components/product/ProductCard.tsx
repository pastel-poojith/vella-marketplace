import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '../../lib/types';
import { formatCurrency, calculateDiscountPercent } from '../../lib/utils';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import { useStore } from '../../contexts/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { categories, settings } = useStore();
  const [added, setAdded] = useState(false);
  const [imgHovered, setImgHovered] = useState(false);

  const isWished = isInWishlist(product.id);
  const discount = calculateDiscountPercent(product.price, product.compare_at_price);
  const category = categories.find((c) => c.id === product.category_id);

  const primaryImage = product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
  const secondaryImage = product.images?.[1]?.image_url || primaryImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = addToCart(product, 1);
    if (res.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-lg border border-sand-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Product Image Frame */}
      <Link
        to={`/product/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-sand-100"
        onMouseEnter={() => setImgHovered(true)}
        onMouseLeave={() => setImgHovered(false)}
      >
        <img
          src={imgHovered ? secondaryImage : primaryImage}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discount && (
            <span className="bg-accent-600 text-white text-[11px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
              Save {discount}%
            </span>
          )}
          {product.is_bestseller && (
            <span className="bg-ink-900 text-sand-50 text-[10px] font-semibold px-2 py-0.5 rounded tracking-wider uppercase">
              Bestseller
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="bg-amber-100 text-amber-800 text-[10px] font-medium px-2 py-0.5 rounded border border-amber-200">
              Only {product.stock} left
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-rose-100 text-rose-800 text-[10px] font-medium px-2 py-0.5 rounded border border-rose-200">
              Out of stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={isWished ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 shadow-sm ${
            isWished
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/90 text-ink-600 hover:text-rose-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWished ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick Add Overlay on hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className={`w-full py-2.5 px-4 rounded text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all ${
              added
                ? 'bg-emerald-600 text-white'
                : product.stock === 0
                ? 'bg-sand-300 text-sand-600 cursor-not-allowed'
                : 'bg-ink-900 text-sand-50 hover:bg-accent-600'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Added to Bag
              </>
            ) : product.stock === 0 ? (
              'Sold Out'
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                Quick Add
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Details Container */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-xs text-sand-500 mb-1">
          <span className="uppercase tracking-wider font-medium truncate max-w-[150px]">
            {category?.name || 'Curated'}
          </span>
          <div className="flex items-center gap-1 text-amber-600">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="font-semibold text-ink-800">{product.rating}</span>
            <span className="text-sand-400">({product.reviews_count})</span>
          </div>
        </div>

        {/* Title */}
        <Link
          to={`/product/${product.slug}`}
          className="font-serif text-lg font-semibold text-ink-900 hover:text-accent-600 transition-colors line-clamp-1 mb-2"
        >
          {product.title}
        </Link>

        {/* Pricing */}
        <div className="mt-auto pt-2 flex items-baseline gap-2">
          <span className="text-base font-semibold text-ink-900">
            {formatCurrency(product.price, settings.currency_symbol)}
          </span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="text-xs text-sand-500 line-through">
              {formatCurrency(product.compare_at_price, settings.currency_symbol)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
