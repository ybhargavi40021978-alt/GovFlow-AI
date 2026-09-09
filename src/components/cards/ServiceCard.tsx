import React from 'react';
import { Service, IntegrationStatus } from '../../types';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  FileCheck, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  CheckCircle2,
  GraduationCap,
  Briefcase,
  HeartPulse,
  Tractor,
  Home,
  IndianRupee,
  Factory,
  Car,
  Users,
  Award,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  highlightMatch?: boolean;
}

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Education':
      return <GraduationCap className="w-4 h-4 text-blue-600" />;
    case 'Employment':
      return <Briefcase className="w-4 h-4 text-amber-600" />;
    case 'Healthcare':
      return <HeartPulse className="w-4 h-4 text-rose-600" />;
    case 'Agriculture':
      return <Tractor className="w-4 h-4 text-emerald-600" />;
    case 'Housing':
      return <Home className="w-4 h-4 text-purple-600" />;
    case 'Financial Assistance':
      return <IndianRupee className="w-4 h-4 text-teal-600" />;
    case 'Business & MSME':
      return <Factory className="w-4 h-4 text-indigo-600" />;
    case 'Transport':
      return <Car className="w-4 h-4 text-cyan-600" />;
    case 'Social Welfare':
      return <Users className="w-4 h-4 text-orange-600" />;
    case 'Identity & Certificates':
      return <Award className="w-4 h-4 text-gov-blue" />;
    default:
      return <Building2 className="w-4 h-4 text-slate-600" />;
  }
};

export const getIntegrationBadge = (status?: IntegrationStatus) => {
  const currentStatus = status || 'Sandbox';
  switch (currentStatus) {
    case 'Live Integration':
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Integration
        </span>
      );
    case 'Sandbox':
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
          Sandbox
        </span>
      );
    case 'Demo Integration':
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          Demo Integration
        </span>
      );
    case 'External Official Service':
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
          <ExternalLink className="w-2.5 h-2.5" />
          External Official
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
          Coming Soon
        </span>
      );
  }
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, highlightMatch = false }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-card-hover transition-all duration-200 p-5 flex flex-col justify-between group">
      <div>
        {/* Header: Category & Level Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
              {getCategoryIcon(service.category)}
            </div>
            <span className="text-xs font-semibold text-slate-700">
              {service.category}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              service.level === 'Central'
                ? 'bg-blue-50 text-gov-blue border border-blue-200'
                : service.level === 'State'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {service.level}
            </span>

            {getIntegrationBadge(service.integrationStatus)}

            {highlightMatch && service.matchScore && (
              <span className="text-[10px] font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                <Sparkles className="w-2.5 h-2.5" />
                {service.matchScore}% Match
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <Link to={`/services/${service.id}`} className="block group-hover:text-gov-blue transition-colors">
          <h3 className="text-base font-bold text-slate-900 leading-snug mb-1 line-clamp-2">
            {service.name}
          </h3>
        </Link>

        {/* Ministry / Department */}
        <p className="text-xs text-slate-500 font-medium mb-3 flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="truncate">{service.ministry ? `${service.ministry} • ${service.department}` : service.department}</span>
        </p>

        {/* Description */}
        <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Section 23 Indicators: Eligibility + Required Documents */}
        <div className="grid grid-cols-2 gap-2 py-2.5 px-3 bg-slate-50/80 rounded-xl border border-slate-100 mb-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <div className="text-[11px] leading-tight">
              <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Eligibility</span>
              <span className="font-semibold text-slate-700">✓ Real-time Check</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600 border-l border-slate-200 pl-2">
            <FileCheck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <div className="text-[11px] leading-tight">
              <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Documents</span>
              <span className="font-semibold text-slate-700">📄 {service.requiredDocuments.length} Proofs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <Link
          to={`/eligibility/${service.id}`}
          className="flex-1 py-2 px-3 text-xs font-bold text-gov-blue bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-center"
        >
          Check Eligibility
        </Link>
        <Link
          to={`/services/${service.id}`}
          className="py-2 px-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1"
          aria-label={`View details for ${service.name}`}
        >
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
