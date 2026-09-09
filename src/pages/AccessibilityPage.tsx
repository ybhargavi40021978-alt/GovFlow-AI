import React from 'react';
import { useGovFlow } from '../store/GovFlowContext';
import { Eye, Type, FastForward, CheckCircle2, ShieldCheck, Sliders } from 'lucide-react';

export const AccessibilityPage: React.FC = () => {
  const { accessibility, updateAccessibility } = useGovFlow();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-gov-blue uppercase tracking-wider mb-2">
          <span>Inclusion & Universal Access</span>
          <span>•</span>
          <span>WCAG 2.1 AA Standards</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gov-navy tracking-tight">
          Accessibility Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Government services must be accessible to every Indian citizen, regardless of device, visual ability, or assistive technology.
        </p>
      </div>

      {/* Interactive Controls Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-gov-blue" />
          Interactive Accessibility Preferences
        </h2>

        {/* Text Scaling */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-2">
            <Type className="w-4 h-4 text-gov-blue" />
            <span>Text Scaling (Current: {accessibility.textScale.toUpperCase()})</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'sm', label: 'Compact (90%)' },
              { id: 'base', label: 'Default (100%)' },
              { id: 'lg', label: 'Large (115%)' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => updateAccessibility({ textScale: s.id as any })}
                className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                  accessibility.textScale === s.id
                    ? 'bg-blue-50 border-gov-blue text-gov-blue ring-2 ring-blue-500/20 shadow-sm'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* High Contrast */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">High Contrast Mode</h4>
            <p className="text-xs text-slate-500">
              Sharpen text contrast, intensify border outlines, and optimize readability under bright outdoor light.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={accessibility.highContrast}
            onClick={() => updateAccessibility({ highContrast: !accessibility.highContrast })}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              accessibility.highContrast ? 'bg-gov-blue' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                accessibility.highContrast ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Reduced Motion */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <FastForward className="w-3.5 h-3.5 text-gov-blue" />
              <span>Reduced Motion</span>
            </h4>
            <p className="text-xs text-slate-500">
              Mutes ambient CSS animations, sliding transitions, and card floating effects for vestibular comfort.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={accessibility.reduceMotion}
            onClick={() => updateAccessibility({ reduceMotion: !accessibility.reduceMotion })}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              accessibility.reduceMotion ? 'bg-gov-blue' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                accessibility.reduceMotion ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
