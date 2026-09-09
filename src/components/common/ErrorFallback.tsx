import React from 'react';
import { useGovFlow } from '../../store/GovFlowContext';
import { GovFlowLogo } from './GovFlowLogo';
import { AlertCircle, RotateCcw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  const { t } = useGovFlow();
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6">
        <div className="flex justify-center">
          <GovFlowLogo size="md" variant="symbol" />
        </div>

        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {t('error.title')}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {t('error.subtitle')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {resetErrorBoundary ? (
            <button
              onClick={resetErrorBoundary}
              className="w-full sm:w-auto px-5 py-2.5 bg-gov-blue hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('error.tryAgain')}</span>
            </button>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto px-5 py-2.5 bg-gov-blue hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('error.tryAgain')}</span>
            </button>
          )}

          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('error.goBack')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
