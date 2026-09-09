import React, { useState } from 'react';
import { useGovFlow } from '../../store/GovFlowContext';
import { Cookie, Shield, Check, X, Sliders, CheckCircle2 } from 'lucide-react';

export const CookiePreferencesModal: React.FC = () => {
  const { 
    cookiePreferences, 
    updateCookiePreferences, 
    isCookieModalOpen, 
    setIsCookieModalOpen,
    acceptAllCookies,
    rejectNonEssentialCookies,
    t 
  } = useGovFlow();

  const [savedToast, setSavedToast] = useState(false);

  if (!isCookieModalOpen) return null;

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      setIsCookieModalOpen(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-elevation border border-slate-200 overflow-hidden select-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-gov-saffron flex items-center justify-center">
              <Cookie className="w-4 h-4" />
            </div>
            <div>
              <h2 id="cookie-modal-title" className="font-bold text-slate-800 text-base">
                {t('cookies.modalTitle')}
              </h2>
              <p className="text-xs text-slate-500">Transparent Civic Data Controls</p>
            </div>
          </div>
          <button 
            onClick={() => setIsCookieModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {savedToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t('cookies.savedToast')}</span>
            </div>
          )}

          <p className="text-xs text-slate-600 leading-relaxed">
            GovFlow AI respects data minimization. We do not engage in commercial tracking or profile selling. You can toggle preferences below:
          </p>

          {/* Essential */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gov-blue" />
                <h4 className="text-sm font-bold text-slate-800">
                  {t('cookies.essentialTitle')}
                </h4>
              </div>
              <span className="text-[11px] font-semibold text-gov-blue bg-blue-100 px-2 py-0.5 rounded">
                Always Required
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {t('cookies.essentialDesc')}
            </p>
          </div>

          {/* Preferences */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="text-sm font-bold text-slate-800">
                {t('cookies.prefTitle')}
              </h4>
              <input
                type="checkbox"
                checked={cookiePreferences.preferences}
                onChange={(e) => updateCookiePreferences({ preferences: e.target.checked })}
                className="w-4 h-4 text-gov-blue rounded border-slate-300 focus:ring-blue-500"
              />
            </div>
            <p className="text-xs text-slate-500">
              {t('cookies.prefDesc')}
            </p>
          </div>

          {/* Analytics */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="text-sm font-bold text-slate-800">
                {t('cookies.analyticsTitle')}
              </h4>
              <input
                type="checkbox"
                checked={cookiePreferences.analytics}
                onChange={(e) => updateCookiePreferences({ analytics: e.target.checked })}
                className="w-4 h-4 text-gov-blue rounded border-slate-300 focus:ring-blue-500"
              />
            </div>
            <p className="text-xs text-slate-500">
              {t('cookies.analyticsDesc')}
            </p>
          </div>

          {/* Optional Personalization */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="text-sm font-bold text-slate-800">
                {t('cookies.optionalTitle')}
              </h4>
              <input
                type="checkbox"
                checked={cookiePreferences.optional ?? false}
                onChange={(e) => updateCookiePreferences({ optional: e.target.checked })}
                className="w-4 h-4 text-gov-blue rounded border-slate-300 focus:ring-blue-500"
              />
            </div>
            <p className="text-xs text-slate-500">
              {t('cookies.optionalDesc')}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={acceptAllCookies}
            className="text-xs font-bold text-gov-blue hover:underline"
          >
            {t('cookies.acceptAll')}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-gov-blue hover:bg-blue-700 rounded-xl shadow-sm transition-colors"
            >
              {t('cookies.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
