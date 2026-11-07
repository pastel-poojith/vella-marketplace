import React, { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { formatCurrency } from '../../lib/utils';

export const FaqPage: React.FC = () => {
  const { settings } = useStore();

  const faqs = [
    {
      q: 'What payment methods does VELLA accept?',
      a: 'We accept 100% verified online payment transactions through our secure gateway. Supported payment instruments include all major Credit and Debit Cards (Visa, Mastercard, RuPay, American Express), UPI (Google Pay, PhonePe, Paytm, BHIM), and Net Banking across all leading financial institutions. In alignment with our strict quality and logistics protocol, Cash on Delivery (COD) is NOT offered.',
    },
    {
      q: 'Why is there a shipping fee on my order?',
      a: `To provide insured priority courier carriage, high-density shock-absorbing packaging, and live airway bill tracking across India, we do not employ artificial price inflation to subsidize "free shipping". A flat standard shipping fee of ${formatCurrency(settings.standard_shipping_fee, settings.currency_symbol)} is transparently applied to every order regardless of cart size.`,
    },
    {
      q: 'What is the Return, Replacement & Refund Policy?',
      a: 'In full accordance with the Consumer Protection (E-Commerce) Rules, 2020 and Consumer Protection Act, 2019, VELLA does not permit returns or cancellations for "change of mind" or buyer remorse once an order has been paid and dispatched. However, if your merchandise arrives damaged in transit, defective, or materially distinct from specifications, you may lodge a claim within 48 hours of delivery for an immediate free replacement.',
    },
    {
      q: 'How do I lodge a replacement claim for a damaged item?',
      a: 'Navigate to our Replacement Claims portal (/claims) or click the link in your Order Confirmation receipt. Select your order, choose the defect category, attach unboxing photographs or video proof, and submit. Our statutory Grievance Officer will acknowledge your claim within 48 hours and coordinate dispatch of a replacement unit.',
    },
    {
      q: 'How does VELLA source and dispatch products?',
      a: 'VELLA operates a certified dropshipping and boutique atelier fulfillment model. We partner directly with verified manufacturing studios across specialized categories (electronics, lifestyle apparel, home decor). Orders are verified on our platform and dispatched directly from the certified studio to eliminate unnecessary intermediary markups.',
    },
    {
      q: 'Can I track my consignment in real time?',
      a: 'Yes. As soon as your parcel is packed and handed to the priority carrier, a unique tracking code (e.g. TRK-...) is issued and linked to your order. You can enter this anytime on our Track Order portal or view it in your Account.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-accent-700 font-bold block">
          Concierge Knowledge Base
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink-900">
          Frequently Inquired Questions
        </h1>
        <p className="text-sm text-sand-700 font-light max-w-xl mx-auto">
          Clear answers regarding payment protocols, mandatory insured shipping, and statutory return/replacement rules.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-xl border border-sand-200 shadow-sm divide-y divide-sand-200">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div key={idx} className="py-4 first:pt-0 last:pb-0">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left font-serif text-lg font-bold text-ink-900 hover:text-accent-700 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-sand-500 transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="pt-3 text-sm text-sand-700 font-light leading-relaxed animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center pt-4">
        <p className="text-xs text-sand-600 mb-3">Still have an inquiry not answered above?</p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 bg-ink-900 hover:bg-accent-600 text-sand-50 rounded text-xs uppercase font-semibold tracking-wider transition-colors"
        >
          Contact Our Concierge Desk
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
