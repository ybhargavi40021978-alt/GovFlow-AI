import React from 'react';
import { useGovFlow } from '../../store/GovFlowContext';
import { Eye, Type, FastForward, RotateCcw, X, Check } from 'lucide-react';

export const AccessibilityDrawer: React.FC = () => {
  const { accessibility, updateAccessibility, isAccessibilityOpen, setIsAccessibilityOpen } = useGovFlow();

  if (!isAccessibilityOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-elevation border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-gov-blue flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h2 id="accessibility-title" className="font-bold text-slate-800 text-base">
                Accessibility Preferences
              </h2>
              <p className="text-xs text-slate-500">WCAG 2.1 AA Compliant Civic Experience</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAccessibilityOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
            aria-label="Close accessibility settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Text Scaling */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Type className="w-4 h-4 text-gov-blue" />
                Text Sizing
              </label>
              <span className="text-xs font-mono uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                {accessibility.textScale === 'sm' ? 'Compact (90%)' : accessibility.textScale === 'base' ? 'Standard (100%)' : 'Large (115%)'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => updateAccessibility({ textScale: 'sm' })}
                className={`py-2 px-3 rounded-lg border text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  accessibility.textScale === 'sm'
                    ? 'border-gov-blue bg-blue-50 text-gov-blue ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span>A-</span>
                <span className="text-xs font-normal">Small</span>
              </button>
              <button
                type="button"
                onClick={() => updateAccessibility({ textScale: 'base' })}
                className={`py-2 px-3 rounded-lg border text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  accessibility.textScale === 'base'
                    ? 'border-gov-blue bg-blue-50 text-gov-blue ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span>A</span>
                <span className="text-xs font-normal">Default</span>
              </button>
              <button
                type="button"
                onClick={() => updateAccessibility({ textScale: 'lg' })}
                className={`py-2 px-3 rounded-lg border text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  accessibility.textScale === 'lg'
                    ? 'border-gov-blue bg-blue-50 text-gov-blue ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-base">A+</span>
                <span className="text-xs font-normal">Large</span>
              </button>
            </div>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
            <div>
              <p className="text-sm font-semibold text-slate-800">High Contrast Mode</p>
              <p className="text-xs text-slate-500">Increases color contrast and element borders for enhanced readability</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={accessibility.highContrast}
              onClick={() => updateAccessibility({ highContrast: !accessibility.highContrast })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
                accessibility.highContrast ? 'bg-gov-blue' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  accessibility.highContrast ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reduce Motion */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
            <div>
              <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <FastForward className="w-3.5 h-3.5 text-gov-blue" />
                Reduce Animations
              </p>
              <p className="text-xs text-slate-500">Disables hover transitions and sliding banner animations</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={accessibility.reduceMotion}
              onClick={() => updateAccessibility({ reduceMotion: !accessibility.reduceMotion })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
                accessibility.reduceMotion ? 'bg-gov-blue' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  accessibility.reduceMotion ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={() => updateAccessibility({ textScale: 'base', highContrast: false, reduceMotion: false })}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={() => setIsAccessibilityOpen(false)}
            className="px-4 py-2 text-xs font-bold text-white bg-gov-blue hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};
