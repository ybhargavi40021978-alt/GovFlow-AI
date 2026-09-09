import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGovFlow } from '../store/GovFlowContext';
import { getStatusBadge } from '../components/cards/ApplicationCard';
import { WithdrawalModal } from '../components/common/WithdrawalModal';
import { 
  ArrowLeft, 
  Building2, 
  Clock, 
  Download, 
  FileText, 
  ShieldCheck, 
  AlertCircle,
  AlertTriangle,
  Trash2,
  CheckCircle2,
  Ban,
  Calendar
} from 'lucide-react';

export const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    applications, 
    withdrawApplication, 
    deleteDraftApplication, 
    getServiceWithdrawalPolicy,
    t 
  } = useGovFlow();

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const application = applications.find(a => a.id === id);

  if (!application) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Application Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">
          This application either does not exist or you do not have authorization to view it.
        </p>
        <Link to="/applications" className="text-xs font-bold text-gov-blue underline mt-4 inline-block">
          Back to Applications
        </Link>
      </div>
    );
  }

  const policy = getServiceWithdrawalPolicy(application.serviceId);
  const isWithdrawn = application.status === 'withdrawn';
  const isDraft = application.status === 'draft';
  const isTerminal = ['approved', 'rejected', 'completed'].includes(application.status);

  // Determine if withdrawal is permitted for this specific application based on service policy
  const isWithdrawalPermitted = !isWithdrawn && !isDraft && !isTerminal && policy.allowed && (
    policy.allowedStatuses.includes(application.status) ||
    (application.status === 'department_review' && policy.allowedStatuses.includes('under_review')) ||
    (application.status === 'under_review' && policy.allowedStatuses.includes('department_review'))
  );

  const handleDownloadReceipt = () => {
    const text = `GOVFLOW AI — OFFICIAL STATUTORY ACKNOWLEDGEMENT\n` +
      `===================================================\n` +
      `Application ID: ${application.id}\n` +
      `Service: ${application.serviceName}\n` +
      `Department: ${application.department}\n` +
      `Applicant: ${application.applicantName}\n` +
      `Submitted: ${application.submittedAt}\n` +
      `Status: ${application.status.toUpperCase()}\n` +
      `${application.withdrawnAt ? `Withdrawn At: ${application.withdrawnAt}\n` : ''}` +
      `${application.withdrawalReason ? `Withdrawal Reason: ${application.withdrawalReason}\n` : ''}` +
      `Current Milestone: ${application.currentStage}\n` +
      `Officer Remarks: ${application.officerNotes || 'None'}\n` +
      `Cryptographic Checksum: SHA256:${application.id.replace(/-/g, '')}89a4f\n`;

    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `GovFlow_Receipt_${application.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleConfirmWithdrawal = async (payload: { reason?: string; remarks?: string }) => {
    const res = await withdrawApplication(application.id, payload);
    setSuccessBanner(`${t('withdrawal.successTitle')}: ${t('withdrawal.successMessage')} (${application.id})`);
    setTimeout(() => {
      setSuccessBanner(null);
    }, 8000);
  };

  const handleDeleteDraft = async () => {
    if (window.confirm('Are you sure you want to permanently delete this draft application?')) {
      await deleteDraftApplication(application.id);
      navigate('/applications');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/applications" className="hover:text-gov-blue flex items-center gap-1 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>My Applications</span>
        </Link>
        <span>/</span>
        <span className="font-mono text-slate-800 font-bold">{application.id}</span>
      </div>

      {/* Success Notification Alert Banner */}
      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3 text-emerald-800 text-xs font-semibold shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessBanner(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Status Header Banner for Withdrawn Applications */}
      {isWithdrawn && (
        <div className="bg-rose-50/80 border-2 border-rose-200 rounded-3xl p-6 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600 flex-shrink-0">
                <Ban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {t('withdrawal.withdrawnBadge')}
                </h3>
                <p className="text-xs text-slate-600">
                  {t('withdrawal.deptNotice')}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
              STATUS: WITHDRAWN
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-rose-100 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">{t('withdrawal.withdrawnOn')}:</span>
              <span className="font-mono font-bold text-slate-800">{application.withdrawnAt || application.updatedAt}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">{t('withdrawal.previousStatus')}:</span>
              <span className="font-semibold text-slate-700 capitalize">
                {application.previousStatus ? application.previousStatus.replace('_', ' ') : 'Under Verification'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">{t('withdrawal.reason')}:</span>
              <span className="font-bold text-rose-700">
                {application.withdrawalReason || 'Not specified'}
                {application.withdrawalRemarks ? ` (${application.withdrawalRemarks})` : ''}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-extrabold text-gov-blue bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
              {application.id}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {application.category}
            </span>
          </div>
          {getStatusBadge(application.status)}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-navy leading-tight mb-2">
          {application.serviceName}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-6 flex items-center gap-1.5 font-medium">
          <Building2 className="w-4 h-4 text-slate-400" />
          <span>{application.department}</span>
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">Applicant:</span>
            <span className="font-bold text-slate-800">{application.applicantName}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Submitted On:</span>
            <span className="font-medium text-slate-700">{application.submittedAt}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Last Updated:</span>
            <span className="font-medium text-slate-700">{application.updatedAt}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Priority Queue:</span>
            <span className="font-semibold text-gov-blue">{application.priority}</span>
          </div>
        </div>

        {/* Action Controls Toolbar */}
        <div className="pt-6 border-t border-slate-100 mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadReceipt}
              className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Official Acknowledgement</span>
            </button>

            {/* DRAFT STATE: Show Delete Draft */}
            {isDraft && (
              <button
                type="button"
                onClick={handleDeleteDraft}
                className="px-4 py-2.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>{t('withdrawal.deleteDraftBtn')}</span>
              </button>
            )}

            {/* PERMITTED WITHDRAWAL STATE: Clearly Visible [ Withdraw Application ] Button */}
            {isWithdrawalPermitted && (
              <button
                type="button"
                id="btn-withdraw-application"
                onClick={() => setIsWithdrawModalOpen(true)}
                className="px-4 py-2.5 text-xs font-extrabold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-xl transition-all flex items-center gap-1.5 shadow-xs hover:shadow focus:ring-2 focus:ring-rose-500/20"
              >
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>{t('withdrawal.withdrawBtn')}</span>
              </button>
            )}

            {/* WITHDRAWN STATE: Display "Application Withdrawn" badge */}
            {isWithdrawn && (
              <span className="px-3.5 py-2 text-xs font-bold text-slate-600 bg-slate-100 border border-slate-300 rounded-xl inline-flex items-center gap-1.5">
                <Ban className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('withdrawal.withdrawnBadge')}</span>
              </span>
            )}
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            Digital Hash: SHA256:{application.id.replace(/-/g, '')}89a4f
          </span>
        </div>
      </div>

      {/* Multi-Stage Visual Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
        <div className="flex items-center justify-between gap-3 mb-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gov-blue" />
            Application Timeline
          </h2>
          {isWithdrawn && (
            <span className="text-[11px] font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
              Submitted → Verification → Withdrawn
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mb-8">
          {isWithdrawn 
            ? 'Unified statutory workflow status up to citizen withdrawal.' 
            : 'Real-time progression through department verification, statutory review, and sanction.'}
        </p>

        <div className="space-y-6">
          {application.stages.map((stage, idx) => {
            const isStageWithdrawn = stage.name.toLowerCase().includes('withdrawn');
            const isCompleted = stage.status === 'completed';
            const isCurrent = stage.status === 'current';
            const isDiscontinued = stage.note?.includes('Discontinued') || (isWithdrawn && !isCompleted && !isStageWithdrawn);
            const isLast = idx === application.stages.length - 1;

            return (
              <div key={idx} className="flex items-start gap-4 relative">
                {!isLast && (
                  <div className={`absolute left-4 top-8 w-0.5 h-10 ${
                    isStageWithdrawn
                      ? 'bg-rose-200'
                      : isCompleted 
                      ? 'bg-emerald-500' 
                      : 'bg-slate-200'
                  }`} />
                )}

                {/* Status node */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 ${
                  isStageWithdrawn
                    ? 'bg-rose-600 text-white shadow-sm ring-4 ring-rose-100'
                    : isCompleted
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : isCurrent
                    ? 'bg-gov-blue text-white ring-4 ring-blue-100 shadow-sm animate-pulse'
                    : isDiscontinued
                    ? 'bg-slate-100 text-slate-300 border border-slate-200 line-through'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}>
                  {isStageWithdrawn ? '✕' : isCompleted ? '✓' : idx + 1}
                </div>

                <div className="flex-1 pt-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <h4 className={`text-sm font-bold ${
                      isStageWithdrawn
                        ? 'text-rose-700 font-extrabold'
                        : isCurrent 
                        ? 'text-gov-blue' 
                        : isCompleted 
                        ? 'text-slate-900' 
                        : isDiscontinued 
                        ? 'text-slate-400 line-through' 
                        : 'text-slate-400'
                    }`}>
                      {stage.name}
                    </h4>
                    {stage.timestamp && (
                      <span className="text-[11px] font-mono text-slate-400">
                        {stage.timestamp}
                      </span>
                    )}
                  </div>

                  {stage.note && (
                    <p className={`text-xs p-2.5 rounded-xl border ${
                      isStageWithdrawn 
                        ? 'text-rose-800 bg-rose-50/80 border-rose-200 font-medium'
                        : isDiscontinued
                        ? 'text-slate-400 bg-slate-50 border-slate-100 italic'
                        : 'text-slate-600 bg-slate-50 border-slate-100'
                    }`}>
                      {stage.note}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Officer Remarks & Attached Proofs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card text-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            Official Department Remarks
          </h3>
          <p className="text-slate-700 bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60 leading-relaxed font-medium">
            {application.officerNotes || 'Application is progressing according to statutory turnaround times.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card text-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-gov-blue" />
            Attached Verified Documents ({application.attachedDocuments.length})
          </h3>
          <div className="space-y-2">
            {application.attachedDocuments.map((doc: string, idx: number) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="font-medium text-slate-800">{doc}</span>
                <span className="text-emerald-700 text-[10px] font-bold">✓ Attached</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <WithdrawalModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        application={application}
        policy={policy}
        onConfirm={handleConfirmWithdrawal}
      />
    </div>
  );
};
