import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const { error } = await resetPassword(email);
    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <Link
        to="/login"
        className="inline-flex items-center gap-1.5 text-xs text-sand-500 hover:text-ink-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Return to Login
      </Link>

      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-bold text-ink-900">
          Reset Password
        </h1>
        <p className="text-xs text-sand-600">
          Enter the email associated with your account, and we will dispatch a secure reset key.
        </p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl text-center space-y-3">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-ink-900">Dispatch Sent</h3>
          <p className="text-xs text-sand-700 leading-relaxed">
            If an account exists under <strong>{email}</strong>, a password reset link has been dispatched.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl border border-sand-200 shadow-sm space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-ink-800 mb-1.5">
              Account Email Address
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-ink-900 hover:bg-accent-600 disabled:bg-sand-300 text-sand-50 rounded text-xs uppercase font-semibold tracking-wider shadow transition-colors"
          >
            {loading ? 'Sending Request...' : 'Send Password Reset Key'}
          </button>
        </form>
      )}
    </div>
  );
};
