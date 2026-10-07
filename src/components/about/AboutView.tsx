import React from 'react';
import {
  Code2,
  Target,
  Compass,
  Trophy,
  BookOpen,
  Users,
  Terminal,
  Award,
  Shield,
  Lightbulb,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const leadershipTeam = [
    {
      role: 'Community President',
      name: 'Executive Committee Lead',
      batch: 'Batch 52nd',
      description: 'Overseeing community operations, university outreach, and contest calendar.',
      icon: Shield,
    },
    {
      role: 'Vice President & CP Lead',
      name: 'Technical Coordination Cell',
      batch: 'Batch 53rd',
      description: 'Directing problem-setting panels, division upsolving sessions, and rating synchronization.',
      icon: Terminal,
    },
    {
      role: 'Head of Problem Setting',
      name: 'Arena & Testcase Panel',
      batch: 'Batch 54th',
      description: 'Designing high quality algorithmic problems for intra-university clashes and speed sprints.',
      icon: Trophy,
    },
    {
      role: 'Academic & Mentorship Lead',
      name: 'Student Coaching Wing',
      batch: 'Batch 55th',
      description: 'Curating resource sheets, freshman bootcamps, and weekly guidance for new coders.',
      icon: BookOpen,
    },
    {
      role: 'Events & Logistics Lead',
      name: 'Operations Directorate',
      batch: 'Batch 55th',
      description: 'Managing lab allocations, contest day logistics, and workshop broadcasts.',
      icon: Users,
    },
    {
      role: 'Platform & Tech Lead',
      name: 'Web & Systems Committee',
      batch: 'Batch 54th',
      description: 'Maintaining the NUBPC portal, multi-platform sync engine, and leaderboard integrity.',
      icon: Code2,
    },
  ];

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Hero / About NUBPC */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold">
          <Code2 className="w-3.5 h-3.5" />
          <span>Independent Student Organization</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          About NUBPC
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          The <strong>Northern University Bangladesh Programming Community (NUBPC)</strong> is a student-led algorithmic sanctuary dedicated to fostering technical excellence, competitive programming mastery, and collaborative problem-solving among engineering undergraduates.
        </p>
      </div>

      {/* Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mission */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Our Mission</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            To cultivate an environment where students regardless of their initial proficiency can develop rigorous computational thinking, master data structures and algorithms, and gain the confidence to compete on national and global stages such as ICPC, IUPC, and top-tier tech recruitment.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Our Vision</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            To establish Northern University Bangladesh as a premier competitive programming powerhouse in Bangladesh, recognized for producing high-caliber problem solvers, innovative engineers, and ethical leaders in the global technology ecosystem.
          </p>
        </div>
      </div>

      {/* What We Do */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            What We Do
          </h2>
          <p className="text-sm text-slate-500">
            A continuous loop of learning, competing, analyzing, and leveling up.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contests */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">Intra & Speed Contests</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We host bi-weekly speed sprints and semestral flagship IUPCs with automated real-time standings. Problems range from Div 3 introductory challenges to advanced ICPC-level graph and math problems.
            </p>
          </div>

          {/* Workshops */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">Intensive Workshops</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Structured hands-on tracks covering C++ STL, Dynamic Programming, Segment Trees, Number Theory, and Graph Traversals taught by high-rating seniors and alumni mentors.
            </p>
          </div>

          {/* Problem Solving Sessions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">Problem Solving Sessions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Weekly lab meetups dedicated to upsolving recent Codeforces rounds, analyzing subtle corner cases, and clarifying doubts in a supportive, zero-judgment atmosphere.
            </p>
          </div>
        </div>
      </div>

      {/* Community Leadership Roles */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Community Leadership & Wings
          </h2>
          <p className="text-sm text-slate-500">
            Organized into dedicated wings to ensure smooth governance and constant support.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {leadershipTeam.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                    {item.batch}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                    {item.role}
                  </span>
                  <h4 className="font-extrabold text-base text-slate-900 mt-0.5">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Affiliation Disclaimer */}
      <div className="bg-slate-100 rounded-2xl border border-slate-200 p-6 text-xs text-slate-600 leading-relaxed text-center max-w-3xl mx-auto space-y-1">
        <p className="font-bold text-slate-800">
          Community Governance & Affiliation Notice
        </p>
        <p>
          NUBPC is an autonomous, student-led academic club founded and run by the undergraduate students of Northern University Bangladesh. The community does not claim official administrative university affiliation unless specifically ratified by university authorities.
        </p>
      </div>
    </div>
  );
};
