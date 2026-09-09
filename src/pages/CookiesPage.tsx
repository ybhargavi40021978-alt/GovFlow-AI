import React from 'react';
import { useGovFlow } from '../store/GovFlowContext';
import { Cookie, Shield, Check, Sliders } from 'lucide-react';

export const CookiesPage: React.FC = () => {
  const { cookiePreferences, updateCookiePreferences, acceptAllCookies, rejectNonEssentialCookies } = useGovFlow();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-gov-blue uppercase tracking-wider mb-2">
          <span>Transparency Controls</span>
          <span>•</span>
          <span>Cookie & Tracker Settings</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gov-navy tracking-tight">
          Cookie Policy & Controls
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          GovFlow AI maintains zero third-party commercial trackers. Adjust your preferences for session caching, language persistence, and performance logging below.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        {/* Category 1: Essential */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Shield className="w-4 h-4 text-gov-blue" />
              <span>Strictly Essential Civic Tokens</span>
            </div>
            <span className="text-[10px] font-bold text-gov-blue bg-blue-100 px-2 py-0.5 rounded">
              Always Active
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Essential for cryptographic CSRF tokens, secure session continuity, role authentication, and DigiLocker payload routing.
          </p>
        </div>

        {/* Category 2: Preferences */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Sliders className="w-4 h-4 text-amber-500" />
              <span>Language & Accessibility Preferences</span>
            </div>
            <input
              type="checkbox"
              checked={cookiePreferences.preferences}
              onChange={(e) => updateCookiePreferences({ preferences: e.target.checked })}
              className="w-4 h-4 text-gov-blue rounded border-slate-300 focus:ring-blue-500"
            />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Remembers your chosen interface language (English, Hindi, Tamil, Telugu) and font size/high-contrast settings.
          </p>
        </div>

        {/* Category 3: Analytics */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Cookie className="w-4 h-4 text-emerald-600" />
              <span>Anonymous Service Latency Analytics</span>
            </div>
            <input
              type="checkbox"
              checked={cookiePreferences.analytics}
              onChange={(e) => updateCookiePreferences({ analytics: e.target.checked })}
              className="w-4 h-4 text-gov-blue rounded border-slate-300 focus:ring-blue-500"
            />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Measures system throughput and API endpoint response times without attaching citizen identifiers.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={rejectNonEssentialCookies}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Reject Non-Essential
          </button>
          <button
            type="button"
            onClick={acceptAllCookies}
            className="px-5 py-2.5 bg-gov-blue hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};
