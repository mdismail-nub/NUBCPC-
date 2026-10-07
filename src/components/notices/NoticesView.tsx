import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  Tag,
  Pin,
  ArrowRight,
  User,
  X,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { Notice } from '../../types';
import { ContentRenderer, sanitizeText } from '../common/ContentRenderer';

interface NoticesViewProps {
  notices: Notice[];
  initialSelectedNoticeId?: string;
}

export const NoticesView: React.FC<NoticesViewProps> = ({
  notices,
  initialSelectedNoticeId,
}) => {
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(
    notices.find((n) => n.id === initialSelectedNoticeId) || null
  );
  const [copied, setCopied] = useState(false);

  // Newest notices first (already sorted by store, ensure stability)
  const sortedNotices = [...notices].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Contest':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Workshop':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Announcement':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Important':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Title & Intro */}
      <div className="border-b border-slate-200/80 pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
          <Bell className="w-3.5 h-3.5" />
          <span>Announcements & Circulars</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Community Notices
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Official bulletins regarding upcoming IUPCs, workshops, rating recalculations, and orientation sessions.
        </p>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {sortedNotices.map((notice) => {
          const formattedDate = new Date(notice.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          return (
            <div
              key={notice.id}
              onClick={() => setSelectedNotice(notice)}
              className="group bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  {notice.isPinned && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                      <Pin className="w-3 h-3 fill-rose-500" />
                      <span>Pinned</span>
                    </span>
                  )}

                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${getCategoryBadgeClass(
                      notice.category
                    )}`}
                  >
                    {notice.category}
                  </span>

                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formattedDate}
                  </span>
                </div>

                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                  {sanitizeText(notice.title)}
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                  {sanitizeText(notice.shortDescription)}
                </p>

                <div className="text-[11px] text-slate-400 font-medium">
                  Issued by <span className="text-slate-700">{notice.author}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:self-center text-xs font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                <span>Read Circular</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/70">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getCategoryBadgeClass(
                      selectedNotice.category
                    )}`}
                  >
                    {selectedNotice.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedNotice.date}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 pt-1">
                  {sanitizeText(selectedNotice.title)}
                </h2>
              </div>

              <button
                onClick={() => setSelectedNotice(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700 leading-relaxed font-sans">
              <ContentRenderer content={selectedNotice.content} className="leading-relaxed" />

              {selectedNotice.tags && selectedNotice.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-slate-100">
                  <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
                  {selectedNotice.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div>
                Published by <span className="font-semibold text-slate-800">{selectedNotice.author}</span>
              </div>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-700 font-medium"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Notice</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
