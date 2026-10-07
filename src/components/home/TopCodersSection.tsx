import React from 'react';
import {
  Trophy,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Medal,
  ChevronRight,
} from 'lucide-react';
import { StudentProfile } from '../../types';
import { LevelBadge } from '../common/LevelBadge';

interface TopCodersSectionProps {
  students: StudentProfile[];
  onViewLeaderboard: () => void;
  onSelectStudent: (username: string) => void;
}

export const TopCodersSection: React.FC<TopCodersSectionProps> = ({
  students,
  onViewLeaderboard,
  onSelectStudent,
}) => {
  const topFive = students.slice(0, 5);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center font-bold text-xs shadow-xs">
          <Medal className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 border border-slate-300 flex items-center justify-center font-bold text-xs">
          <Medal className="w-3.5 h-3.5 text-slate-500 fill-slate-400" />
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="w-7 h-7 rounded-full bg-amber-50 text-amber-900 border border-amber-200 flex items-center justify-center font-bold text-xs">
          <Medal className="w-3.5 h-3.5 text-amber-700 fill-amber-600" />
        </span>
      );
    }
    return (
      <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-mono flex items-center justify-center font-semibold text-xs border border-slate-200">
        #{rank}
      </span>
    );
  };

  return (
    <section className="py-12 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" />
              <span>Hall of Fame</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Top Coders
            </h2>
            <p className="text-sm text-slate-500">
              Leading the competitive programming ranks across all departments and batches.
            </p>
          </div>

          <button
            onClick={onViewLeaderboard}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 group cursor-pointer"
          >
            <span>View Full Leaderboard</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Top 5 List */}
        <div className="overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100">
          {topFive.map((student) => {
            const hasIncreased = student.ratingChange > 0;
            const hasDecreased = student.ratingChange < 0;

            return (
              <div
                key={student.id}
                onClick={() => onSelectStudent(student.username)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 hover:bg-slate-50/80 transition-all cursor-pointer gap-4"
              >
                {/* Left: Rank, Avatar, Name & Info */}
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {getRankBadge(student.rank)}
                  </div>

                  <img
                    src={student.avatar}
                    alt={student.fullName}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-blue-500/30 transition-all"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors truncate">
                        {student.fullName}
                      </span>
                      <span className="text-xs text-slate-400 font-mono hidden md:inline">
                        @{student.username}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {student.department}
                      </span>
                      <span>•</span>
                      <span>Batch {student.batch}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline text-slate-400">
                        {student.solvedProblemsCount} Solved
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: NUBPC Rating, Level, Rating Change */}
                <div className="flex items-center justify-between sm:justify-end gap-5 pl-11 sm:pl-0">
                  <div className="flex items-center gap-2">
                    <LevelBadge level={student.level} size="sm" />
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-base sm:text-lg font-bold font-mono text-slate-900">
                        {student.overallRating}
                      </span>

                      {/* Rating Change Indicator */}
                      <span
                        className={`inline-flex items-center text-xs font-mono font-semibold ${
                          hasIncreased
                            ? 'text-emerald-600'
                            : hasDecreased
                            ? 'text-rose-600'
                            : 'text-slate-400'
                        }`}
                        title="Rating change from recent contest"
                      >
                        {hasIncreased && <TrendingUp className="w-3.5 h-3.5 mr-0.5" />}
                        {hasDecreased && <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
                        {!hasIncreased && !hasDecreased && <Minus className="w-3.5 h-3.5 mr-0.5" />}
                        {hasIncreased ? `+${student.ratingChange}` : student.ratingChange}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      NUBPC Rating
                    </span>
                  </div>

                  <div className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all hidden sm:block">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-8 text-center">
          <button
            onClick={onViewLeaderboard}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 shadow-2xs hover:border-slate-300 transition-all cursor-pointer"
          >
            <span>View Full Leaderboard (All Batches & Departments)</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>
    </section>
  );
};
