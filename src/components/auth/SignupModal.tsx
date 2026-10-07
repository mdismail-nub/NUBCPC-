import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader2,
  User,
  Mail,
  Lock,
  Building2,
  Calendar,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { codeforcesService } from '../../services/codeforcesService';
import { codechefService } from '../../services/codechefService';
import { leetcodeService } from '../../services/leetcodeService';
import { atcoderService } from '../../services/atcoderService';
import { calculateOverallRating, getLevelFromRating } from '../../services/ratingService';
import { store } from '../../services/supabaseClient';
import { CodingProfiles, PlatformAccount, StudentProfile } from '../../types';
import { LevelBadge } from '../common/LevelBadge';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (student: StudentProfile) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
];

export const SignupModal: React.FC<SignupModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 Form Data
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [batch, setBatch] = useState('56th');
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0]);
  const [bio, setBio] = useState('');
  const [step1Error, setStep1Error] = useState('');

  // Step 2 Platform handles & verification state
  const [cfHandle, setCfHandle] = useState('');
  const [ccHandle, setCcHandle] = useState('');
  const [lcHandle, setLcHandle] = useState('');
  const [acHandle, setAcHandle] = useState('');

  const [codingProfiles, setCodingProfiles] = useState<CodingProfiles>({});
  const [verifying, setVerifying] = useState<Record<string, boolean>>({});
  const [verifyErrors, setVerifyErrors] = useState<Record<string, string>>({});

  // Handlers for Platform Verification
  const handleVerifyCF = async () => {
    if (!cfHandle.trim()) return;
    setVerifying((prev) => ({ ...prev, cf: true }));
    setVerifyErrors((prev) => ({ ...prev, cf: '' }));
    try {
      const data = await codeforcesService.verifyUser(cfHandle);
      setCodingProfiles((prev) => ({ ...prev, codeforces: data }));
    } catch (err: any) {
      setVerifyErrors((prev) => ({ ...prev, cf: err.message || 'Verification failed' }));
    } finally {
      setVerifying((prev) => ({ ...prev, cf: false }));
    }
  };

  const handleVerifyCC = async () => {
    if (!ccHandle.trim()) return;
    setVerifying((prev) => ({ ...prev, cc: true }));
    setVerifyErrors((prev) => ({ ...prev, cc: '' }));
    try {
      const data = await codechefService.verifyUser(ccHandle);
      setCodingProfiles((prev) => ({ ...prev, codechef: data }));
    } catch (err: any) {
      setVerifyErrors((prev) => ({ ...prev, cc: err.message || 'Verification failed' }));
    } finally {
      setVerifying((prev) => ({ ...prev, cc: false }));
    }
  };

  const handleVerifyLC = async () => {
    if (!lcHandle.trim()) return;
    setVerifying((prev) => ({ ...prev, lc: true }));
    setVerifyErrors((prev) => ({ ...prev, lc: '' }));
    try {
      const data = await leetcodeService.verifyUser(lcHandle);
      setCodingProfiles((prev) => ({ ...prev, leetcode: data }));
    } catch (err: any) {
      setVerifyErrors((prev) => ({ ...prev, lc: err.message || 'Verification failed' }));
    } finally {
      setVerifying((prev) => ({ ...prev, lc: false }));
    }
  };

  const handleVerifyAC = async () => {
    if (!acHandle.trim()) return;
    setVerifying((prev) => ({ ...prev, ac: true }));
    setVerifyErrors((prev) => ({ ...prev, ac: '' }));
    try {
      const data = await atcoderService.verifyUser(acHandle);
      setCodingProfiles((prev) => ({ ...prev, atcoder: data }));
    } catch (err: any) {
      setVerifyErrors((prev) => ({ ...prev, ac: err.message || 'Verification failed' }));
    } finally {
      setVerifying((prev) => ({ ...prev, ac: false }));
    }
  };

  // Step 1 Validation
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim() || !studentId.trim()) {
      setStep1Error('Please fill in all required fields.');
      return;
    }
    setStep1Error('');
    setStep(2);
  };

  // Calculate ratings for preview
  const ratingConfig = store.getRatingConfig();
  const levelThresholds = store.getLevelThresholds();
  const ratingPreview = calculateOverallRating(codingProfiles, ratingConfig);
  const calculatedLevel = getLevelFromRating(ratingPreview.overallRating, levelThresholds);

  // Final submit
  const handleCompleteRegistration = async () => {
    const slug = fullName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');

    const newStudent = await store.signUpWithSupabase(email, password, {
      fullName,
      username: slug || 'coder_' + Date.now(),
      email,
      studentId,
      department,
      batch,
      avatar,
      bio: bio || `Member of NUBPC, Batch ${batch} (${department}).`,
      codingProfiles,
    });

    onSuccess(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Progress Steps */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                Student Registration
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">
                Join NUBPC Community
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Bar */}
          <div className="flex items-center justify-between mt-5 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
            {[
              { num: 1, label: 'University Details' },
              { num: 2, label: 'CP Accounts' },
              { num: 3, label: 'Rating Preview' },
            ].map((s) => {
              const isCurrent = step === s.num;
              const isDone = step > s.num;

              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isDone
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                    }`}
                  >
                    {isDone ? '✓' : s.num}
                  </div>
                  <span
                    className={`text-[10px] font-semibold mt-1 tracking-tight ${
                      isCurrent ? 'text-blue-600' : 'text-slate-500'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1: Personal & University Details */}
          {step === 1 && (
            <form onSubmit={handleProceedToStep2} className="space-y-4">
              {step1Error && (
                <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{step1Error}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvir Hossain"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Email & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password *
                  </label>
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
              </div>

              {/* Student ID & Dept & Batch */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="018232..."
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                  >
                    <option value="CSE">CSE</option>
                    <option value="EEE">EEE</option>
                    <option value="Software Eng.">Software Eng.</option>
                    <option value="Textile">Textile</option>
                    <option value="BBA">BBA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Batch
                  </label>
                  <select
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                  >
                    {['52nd', '53rd', '54th', '55th', '56th', '57th', '58th', '59th'].map((b) => (
                      <option key={b} value={b}>
                        Batch {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Choose Profile Picture
                </label>
                <div className="flex items-center gap-3">
                  {PRESET_AVATARS.map((imgUrl, i) => (
                    <img
                      key={i}
                      src={imgUrl}
                      alt="Avatar"
                      onClick={() => setAvatar(imgUrl)}
                      className={`w-10 h-10 rounded-full object-cover cursor-pointer transition-all ${
                        avatar === imgUrl
                          ? 'ring-3 ring-blue-600 scale-105'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                  <span>Continue to CP Accounts</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Connect Competitive Programming Accounts */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3 text-xs text-blue-900 leading-relaxed">
                Connect your contest handles. Each platform will be verified and normalized using NUBPC's rating engine. You can connect one or all platforms.
              </div>

              {/* Codeforces */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    Codeforces Username (Weight: 35%)
                  </span>
                  {codingProfiles.codeforces?.verified && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ✓ Verified • Rating: {codingProfiles.codeforces.rating}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. tourist, tanvir_nub"
                    value={cfHandle}
                    onChange={(e) => setCfHandle(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-mono"
                  />
                  <button
                    onClick={handleVerifyCF}
                    disabled={verifying.cf || !cfHandle.trim()}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                  >
                    {verifying.cf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Verify'}
                  </button>
                </div>
                {verifyErrors.cf && (
                  <p className="text-[11px] text-rose-600">{verifyErrors.cf}</p>
                )}
              </div>

              {/* CodeChef */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-600" />
                    CodeChef Username (Weight: 25%)
                  </span>
                  {codingProfiles.codechef?.verified && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ✓ Verified • Rating: {codingProfiles.codechef.rating}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. chef_tanvir"
                    value={ccHandle}
                    onChange={(e) => setCcHandle(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-mono"
                  />
                  <button
                    onClick={handleVerifyCC}
                    disabled={verifying.cc || !ccHandle.trim()}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 flex items-center gap-1"
                  >
                    {verifying.cc ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Verify'}
                  </button>
                </div>
                {verifyErrors.cc && (
                  <p className="text-[11px] text-rose-600">{verifyErrors.cc}</p>
                )}
              </div>

              {/* LeetCode */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-600" />
                    LeetCode Username (Weight: 20%)
                  </span>
                  {codingProfiles.leetcode?.verified && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ✓ Verified • Rating: {codingProfiles.leetcode.rating}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. leet_tanvir"
                    value={lcHandle}
                    onChange={(e) => setLcHandle(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-mono"
                  />
                  <button
                    onClick={handleVerifyLC}
                    disabled={verifying.lc || !lcHandle.trim()}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 flex items-center gap-1"
                  >
                    {verifying.lc ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Verify'}
                  </button>
                </div>
                {verifyErrors.lc && (
                  <p className="text-[11px] text-rose-600">{verifyErrors.lc}</p>
                )}
              </div>

              {/* AtCoder */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-600" />
                    AtCoder Username (Weight: 20%)
                  </span>
                  {codingProfiles.atcoder?.verified && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ✓ Verified • Rating: {codingProfiles.atcoder.rating}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. atcoder_tanvir"
                    value={acHandle}
                    onChange={(e) => setAcHandle(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-mono"
                  />
                  <button
                    onClick={handleVerifyAC}
                    disabled={verifying.ac || !acHandle.trim()}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-50 flex items-center gap-1"
                  >
                    {verifying.ac ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Verify'}
                  </button>
                </div>
                {verifyErrors.ac && (
                  <p className="text-[11px] text-rose-600">{verifyErrors.ac}</p>
                )}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                  <span>Review & Preview Rating</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Rating Preview & Confirmation */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white space-y-4 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={avatar}
                      alt={fullName}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20"
                    />
                    <div>
                      <h4 className="font-extrabold text-base text-white">{fullName}</h4>
                      <p className="text-xs text-slate-300">
                        {department} • Batch {batch} • ID: {studentId}
                      </p>
                    </div>
                  </div>

                  <LevelBadge level={calculatedLevel} size="md" />
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                      Calculated NUBPC Rating
                    </div>
                    <div className="text-3xl font-black font-mono text-white">
                      {ratingPreview.overallRating}
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-300">
                    <div>{ratingPreview.activePlatformsCount} Platforms Connected</div>
                    <div className="text-emerald-400 font-medium">Ready to Compete</div>
                  </div>
                </div>
              </div>

              {/* Breakdown Table */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-900">
                  Rating Calculation Breakdown
                </div>
                {ratingPreview.normalizedBreakdown.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    No CP accounts connected yet. You will start with the default base rating (1000). You can connect accounts later in your profile.
                  </p>
                ) : (
                  <div className="space-y-1.5 text-xs">
                    {ratingPreview.normalizedBreakdown.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-1 border-b border-slate-200/60 last:border-0"
                      >
                        <span className="font-medium text-slate-700">{item.platform}</span>
                        <div className="flex items-center gap-3 font-mono text-[11px]">
                          <span className="text-slate-500">Raw: {item.raw}</span>
                          <span className="text-slate-700">Norm: {item.normalized}</span>
                          <span className="font-bold text-blue-600">
                            +{item.contribution} pts
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleCompleteRegistration}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create Student Profile</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
