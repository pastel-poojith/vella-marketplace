import React from 'react';
import { useStore } from '../../contexts/StoreContext';
import { formatCurrency } from '../../lib/utils';
import { Truck, ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ShippingPolicyPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-accent-700 font-bold block">
          Logistics & Fulfillment Protocol
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink-900">
          Shipping & Insured Transit Policy
        </h1>
        <p className="text-sm text-sand-700 font-light max-w-xl mx-auto">
          Every acquisition is encased in tamper-evident protective materials and dispatched through licensed priority courier networks with live digital tracking.
        </p>
      </div>

      <div className="bg-white p-8 sm:p-10 rounded-xl border border-sand-200 shadow-sm space-y-8 text-sm text-sand-800 leading-relaxed font-light">
        <div className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-ink-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-accent-700" />
            1. Insured Delivery Fee Structure
          </h2>
          <p>
            To maintain premium packaging integrity, transit insurance, and dedicated handling, {settings.store_name} does not offer promotional free shipping gimmicks. A standard insured shipping charge is applied transparently to every order:
          </p>
          <div className="p-4 bg-sand-50 rounded-lg border border-sand-200 space-y-1">
            <div className="flex items-center justify-between text-ink-900 font-serif font-bold text-base">
              <span>Standard Insured Courier Dispatch</span>
              <span className="text-accent-700">
                {formatCurrency(settings.standard_shipping_fee, settings.currency_symbol)}
              </span>
            </div>
            <p className="text-xs text-sand-600">
              Covers doorstep carriage across India, shock-absorbing inner foam casing, barcode verification, and continuous SMS/email transit tracking.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-6 border-t border-sand-200">
          <h2 className="font-serif text-2xl font-bold text-ink-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent-700" />
            2. Dispatch & Transit Timelines
          </h2>
          <p>
            Upon successful 100% online payment verification (Cards, UPI, Netbanking), order manifests are routed directly to certified partner studios within 24 to 48 business hours:
          </p>
          <ul className="list-disc pl-5 space-y-2 pt-1 text-xs sm:text-sm">
            <li>
              <strong>Metro Destinations:</strong> Expected arrival in 2 to 4 business days post-dispatch.
            </li>
            <li>
              <strong>Tier-2 & Regional Destinations:</strong> Expected arrival in 4 to 6 business days.
            </li>
            <li>
              <strong>Airway Bill (AWB) Notification:</strong> An official tracking reference code (e.g.{' '}
              <span className="font-mono text-ink-900">TRK-IND-...</span>) is generated immediately upon courier handover and transmitted to your registered email address.
            </li>
          </ul>
        </div>

        <div className="space-y-3 pt-6 border-t border-sand-200">
          <h2 className="font-serif text-2xl font-bold text-ink-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            3. 100% Online Payment Requirement (Zero COD)
          </h2>
          <p>
            In order to minimize fraudulent consignments and ensure courier transit safety, <strong>Cash on Delivery (COD) is strictly prohibited</strong>. All orders must be settled in full prior to atelier dispatch via our encrypted online checkout gateway.
          </p>
        </div>

        <div className="space-y-3 pt-6 border-t border-sand-200 bg-amber-50/70 p-5 rounded-xl border border-amber-200">
          <h2 className="font-serif text-lg font-bold text-amber-950 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
            4. Statutory Delivery Inspection (48-Hour Protocol)
          </h2>
          <p className="text-xs text-amber-900 leading-relaxed">
            Please examine the outer tamper-evident seals upon receiving your parcel from the courier representative. If an outer carton appears crushed or pierced, please record a video while unboxing. Transit damage or manufacturing defects must be reported within <strong>48 hours</strong> of courier delivery timestamp through our{' '}
            <Link to="/claims" className="underline font-bold hover:text-ink-900">
              Replacement Claims Portal
            </Link>{' '}
            for immediate free replacement.
          </p>
        </div>
      </div>
    </div>
  );
};
