import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { store } from '../../services/supabaseClient';
import { StudentProfile } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: StudentProfile) => void;
  onSwitchToSignup: () => void;
  onOpenForgotPassword: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToSignup,
  onOpenForgotPassword,
}) => {
  if (!isOpen) return null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const students = store.getStudents();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = students.find((s) => s.email.toLowerCase() === email.toLowerCase());
    if (found) {
      store.setCurrentUser(found);
      onSuccess(found);
      onClose();
    } else {
      setError('No student found with this email. Try quick demo login below.');
    }
  };

  const handleQuickLogin = (student: StudentProfile) => {
    store.setCurrentUser(student);
    onSuccess(student);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              NUBPC Portal
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              Student Sign In
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
        <div className="p-6 space-y-5">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Student Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="student@nub.ac.bd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenForgotPassword();
                  }}
                  className="text-[11px] text-blue-600 hover:underline font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
            >
              Sign In
            </button>
          </form>

          {/* Quick Demo Switchers */}
          <div className="pt-3 border-t border-slate-100">
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
              Quick Demo Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              {students.slice(0, 2).map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleQuickLogin(s)}
                  className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left transition-all"
                >
                  <img
                    src={s.avatar}
                    alt={s.fullName}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {s.fullName.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {s.level}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{' '}
              <button
                onClick={() => {
                  onClose();
                  onSwitchToSignup();
                }}
                className="font-bold text-blue-600 hover:underline"
              >
                Join Community
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
