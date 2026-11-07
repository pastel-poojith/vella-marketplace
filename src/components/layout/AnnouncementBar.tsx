import React from 'react';
import { useStore } from '../../contexts/StoreContext';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldCheck, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useStore();
  const { isAdmin, setDemoUser } = useAuth();

  if (!settings.announcement_bar_enabled) return null;

  return (
    <div className="bg-ink-900 text-sand-100 text-xs py-2 px-4 border-b border-ink-800 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-center sm:text-left tracking-wide font-medium flex-1">
          {settings.announcement_bar_text}
        </p>

        {/* Preview Role Quick-Switcher */}
        <div className="flex items-center gap-3 text-[11px] tracking-wider uppercase font-semibold">
          <span className="text-sand-400 hidden md:inline">Mode:</span>
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-accent-400 bg-ink-800 px-2 py-0.5 rounded">
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Active
              </span>
              <Link
                to="/admin"
                className="underline hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => setDemoUser('customer')}
                className="text-sand-300 hover:text-white underline cursor-pointer"
                title="Switch to customer mode"
              >
                (Switch to Customer)
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-sand-300">
                <UserCheck className="w-3.5 h-3.5" />
                Customer
              </span>
              <button
                onClick={() => setDemoUser('admin')}
                className="text-accent-300 hover:text-white underline cursor-pointer font-bold"
                title="Switch to store admin mode"
              >
                (Switch to Admin)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
