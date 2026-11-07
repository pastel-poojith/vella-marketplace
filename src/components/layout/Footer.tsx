import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { ArrowRight, CheckCircle2, ShieldCheck, Truck, RefreshCw, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, categories } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-sand-100 border-t border-sand-200 text-ink-800">
      {/* Value Badges Banner */}
      <div className="border-b border-sand-200 py-8 bg-sand-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Truck className="w-6 h-6 text-accent-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-ink-900">Trackable Express Shipping</p>
                <p className="text-xs text-sand-600">Dispatched with verified priority courier partners</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <RefreshCw className="w-6 h-6 text-accent-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-ink-900">Protected Replacement Policy</p>
                <p className="text-xs text-sand-600">Statutory remedies for damaged or defective arrivals</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <ShieldCheck className="w-6 h-6 text-accent-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-ink-900">100% Genuine Studio Origin</p>
                <p className="text-xs text-sand-600">Strictly authenticated artisanal supply lines</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Lock className="w-6 h-6 text-accent-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-ink-900">100% Secure Online Payments</p>
                <p className="text-xs text-sand-600">Encrypted UPI, Cards, and Netbanking gateways</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Legal Entity Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl font-bold tracking-widest text-ink-900">
                {settings.store_name}
              </span>
            </Link>
            <p className="text-sm text-sand-700 max-w-sm leading-relaxed font-light">
              A premium multi-category marketplace curating heirloom textile garments, bespoke acoustic hardware, and artisanal living objects.
            </p>
            <div className="text-xs text-sand-600 space-y-1 pt-2">
              <p className="font-semibold text-ink-900">{settings.address}</p>
              <p>Customer Support: <span className="font-mono text-ink-900">{settings.contact_email}</span></p>
              <p>Helpline: <span className="font-mono text-ink-900">{settings.contact_phone}</span></p>
            </div>

            {/* Grievance Officer Disclosure under Consumer Protection (E-Commerce) Rules 2020 */}
            <div className="p-3 bg-white/70 border border-sand-300 rounded-lg text-[11px] text-sand-700 space-y-1">
              <p className="font-bold text-ink-900 uppercase tracking-wider text-[10px]">
                Statutory Grievance Redressal Officer
              </p>
              <p>Officer: <strong className="text-ink-900">{settings.grievance_officer_name}</strong></p>
              <p>Email: <span className="font-mono text-accent-700">{settings.grievance_officer_email}</span></p>
              <p className="text-[10px] text-sand-500">
                Acknowledgment within 48h • Redressal within 30 days under Indian Consumer Protection Act, 2019.
              </p>
            </div>
          </div>

          {/* Department Categories */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-ink-900 mb-4">
              Catalog
            </h4>
            <ul className="space-y-2.5 text-sm text-sand-700">
              <li>
                <Link to="/shop" className="hover:text-accent-600 transition-colors">
                  All Collections
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/shop?category=${c.slug}`}
                    className="hover:text-accent-600 transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care & Legal Policies */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-ink-900 mb-4">
              Concierge & Policies
            </h4>
            <ul className="space-y-2.5 text-sm text-sand-700">
              <li>
                <Link to="/track-order" className="hover:text-accent-600 transition-colors">
                  Track Consignment
                </Link>
              </li>
              <li>
                <Link to="/returns-policy" className="hover:text-accent-600 transition-colors font-medium text-ink-900">
                  Return & Replacement Policy
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-accent-600 transition-colors">
                  Shipping Terms & Tariffs
                </Link>
              </li>
              <li>
                <Link to="/claims" className="hover:text-accent-600 transition-colors">
                  Damaged / Wrong Item Claims
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-accent-600 transition-colors">
                  Frequently Asked
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-accent-600 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-ink-900 mb-4">
              The Gazette
            </h4>
            <p className="text-xs text-sand-700 mb-3 leading-relaxed font-light">
              Private previews for upcoming dropshipping arrivals, artisan interviews, and seasonal releases.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Subscribed to seasonal bulletins.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full bg-white border border-sand-300 rounded px-3 py-2 text-xs text-ink-900 placeholder:text-sand-400 focus:outline-none focus:border-accent-500"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="absolute right-1 top-1 bottom-1 px-2.5 bg-ink-900 text-sand-100 hover:bg-accent-600 rounded text-xs flex items-center justify-center transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-sand-500">Strictly confidential. No promotional spam.</p>
              </form>
            )}

            {/* Social media links */}
            <div className="pt-4 space-y-1.5">
              <p className="text-[10px] uppercase font-bold text-sand-600 tracking-wider">Follow Curations</p>
              <div className="flex items-center gap-3 text-xs text-sand-700">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-ink-900">Instagram</a>
                <span>•</span>
                <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-ink-900">Pinterest</a>
                <span>•</span>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-ink-900">X (Twitter)</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Statutory Note */}
        <div className="mt-12 pt-8 border-t border-sand-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sand-600">
          <p>© {new Date().getFullYear()} {settings.store_name} E-Commerce Pvt. Ltd. Compliant with Indian Consumer Protection Act 2019.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link to="/returns-policy" className="hover:text-ink-900 transition-colors">
              Return & Replacement Policy
            </Link>
            <Link to="/privacy" className="hover:text-ink-900 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-ink-900 transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/about" className="hover:text-ink-900 transition-colors">
              About Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
