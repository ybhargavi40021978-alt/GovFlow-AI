import React from 'react';
import { Application } from '../../types';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  FileText,
  Ban
} from 'lucide-react';

interface ApplicationCardProps {
  application: Application;
}

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
          <AlertCircle className="w-3 h-3 text-rose-600" />
          Rejected
        </span>
      );
    case 'withdrawn':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-300 px-2.5 py-0.5 rounded-full">
          <Ban className="w-3 h-3 text-slate-500" />
          Withdrawn
        </span>
      );
    case 'draft':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-full">
          <Clock className="w-3 h-3 text-amber-600" />
          Draft
        </span>
      );
    case 'under_verification':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
          <Clock className="w-3 h-3 text-blue-600" />
          Under Verification
        </span>
      );
    case 'department_review':
    case 'under_review':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
          <ShieldCheck className="w-3 h-3 text-amber-600" />
          Department Review
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
          <FileText className="w-3 h-3 text-slate-500" />
          Submitted
        </span>
      );
  }
};

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
  const completedStages = application.stages.filter(s => s.status === 'completed').length;
  const totalStages = application.stages.length;
  const progressPercent = Math.round((completedStages / totalStages) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-card-hover transition-all p-5 flex flex-col justify-between">
      <div>
        {/* Top meta row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-gov-blue bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              {application.id}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              {application.category}
            </span>
          </div>
          {getStatusBadge(application.status)}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
          {application.serviceName}
        </h3>
        <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
          <Building2 className="w-3 h-3 text-slate-400" />
          <span className="truncate">{application.department}</span>
        </p>

        {/* Stage Progress */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-500 font-medium">Current Milestone:</span>
            <span className="font-bold text-slate-800">{application.currentStage}</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-1">
            <div 
              className={`${application.status === 'withdrawn' ? 'bg-rose-500' : 'bg-gov-blue'} h-full rounded-full transition-all duration-500`} 
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Stage {completedStages} of {totalStages}</span>
            <span>{progressPercent}% Complete</span>
          </div>
        </div>
      </div>

      {/* Footer Details & Action */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-slate-500 text-[11px]">
          <Calendar className="w-3 h-3" />
          <span>{application.submittedAt.split(' ')[0]}</span>
        </div>

        <Link
          to={`/applications/${application.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-gov-blue hover:text-blue-700 transition-colors"
        >
          <span>Track Application</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
