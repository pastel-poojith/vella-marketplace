import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../contexts/StoreContext';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signIn, setDemoUser } = useAuth();
  const { settings } = useStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setErrorMsg(error.message || 'Invalid email or password credentials.');
    } else {
      navigate('/account');
    }
  };

  const handleQuickDemo = (role: 'admin' | 'customer') => {
    setDemoUser(role);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/account');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest text-accent-700 font-bold block">
          Patron Access
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-900">
          Sign In to {settings.store_name}
        </h1>
        <p className="text-xs text-sand-600">
          Access your private wishlist, curated orders, and concierge preferences.
        </p>
      </div>

      {/* Quick Demo Access Bar */}
      <div className="p-4 bg-sand-100 rounded-xl border border-sand-200 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-sand-600 text-center">
          Instant Preview Logins
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemo('customer')}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-sand-50 border border-sand-300 rounded text-xs font-semibold text-ink-800 transition-colors shadow-xs"
          >
            <UserCheck className="w-3.5 h-3.5 text-accent-600" />
            Demo Customer
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('admin')}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-ink-900 hover:bg-accent-600 text-sand-50 rounded text-xs font-semibold transition-colors shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-accent-400" />
            Demo Admin
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Standard Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl border border-sand-200 shadow-sm space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-ink-800 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-sand-50 border border-sand-300 rounded px-3 py-2.5 pl-10 text-sm text-ink-900 focus:outline-none focus:border-accent-500"
            />
            <Mail className="w-4 h-4 text-sand-400 absolute left-3.5 top-3" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs uppercase tracking-wider font-semibold text-ink-800">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-sand-500 hover:text-accent-600 underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-sand-50 border border-sand-300 rounded px-3 py-2.5 pl-10 text-sm text-ink-900 focus:outline-none focus:border-accent-500"
            />
            <Lock className="w-4 h-4 text-sand-400 absolute left-3.5 top-3" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-ink-900 hover:bg-accent-600 disabled:bg-sand-300 text-sand-50 rounded text-xs uppercase font-semibold tracking-wider shadow transition-colors flex items-center justify-center gap-2"
        >
          {loading ? 'Authenticating...' : 'Sign In to Account'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center text-xs text-sand-600">
        New to {settings.store_name}?{' '}
        <Link to="/signup" className="text-accent-700 font-semibold hover:underline">
          Create an account
        </Link>
      </div>
    </div>
  );
};
