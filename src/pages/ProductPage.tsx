import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { formatCurrency, calculateDiscountPercent } from '../lib/utils';
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  RotateCcw,
  Check,
  Minus,
  Plus,
  ArrowRight,
  Share2,
} from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';

export const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, categories, settings } = useStore();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const product = products.find((p) => p.slug === slug);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'description' | 'policy' | 'shipping'>('description');
  const [addedToast, setAddedToast] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      setSelectedImage(product.images[0].image_url);
    }
    // Set default variant if available
    const sizeVariant = product?.variants?.find((v) => v.name.toLowerCase().includes('size'));
    if (sizeVariant && sizeVariant.options.length > 0) {
      setSelectedSize(sizeVariant.options[0]);
    } else {
      setSelectedSize('');
    }

    const colorVariant = product?.variants?.find((v) => v.name.toLowerCase().includes('color'));
    if (colorVariant && colorVariant.options.length > 0) {
      setSelectedColor(colorVariant.options[0]);
    } else {
      setSelectedColor('');
    }

    setQuantity(1);
    window.scrollTo(0, 0);
  }, [product, slug]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-ink-900">Product Not Found</h2>
        <p className="text-sm text-sand-600">The product you are looking for is not listed or has been archived.</p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 bg-ink-900 text-sand-50 rounded text-xs uppercase font-semibold tracking-wider hover:bg-accent-600 transition-colors"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.category_id);
  const isWished = isInWishlist(product.id);
  const discount = calculateDiscountPercent(product.price, product.compare_at_price);

  const relatedProducts = products
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    const res = addToCart(product, quantity, selectedSize, selectedColor);
    if (res.success) {
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2200);
    }
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    navigate('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Find variant lists
  const sizeVariant = product.variants?.find((v) => v.name.toLowerCase().includes('size'));
  const colorVariant = product.variants?.find((v) => v.name.toLowerCase().includes('color'));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-sand-500">
        <Link to="/" className="hover:text-ink-900 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-ink-900 transition-colors">Catalog</Link>
        <span>/</span>
        {category && (
          <>
            <Link to={`/shop?category=${category.slug}`} className="hover:text-ink-900 transition-colors">
              {category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-ink-900 font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-sand-100 border border-sand-300 shadow-sm">
            <img
              src={selectedImage || product.images?.[0]?.image_url}
              alt={product.title}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {discount && (
              <span className="absolute top-4 left-4 bg-accent-600 text-white text-xs font-bold px-3 py-1 rounded tracking-wide uppercase shadow">
                Save {discount}%
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-md ${
                isWished
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-white/90 text-ink-700 hover:text-rose-600 hover:bg-white'
              }`}
              aria-label="Toggle Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWished ? 'fill-rose-600' : ''}`} />
            </button>
          </div>

          {/* Thumbnails Row */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.image_url)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === img.image_url
                      ? 'border-ink-900 ring-2 ring-ink-900/10'
                      : 'border-sand-300 hover:border-sand-400 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img.image_url} alt={img.alt_text} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-sand-500 uppercase tracking-widest font-semibold mb-2">
              <span>{category?.name || 'VELLA Collection'}</span>
              <span>SKU: {product.sku}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-900 leading-tight">
              {product.title}
            </h1>
          </div>

          {/* Reviews & Stock Status */}
          <div className="flex flex-wrap items-center gap-4 text-sm pb-4 border-b border-sand-200">
            <div className="flex items-center gap-1.5 text-amber-600">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-sand-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-ink-900">{product.rating}</span>
              <span className="text-sand-500">({product.reviews_count} verified ratings)</span>
            </div>

            <span className="text-sand-300">•</span>

            <div>
              {product.stock > 5 ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  In Stock ({product.stock} units ready)
                </span>
              ) : product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-amber-700 font-medium text-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  Limited Allocation: {product.stock} units remaining
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-rose-700 font-medium text-xs">
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  Sold Out
                </span>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-ink-900">
              {formatCurrency(product.price, settings.currency_symbol)}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-lg text-sand-500 line-through">
                {formatCurrency(product.compare_at_price, settings.currency_symbol)}
              </span>
            )}
            {discount && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Save {discount}%
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-sand-800 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Product Variants: Sizes */}
          {sizeVariant && sizeVariant.options.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-ink-800">
                  Select Size:
                </span>
                <span className="text-sand-500 font-medium">{selectedSize}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizeVariant.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSelectedSize(opt)}
                    className={`px-4 py-2 text-xs font-semibold rounded border transition-all ${
                      selectedSize === opt
                        ? 'border-ink-900 bg-ink-900 text-white shadow-xs'
                        : 'border-sand-300 bg-white text-ink-800 hover:border-sand-400'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Variants: Colors */}
          {colorVariant && colorVariant.options.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-ink-800">
                  Select Shade / Finish:
                </span>
                <span className="text-sand-500 font-medium">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {colorVariant.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSelectedColor(opt)}
                    className={`px-4 py-2 text-xs font-medium rounded border transition-all ${
                      selectedColor === opt
                        ? 'border-ink-900 bg-sand-200 text-ink-900 font-semibold'
                        : 'border-sand-300 bg-white text-sand-700 hover:border-sand-400'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Cart Actions */}
          <div className="space-y-4 pt-4 border-t border-sand-200">
            <div className="flex items-center gap-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-ink-800">
                Quantity
              </span>
              <div className="inline-flex items-center border border-sand-300 rounded-lg bg-white overflow-hidden shadow-xs">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || product.stock === 0}
                  className="p-2.5 hover:bg-sand-100 text-ink-700 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-12 text-center text-sm font-semibold text-ink-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock || product.stock === 0}
                  className="p-2.5 hover:bg-sand-100 text-ink-700 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-4 px-6 rounded-lg font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all ${
                  addedToast
                    ? 'bg-emerald-600 text-white'
                    : product.stock === 0
                    ? 'bg-sand-300 text-sand-500 cursor-not-allowed'
                    : 'bg-ink-900 text-sand-50 hover:bg-accent-600 cursor-pointer'
                }`}
              >
                {addedToast ? (
                  <>
                    <Check className="w-4 h-4" />
                    Item Added to Bag
                  </>
                ) : product.stock === 0 ? (
                  'Sold Out'
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="py-4 px-8 bg-accent-600 hover:bg-accent-700 disabled:bg-sand-300 text-white rounded-lg font-semibold text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Buy Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-sand-500">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 hover:text-ink-900 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                {copiedLink ? 'Link Copied to Clipboard!' : 'Share Piece'}
              </button>
              <span>Authenticity Protected</span>
            </div>
          </div>

          {/* Phase 14 Policy Disclosure Card on Product Page */}
          <div className="p-4 bg-sand-100 rounded-xl border border-sand-300 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-ink-900">
              <RotateCcw className="w-4 h-4 text-accent-700 flex-shrink-0" />
              <span>VELLA Replacement Guarantee & Return Terms</span>
            </div>
            <p className="text-sand-700 leading-relaxed font-light">
              Eligible for prompt replacement or statutory remedy if delivered damaged, defective, or incorrect. In accordance with VELLA terms, voluntary change-of-mind returns are not accepted.
            </p>
            <Link to="/returns-policy" className="text-accent-700 underline font-medium block">
              Review our complete Return & Replacement Policy →
            </Link>
          </div>

          {/* Mandatory Insured Shipping Notice */}
          <div className="p-4 bg-white rounded-xl border border-sand-200 text-xs space-y-1">
            <div className="flex items-center gap-2 font-semibold text-ink-900">
              <Truck className="w-4 h-4 text-accent-700" />
              <span>Insured Courier Dispatch: {formatCurrency(settings.standard_shipping_fee, settings.currency_symbol)}</span>
            </div>
            <p className="text-sand-600 text-[11px]">
              Insured priority ground delivery charged on every order to guarantee tamper-proof transit.
            </p>
          </div>

          {/* Structured Details Tabs */}
          <div className="pt-6 border-t border-sand-200">
            <div className="flex space-x-6 border-b border-sand-200">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-3 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                  activeTab === 'description'
                    ? 'border-b-2 border-ink-900 text-ink-900'
                    : 'text-sand-500 hover:text-ink-800'
                }`}
              >
                Craft & Specs
              </button>
              <button
                onClick={() => setActiveTab('policy')}
                className={`pb-3 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                  activeTab === 'policy'
                    ? 'border-b-2 border-ink-900 text-ink-900'
                    : 'text-sand-500 hover:text-ink-800'
                }`}
              >
                Return Policy
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`pb-3 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                  activeTab === 'shipping'
                    ? 'border-b-2 border-ink-900 text-ink-900'
                    : 'text-sand-500 hover:text-ink-800'
                }`}
              >
                Delivery Tariffs
              </button>
            </div>

            <div className="py-4 text-xs sm:text-sm text-sand-700 leading-relaxed font-light">
              {activeTab === 'description' && (
                <div className="space-y-3">
                  <p>{product.description}</p>
                  <p>SKU Identifier: <strong className="font-mono text-ink-900">{product.sku}</strong></p>
                </div>
              )}
              {activeTab === 'policy' && (
                <div className="space-y-2">
                  <p>
                    <strong>No Voluntary Change-of-Mind Returns:</strong> To protect our artisans from speculative returns, we do not accept returns simply because you changed your mind or selected the wrong size where delivered goods match your order.
                  </p>
                  <p>
                    <strong>Defective / Damaged Remedies:</strong> If a parcel arrives damaged or defective, you may submit a claim with photo verification within 48 hours for immediate replacement.
                  </p>
                </div>
              )}
              {activeTab === 'shipping' && (
                <div className="space-y-2">
                  <p>
                    Standard freight fee of {formatCurrency(settings.standard_shipping_fee, settings.currency_symbol)} applies on every order.
                  </p>
                  <p>Dispatched with full tracking and signature confirmation.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-sand-200">
          <div className="mb-8">
            <span className="text-xs uppercase tracking-widest text-accent-700 font-bold block mb-1">
              Complementary Selections
            </span>
            <h2 className="font-serif text-3xl font-bold text-ink-900">
              You May Also Appreciate
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
