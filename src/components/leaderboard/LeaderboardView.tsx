import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Trophy,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Minus,
  Medal,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Code2,
  Sparkles,
  Calendar,
  User,
} from 'lucide-react';
import { StudentProfile, NUBPCLevel } from '../../types';
import { LevelBadge } from '../common/LevelBadge';
import { PlatformBadge } from '../common/PlatformBadge';

interface LeaderboardViewProps {
  students: StudentProfile[];
  currentUserId?: string;
  onSelectStudent: (username: string) => void;
  onOpenSignup: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  students,
  currentUserId,
  onSelectStudent,
  onOpenSignup,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [batchFilter, setBatchFilter] = useState('ALL');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [timeframe, setTimeframe] = useState<'all_time' | 'this_year' | 'this_semester' | 'this_month'>('all_time');
  const [sortBy, setSortBy] = useState<'rating_desc' | 'rating_asc' | 'change_desc' | 'solved_desc'>('rating_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Extract unique departments & batches
  const departments = useMemo(() => {
    const set = new Set(students.map((s) => s.department));
    return Array.from(set).sort();
  }, [students]);

  const batches = useMemo(() => {
    const set = new Set(students.map((s) => s.batch));
    return Array.from(set).sort();
  }, [students]);

  const levels: NUBPCLevel[] = ['Grandmaster', 'Master', 'Expert', 'Specialist', 'Pupil', 'Newbie'];

  // Filter & Sort
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        if (!s.isActive) return false;

        const matchesSearch =
          s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.studentId.includes(searchTerm);

        const matchesDept = departmentFilter === 'ALL' || s.department === departmentFilter;
        const matchesBatch = batchFilter === 'ALL' || s.batch === batchFilter;
        const matchesLevel = levelFilter === 'ALL' || s.level === levelFilter;

        return matchesSearch && matchesDept && matchesBatch && matchesLevel;
      })
      .sort((a, b) => {
        if (sortBy === 'rating_desc') return b.overallRating - a.overallRating;
        if (sortBy === 'rating_asc') return a.overallRating - b.overallRating;
        if (sortBy === 'change_desc') return b.ratingChange - a.ratingChange;
        if (sortBy === 'solved_desc') return (b.solvedProblemsCount || 0) - (a.solvedProblemsCount || 0);
        return 0;
      });
  }, [students, searchTerm, departmentFilter, batchFilter, levelFilter, sortBy, timeframe]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage, itemsPerPage]);

  const topThree = useMemo(() => {
    return [...students]
      .filter((s) => s.isActive)
      .sort((a, b) => b.overallRating - a.overallRating)
      .slice(0, 3);
  }, [students]);

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
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Page Title & Intro */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>Official Standings</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            NUBPC Leaderboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Unified ratings updated weekly across Codeforces, CodeChef, LeetCode, and AtCoder.
          </p>
        </div>

        <button
          onClick={onOpenSignup}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Join Leaderboard</span>
        </button>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {topThree.map((student, idx) => {
          const isCurrent = currentUserId === student.id;
          const podiumStyles = [
            {
              border: 'border-amber-300 ring-2 ring-amber-400/20',
              badge: 'bg-amber-500 text-white',
              title: 'Gold • Rank #1',
              gradient: 'from-amber-500/10 via-amber-100/20 to-transparent',
            },
            {
              border: 'border-slate-300 ring-2 ring-slate-400/20',
              badge: 'bg-slate-500 text-white',
              title: 'Silver • Rank #2',
              gradient: 'from-slate-400/10 via-slate-100/20 to-transparent',
            },
            {
              border: 'border-amber-200 ring-2 ring-amber-300/20',
              badge: 'bg-amber-700 text-white',
              title: 'Bronze • Rank #3',
              gradient: 'from-amber-700/10 via-orange-100/20 to-transparent',
            },
          ][idx];

          return (
            <div
              key={student.id}
              onClick={() => onSelectStudent(student.username)}
              className={`relative overflow-hidden rounded-2xl bg-white border p-6 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                podiumStyles.border
              } ${isCurrent ? 'ring-3 ring-blue-500' : ''}`}
            >
              <div
                className={`absolute top-0 right-0 left-0 h-24 bg-gradient-to-b ${podiumStyles.gradient} pointer-events-none`}
              />

              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={student.avatar}
                      alt={student.fullName}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${podiumStyles.badge}`}
                    >
                      #{idx + 1}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-base text-slate-900 hover:text-blue-600 transition-colors">
                        {student.fullName}
                      </h3>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded font-mono">
                          YOU
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-mono">@{student.username}</p>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {student.department} • Batch {student.batch}
                    </div>
                  </div>
                </div>

                <LevelBadge level={student.level} size="sm" />
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">
                    Overall Rating
                  </div>
                  <div className="text-2xl font-black font-mono text-slate-900">
                    {student.overallRating}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">
                    Change
                  </div>
                  <div
                    className={`text-xs font-mono font-bold inline-flex items-center gap-0.5 ${
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
          );
        })}
      </div>

      {/* Timeframe Filters Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1">
          {[
            { id: 'all_time', label: 'All Time' },
            { id: 'this_year', label: 'This Year (2026)' },
            { id: 'this_semester', label: 'This Semester (Summer 26)' },
            { id: 'this_month', label: 'This Month' },
          ].map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === tf.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing {filteredStudents.length} of {students.length} students
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, handle, or ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50"
            />
          </div>

          {/* Quick Sorting dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-medium rounded-xl border border-slate-200 py-2 px-3 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="rating_desc">Highest Rating</option>
              <option value="rating_asc">Lowest Rating</option>
              <option value="change_desc">Biggest Rating Surge</option>
              <option value="solved_desc">Most Problems Solved</option>
            </select>
          </div>
        </div>

        {/* Filter Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Dept Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Department:</span>
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs rounded-lg border border-slate-200 py-1.5 px-2 bg-slate-50 text-slate-700"
            >
              <option value="ALL">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Batch Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Batch:</span>
            <select
              value={batchFilter}
              onChange={(e) => {
                setBatchFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs rounded-lg border border-slate-200 py-1.5 px-2 bg-slate-50 text-slate-700"
            >
              <option value="ALL">All Batches</option>
              {batches.map((batch) => (
                <option key={batch} value={batch}>
                  Batch {batch}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Tier:</span>
            <select
              value={levelFilter}
              onChange={(e) => {
                setLevelFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs rounded-lg border border-slate-200 py-1.5 px-2 bg-slate-50 text-slate-700"
            >
              <option value="ALL">All Levels</option>
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 text-center w-16">Rank</th>
              <th className="py-3.5 px-4">Student</th>
              <th className="py-3.5 px-3">Dept</th>
              <th className="py-3.5 px-3">Batch</th>
              <th className="py-3.5 px-4 text-right">Overall Rating</th>
              <th className="py-3.5 px-3 text-center">Rating Δ</th>
              <th className="py-3.5 px-3 text-center">Codeforces</th>
              <th className="py-3.5 px-3 text-center">CodeChef</th>
              <th className="py-3.5 px-3 text-center">LeetCode</th>
              <th className="py-3.5 px-3 text-center">AtCoder</th>
              <th className="py-3.5 px-4 text-center">NUBPC Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedStudents.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-400">
                  No students found matching your criteria.
                </td>
              </tr>
            ) : (
              paginatedStudents.map((student) => {
                const hasIncreased = student.ratingChange > 0;
                const hasDecreased = student.ratingChange < 0;
                const isCurrent = currentUserId === student.id;

                return (
                  <tr
                    key={student.id}
                    onClick={() => onSelectStudent(student.username)}
                    className={`transition-colors cursor-pointer group ${
                      isCurrent
                        ? 'bg-blue-50/70 hover:bg-blue-100/60 font-medium'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-4 text-center font-bold">
                      <div className="flex justify-center">{getRankBadge(student.rank)}</div>
                    </td>

                    {/* Student Name & Avatar */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.fullName}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                            <span>{student.fullName}</span>
                            {isCurrent && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-600 text-white rounded font-mono">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            @{student.username}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Dept */}
                    <td className="py-4 px-3 font-semibold text-slate-700">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {student.department}
                      </span>
                    </td>

                    {/* Batch */}
                    <td className="py-4 px-3 text-slate-600 font-mono text-[11px]">
                      {student.batch}
                    </td>

                    {/* Overall Rating */}
                    <td className="py-4 px-4 text-right">
                      <div className="font-extrabold font-mono text-sm text-slate-900">
                        {student.overallRating}
                      </div>
                    </td>

                    {/* Rating Change */}
                    <td className="py-4 px-3 text-center">
                      <div
                        className={`text-xs font-mono font-semibold inline-flex items-center justify-center gap-0.5 ${
                          hasIncreased
                            ? 'text-emerald-600'
                            : hasDecreased
                            ? 'text-rose-600'
                            : 'text-slate-400'
                        }`}
                      >
                        {hasIncreased && <TrendingUp className="w-3 h-3" />}
                        {hasDecreased && <TrendingDown className="w-3 h-3" />}
                        {!hasIncreased && !hasDecreased && <Minus className="w-3 h-3" />}
                        {hasIncreased ? `+${student.ratingChange}` : student.ratingChange}
                      </div>
                    </td>

                    {/* Platform Ratings */}
                    <td className="py-4 px-3 text-center">
                      <PlatformBadge
                        platform="codeforces"
                        data={student.codingProfiles.codeforces}
                        showHandle={false}
                      />
                    </td>
                    <td className="py-4 px-3 text-center">
                      <PlatformBadge
                        platform="codechef"
                        data={student.codingProfiles.codechef}
                        showHandle={false}
                      />
                    </td>
                    <td className="py-4 px-3 text-center">
                      <PlatformBadge
                        platform="leetcode"
                        data={student.codingProfiles.leetcode}
                        showHandle={false}
                      />
                    </td>
                    <td className="py-4 px-3 text-center">
                      <PlatformBadge
                        platform="atcoder"
                        data={student.codingProfiles.atcoder}
                        showHandle={false}
                      />
                    </td>

                    {/* NUBPC Level */}
                    <td className="py-4 px-4 text-center">
                      <LevelBadge level={student.level} size="sm" />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {paginatedStudents.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400">
            No students found.
          </div>
        ) : (
          paginatedStudents.map((student) => {
            const isCurrent = currentUserId === student.id;
            return (
              <div
                key={student.id}
                onClick={() => onSelectStudent(student.username)}
                className={`bg-white p-4 rounded-xl border shadow-2xs space-y-3 cursor-pointer ${
                  isCurrent
                    ? 'border-blue-400 ring-2 ring-blue-200/50 bg-blue-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getRankBadge(student.rank)}
                    <img
                      src={student.avatar}
                      alt={student.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-900 text-sm">{student.fullName}</h4>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-600 text-white rounded font-mono">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        {student.department} • Batch {student.batch}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-extrabold font-mono text-slate-900">
                      {student.overallRating}
                    </div>
                    <LevelBadge level={student.level} size="sm" />
                  </div>
                </div>

                {/* Rating Change & Platform Badges */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">
                    Change:{' '}
                    <strong
                      className={
                        student.ratingChange >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }
                    >
                      {student.ratingChange >= 0
                        ? `+${student.ratingChange}`
                        : student.ratingChange}
                    </strong>
                  </span>

                  <div className="flex flex-wrap items-center gap-1">
                    <PlatformBadge
                      platform="codeforces"
                      data={student.codingProfiles.codeforces}
                      showHandle={false}
                    />
                    <PlatformBadge
                      platform="codechef"
                      data={student.codingProfiles.codechef}
                      showHandle={false}
                    />
                    <PlatformBadge
                      platform="leetcode"
                      data={student.codingProfiles.leetcode}
                      showHandle={false}
                    />
                    <PlatformBadge
                      platform="atcoder"
                      data={student.codingProfiles.atcoder}
                      showHandle={false}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-600">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of{' '}
            {filteredStudents.length} coders
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-mono font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
