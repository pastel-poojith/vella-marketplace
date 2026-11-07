import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { AdminLayout } from './AdminLayout';
import { Check, Settings, CreditCard, Bell, Truck, ShieldCheck } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useStore();

  const [storeName, setStoreName] = useState(settings.store_name);
  const [contactEmail, setContactEmail] = useState(settings.contact_email);
  const [contactPhone, setContactPhone] = useState(settings.contact_phone);
  const [address, setAddress] = useState(settings.address);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currency_symbol);
  const [taxRate, setTaxRate] = useState(settings.tax_rate_percent);
  const [standardShipping, setStandardShipping] = useState(settings.standard_shipping_fee);
  const [razorpayEnabled, setRazorpayEnabled] = useState(settings.razorpay_enabled);
  const [razorpayKeyId, setRazorpayKeyId] = useState(settings.razorpay_key_id);
  const [announcementText, setAnnouncementText] = useState(settings.announcement_bar_text);
  const [announcementEnabled, setAnnouncementEnabled] = useState(settings.announcement_bar_enabled);
  const [returnDays, setReturnDays] = useState(settings.return_policy_days);

  // Statutory Grievance Officer under Consumer Protection (E-Commerce) Rules 2020
  const [grievanceOfficerName, setGrievanceOfficerName] = useState(settings.grievance_officer_name);
  const [grievanceOfficerEmail, setGrievanceOfficerEmail] = useState(settings.grievance_officer_email);
  const [grievanceOfficerPhone, setGrievanceOfficerPhone] = useState(settings.grievance_officer_phone);
  const [grievanceOfficerAddress, setGrievanceOfficerAddress] = useState(settings.grievance_officer_address);

  const [saveToast, setSaveToast] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      store_name: storeName,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      address,
      currency_symbol: currencySymbol,
      tax_rate_percent: Number(taxRate),
      standard_shipping_fee: Number(standardShipping),
      free_shipping_threshold: 0, // Enforce zero free shipping threshold
      cod_enabled: false, // Strict mandatory COD removal
      razorpay_enabled: razorpayEnabled,
      razorpay_key_id: razorpayKeyId,
      announcement_bar_text: announcementText,
      announcement_bar_enabled: announcementEnabled,
      return_policy_days: Number(returnDays),
      grievance_officer_name: grievanceOfficerName,
      grievance_officer_email: grievanceOfficerEmail,
      grievance_officer_phone: grievanceOfficerPhone,
      grievance_officer_address: grievanceOfficerAddress,
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <AdminLayout>
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-sand-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-sand-200">
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink-900">
              Storefront Governance & Settings
            </h2>
            <p className="text-xs text-sand-500">
              Configure corporate identity, statutory grievance disclosures, mandatory shipping fees, and online payment gateways.
            </p>
          </div>
          {saveToast && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-semibold">
              <Check className="w-4 h-4 text-emerald-600" />
              Settings Synced
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-8 text-xs">
          {/* Section 1: Store Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-bold text-ink-900 flex items-center gap-2">
              <Settings className="w-4 h-4 text-accent-700" />
              1. Brand Identity & Official Concierge
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block uppercase font-semibold text-sand-600 mb-1">Store Name</label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-sm text-ink-900 font-serif font-bold"
                />
              </div>

              <div>
                <label className="block uppercase font-semibold text-sand-600 mb-1">Currency Symbol</label>
                <input
                  type="text"
                  required
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900 font-bold"
                />
              </div>

              <div>
                <label className="block uppercase font-semibold text-sand-600 mb-1">Official Contact Email</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900"
                />
              </div>

              <div>
                <label className="block uppercase font-semibold text-sand-600 mb-1">Concierge Telephone</label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block uppercase font-semibold text-sand-600 mb-1">Headquarters Registered Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Statutory Grievance Redressal (Mandatory under Indian E-Commerce Rules 2020) */}
          <div className="space-y-4 pt-6 border-t border-sand-200">
            <h3 className="font-serif text-base font-bold text-ink-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              2. Statutory Grievance Redressal Officer (Consumer Protection Rules 2020)
            </h3>
            <p className="text-[11px] text-sand-500">
              Mandatory disclosure of name, electronic contact, and office address of the grievance officer who acknowledges complaints within 48 hours and disposes them within 30 days.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block uppercase font-semibold text-sand-600 mb-1">
                  Grievance Officer Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={grievanceOfficerName}
                  onChange={(e) => setGrievanceOfficerName(e.target.value)}
                  className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900 font-semibold"
                />
              </div>

              <div>
                <label className="block uppercase font-semibold text-sand-600 mb-1">
                  Grievance Electronic Mail *
                </label>
                <input
                  type="email"
                  required
                  value={grievanceOfficerEmail}
                  onChange={(e) => setGrievanceOfficerEmail(e.target.value)}
                  className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900 font-mono"
                />
              </div>

              <div>
                <label className="block uppercase font-semibold text-sand-600 mb-1">
                  Grievance Redressal Telephone *
                </label>
                <input
                  type="tel"
                  required
                  value={grievanceOfficerPhone}
                  onChange={(e) => setGrievanceOfficerPhone(e.target.value)}
                  className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900"
                />
              </div>

              <div>
                <label className="block uppercase font-semibold text-sand-600 mb-1">
                  Transit Claim Window (Days) *
                </label>
                <input
                  type="number"
                  required
                  value={returnDays}
                  onChange={(e) => setReturnDays(Number(e.target.value))}
                  className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block uppercase font-semibold text-sand-600 mb-1">
                  Grievance Officer Physical Redressal Address *
                </label>
                <input
                  type="text"
                  required
                  value={grievanceOfficerAddress}
                  onChange={(e) => setGrievanceOfficerAddress(e.target.value)}
                  className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Shipping & Logistics */}
          <div className="space-y-4 pt-6 border-t border-sand-200">
            <h3 className="font-serif text-base font-bold text-ink-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-accent-700" />
              3. Insured Shipping Fees & Taxation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block uppercase font-semibold text-sand-600 mb-1">
                  Standard Flat Shipping Fee ({currencySymbol}) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={standardShipping}
                  onChange={(e) => setStandardShipping(Number(e.target.value))}
                  className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900 font-bold"
                />
                <p className="text-[10px] text-amber-700 mt-1">
                  * Note: In accordance with Phase 4 rules, free shipping is prohibited. Every customer pays this fee.
                </p>
              </div>

              <div>
                <label className="block uppercase font-semibold text-sand-600 mb-1">
                  Applicable GST / Sales Tax Rate (%) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Payment Gateways (Strictly Online, Zero COD) */}
          <div className="space-y-4 pt-6 border-t border-sand-200">
            <h3 className="font-serif text-base font-bold text-ink-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-accent-700" />
              4. Payment Gateway Settings (Online Only — Zero COD)
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-sand-50 rounded-lg border border-sand-200 flex items-start gap-3">
                <input
                  type="checkbox"
                  disabled
                  checked={false}
                  className="h-4 w-4 rounded accent-ink-900 mt-0.5 cursor-not-allowed opacity-50"
                />
                <div>
                  <p className="font-semibold text-sand-500 line-through">
                    Cash on Delivery (COD) / Pay on Delivery
                  </p>
                  <p className="text-sand-500 text-[11px]">
                    Permanently disabled per VELLA Master Architecture Phase 2. All transactions require verified online settlement before dispatch.
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-3 p-3 bg-sand-50 rounded-lg border border-sand-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={razorpayEnabled}
                  onChange={(e) => setRazorpayEnabled(e.target.checked)}
                  className="h-4 w-4 accent-ink-900"
                />
                <div>
                  <p className="font-semibold text-ink-900">
                    Enable Razorpay Payment Gateway (Cards, UPI, Netbanking)
                  </p>
                  <p className="text-sand-600 text-[11px]">
                    Production-grade payment processing tailored for Indian credit cards, debit cards, UPI, and net banking.
                  </p>
                </div>
              </label>

              {razorpayEnabled && (
                <div className="pl-6 space-y-1">
                  <label className="block uppercase font-semibold text-sand-600">
                    Razorpay Public Key ID
                  </label>
                  <input
                    type="text"
                    value={razorpayKeyId}
                    onChange={(e) => setRazorpayKeyId(e.target.value)}
                    placeholder="rzp_test_..."
                    className="w-full max-w-md bg-white border border-sand-300 rounded p-2 font-mono text-xs"
                  />
                  <p className="text-[10px] text-sand-500">
                    Client-side key used for initializing the checkout modal securely.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Announcement Bar */}
          <div className="space-y-4 pt-6 border-t border-sand-200">
            <h3 className="font-serif text-base font-bold text-ink-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-accent-700" />
              5. Global Header Announcement Bar
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-2 font-medium">
                <input
                  type="checkbox"
                  checked={announcementEnabled}
                  onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                  className="h-4 w-4 accent-ink-900"
                />
                Display Global Header Announcement Bar
              </label>

              {announcementEnabled && (
                <div>
                  <label className="block uppercase font-semibold text-sand-600 mb-1">
                    Announcement Headline
                  </label>
                  <input
                    type="text"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-sand-200 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-ink-900 hover:bg-accent-600 text-sand-50 rounded font-semibold uppercase tracking-wider transition-colors shadow"
            >
              Save Storefront Configuration
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
