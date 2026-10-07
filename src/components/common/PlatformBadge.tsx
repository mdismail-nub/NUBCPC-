import React from 'react';
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import { PlatformAccount } from '../../types';

interface PlatformBadgeProps {
  platform: 'codeforces' | 'codechef' | 'leetcode' | 'atcoder';
  data?: PlatformAccount;
  showHandle?: boolean;
}

const PLATFORM_CONFIGS = {
  codeforces: {
    name: 'Codeforces',
    short: 'CF',
    color: 'text-blue-700 bg-blue-50/80 border-blue-200/80 hover:bg-blue-100/70',
    profileUrl: (h: string) => `https://codeforces.com/profile/${h}`,
  },
  codechef: {
    name: 'CodeChef',
    short: 'CC',
    color: 'text-amber-800 bg-amber-50/80 border-amber-200/80 hover:bg-amber-100/70',
    profileUrl: (h: string) => `https://www.codechef.com/users/${h}`,
  },
  leetcode: {
    name: 'LeetCode',
    short: 'LC',
    color: 'text-amber-700 bg-orange-50/80 border-orange-200/80 hover:bg-orange-100/70',
    profileUrl: (h: string) => `https://leetcode.com/u/${h}/`,
  },
  atcoder: {
    name: 'AtCoder',
    short: 'AC',
    color: 'text-slate-800 bg-slate-100/80 border-slate-200/80 hover:bg-slate-200/70',
    profileUrl: (h: string) => `https://atcoder.jp/users/${h}`,
  },
};

export const PlatformBadge: React.FC<PlatformBadgeProps> = ({
  platform,
  data,
  showHandle = true,
}) => {
  const config = PLATFORM_CONFIGS[platform];

  if (!data || !data.verified) {
    return (
      <span className="inline-flex items-center text-xs px-2 py-0.5 rounded text-slate-400 bg-slate-50 border border-slate-200/60 font-mono">
        —
      </span>
    );
  }

  return (
    <a
      href={config.profileUrl(data.handle)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-medium transition-all group ${config.color}`}
      title={`${config.name}: ${data.handle} (Rating: ${data.rating || 'N/A'})`}
    >
      <span className="font-semibold">{config.short}</span>
      <span className="font-bold text-slate-900">{data.rating ?? '—'}</span>
      {showHandle && (
        <span className="text-[11px] text-slate-500 font-sans hidden sm:inline">
          @{data.handle}
        </span>
      )}
      <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
      <ExternalLink className="w-2.5 h-2.5 opacity-40 group-hover:opacity-100 transition-opacity" />
    </a>
  );
};
