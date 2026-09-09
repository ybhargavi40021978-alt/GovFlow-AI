import React, { useState, useEffect, useRef } from 'react';
import { Application, ServiceWithdrawalPolicy } from '../../types';
import { useGovFlow } from '../../store/GovFlowContext';
import { getStatusBadge } from '../cards/ApplicationCard';
import { 
  AlertTriangle, 
  X, 
  Building2, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
  policy: ServiceWithdrawalPolicy;
  onConfirm: (payload: { reason?: string; remarks?: string }) => Promise<void>;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  application,
  policy,
  onConfirm,
}) => {
  const { t } = useGovFlow();
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [otherRemarks, setOtherRemarks] = useState<string>('');
  const [touched, setTouched] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    if (isSubmitting) return;
    setSelectedReason('');
    setOtherRemarks('');
    setTouched(false);
    setSubmitError(null);
    setIsSubmitting(false);
    onClose();
  };

  // Keyboard accessibility (Escape key closes modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting]);

  if (!isOpen) return null;

  // Real-time reason validation
  const getValidationError = (): string | null => {
    if (policy.reasonRequired && !selectedReason) {
      return t('withdrawal.reasonRequired');
    }
    if (selectedReason === 'Other' && !otherRemarks.trim()) {
      return t('withdrawal.otherReasonRequired');
    }
    return null;
  };

  const validationError = getValidationError();
  const isFormValid = !validationError;

  const handleConfirm = async () => {
    setTouched(true);
    if (!isFormValid) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const finalReason = selectedReason === 'Other' 
        ? `Other: ${otherRemarks.trim()}`
        : selectedReason;

      await onConfirm({
        reason: finalReason,
        remarks: otherRemarks.trim() || undefined,
      });
      handleClose();
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to withdraw application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reasonOptions = policy.reasonOptions?.length > 0 ? policy.reasonOptions : [
    'No longer required',
    'Submitted by mistake',
    'Information needs correction',
    'Applying for another service',
    'Other'
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="withdrawal-modal-title"
    >
      <div 
        ref={modalRef}
        className="w-full max-w-lg bg-white rounded-3xl shadow-elevation border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col transform transition-all animate-scaleUp"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-rose-100 bg-rose-50/50 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5 border border-rose-200">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 id="withdrawal-modal-title" className="text-lg font-bold text-slate-900 tracking-tight">
                {t('withdrawal.modalTitle')}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                {t('withdrawal.modalConfirmPrompt')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close dialog"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Target Application Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-gov-blue bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                  {application.id}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {application.category}
                </span>
              </div>
              <div>{getStatusBadge(application.status)}</div>
            </div>

            <h3 className="font-bold text-slate-800 text-sm">
              {application.serviceName}
            </h3>

            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{application.department}</span>
            </div>
          </div>

          {/* Destructive Warning Alert */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-900 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>{t('withdrawal.warningConsequencesTitle')}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900/90">
              {policy.warningMessage || t('withdrawal.warningCannotUndo')}
            </p>
            <p className="text-[11px] leading-relaxed text-amber-800/80 font-medium">
              • {t('withdrawal.warningNotice')}
            </p>
          </div>

          {/* Withdrawal Reason Field */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-800 text-xs">
              {t('withdrawal.reasonLabel')}{' '}
              {policy.reasonRequired && <span className="text-rose-600">*</span>}
            </label>

            <div className="space-y-1.5">
              {reasonOptions.map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedReason === opt
                      ? 'border-gov-blue bg-blue-50/70 text-slate-900 font-bold shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="withdrawalReason"
                    value={opt}
                    checked={selectedReason === opt}
                    onChange={(e) => {
                      setSelectedReason(e.target.value);
                      setTouched(true);
                    }}
                    className="w-4 h-4 text-gov-blue focus:ring-blue-500"
                  />
                  <span className="text-xs">
                    {t(`withdrawal.reason.${opt.toLowerCase().replace(/[^a-z0-9]/g, '_')}`) || opt}
                  </span>
                </label>
              ))}
            </div>

            {/* Optional / Required Textfield for 'Other' */}
            {selectedReason === 'Other' && (
              <div className="pt-2 space-y-1 animate-fadeIn">
                <label className="block text-[11px] font-bold text-slate-700">
                  {t('withdrawal.otherReasonLabel')} <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={3}
                  value={otherRemarks}
                  onChange={(e) => {
                    setOtherRemarks(e.target.value);
                    setTouched(true);
                  }}
                  placeholder={t('withdrawal.otherReasonPlaceholder')}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-gov-blue"
                />
              </div>
            )}

            {/* Real-time Validation Message */}
            {touched && validationError && (
              <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1 animate-shake">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{validationError}</span>
              </p>
            )}
          </div>

          {/* Server Error Alert */}
          {submitError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{submitError}</span>
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
          >
            {t('withdrawal.cancel')}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting || (touched && !isFormValid)}
            className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{t('withdrawal.withdrawing')}</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{t('withdrawal.confirm')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
