import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Trophy,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Flame,
  Medal,
} from 'lucide-react';
import { Contest } from '../../types';
import { ContentRenderer, sanitizeText } from '../common/ContentRenderer';

interface ContestDetailViewProps {
  contest: Contest;
  currentUserId?: string;
  onBack: () => void;
  onToggleRegister: (contestId: string) => void;
  onSelectStudent: (username: string) => void;
}

export const ContestDetailView: React.FC<ContestDetailViewProps> = ({
  contest,
  currentUserId,
  onBack,
  onToggleRegister,
  onSelectStudent,
}) => {
  const [activeTab, setActiveTab] = useState<'standings' | 'problems' | 'rules'>('standings');

  const isRegistered = currentUserId
    ? contest.registeredUserIds.includes(currentUserId)
    : false;

  const formattedDate = new Date(contest.startTime).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Contests</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                  contest.status === 'upcoming'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : contest.status === 'ongoing'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {contest.status}
              </span>
              <span className="text-xs font-mono font-semibold text-slate-500">
                {contest.platform}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {sanitizeText(contest.title)}
            </h1>

            <ContentRenderer content={contest.description} className="text-sm text-slate-600 leading-relaxed" />

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 font-medium">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Starts: {formattedDate}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>
                  Duration: {contest.durationMinutes}m (Ends:{' '}
                  {new Date(new Date(contest.startTime).getTime() + contest.durationMinutes * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-500" />
                {contest.participantsCount} Registered
              </span>
              {contest.registrationLink && (
                <a
                  href={contest.registrationLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Portal Link</span>
                </a>
              )}
            </div>
          </div>

          {/* Action */}
          {contest.status !== 'past' && (
            <div className="flex-shrink-0">
              <button
                onClick={() => onToggleRegister(contest.id)}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer ${
                  isRegistered
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                }`}
              >
                {isRegistered ? '✓ You Are Registered' : 'Register for Contest'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('standings')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'standings'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Standings / Leaderboard</span>
        </button>

        <button
          onClick={() => setActiveTab('problems')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'problems'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Problem Set ({contest.problems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'rules'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Rules & Guidelines</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'standings' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          {!contest.standings || contest.standings.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Clock className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-medium">
                Contest has not begun yet. Standings will activate dynamically once submissions start.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 font-bold text-slate-500 uppercase text-[11px]">
                    <th className="py-3.5 px-4 text-center w-16">Rank</th>
                    <th className="py-3.5 px-4">Participant</th>
                    <th className="py-3.5 px-3">Dept</th>
                    <th className="py-3.5 px-3 text-center">Solved</th>
                    <th className="py-3.5 px-3 text-center">Penalty</th>
                    {contest.problems.map((p) => (
                      <th key={p.id} className="py-3.5 px-3 text-center font-mono">
                        {p.code}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {contest.standings.map((row) => (
                    <tr
                      key={row.username}
                      onClick={() => onSelectStudent(row.username)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 text-center font-bold font-mono">
                        {row.rank === 1 ? (
                          <span className="text-amber-600 font-extrabold">#1 🥇</span>
                        ) : row.rank === 2 ? (
                          <span className="text-slate-600 font-extrabold">#2 🥈</span>
                        ) : row.rank === 3 ? (
                          <span className="text-amber-800 font-extrabold">#3 🥉</span>
                        ) : (
                          `#${row.rank}`
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {row.studentName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          @{row.username}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-700">
                        {row.department}
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold font-mono text-emerald-600 text-sm">
                        {row.solvedCount}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono text-slate-600">
                        {row.penalty}m
                      </td>
                      {contest.problems.map((p) => {
                        const status = row.problemStatus[p.code];
                        return (
                          <td key={p.code} className="py-3.5 px-3 text-center font-mono">
                            {status?.solved ? (
                              <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                                +{status.attempts > 1 ? status.attempts - 1 : ''}
                                {status.time ? ` (${status.time}m)` : ''}
                              </span>
                            ) : status?.attempts ? (
                              <span className="inline-block px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[11px]">
                                -{status.attempts}
                              </span>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Problem Set Tab */}
      {activeTab === 'problems' && (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-2xs">
          {contest.problems.map((p) => (
            <div key={p.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-mono font-bold flex items-center justify-center text-sm border border-blue-200/60">
                  {p.code}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{p.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span
                      className={`font-semibold ${
                        p.difficulty === 'Easy'
                          ? 'text-emerald-600'
                          : p.difficulty === 'Medium'
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {p.difficulty}
                    </span>
                    <span>•</span>
                    <span className="font-mono">{p.points} Points</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 font-mono">
                  {p.solvedByCount} Solved
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rules Tab */}
      {activeTab === 'rules' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 text-sm text-slate-700 leading-relaxed">
          <h3 className="font-bold text-base text-slate-900">Official Regulations</h3>
          <ContentRenderer content={contest.rules || 'Standard ICPC individual programming contest rules apply.'} />
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
            <li>Strict anti-plagiarism automated code check will be executed post contest.</li>
            <li>Allowed compilers: GNU C++20, Python 3.11, OpenJDK 17.</li>
            <li>Rating updates will be synced to global NUBPC standings within 24 hours.</li>
          </ul>
        </div>
      )}
    </div>
  );
};
