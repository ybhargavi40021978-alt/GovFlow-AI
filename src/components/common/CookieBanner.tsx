import React from 'react';
import { useGovFlow } from '../../store/GovFlowContext';
import { ShieldCheck, Check, X, Sliders } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const { 
    cookiePreferences, 
    acceptAllCookies, 
    rejectNonEssentialCookies, 
    setIsCookieModalOpen,
    t 
  } = useGovFlow();

  if (cookiePreferences.hasConsented) return null;

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-xl z-50 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/80 p-5 animate-slideUp text-slate-800 select-none"
      role="region"
      aria-label="Cookie consent banner"
    >
      <div className="flex items-start gap-3.5 mb-3">
        <div className="w-10 h-10 rounded-xl bg-orange-100 text-gov-saffron flex items-center justify-center flex-shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-base">
            {t('cookies.bannerTitle')}
          </h3>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
            {t('cookies.bannerText')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <span className="text-green-600 font-bold">✓</span> Keep platform secure
        </div>
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <span className="text-green-600 font-bold">✓</span> Remember preferences
        </div>
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <span className="text-green-600 font-bold">✓</span> Fast session routing
        </div>
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <span className="text-green-600 font-bold">✓</span> Zero data commercialization
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
        <button
          type="button"
          onClick={acceptAllCookies}
          className="flex-1 min-w-[120px] py-2 px-3 text-xs font-bold text-white bg-gov-blue hover:bg-blue-700 rounded-lg shadow-sm transition-all text-center flex items-center justify-center gap-1.5"
        >
          <Check className="w-3.5 h-3.5" />
          <span>{t('cookies.acceptAll')}</span>
        </button>
        <button
          type="button"
          onClick={rejectNonEssentialCookies}
          className="py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          <X className="w-3.5 h-3.5" />
          <span>{t('cookies.essentialOnly')}</span>
        </button>
        <button
          type="button"
          onClick={() => setIsCookieModalOpen(true)}
          className="py-2 px-3 text-xs font-semibold text-gov-blue hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{t('cookies.manage')}</span>
        </button>
      </div>
    </div>
  );
};
