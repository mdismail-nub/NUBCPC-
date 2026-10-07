import React from 'react';
import {
  Code,
  Award,
  TerminalSquare,
  Users2,
  TrendingUp,
  Cpu,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface CommunityFeaturesProps {
  onNavigate: (page: string) => void;
}

export const CommunityFeatures: React.FC<CommunityFeaturesProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: TerminalSquare,
      title: 'Unified Competitive Rating',
      description:
        'A mathematically weighted rating combining Codeforces (35%), CodeChef (25%), AtCoder (20%), and LeetCode (20%) into one definitive benchmark.',
      actionLabel: 'Explore System',
      page: 'about',
      badge: 'Multi-Platform',
    },
    {
      icon: Code,
      title: 'Campus IUPC & Sprints',
      description:
        'Regular intra-university coding clashes, fast-paced speed sprints, and ICPC preliminary trials hosted with live standings and team qualifications.',
      actionLabel: 'View Contests',
      page: 'contests',
      badge: 'Bi-Weekly',
    },
    {
      icon: Cpu,
      title: 'Curated Roadmaps & Sheets',
      description:
        'Vetted learning paths for C++ STL, CSES Problem Set, Dynamic Programming, Graph Theory, and Blind 75 interview problem patterns.',
      actionLabel: 'Browse Resources',
      page: 'resources',
      badge: 'Hand-Picked',
    },
    {
      icon: Users2,
      title: 'Mentorship & Team Camps',
      description:
        'Peer-to-peer mentoring where experienced problem solvers guide juniors through division upsolving and contest post-mortems.',
      actionLabel: 'Meet the Community',
      page: 'about',
      badge: 'Batch 52–58',
    },
  ];

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Why NUBPC</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Engineered for Northern Coders
        </h2>
        <p className="text-sm sm:text-base text-slate-500">
          A modern platform designed to eliminate scattered ranking spreadsheets and empower students with real algorithmic momentum.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="group p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {item.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100">
                <button
                  onClick={() => onNavigate(item.page)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
