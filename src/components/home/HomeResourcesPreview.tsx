import React from 'react';
import { BookOpen, ExternalLink, ArrowRight, Star } from 'lucide-react';
import { Resource } from '../../types';
import { sanitizeText } from '../common/ContentRenderer';

interface HomeResourcesPreviewProps {
  resources: Resource[];
  onViewAll: () => void;
}

export const HomeResourcesPreview: React.FC<HomeResourcesPreviewProps> = ({
  resources,
  onViewAll,
}) => {
  const featured = resources.slice(0, 3);

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curated Knowledge</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Learning Resources & Practice
          </h2>
          <p className="text-sm text-slate-500">
            Hand-picked algorithms, CP roadmaps, and interview problem sets.
          </p>
        </div>

        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 group cursor-pointer"
        >
          <span>View All Resources</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featured.map((res) => (
          <div
            key={res.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  {res.category}
                </span>
                <span className="text-[10px] font-bold uppercase text-slate-500 font-mono">
                  {res.difficulty}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {sanitizeText(res.title)}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {sanitizeText(res.description)}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                {res.type}
              </span>

              <a
                href={res.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors"
              >
                <span>Explore</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
