import React from 'react';
import { useStore } from '../../contexts/StoreContext';

export const PrivacyPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-accent-700 font-bold block">
          Client Data Integrity
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink-900">
          Privacy Policy
        </h1>
        <p className="text-xs text-sand-500">Effective Date: November 2026</p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-sand-200 shadow-sm space-y-6 text-sm text-sand-800 leading-relaxed font-light">
        <div className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-ink-900">1. Information Collection & Use</h2>
          <p>
            {settings.store_name} collects personal identifiers strictly necessary to execute acquisition orders, arrange white-glove transport, and manage warranty services. This includes customer name, shipping destination, 6-digit PIN code, email address, and phone number.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-ink-900">2. Supabase Infrastructure & Security</h2>
          <p>
            Customer profiles and encrypted credentials are stored within Supabase PostgreSQL clusters with Row Level Security (RLS) strictly enforced. We never sell, lease, or monetize your contact details to third-party marketing brokers.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-ink-900">3. Payment Information Security</h2>
          <p>
            Payment transactions processed via online gateways are encrypted using TLS 1.3 standards. Credit card numbers, CVVs, and banking passwords never touch or persist on our web servers. All payment transactions are handled through certified PCI-DSS compliant online payment gateways.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-ink-900">4. Grievance Redressal & Patron Rights</h2>
          <p>
            You possess the permanent right to request full export or deletion of your patron profile by transmitting a notice to our compliance desk at <strong>{settings.contact_email}</strong> or to our designated Grievance Officer at <strong>{settings.grievance_officer_email}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
