import React from 'react';
import { Bell, Calendar, ArrowRight, Pin } from 'lucide-react';
import { Notice } from '../../types';
import { sanitizeText } from '../common/ContentRenderer';

interface HomeNoticesPreviewProps {
  notices: Notice[];
  onViewAll: () => void;
  onSelectNotice: (id: string) => void;
}

export const HomeNoticesPreview: React.FC<HomeNoticesPreviewProps> = ({
  notices,
  onViewAll,
  onSelectNotice,
}) => {
  const latest = notices.slice(0, 3);

  return (
    <section className="py-12 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <Bell className="w-3.5 h-3.5" />
              <span>Official Circulars</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Latest Community Notices
            </h2>
            <p className="text-sm text-slate-500">
              Stay informed about upcoming IUPCs, workshops, and orientation sessions.
            </p>
          </div>

          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 group cursor-pointer"
          >
            <span>View All Notices</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latest.map((n) => (
            <div
              key={n.id}
              onClick={() => onSelectNotice(n.id)}
              className="p-5 rounded-2xl bg-[#FAFAFC] border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60">
                    {n.category}
                  </span>
                  {n.isPinned && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600">
                      <Pin className="w-2.5 h-2.5 fill-rose-500" />
                      Pinned
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                  {sanitizeText(n.title)}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {sanitizeText(n.shortDescription)}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>{n.date}</span>
                <span className="text-blue-600 font-sans font-semibold group-hover:underline">
                  Read Circular →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
