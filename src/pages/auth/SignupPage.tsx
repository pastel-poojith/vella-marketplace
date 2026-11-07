import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../contexts/StoreContext';
import { Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const { signUp } = useAuth();
  const { settings } = useStore();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg('Account created successfully! Redirecting...');
      setTimeout(() => navigate('/account'), 1500);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest text-accent-700 font-bold block">
          New Membership
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-900">
          Create an Account
        </h1>
        <p className="text-xs text-sand-600">
          Join {settings.store_name} for expedited checkout and private order curation.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl border border-sand-200 shadow-sm space-y-5">
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
              placeholder="Elena Rostova"
              className="w-full bg-sand-50 border border-sand-300 rounded px-3 py-2.5 pl-10 text-sm text-ink-900 focus:outline-none focus:border-accent-500"
            />
            <User className="w-4 h-4 text-sand-400 absolute left-3.5 top-3" />
          </div>
        </div>

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
              placeholder="elena@example.com"
              className="w-full bg-sand-50 border border-sand-300 rounded px-3 py-2.5 pl-10 text-sm text-ink-900 focus:outline-none focus:border-accent-500"
            />
            <Mail className="w-4 h-4 text-sand-400 absolute left-3.5 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-ink-800 mb-1.5">
            Password (Min 6 Characters)
          </label>
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

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-ink-800 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? 'Creating Membership...' : 'Complete Registration'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center text-xs text-sand-600">
        Already registered with VELLA?{' '}
        <Link to="/login" className="text-accent-700 font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};
