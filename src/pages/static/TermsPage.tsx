import React from 'react';
import { useStore } from '../../contexts/StoreContext';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-accent-700 font-bold block">
          Legal Agreement & Code of Commerce
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink-900">
          Terms & Conditions of Service
        </h1>
        <p className="text-xs text-sand-500">Effective Date: November 2026</p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-sand-200 shadow-sm space-y-6 text-sm text-sand-800 leading-relaxed font-light">
        <div className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-ink-900">1. Acceptance of Terms</h2>
          <p>
            By visiting or completing an acquisition through the {settings.store_name} marketplace, you agree to be bound by these Terms of Service, the Return & Replacement Policy, and all applicable statutory regulations under the <strong>Consumer Protection Act, 2019</strong> and the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-ink-900">2. Online Payment & Order Confirmation</h2>
          <p>
            All orders require 100% verified settlement through our certified online payment gateways before consignment dispatch. Cash on Delivery (COD) is strictly prohibited across the marketplace. An order is deemed accepted only once the payment gateway issues a valid transaction authorization.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-ink-900">3. Shipping & Insured Delivery Charges</h2>
          <p>
            A mandatory standard insured shipping fee is levied on every transaction to ensure shockproof packaging, courier transit insurance, and tamper-evident sealing. Free shipping is not provided under any order value threshold.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-ink-900">4. Return & Replacement Policy</h2>
          <p>
            In accordance with Rule 5 of the Consumer Protection (E-Commerce) Rules, 2020, {settings.store_name} does not offer returns for change of mind. If an item arrives damaged in transit or displays verifiable manufacturing defects, a replacement claim must be lodged within <strong>48 hours</strong> of delivery through our{' '}
            <Link to="/claims" className="text-accent-700 underline font-semibold">
              Claims Portal
            </Link>
            .
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-ink-900">5. Grievance Redressal Mechanism</h2>
          <p>
            In compliance with the Consumer Protection (E-Commerce) Rules, 2020, any consumer grievances may be directed to our designated Grievance Officer: <strong>{settings.grievance_officer_name}</strong> at <span className="font-mono text-ink-900">{settings.grievance_officer_email}</span>, who will acknowledge receipt within 48 hours and resolve the dispute within 30 days.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-ink-900">6. Applicable Law & Jurisdiction</h2>
          <p>
            These terms are governed by and construed in accordance with the laws of India. Any legal dispute or proceeding arising out of or in connection with this agreement shall be subject to the exclusive jurisdiction of the competent courts of India.
          </p>
        </div>
      </div>
    </div>
  );
};
