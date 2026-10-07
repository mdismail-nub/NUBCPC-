import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  Flame,
  Search,
  Filter,
  Trophy,
} from 'lucide-react';
import { Contest } from '../../types';

interface ContestsViewProps {
  contests: Contest[];
  currentUserId?: string;
  onSelectContest: (contestId: string) => void;
  onToggleRegister: (contestId: string) => void;
}

export const ContestsView: React.FC<ContestsViewProps> = ({
  contests,
  currentUserId,
  onSelectContest,
  onToggleRegister,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'ongoing' | 'past'>('upcoming');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContests = contests
    .filter((c) => c.status === activeTab)
    .filter((c) => c.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const counts = {
    upcoming: contests.filter((c) => c.status === 'upcoming').length,
    ongoing: contests.filter((c) => c.status === 'ongoing').length,
    past: contests.filter((c) => c.status === 'past').length,
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Title & Intro */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>NUBPC Arena</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Programming Contests
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Participate in weekly speed sprints, semester clashes, and ICPC regional trials.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search contests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        {[
          { id: 'upcoming', label: 'Upcoming', count: counts.upcoming },
          { id: 'ongoing', label: 'Ongoing', count: counts.ongoing },
          { id: 'past', label: 'Past Contests', count: counts.past },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                  isActive ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Contest Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredContests.length === 0 ? (
          <div className="col-span-2 p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 space-y-2">
            <Calendar className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-medium">No contests found in this category.</p>
          </div>
        ) : (
          filteredContests.map((contest) => {
            const isRegistered = currentUserId
              ? contest.registeredUserIds.includes(currentUserId)
              : false;

            const formattedDate = new Date(contest.startTime).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            });

            return (
              <div
                key={contest.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  {/* Status & Platform Tag */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border ${
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

                  <h3
                    onClick={() => onSelectContest(contest.id)}
                    className="font-extrabold text-lg text-slate-900 hover:text-blue-600 transition-colors cursor-pointer leading-snug"
                  >
                    {contest.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {contest.description}
                  </p>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-600 font-medium border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      <span className="truncate">{formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      <span>{contest.durationMinutes} min ({contest.durationMinutes / 60}h)</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      <span>{contest.participantsCount} Registered</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-slate-500">
                      <span>{contest.problems?.length || 5} Problems</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  {contest.status !== 'past' ? (
                    <button
                      onClick={() => onToggleRegister(contest.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isRegistered
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                      }`}
                    >
                      {isRegistered ? '✓ Registered' : 'Register for Contest'}
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-mono">
                      Completed
                    </span>
                  )}

                  <button
                    onClick={() => onSelectContest(contest.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    <span>Standings & Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
