import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AccountLayout } from './AccountLayout';
import { Check, ShieldCheck, User } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile, isAdmin } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || user?.user_metadata.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      full_name: fullName,
      phone,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <AccountLayout>
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-sand-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-sand-200">
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink-900">Personal Information</h2>
            <p className="text-xs text-sand-500">Manage your contact details and account security preferences.</p>
          </div>
          {isAdmin && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 border border-amber-200 rounded-full text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              Store Administrator
            </span>
          )}
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-ink-800 mb-1.5">
              Full Legal Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-sand-50 border border-sand-300 rounded px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-accent-500"
              />
              <User className="w-4 h-4 text-sand-400 absolute right-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-ink-800 mb-1.5">
              Registered Email (Primary Identity)
            </label>
            <input
              type="email"
              disabled
              value={user?.email || profile?.email || ''}
              className="w-full bg-sand-200 border border-sand-300 rounded px-3 py-2 text-sm text-sand-700 cursor-not-allowed"
            />
            <p className="text-[11px] text-sand-500 mt-1">
              Authentication email is linked to Supabase session management.
            </p>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-ink-800 mb-1.5">
              Contact Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full bg-sand-50 border border-sand-300 rounded px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-accent-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-ink-900 hover:bg-accent-600 text-sand-50 rounded text-xs uppercase font-semibold tracking-wider transition-colors shadow-xs"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </AccountLayout>
  );
};
