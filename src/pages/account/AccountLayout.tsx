import React, { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User, Package, Heart, MapPin, LogOut, Shield } from 'lucide-react';

interface AccountLayoutProps {
  children: ReactNode;
}

export const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { label: 'Profile Information', path: '/account', icon: User, end: true },
    { label: 'Orders & Tracking', path: '/account/orders', icon: Package },
    { label: 'Curated Wishlist', path: '/account/wishlist', icon: Heart },
    { label: 'Saved Addresses', path: '/account/addresses', icon: MapPin },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 border-b border-sand-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-accent-700 font-bold block mb-1">
            Client Portal
          </span>
          <h1 className="font-serif text-3xl font-bold text-ink-900">
            Welcome, {profile?.full_name || user?.email || 'Valued Patron'}
          </h1>
        </div>

        {isAdmin && (
          <NavLink
            to="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 bg-ink-900 text-sand-50 rounded text-xs uppercase font-semibold tracking-wider hover:bg-accent-600 transition-colors shadow-xs"
          >
            <Shield className="w-4 h-4 text-accent-400" />
            Switch to Admin Dashboard
          </NavLink>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="bg-white p-4 rounded-xl border border-sand-200 shadow-sm space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'bg-ink-900 text-sand-50 shadow-xs'
                    : 'text-sand-700 hover:bg-sand-50 hover:text-ink-900'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}

          <div className="pt-4 border-t border-sand-200 mt-2">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  );
};
