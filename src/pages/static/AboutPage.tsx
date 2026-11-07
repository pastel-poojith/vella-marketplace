import React from 'react';
import { useStore } from '../../contexts/StoreContext';
import { Award, Compass, ShieldCheck, HeartHandshake } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Editorial Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-accent-700 font-bold block">
          Our Heritage & Provenance
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-ink-900 leading-tight">
          The Philosophy of Quiet Elegance.
        </h1>
        <p className="text-base sm:text-lg text-sand-700 font-light leading-relaxed">
          Founded in 2024, {settings.store_name} emerged from an uncompromising conviction: that the objects we invite into our everyday rituals should endure long after fleeting industrial trends have dissolved.
        </p>
      </div>

      {/* Visual Showcase */}
      <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-xl border border-sand-300">
        <img
          src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1600&q=80"
          alt="VELLA Curated Atmosphere"
          className="w-full h-full object-cover filter contrast-105"
        />
      </div>

      {/* Narrative Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm text-sand-800 leading-relaxed font-light">
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-ink-900">
            A Trilogy of Curated Disciplines
          </h2>
          <p>
            Rather than accumulating countless generic consumer goods, {settings.store_name} restricts its focus strictly to three harmonious pillars of modern taste: <strong>Electronics & Acoustic Engineering</strong>, <strong>Textile & Leather Fashion</strong>, and <strong>Home Living & Ceramics</strong>.
          </p>
          <p>
            By working exclusively with specialized workshops across Germany, Italy, and Japan, each SKU undergoes rigorous acoustic calibration, yarn density verification, or kiln temperature inspection.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-ink-900">
            Ethical Direct-to-Patron Fulfillment
          </h2>
          <p>
            We operate on a transparent direct-to-artisan model. When you acquire a piece from our gallery, our partnered studio is compensated fairly, preserving multi-generational craft legacies while avoiding speculative overproduction waste.
          </p>
          <p>
            Every order is dispatched in eco-conscious fiberboard packaging, verified by hand, and backed by a comprehensive {settings.return_policy_days}-day complimentary return privilege.
          </p>
        </div>
      </div>

      {/* Principles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-sand-200">
        <div className="p-6 bg-white rounded-xl border border-sand-200 shadow-xs space-y-3">
          <Award className="w-6 h-6 text-accent-700" />
          <h3 className="font-serif text-lg font-bold text-ink-900">Verified Craft</h3>
          <p className="text-xs text-sand-600 leading-relaxed">
            Every studio partner is vetted for certified materials and humane labor conditions.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-sand-200 shadow-xs space-y-3">
          <Compass className="w-6 h-6 text-accent-700" />
          <h3 className="font-serif text-lg font-bold text-ink-900">Enduring Form</h3>
          <p className="text-xs text-sand-600 leading-relaxed">
            Designed to age with character. Leather develops rich patinas; ceramics deepen in warmth.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-sand-200 shadow-xs space-y-3">
          <ShieldCheck className="w-6 h-6 text-accent-700" />
          <h3 className="font-serif text-lg font-bold text-ink-900">Lifetime Support</h3>
          <p className="text-xs text-sand-600 leading-relaxed">
            Dedicated concierge support available 7 days a week for repairs, sizing, and guidance.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-sand-200 shadow-xs space-y-3">
          <HeartHandshake className="w-6 h-6 text-accent-700" />
          <h3 className="font-serif text-lg font-bold text-ink-900">Fair Ecosystem</h3>
          <p className="text-xs text-sand-600 leading-relaxed">
            Sustainable profit margins shared directly with master technicians and weavers.
          </p>
        </div>
      </div>
    </div>
  );
};
