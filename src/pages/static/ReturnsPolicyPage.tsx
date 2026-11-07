import React from 'react';
import { useStore } from '../../contexts/StoreContext';
import { ShieldAlert, RefreshCw, Clock, CheckCircle2, AlertOctagon, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ReturnsPolicyPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Title Header */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-accent-700 font-bold block">
          Statutory Compliance Notice
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink-900">
          Return, Replacement & Refund Policy
        </h1>
        <p className="text-sm text-sand-700 font-light max-w-xl mx-auto">
          Formulated pursuant to the <strong>Consumer Protection Act, 2019</strong> and the{' '}
          <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>.
        </p>
      </div>

      {/* Main Policy Body */}
      <div className="bg-white p-8 sm:p-10 rounded-xl border border-sand-200 shadow-sm space-y-8 text-sm text-sand-800 leading-relaxed font-light">
        {/* Section 1: No Change-of-Mind Returns */}
        <div className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-ink-900 flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-600 flex-shrink-0" />
            1. Strict Prohibition of "Change of Mind" Returns
          </h2>
          <p>
            At {settings.store_name}, every acquisition is custom curated, quality-inspected, and individually prepared by certified artisan studios. In accordance with e-commerce regulations for limited-run luxury and specialty goods:
          </p>
          <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-lg text-rose-950 font-medium text-xs leading-normal">
            Orders once verified, paid, and dispatched are final. We <strong>do NOT</strong> accept returns, cancellations, or exchanges based on subjective preference, buyer remorse, aesthetic second thoughts, or change of mind.
          </div>
        </div>

        {/* Section 2: Replacement for Transit Damage or Manufacturing Defects */}
        <div className="space-y-3 pt-6 border-t border-sand-200">
          <h2 className="font-serif text-2xl font-bold text-ink-900 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-accent-700 flex-shrink-0" />
            2. Replacement Protocol for Damaged or Defective Items
          </h2>
          <p>
            We guarantee that every product arrives in flawless factory specification. If a consignment arrives compromised, you are legally entitled to an immediate, <strong>free replacement</strong> under the following verifiable conditions:
          </p>
          <ul className="list-disc pl-5 space-y-2 pt-1 text-xs sm:text-sm">
            <li>
              <strong>Damaged in Transit:</strong> The exterior carton or interior merchandise suffered physical breakage, impact fracture, or tearing during courier carriage.
            </li>
            <li>
              <strong>Manufacturing Defect:</strong> The item displays internal mechanical, electrical, or structural flaws rendering it unfit for designated use.
            </li>
            <li>
              <strong>Incorrect Fulfillment:</strong> The parcel contains a product, size, or color materially distinct from your invoice manifest.
            </li>
          </ul>
        </div>

        {/* Section 3: 48-Hour Reporting Protocol */}
        <div className="space-y-3 pt-6 border-t border-sand-200">
          <h2 className="font-serif text-2xl font-bold text-ink-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent-700 flex-shrink-0" />
            3. Mandatory 48-Hour Inspection & Evidence Window
          </h2>
          <p>
            To establish carrier liability and initiate studio redressal, the recipient must file a claim within <strong>48 hours</strong> of carrier delivery timestamp confirmation:
          </p>
          <ol className="list-decimal pl-5 space-y-2 pt-1 text-xs sm:text-sm">
            <li>
              Retain all original presentation packaging, airway bills, tags, protective dust covers, and accessories.
            </li>
            <li>
              Record a clear continuous unboxing video or take high-resolution photographs illustrating the courier packaging defect alongside the barcode label.
            </li>
            <li>
              Submit the claim directly through our online{' '}
              <Link to="/claims" className="text-accent-700 font-bold underline hover:text-ink-900">
                Replacement Claims Portal
              </Link>{' '}
              to generate a unique dispute tracking reference (<code className="font-mono text-xs bg-sand-100 px-1 py-0.5 rounded">CLM-XXXXX</code>).
            </li>
          </ol>
        </div>

        {/* Section 4: Refund Circumstances */}
        <div className="space-y-3 pt-6 border-t border-sand-200">
          <h2 className="font-serif text-2xl font-bold text-ink-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-accent-700 flex-shrink-0" />
            4. Refund Execution Framework
          </h2>
          <p>
            A monetary refund is executed <strong>exclusively</strong> if:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 pt-1 text-xs sm:text-sm">
            <li>An approved damaged or defective item cannot be replaced due to permanent inventory exhaustion at the supplier atelier.</li>
            <li>The order is cancelled prior to courier dispatch by mutual administrative confirmation.</li>
          </ul>
          <p className="pt-2 text-xs text-sand-600">
            Approved refunds are remitted strictly back to the original source payment instrument (credit/debit card, net banking, UPI) within 5 to 7 banking business days. No cash payouts or alternative third-party accounts are permitted.
          </p>
        </div>

        {/* Section 5: Statutory Grievance Redressal Officer */}
        <div className="space-y-4 pt-6 border-t border-sand-200 bg-sand-50 p-6 rounded-xl border border-sand-300">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-ink-900" />
            <h2 className="font-serif text-xl font-bold text-ink-900">
              5. Statutory Grievance Redressal Officer
            </h2>
          </div>
          <p className="text-xs text-sand-700 leading-relaxed">
            In compliance with Rule 4(4) and Rule 5(3)(e) of the Consumer Protection (E-Commerce) Rules, 2020, the designated Grievance Officer details are published below:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="bg-white p-3 rounded-lg border border-sand-200">
              <span className="text-sand-500 uppercase font-semibold text-[10px] block">
                Designated Officer
              </span>
              <span className="font-bold text-ink-900 text-sm">
                {settings.grievance_officer_name}
              </span>
              <span className="text-sand-600 block text-[11px]">Nodal Officer for Consumer Affairs</span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-sand-200">
              <span className="text-sand-500 uppercase font-semibold text-[10px] block">
                Electronic Contact
              </span>
              <a
                href={`mailto:${settings.grievance_officer_email}`}
                className="font-mono text-accent-700 font-semibold hover:underline"
              >
                {settings.grievance_officer_email}
              </a>
              <span className="text-sand-600 block text-[11px] pt-0.5">
                Tel: {settings.grievance_officer_phone}
              </span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-sand-200 sm:col-span-2">
              <span className="text-sand-500 uppercase font-semibold text-[10px] block">
                Official Redressal Address
              </span>
              <span className="text-ink-900 font-medium">{settings.grievance_officer_address}</span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-sand-600 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-accent-700 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Statutory Service Level Agreement:</strong> The Grievance Officer shall acknowledge receipt of any consumer grievance within <strong>48 hours</strong> and redressed completely within <strong>1 month (30 calendar days)</strong> from the date of receipt.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-6 border-t border-sand-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-sand-600">
            Received a consignment requiring immediate studio replacement?
          </p>
          <Link
            to="/claims"
            className="px-6 py-3 bg-ink-900 hover:bg-accent-600 text-sand-50 rounded text-xs uppercase font-semibold tracking-wider transition-colors shadow-xs"
          >
            Submit Defect / Transit Claim
          </Link>
        </div>
      </div>
    </div>
  );
};
