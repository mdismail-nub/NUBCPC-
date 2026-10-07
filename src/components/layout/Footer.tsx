import React from 'react';
import { Heart, Terminal } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-slate-200/80 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                <span className="font-mono">&lt;/&gt;</span>
              </div>
              <span className="font-bold text-base tracking-tight text-slate-900">
                NUBPC
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Northern University Bangladesh Programming Community — where passionate coders learn, compete, and conquer.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Terminal className="w-3.5 h-3.5 text-blue-500" />
              <span>Ashkona, Dhaka • Est. 2023</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => onNavigate('leaderboard')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Global Leaderboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contests')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Contests & Standings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('resources')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Curated CP Resources
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('notices')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Official Notices
                </button>
              </li>
            </ul>
          </div>

          {/* Competitive Platforms */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Synced Platforms
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <a
                  href="https://codeforces.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-600 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Codeforces</span>
                  <span className="text-[10px] text-slate-400 font-mono">(35% weight)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.codechef.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-600 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>CodeChef</span>
                  <span className="text-[10px] text-slate-400 font-mono">(25% weight)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://atcoder.jp"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-600 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>AtCoder</span>
                  <span className="text-[10px] text-slate-400 font-mono">(20% weight)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://leetcode.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-600 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>LeetCode</span>
                  <span className="text-[10px] text-slate-400 font-mono">(20% weight)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Community & Disclaimer */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Community
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 mb-4">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-blue-600 transition-colors"
                >
                  About the Community
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Coordinator & Admin Panel
                </button>
              </li>
            </ul>
            <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
              Disclaimer: NUBPC is a student-led developer & competitive programming initiative of Northern University Bangladesh students.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} NUBPC. Built with precision for NUB problem solvers.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for the programming community
          </p>
        </div>
      </div>
    </footer>
  );
};
