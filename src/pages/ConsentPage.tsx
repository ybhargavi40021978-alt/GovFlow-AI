import React from 'react';
import { useGovFlow } from '../store/GovFlowContext';
import { 
  ShieldCheck, 
  Lock, 
  Check, 
  X, 
  Clock, 
  Building2, 
  FileText, 
  AlertCircle,
  Eye
} from 'lucide-react';

export const ConsentPage: React.FC = () => {
  const { consents, toggleConsentStatus, citizenProfile, currentUser } = useGovFlow();

  const activeCount = consents.filter(c => c.status === 'active').length;
  const citizenDisplayId = citizenProfile?.id || currentUser?.id || 'ANONYMOUS-VAULT';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-gov-blue uppercase tracking-wider mb-2">
          <span>Data Privacy & Federation</span>
          <span>•</span>
          <span>Consent-Based Access</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gov-navy tracking-tight">
          You control your data
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          GovFlow AI operates on explicit, granular citizen authorizations. No government department or API adapter can access your documents without your direct consent.
        </p>
      </div>

      {/* Summary Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-gov-blue flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Active Data Sharing Authorizations ({activeCount})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Citizen ID: <span className="font-mono font-semibold text-slate-700">{citizenDisplayId}</span>
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Zero Unauthorized Centralization
        </span>
      </div>

      {/* Consents List */}
      <div className="space-y-4">
        {consents.map((consent) => {
          const isActive = consent.status === 'active';
          return (
            <div
              key={consent.id}
              className={`p-6 rounded-3xl border transition-all bg-white shadow-card ${
                isActive ? 'border-slate-200/90' : 'border-slate-200 bg-slate-50/50 opacity-80'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-gov-blue bg-blue-50 px-2 py-0.5 rounded">
                      {consent.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {consent.serviceName}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{consent.department}</span>
                  </p>
                </div>

                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {isActive ? '✓ Active Consent' : '✕ Access Denied / Revoked'}
                </span>
              </div>

              {/* Purpose & Data requested */}
              <div className="space-y-3 py-3 border-y border-slate-100 text-xs text-slate-600 mb-4">
                <div>
                  <span className="font-bold text-slate-800 block mb-0.5">Authorised Purpose:</span>
                  <p className="leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-700">
                    {consent.purpose}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-800 block mb-1.5">Authorized Data Attributes:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {consent.requestedData.map((field, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-blue-50/70 border border-blue-100 text-gov-blue text-[11px] font-semibold"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>

                {consent.grantedAt && (
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-mono pt-1">
                    <span>Authorized on: {consent.grantedAt}</span>
                    {consent.expiresAt && <span>Expires: {consent.expiresAt}</span>}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <p className="text-[11px] text-slate-400">
                  Revoking consent halts automated data exchange for this service immediately.
                </p>

                {isActive ? (
                  <button
                    type="button"
                    onClick={() => toggleConsentStatus(consent.id, 'denied')}
                    className="px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Revoke Consent</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleConsentStatus(consent.id, 'active')}
                    className="px-4 py-2 text-xs font-bold text-white bg-gov-blue hover:bg-blue-700 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Grant Consent</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
