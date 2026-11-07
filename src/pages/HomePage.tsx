import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Award, Shield, Compass, Lock, RefreshCw, Truck, PlusCircle } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { useAuth } from '../contexts/AuthContext';
import { ProductCard } from '../components/product/ProductCard';
import heroModelPhoto from '../assets/images/vella_fashion_hero_1794032655872.jpg';

export const HomePage: React.FC = () => {
  const { categories, products, settings } = useStore();
  const { isAdmin } = useAuth();

  // Small, curated selection of genuine products only when available (max 4, never overcrowded)
  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 4);

  return (
    <div className="space-y-24 pb-20">
      {/* Large Premium Advertising Hero Section featuring Editorial Fashion Model */}
      <section className="relative overflow-hidden bg-sand-200 border-b border-sand-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-6 space-y-6 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-ink-900 text-sand-100 text-xs tracking-widest uppercase font-semibold rounded-full shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-accent-400" />
                VELLA Haute Living & Curation
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-ink-900 leading-[1.05]">
                Quiet Luxury. Measured Form.
              </h1>

              <p className="text-base sm:text-lg text-ink-800 leading-relaxed font-light max-w-xl">
                Experience an uncompromising international marketplace bridging pure textile tailoring, acoustic engineering, and hand-finished ceramic homeware.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/shop"
                  className="px-8 py-4 bg-ink-900 hover:bg-accent-600 text-sand-50 text-xs font-semibold tracking-widest uppercase rounded shadow-lg transition-all flex items-center gap-2 group"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/about"
                  className="px-8 py-4 bg-white/90 hover:bg-white text-ink-900 border border-sand-300 text-xs font-semibold tracking-widest uppercase rounded shadow-xs transition-all"
                >
                  Brand Manifesto
                </Link>
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-sand-300 text-xs text-sand-800">
                <div>
                  <p className="font-serif font-bold text-lg text-ink-900">Direct Sourced</p>
                  <p className="text-[11px] text-sand-600">Verified Artisan Studios</p>
                </div>
                <div>
                  <p className="font-serif font-bold text-lg text-ink-900">100% Online</p>
                  <p className="text-[11px] text-sand-600">Secure Indian Gateways</p>
                </div>
                <div>
                  <p className="font-serif font-bold text-lg text-ink-900">Compliant</p>
                  <p className="text-[11px] text-sand-600">Consumer Protection 2019</p>
                </div>
              </div>
            </div>

            {/* Right Large Commercial Fashion Photograph */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 group">
                <img
                  src={heroModelPhoto}
                  alt="VELLA Luxury Fashion Campaign Model"
                  className="w-full h-full object-cover object-top filter contrast-[1.03] group-hover:scale-102 transition-transform duration-700 ease-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent pointer-events-none" />

                {/* Editorial Monogram Plaque */}
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/95 backdrop-blur-md rounded-xl border border-sand-200 shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-accent-700">
                      Campaign Edition
                    </span>
                    <p className="font-serif text-lg font-bold text-ink-900 leading-snug">
                      The Minimalist Tailored Silhouette
                    </p>
                    <p className="text-xs text-sand-600">Curated by {settings.store_name} Design Direction</p>
                  </div>
                  <Link
                    to="/shop?category=fashion"
                    className="p-2.5 bg-ink-900 text-white rounded-lg hover:bg-accent-600 transition-colors shadow-xs"
                    aria-label="Explore Fashion"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carefully Designed Category Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-accent-700 font-bold block mb-1">
              Curated Departments
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-900">
              Explore by Discipline
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold uppercase tracking-wider text-ink-900 hover:text-accent-600 inline-flex items-center gap-1.5 transition-colors group"
          >
            All Collections
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group relative h-96 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-sand-300"
            >
              <img
                src={cat.image_url}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-sand-50 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-accent-300 font-semibold">
                  Department
                </span>
                <h3 className="font-serif text-2xl font-bold">{cat.name}</h3>
                <p className="text-xs text-sand-200 line-clamp-2 font-light leading-relaxed">
                  {cat.description}
                </p>
                <div className="pt-2 flex items-center text-xs font-semibold text-accent-200 group-hover:text-white transition-colors gap-1">
                  Discover Discipline
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Limited Featured Products (Carefully curated, not overcrowded) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-accent-700 font-bold block mb-1">
              Curator's Edit
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-900">
              Featured Gallery
            </h2>
          </div>
          {products.length > 0 && (
            <Link
              to="/shop"
              className="text-xs font-semibold uppercase tracking-wider text-ink-900 hover:text-accent-600 inline-flex items-center gap-1.5 transition-colors group"
            >
              View entire catalog
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Phase 9 Compliant: If genuine products exist, show small curated selection. Otherwise show professional empty state. */}
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 sm:p-16 rounded-2xl border border-sand-300 text-center space-y-4 shadow-xs max-w-3xl mx-auto">
            <Compass className="w-12 h-12 text-sand-400 mx-auto" />
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900">
              Upcoming Seasonal Capsule in Curation
            </h3>
            <p className="text-sm text-sand-700 font-light leading-relaxed max-w-lg mx-auto">
              {settings.store_name} curates small-batch dropshipping releases directly from certified artisan studios. Our autumn-winter collection is currently undergoing final quality inspection.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/shop"
                className="px-6 py-2.5 bg-sand-200 hover:bg-sand-300 text-ink-900 rounded text-xs uppercase font-semibold tracking-wider transition-colors"
              >
                Browse Departments
              </Link>
              {isAdmin && (
                <Link
                  to="/admin/products"
                  className="px-6 py-2.5 bg-ink-900 hover:bg-accent-600 text-sand-50 rounded text-xs uppercase font-semibold tracking-wider transition-colors flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Add Genuine Product in Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Why Choose VELLA Section */}
      <section className="bg-sand-100 border-y border-sand-300 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest text-accent-700 font-bold block">
              The VELLA Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-ink-900">
              Why Discerning Clients Choose VELLA
            </h2>
            <p className="text-sm text-sand-700 font-light">
              Crafted for long-term ownership, complete transparency, and lawful consumer protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl border border-sand-200 shadow-xs space-y-3">
              <Award className="w-8 h-8 text-accent-700" />
              <h3 className="font-serif text-xl font-bold text-ink-900">Artisanal Provenance</h3>
              <p className="text-xs text-sand-600 leading-relaxed font-light">
                Direct manufacturer partnerships ensuring genuine materials, certified wool grades, and precision acoustic calibration.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-sand-200 shadow-xs space-y-3">
              <Truck className="w-8 h-8 text-accent-700" />
              <h3 className="font-serif text-xl font-bold text-ink-900">Reinforced Freight</h3>
              <p className="text-xs text-sand-600 leading-relaxed font-light">
                Mandatory priority carrier dispatch with tamper-evident seal boxes. Fully tracked to your doorstep.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-sand-200 shadow-xs space-y-3">
              <RefreshCw className="w-8 h-8 text-accent-700" />
              <h3 className="font-serif text-xl font-bold text-ink-900">Replacement Security</h3>
              <p className="text-xs text-sand-600 leading-relaxed font-light">
                Statutory protection against damaged or defective arrivals with dedicated photo-verified claim processing.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-sand-200 shadow-xs space-y-3">
              <Lock className="w-8 h-8 text-accent-700" />
              <h3 className="font-serif text-xl font-bold text-ink-900">100% Online Gateways</h3>
              <p className="text-xs text-sand-600 leading-relaxed font-light">
                Eliminating cash ambiguity. All transactions are securely audited via licensed Indian banking networks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Trust & Statutory Compliance Notice */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="p-8 bg-white rounded-2xl border border-sand-300 shadow-sm space-y-4">
          <Shield className="w-8 h-8 text-emerald-700 mx-auto" />
          <h3 className="font-serif text-2xl font-bold text-ink-900">
            Consumer Rights & Legal Governance Notice
          </h3>
          <p className="text-xs sm:text-sm text-sand-700 font-light leading-relaxed max-w-2xl mx-auto">
            {settings.store_name} operates in strict compliance with the <strong>Indian Consumer Protection Act, 2019</strong> and the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>. We uphold mandatory replacements and lawful remedies for damaged or non-conforming items while maintaining a disciplined no-change-of-mind policy.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-sand-600 font-medium">
            <span>Grievance Officer: <strong>{settings.grievance_officer_name}</strong></span>
            <span>•</span>
            <Link to="/returns-policy" className="text-accent-700 hover:underline">
              Read Complete Policy
            </Link>
            <span>•</span>
            <Link to="/contact" className="text-accent-700 hover:underline">
              Contact Concierge
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
