import React, { useState } from 'react';
import {
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { PlatformAccount, VerificationStatus } from '../../types';

interface PlatformConnectionCardProps {
  platformName: string;
  platformKey: 'codeforces' | 'codechef' | 'leetcode' | 'atcoder';
  colorTheme: {
    bg: string;
    text: string;
    border: string;
    badgeBg: string;
  };
  weightPercent: number;
  account?: PlatformAccount;
  onVerify: (handle: string) => Promise<PlatformAccount>;
  readOnly?: boolean;
}

export const PlatformConnectionCard: React.FC<PlatformConnectionCardProps> = ({
  platformName,
  platformKey,
  colorTheme,
  weightPercent,
  account,
  onVerify,
  readOnly = false,
}) => {
  const [handleInput, setHandleInput] = useState(account?.handle || '');
  const [status, setStatus] = useState<VerificationStatus>(account?.status || (account?.verified ? 'verified' : 'not_connected'));
  const [errorMessage, setErrorMessage] = useState(account?.errorMessage || '');
  const [currentAccount, setCurrentAccount] = useState<PlatformAccount | undefined>(account);

  const handleVerifyClick = async () => {
    if (!handleInput.trim()) return;
    setStatus('checking');
    setErrorMessage('');

    try {
      const result = await onVerify(handleInput.trim());
      setCurrentAccount(result);
      setStatus(result.status || (result.verified ? 'verified' : 'not_connected'));
      if (result.status === 'invalid') {
        setErrorMessage(result.errorMessage || 'Handle not found or invalid.');
      }
    } catch (err: any) {
      setStatus('temporarily_unavailable');
      setErrorMessage(err.message || 'Platform service temporarily unreachable.');
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Verified</span>
          </span>
        );
      case 'checking':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
            <span>Checking...</span>
          </span>
        );
      case 'invalid':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>Invalid</span>
          </span>
        );
      case 'temporarily_unavailable':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>Unavailable</span>
          </span>
        );
      case 'not_connected':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            <span>Not Connected</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${colorTheme.bg}`} />
          <h4 className="text-sm font-bold text-slate-900">{platformName}</h4>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
            Weight: {weightPercent}%
          </span>
        </div>

        <div>{getStatusBadge()}</div>
      </div>

      {/* Input / Info Area */}
      {!readOnly && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={`Enter ${platformName} handle`}
            value={handleInput}
            disabled={status === 'checking'}
            onChange={(e) => {
              setHandleInput(e.target.value);
              if (status !== 'checking') setStatus('not_connected');
            }}
            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
          />

          <button
            type="button"
            onClick={handleVerifyClick}
            disabled={status === 'checking' || !handleInput.trim()}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-blue-600 disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
          >
            {status === 'checking' ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : status === 'verified' ? (
              <>
                <RefreshCw className="w-3 h-3" />
                <span>Re-verify</span>
              </>
            ) : (
              <span>Verify</span>
            )}
          </button>
        </div>
      )}

      {/* Verified Details */}
      {status === 'verified' && currentAccount && (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 text-[11px] block">Current Rating</span>
            <span className="text-lg font-bold font-mono text-slate-900">
              {currentAccount.rating ?? '—'}
            </span>
            {currentAccount.rank && (
              <span className="text-[11px] text-slate-500 ml-1.5 font-mono capitalize">
                ({currentAccount.rank})
              </span>
            )}
          </div>

          <div className="text-right space-y-1">
            {currentAccount.profileUrl && (
              <a
                href={currentAccount.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-semibold hover:underline"
              >
                <span>View Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
              <Clock className="w-2.5 h-2.5" />
              <span>
                Synced{' '}
                {currentAccount.lastUpdated
                  ? new Date(currentAccount.lastUpdated).toLocaleDateString()
                  : 'recently'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Error message display */}
      {errorMessage && (status === 'invalid' || status === 'temporarily_unavailable') && (
        <p className="text-[11px] text-rose-600 flex items-center gap-1 pt-1">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          <span>{errorMessage}</span>
        </p>
      )}
    </div>
  );
};
