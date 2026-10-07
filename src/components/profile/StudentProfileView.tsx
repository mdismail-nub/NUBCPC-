import React, { useState } from 'react';
import {
  Trophy,
  Calendar,
  Building2,
  Award,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Code2,
  Flame,
  ArrowLeft,
  Medal,
  CheckCircle2,
  Users,
  Edit2,
  X,
  Loader2,
  Save,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { CodingProfiles, PlatformAccount, StudentProfile } from '../../types';
import { LevelBadge } from '../common/LevelBadge';
import { PlatformBadge } from '../common/PlatformBadge';
import { ContentRenderer, sanitizeText } from '../common/ContentRenderer';
import { codeforcesService } from '../../services/codeforcesService';
import { codechefService } from '../../services/codechefService';
import { leetcodeService } from '../../services/leetcodeService';
import { atcoderService } from '../../services/atcoderService';
import { store } from '../../services/supabaseClient';

interface StudentProfileViewProps {
  student: StudentProfile;
  currentUserId?: string;
  onBack: () => void;
  onSelectContest?: (contestId: string) => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  student,
  currentUserId,
  onBack,
  onSelectContest,
}) => {
  const [activeTab, setActiveTab] = useState<'contests' | 'achievements'>('contests');
  const [isEditing, setIsEditing] = useState(false);

  const isCurrentUser = currentUserId === student.id;

  // Edit State
  const [bioInput, setBioInput] = useState(student.bio || '');
  const [cfInput, setCfInput] = useState(student.codingProfiles?.codeforces?.handle || '');
  const [ccInput, setCcInput] = useState(student.codingProfiles?.codechef?.handle || '');
  const [lcInput, setLcInput] = useState(student.codingProfiles?.leetcode?.handle || '');
  const [acInput, setAcInput] = useState(student.codingProfiles?.atcoder?.handle || '');

  const [verifying, setVerifying] = useState<Record<string, boolean>>({});
  const [editProfiles, setEditProfiles] = useState<CodingProfiles>(student.codingProfiles || {});
  const [editSaveMsg, setEditSaveMsg] = useState('');
  const [editErrorMsg, setEditErrorMsg] = useState('');

  const handleVerifyPlatform = async (platform: 'codeforces' | 'codechef' | 'leetcode' | 'atcoder', handle: string) => {
    if (!handle.trim()) return;
    setVerifying((prev) => ({ ...prev, [platform]: true }));
    setEditErrorMsg('');

    try {
      let result: PlatformAccount;
      if (platform === 'codeforces') result = await codeforcesService.verifyUser(handle);
      else if (platform === 'codechef') result = await codechefService.verifyUser(handle);
      else if (platform === 'leetcode') result = await leetcodeService.verifyUser(handle);
      else result = await atcoderService.verifyUser(handle);

      setEditProfiles((prev) => ({ ...prev, [platform]: result }));
    } catch (err: any) {
      setEditErrorMsg(`Verification failed: ${err.message}`);
    } finally {
      setVerifying((prev) => ({ ...prev, [platform]: false }));
    }
  };

  const handleSaveProfileUpdates = () => {
    store.updateStudentProfile(student.id, {
      bio: bioInput,
      codingProfiles: editProfiles,
    });
    setEditSaveMsg('Profile and handles updated successfully!');
    setTimeout(() => {
      setEditSaveMsg('');
      setIsEditing(false);
    }, 1200);
  };

  // SVG Rating History calculation
  const history = student.ratingHistory && student.ratingHistory.length > 0
    ? student.ratingHistory
    : [{ date: '2026-09-01', contestName: 'Initial Rating', rating: student.overallRating, change: 0 }];

  const ratings = history.map((h) => h.rating);
  const minRating = Math.max(0, Math.min(...ratings) - 100);
  const maxRating = Math.max(...ratings) + 100;
  const ratingRange = maxRating - minRating || 1;

  const svgWidth = 650;
  const svgHeight = 200;
  const paddingX = 40;
  const paddingY = 30;

  const points = history.map((pt, i) => {
    const x =
      history.length === 1
        ? svgWidth / 2
        : paddingX + (i / (history.length - 1)) * (svgWidth - 2 * paddingX);
    const y =
      svgHeight -
      paddingY -
      ((pt.rating - minRating) / ratingRange) * (svgHeight - 2 * paddingY);
    return { x, y, ...pt };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Back button & Edit Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Leaderboard</span>
        </button>

        {isCurrentUser && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit My Handles & Bio</span>
          </button>
        )}
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar & Details */}
          <div className="flex items-start sm:items-center gap-5">
            <img
              src={student.avatar}
              alt={student.fullName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-blue-50 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {student.fullName}
                </h1>
                <LevelBadge level={student.level} size="md" />
                {isCurrentUser && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">
                    YOU
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-500 font-mono">
                @{student.username} • ID: {student.studentId}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  {student.department}
                </span>
                <span>•</span>
                <span>Batch {student.batch}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {student.joinedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
            <div className="text-center sm:text-right">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                NUBPC Rank
              </div>
              <div className="text-3xl font-black font-mono text-slate-900 mt-0.5">
                #{student.rank}
              </div>
              <div className="text-[11px] text-slate-500">
                {student.solvedProblemsCount} Problems Solved
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Overall Rating
              </div>
              <div className="text-3xl font-black font-mono text-blue-600 mt-0.5">
                {student.overallRating}
              </div>
              <div
                className={`text-[11px] font-mono font-bold flex items-center justify-center sm:justify-end gap-0.5 ${
                  student.ratingChange >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {student.ratingChange >= 0 ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {student.ratingChange >= 0 ? `+${student.ratingChange}` : student.ratingChange}
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {student.bio && (
          <div className="mt-6 pt-5 border-t border-slate-100 text-sm text-slate-600 leading-relaxed">
            <ContentRenderer content={student.bio} />
          </div>
        )}
      </div>

      {/* Connected CP Platforms Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-blue-600" />
          <span>Connected Competitive Programming Profiles</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Codeforces */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                Codeforces
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Weight: 35%</span>
            </div>
            {student.codingProfiles.codeforces?.verified ? (
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold font-mono text-slate-900">
                    {student.codingProfiles.codeforces.rating}
                  </span>
                  <span className="text-xs text-slate-500 font-mono capitalize">
                    {student.codingProfiles.codeforces.rank}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-mono truncate">
                    @{student.codingProfiles.codeforces.handle}
                  </span>
                  <a
                    href={`https://codeforces.com/profile/${student.codingProfiles.codeforces.handle}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-0.5"
                  >
                    <span>Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 py-2">Not connected</div>
            )}
          </div>

          {/* CodeChef */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                CodeChef
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Weight: 25%</span>
            </div>
            {student.codingProfiles.codechef?.verified ? (
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold font-mono text-slate-900">
                    {student.codingProfiles.codechef.rating}
                  </span>
                  <span className="text-xs text-amber-700 font-bold">
                    {student.codingProfiles.codechef.rank}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-mono truncate">
                    @{student.codingProfiles.codechef.handle}
                  </span>
                  <a
                    href={`https://www.codechef.com/users/${student.codingProfiles.codechef.handle}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-0.5"
                  >
                    <span>Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 py-2">Not connected</div>
            )}
          </div>

          {/* LeetCode */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-600" />
                LeetCode
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Weight: 20%</span>
            </div>
            {student.codingProfiles.leetcode?.verified ? (
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold font-mono text-slate-900">
                    {student.codingProfiles.leetcode.rating}
                  </span>
                  <span className="text-xs text-orange-700 font-bold">
                    {student.codingProfiles.leetcode.rank}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-mono truncate">
                    @{student.codingProfiles.leetcode.handle}
                  </span>
                  <a
                    href={`https://leetcode.com/u/${student.codingProfiles.leetcode.handle}/`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-0.5"
                  >
                    <span>Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 py-2">Not connected</div>
            )}
          </div>

          {/* AtCoder */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-600" />
                AtCoder
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Weight: 20%</span>
            </div>
            {student.codingProfiles.atcoder?.verified ? (
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold font-mono text-slate-900">
                    {student.codingProfiles.atcoder.rating}
                  </span>
                  <span className="text-xs text-slate-600 font-semibold">
                    {student.codingProfiles.atcoder.rank}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-mono truncate">
                    @{student.codingProfiles.atcoder.handle}
                  </span>
                  <a
                    href={`https://atcoder.jp/users/${student.codingProfiles.atcoder.handle}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-0.5"
                  >
                    <span>Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 py-2">Not connected</div>
            )}
          </div>
        </div>
      </div>

      {/* Rating History Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">Rating History</h3>
            <p className="text-xs text-slate-500">
              Trajectory of NUBPC ratings after intra and external verified rounds
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60">
            Current: {student.overallRating}
          </span>
        </div>

        {/* SVG Line Graph */}
        <div className="w-full overflow-x-auto pt-4 pb-2">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-48 sm:h-56 min-w-[500px]"
          >
            {[0.25, 0.5, 0.75].map((ratio, i) => {
              const y = paddingY + ratio * (svgHeight - 2 * paddingY);
              const val = Math.round(maxRating - ratio * ratingRange);
              return (
                <g key={i}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={svgWidth - paddingX}
                    y2={y}
                    stroke="#E2E8F0"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] fill-slate-400 font-mono"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            <path
              d={pathD}
              fill="none"
              stroke="#2563EB"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {points.map((pt, i) => (
              <g key={i} className="group cursor-pointer">
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  className="fill-blue-600 stroke-white stroke-2 group-hover:r-7 transition-all"
                />
                <text
                  x={pt.x}
                  y={pt.y - 12}
                  textAnchor="middle"
                  className="text-[11px] font-mono font-bold fill-slate-900"
                >
                  {pt.rating}
                </text>
                <text
                  x={pt.x}
                  y={svgHeight - 8}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {pt.date.substring(5)}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Tabs: Contest History & Achievements */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('contests')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'contests'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Contest History ({student.contestHistory?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'achievements'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Achievements & Badges ({student.achievements?.length || 0})
          </button>
        </div>

        {activeTab === 'contests' ? (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            {(!student.contestHistory || student.contestHistory.length === 0) ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No intra-contest records recorded yet. Check out upcoming contests to participate!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase text-[11px]">
                      <th className="py-3 px-4">Contest</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-center">Rank</th>
                      <th className="py-3 px-4 text-center">Solved</th>
                      <th className="py-3 px-4 text-center">Performance</th>
                      <th className="py-3 px-4 text-right">Rating Δ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {student.contestHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70">
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {item.contestName}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-mono">
                          {item.date}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold">
                          #{item.rank} / {item.totalParticipants}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-semibold text-emerald-600">
                          {item.solvedCount} / {item.totalProblems}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-slate-700">
                          {item.performance}
                        </td>
                        <td
                          className={`py-3.5 px-4 text-right font-mono font-bold ${
                            item.ratingChange >= 0 ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {item.ratingChange >= 0 ? `+${item.ratingChange}` : item.ratingChange}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(!student.achievements || student.achievements.length === 0) ? (
              <div className="col-span-3 p-8 bg-white rounded-xl border border-slate-200 text-center text-slate-400 text-sm">
                No badges unlocked yet. Keep solving and participating in campus contests!
              </div>
            ) : (
              student.achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{ach.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{ach.description}</p>
                    <span className="inline-block mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                      {ach.category}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Edit Profile & Handles Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                  Update Account
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Connect & Verify Handles
                </h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              {editSaveMsg && (
                <div className="p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editSaveMsg}</span>
                </div>
              )}

              {editErrorMsg && (
                <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{editErrorMsg}</span>
                </div>
              )}

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bio / Interests
                </label>
                <textarea
                  rows={2}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="Share your CP focus or tech stack..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              {/* Handles Verification */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Verify Coding Accounts
                </span>

                {/* Codeforces */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">Codeforces Handle</span>
                    {editProfiles.codeforces?.verified && (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Rating: {editProfiles.codeforces.rating}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={cfInput}
                      onChange={(e) => setCfInput(e.target.value)}
                      placeholder="Codeforces handle"
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleVerifyPlatform('codeforces', cfInput)}
                      disabled={verifying.codeforces || !cfInput.trim()}
                      className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {verifying.codeforces ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Verify'}
                    </button>
                  </div>
                </div>

                {/* CodeChef */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">CodeChef Handle</span>
                    {editProfiles.codechef?.verified && (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Rating: {editProfiles.codechef.rating}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ccInput}
                      onChange={(e) => setCcInput(e.target.value)}
                      placeholder="CodeChef handle"
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleVerifyPlatform('codechef', ccInput)}
                      disabled={verifying.codechef || !ccInput.trim()}
                      className="px-3 py-1.5 text-xs font-semibold bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
                    >
                      {verifying.codechef ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Verify'}
                    </button>
                  </div>
                </div>

                {/* LeetCode */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">LeetCode Handle</span>
                    {editProfiles.leetcode?.verified && (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Rating: {editProfiles.leetcode.rating}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={lcInput}
                      onChange={(e) => setLcInput(e.target.value)}
                      placeholder="LeetCode username"
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleVerifyPlatform('leetcode', lcInput)}
                      disabled={verifying.leetcode || !lcInput.trim()}
                      className="px-3 py-1.5 text-xs font-semibold bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                    >
                      {verifying.leetcode ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Verify'}
                    </button>
                  </div>
                </div>

                {/* AtCoder */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">AtCoder Handle</span>
                    {editProfiles.atcoder?.verified && (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Rating: {editProfiles.atcoder.rating}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={acInput}
                      onChange={(e) => setAcInput(e.target.value)}
                      placeholder="AtCoder username"
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleVerifyPlatform('atcoder', acInput)}
                      disabled={verifying.atcoder || !acInput.trim()}
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-900 disabled:opacity-50"
                    >
                      {verifying.atcoder ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Verify'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfileUpdates}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes & Recalculate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
