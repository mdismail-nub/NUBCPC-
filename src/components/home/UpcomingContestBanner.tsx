import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Users,
  ArrowRight,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { Contest } from '../../types';

interface UpcomingContestBannerProps {
  contest?: Contest;
  onViewContest: (id: string) => void;
  onRegisterToggle: (id: string) => void;
  isRegistered: boolean;
}

export const UpcomingContestBanner: React.FC<UpcomingContestBannerProps> = ({
  contest,
  onViewContest,
  onRegisterToggle,
  isRegistered,
}) => {
  if (!contest) return null;

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(contest.startTime).getTime();

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
  }, [contest.startTime]);

  const formattedDate = new Date(contest.startTime).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-2xl bg-white border border-blue-200/80 p-6 sm:p-8 shadow-xs overflow-hidden">
        {/* Very subtle blue accent corner */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Contest info */}
          <div className="space-y-3 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Next Major Clash</span>
              <span className="w-1 h-1 rounded-full bg-blue-400" />
              <span>{contest.platform}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {contest.title}
            </h3>

            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {contest.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 font-medium">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>{formattedDate}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{contest.durationMinutes} Minutes ({contest.durationMinutes / 60}h)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                <span>{contest.participantsCount} Registered Coders</span>
              </span>
            </div>
          </div>

          {/* Countdown timer & actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-4">
            {/* Live countdown blocks */}
            <div className="grid grid-cols-4 gap-2 text-center font-mono">
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 min-w-[56px]">
                <div className="text-lg sm:text-xl font-bold text-slate-900">{timeLeft.days}</div>
                <div className="text-[10px] text-slate-400 uppercase font-sans">Days</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 min-w-[56px]">
                <div className="text-lg sm:text-xl font-bold text-slate-900">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-sans">Hrs</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 min-w-[56px]">
                <div className="text-lg sm:text-xl font-bold text-slate-900">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-sans">Min</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 min-w-[56px]">
                <div className="text-lg sm:text-xl font-bold text-blue-600">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-sans">Sec</div>
              </div>
            </div>

            {/* Registration & Details buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => onRegisterToggle(contest.id)}
                className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                  isRegistered
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                }`}
              >
                {isRegistered ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Registered</span>
                  </>
                ) : (
                  <span>Register Now</span>
                )}
              </button>

              <button
                onClick={() => onViewContest(contest.id)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer"
              >
                <span>Details & Standings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
