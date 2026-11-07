import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { Mail, Phone, MapPin, CheckCircle2, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product Inquiries');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-accent-700 font-bold block">
          Client Concierge
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink-900">
          We Are Here to Assist.
        </h1>
        <p className="text-sm text-sand-700 font-light leading-relaxed">
          Whether you require sizing guidance for cashmere knitwear, acoustic driver technical inquiries, or assistance with a current order, our concierge is at your disposal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Sidebar */}
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-xl border border-sand-200 shadow-sm space-y-4 text-xs">
            <h3 className="font-serif text-lg font-bold text-ink-900 border-b border-sand-200 pb-2">
              Concierge Desk
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-accent-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ink-900">Direct Dispatch Email</p>
                  <p className="text-sand-600 font-mono">{settings.contact_email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-accent-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ink-900">Telephone Line</p>
                  <p className="text-sand-600 font-mono">{settings.contact_phone}</p>
                  <p className="text-[10px] text-sand-500">Mon - Fri: 9:00 AM - 6:00 PM PST</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ink-900">Atelier & Studio Gallery</p>
                  <p className="text-sand-600">{settings.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <div className="p-6 sm:p-8 bg-white rounded-xl border border-sand-200 shadow-sm">
            {submitted ? (
              <div className="p-8 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-serif text-2xl font-bold text-ink-900">Message Dispatched</h3>
                <p className="text-sm text-sand-700 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. A dedicated concierge specialist will review your inquiry and reply within one business day.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-ink-900 text-sand-50 rounded text-xs uppercase font-semibold tracking-wider"
                >
                  Submit Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase font-semibold text-sand-600 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-sm text-ink-900 focus:outline-none focus:border-accent-500"
                    />
                  </div>

                  <div>
                    <label className="block uppercase font-semibold text-sand-600 mb-1">
                      Your Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="elena@example.com"
                      className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-sm text-ink-900 focus:outline-none focus:border-accent-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase font-semibold text-sand-600 mb-1">
                    Nature of Inquiry
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-sm text-ink-900 focus:outline-none focus:border-accent-500"
                  >
                    <option value="Product Inquiries">Product Inquiries & Specifications</option>
                    <option value="Order Status">Order Status & Tracking</option>
                    <option value="Returns & Exchanges">Returns & Warranty Exchanges</option>
                    <option value="Bespoke Studio Partnerships">Bespoke Studio Partnerships</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase font-semibold text-sand-600 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry in detail..."
                    className="w-full bg-sand-50 border border-sand-300 rounded p-3 text-sm text-ink-900 focus:outline-none focus:border-accent-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-ink-900 hover:bg-accent-600 text-sand-50 rounded text-xs uppercase font-semibold tracking-wider transition-colors shadow flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Transmit Inquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
