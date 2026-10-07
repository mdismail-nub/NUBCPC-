import React, { useState } from 'react';
import { X, Mail, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { store } from '../../services/supabaseClient';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onBackToLogin,
}) => {
  if (!isOpen) return null;

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await store.resetPassword(email.trim());
      setSuccessMsg(res.message);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              Account Recovery
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              Reset Your Password
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {successMsg ? (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm text-slate-700 font-medium">
                {successMsg}
              </p>
              <button
                onClick={onBackToLogin}
                className="w-full py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter your Northern University email address associated with your NUBPC account. We will send password reset guidelines.
              </p>

              {errorMsg && (
                <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  University Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="student@nub.ac.bd"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Remember password? Return to login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
