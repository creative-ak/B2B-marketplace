import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ShieldAlert, ArrowLeft, Clock, UserCheck } from 'lucide-react';

export const ImpersonationBanner: React.FC = () => {
  const { impersonation, stopImpersonation } = useMarketplace();

  if (!impersonation.isImpersonating || !impersonation.targetUser) {
    return null;
  }

  const { targetUser, reason, startedAt, realAdmin } = impersonation;
  const timeFormatted = new Date(startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-amber-500 text-slate-950 px-4 py-2.5 shadow-md sticky top-0 z-50 border-b border-amber-600">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-950 text-amber-400 shrink-0 font-bold">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold flex items-center gap-2">
              <span>Admin Impersonation Active</span>
              <span className="text-xs bg-slate-950/15 px-2 py-0.5 rounded font-mono">
                Admin: {realAdmin?.name}
              </span>
            </div>
            <div className="text-xs opacity-90 flex items-center gap-2 mt-0.5">
              <span>Viewing as: <strong>{targetUser.name}</strong> ({targetUser.businessName} · {targetUser.role.toUpperCase()})</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Started: {timeFormatted}</span>
              <span>·</span>
              <span className="italic">Reason: "{reason}"</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs hidden md:inline text-slate-900 bg-amber-400/80 px-2 py-1 rounded">
            Audit logging enabled & privilege escalation locked
          </span>
          <button
            onClick={stopImpersonation}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-900 text-white rounded text-xs font-semibold shadow transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Admin Console
          </button>
        </div>
      </div>
    </div>
  );
};
