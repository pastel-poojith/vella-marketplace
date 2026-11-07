import React, { ReactNode } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../contexts/StoreContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Truck,
  Settings,
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, profile, isAdmin, setDemoUser } = useAuth();
  const { settings } = useStore();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Overview Metrics', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Product Catalog', path: '/admin/products', icon: Package },
    { label: 'Department Categories', path: '/admin/categories', icon: Layers },
    { label: 'Fulfillment & Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Returns & Claims', path: '/admin/returns', icon: RefreshCw },
    { label: 'Customer Directory', path: '/admin/customers', icon: Users },
    { label: 'Suppliers & Margin', path: '/admin/suppliers', icon: Truck },
    { label: 'Store Governance', path: '/admin/settings', icon: Settings },
  ];

  // Role Gate: if not admin, show graceful notice with instant authorization button for preview mode
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-ink-900">
          Admin Authentication Required
        </h1>
        <p className="text-sm text-sand-700 leading-relaxed max-w-md mx-auto">
          Access to store metrics, catalog writes, order status transitions, and dropshipping margins requires an administrator JWT role (<code className="bg-sand-200 px-1.5 py-0.5 rounded text-xs font-mono">role: admin</code>).
        </p>

        <div className="p-6 bg-white rounded-xl border border-sand-300 shadow-sm space-y-4 max-w-md mx-auto">
          <p className="text-xs text-sand-600">
            For development review & testing in Google AI Studio, you can activate the administrator role instantly:
          </p>
          <button
            onClick={() => setDemoUser('admin')}
            className="w-full py-3 bg-ink-900 hover:bg-accent-600 text-sand-50 rounded text-xs uppercase font-semibold tracking-wider transition-colors shadow flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-accent-400" />
            Enable Administrator Role
          </button>
        </div>

        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs text-sand-600 hover:text-ink-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Storefront
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-100/60">
      {/* Top Admin Bar */}
      <header className="bg-ink-900 text-sand-50 border-b border-ink-800 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sand-400 hover:text-sand-100 transition-colors flex items-center gap-1.5 text-xs">
              <ArrowLeft className="w-4 h-4" />
              Storefront
            </Link>
            <span className="text-ink-700">|</span>
            <span className="font-serif text-xl font-bold tracking-wider">
              {settings.store_name} Control Panel
            </span>
            <span className="bg-accent-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider hidden sm:inline">
              Super Admin
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-sand-300 hidden md:inline">
              Signed in as <strong>{profile?.full_name || user?.email}</strong>
            </span>
            <button
              onClick={() => {
                setDemoUser('customer');
                navigate('/');
              }}
              className="text-xs text-sand-400 hover:text-white underline cursor-pointer"
            >
              Exit to Customer
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Admin Navigation Sidebar */}
          <aside className="lg:col-span-1 bg-white p-3 rounded-xl border border-sand-200 shadow-sm space-y-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-ink-900 text-sand-50 shadow-xs'
                      : 'text-sand-700 hover:bg-sand-50 hover:text-ink-900'
                  }`
                }
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </aside>

          {/* Admin Page Content */}
          <main className="lg:col-span-4">{children}</main>
        </div>
      </div>
    </div>
  );
};
