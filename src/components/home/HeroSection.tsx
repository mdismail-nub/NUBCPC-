import React, { useState, useEffect } from 'react';
import {
  Trophy,
  ArrowRight,
  Sparkles,
  Users,
  Activity,
  Calendar,
  CheckCircle2,
  Clock,
  Medal,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { CommunityStats, Contest, StudentProfile } from '../../types';
import { LevelBadge } from '../common/LevelBadge';

interface HeroSectionProps {
  stats: CommunityStats;
  topStudents?: StudentProfile[];
  nextContest?: Contest;
  onJoinClick: () => void;
  onLeaderboardClick: () => void;
  onViewContest?: (id: string) => void;
  onSelectStudent?: (username: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  stats,
  topStudents = [],
  nextContest,
  onJoinClick,
  onLeaderboardClick,
  onViewContest,
  onSelectStudent,
}) => {
  // Live countdown for next contest if available
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 16, hours: 20, minutes: 8, seconds: 21 });

  useEffect(() => {
    if (!nextContest) return;
    const targetDate = new Date(nextContest.startTime).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [nextContest]);

  const spotlightStudents = topStudents.slice(0, 3);

  return (
    <div className="relative overflow-hidden pt-6 pb-14 md:pt-12 md:pb-20">
      {/* Very subtle background geometric accent */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-10 left-10 -z-10 w-80 h-80 bg-slate-100/50 rounded-full blur-2xl opacity-70 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Brief, Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Tagline label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span>Official Community Hub for NUB Coders</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
                CODE. <span className="text-blue-600">COMPETE.</span> CONQUER.
              </h1>
              <div className="text-sm sm:text-base font-bold text-blue-700 tracking-wide pt-1">
                Northern University Bangladesh Programming Community
              </div>
              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl pt-1">
                “Where programmers come together to learn, compete and grow.”
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={onJoinClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Join the Community</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>
              <button
                onClick={onLeaderboardClick}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs hover:border-slate-300 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-blue-600" />
                <span>View Leaderboard</span>
              </button>
            </div>

            {/* Micro value badges */}
            <div className="pt-3 flex flex-wrap items-center gap-y-2.5 gap-x-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Normalized Multi-Platform Rating</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>ICPC Regional Team Selection</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Automated Handle Verification</span>
              </span>
            </div>
          </div>

          {/* Right Column: Clean Community Hub Spotlight (Replaces fake compiler/engine) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Upcoming Contest Card */}
            {nextContest && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-200 transition-all text-left space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span>Upcoming Major Contest</span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                    {nextContest.platform}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 line-clamp-1">
                    {nextContest.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {nextContest.description}
                  </p>
                </div>

                {/* Countdown Timer */}
                <div className="grid grid-cols-4 gap-2 text-center py-1">
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                    <div className="text-base font-bold font-mono text-slate-900">
                      {timeLeft.days}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">Days</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                    <div className="text-base font-bold font-mono text-slate-900">
                      {timeLeft.hours}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">Hours</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                    <div className="text-base font-bold font-mono text-slate-900">
                      {timeLeft.minutes}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">Mins</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                    <div className="text-base font-bold font-mono text-slate-900">
                      {timeLeft.seconds}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">Secs</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>{nextContest.participantsCount} Registered</span>
                  </span>

                  <button
                    onClick={() => onViewContest && onViewContest(nextContest.id)}
                    className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    <span>View Contest</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Top Coders Snapshot Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-left space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Top Coders Spotlight</span>
                </div>
                <button
                  onClick={onLeaderboardClick}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Leaderboard</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {spotlightStudents.map((student, idx) => (
                  <div
                    key={student.id}
                    onClick={() => onSelectStudent && onSelectStudent(student.username)}
                    className="py-2.5 flex items-center justify-between hover:bg-slate-50/80 -mx-2 px-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          idx === 0
                            ? 'bg-amber-100 text-amber-800'
                            : idx === 1
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-amber-50 text-amber-900'
                        }`}
                      >
                        #{student.rank}
                      </span>
                      <img
                        src={student.avatar}
                        alt={student.fullName}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 leading-snug">
                          {student.fullName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {student.department} · {student.batch}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-extrabold font-mono text-slate-900">
                        {student.overallRating}
                      </div>
                      <LevelBadge level={student.level} size="sm" showDot={false} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Supported Platforms Quiet Row */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-medium">Tracked Platforms:</span>
                <span className="text-slate-600 font-mono text-[10px]">
                  CF 35% · CC 25% · AC 20% · LC 20%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Community Statistics Bar */}
        <div className="mt-12 lg:mt-16 pt-8 border-t border-slate-200/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-2xs text-left">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Members</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                {stats.members}+
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Enrolled across batches</div>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-2xs text-left">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Active Coders</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                {stats.activeCoders}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Contest-active this month</div>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-2xs text-left">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Contests</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                {stats.contests}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Intra & weekly rounds</div>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-2xs text-left">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>Problems Solved</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                {stats.problemsSolved.toLocaleString()}+
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Submissions verified</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
