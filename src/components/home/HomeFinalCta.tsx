import React from 'react';
import { Sparkles, Trophy, ArrowRight } from 'lucide-react';

interface HomeFinalCtaProps {
  onJoinClick: () => void;
  onLeaderboardClick: () => void;
}

export const HomeFinalCta: React.FC<HomeFinalCtaProps> = ({
  onJoinClick,
  onLeaderboardClick,
}) => {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 text-center shadow-xs relative overflow-hidden">
        {/* Subtle accent blur */}
        <div className="absolute top-0 right-1/3 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready to climb the NUB rankings?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Connect Your Profiles & Start Competing
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Verify your handles on Codeforces, CodeChef, LeetCode, and AtCoder. Join hundreds of your university peers on Northern University Bangladesh's centralized leaderboard.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={onJoinClick}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Join the Community</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onLeaderboardClick}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-blue-600" />
              <span>Explore Standings</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
