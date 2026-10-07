import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  Star,
  Tag,
  Code2,
  Filter,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { Resource } from '../../types';
import { ContentRenderer, sanitizeText } from '../common/ContentRenderer';

interface ResourcesViewProps {
  resources: Resource[];
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({ resources }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const categories = [
    'ALL',
    'C/C++',
    'Data Structures',
    'Algorithms',
    'Competitive Programming',
    'Problem Solving',
    'Git & GitHub',
    'Web Development',
    'Interview Preparation',
  ];

  const difficulties = ['ALL', 'Beginner', 'Intermediate', 'Advanced'];

  const filtered = useMemo(() => {
    return resources.filter((res) => {
      const matchesSearch =
        res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'ALL' || res.category === selectedCategory;

      const matchesDifficulty =
        selectedDifficulty === 'ALL' || res.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [resources, searchTerm, selectedCategory, selectedDifficulty]);

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setStarredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Title & Intro */}
      <div className="border-b border-slate-200/80 pb-6 text-left">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Knowledge Repository</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Curated CP & Developer Resources
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">
          Hand-picked algorithmic sheets, textbooks, roadmap guides, and practice problems recommended by top NUB problem solvers.
        </p>
      </div>

      {/* Search & Difficulty Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, topic, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
              Difficulty:
            </span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="text-xs font-semibold rounded-xl border border-slate-200 py-2 px-3 bg-white text-slate-700 w-full sm:w-auto"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d === 'ALL' ? 'All Difficulties' : d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 no-scrollbar pb-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                {cat === 'ALL' ? 'All Categories' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400">
            No resources match your filters.
          </div>
        ) : (
          filtered.map((res) => {
            const isStarred = starredIds.has(res.id);

            return (
              <div
                key={res.id}
                onClick={() => setSelectedResource(res)}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between group cursor-pointer text-left"
              >
                <div className="space-y-3">
                  {/* Category & Difficulty Badges */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      {res.category}
                    </span>

                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        res.difficulty === 'Beginner'
                          ? 'bg-emerald-50 text-emerald-700'
                          : res.difficulty === 'Intermediate'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {res.difficulty}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {sanitizeText(res.title)}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                      {sanitizeText(res.description)}
                    </p>
                  </div>

                  {/* Recommended by */}
                  {res.recommendedBy && (
                    <div className="text-[11px] text-slate-400 pt-1">
                      Curated by <span className="text-slate-700 font-medium">{res.recommendedBy}</span>
                    </div>
                  )}
                </div>

                {/* Footer with Type & Action */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {res.type}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => toggleStar(res.id, e)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isStarred
                          ? 'bg-amber-50 border-amber-300 text-amber-500'
                          : 'border-slate-200 text-slate-400 hover:text-amber-500'
                      }`}
                      title="Bookmark"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400' : ''}`}
                      />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedResource(res);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Resource Details Modal */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] text-left">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/70">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60">
                    {selectedResource.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      selectedResource.difficulty === 'Beginner'
                        ? 'bg-emerald-50 text-emerald-700'
                        : selectedResource.difficulty === 'Intermediate'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {selectedResource.difficulty}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedResource.type}
                  </span>
                </div>

                <h2 className="text-xl font-extrabold text-slate-900 pt-1">
                  {sanitizeText(selectedResource.title)}
                </h2>
              </div>

              <button
                onClick={() => setSelectedResource(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700 leading-relaxed font-sans">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Overview & Synopsis
                </h4>
                <ContentRenderer content={selectedResource.description} />
              </div>

              {selectedResource.recommendedBy && (
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-0.5">
                  <span className="font-bold">Recommended By:</span>
                  <div>{selectedResource.recommendedBy}</div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  How to utilize this for NUBPC contests
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Study the conceptual principles, implement template codes locally in C++, and practice corresponding problem tags on Codeforces and CSES. Focus on edge cases and time complexities.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={(e) => toggleStar(selectedResource.id, e)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                  starredIds.has(selectedResource.id)
                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${starredIds.has(selectedResource.id) ? 'fill-amber-400 text-amber-500' : ''}`} />
                <span>{starredIds.has(selectedResource.id) ? 'Bookmarked' : 'Bookmark'}</span>
              </button>

              <a
                href={selectedResource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
              >
                <span>Open Resource</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
