import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGovFlow } from '../store/GovFlowContext';
import { getCategoryIcon } from '../components/cards/ServiceCard';
import { 
  Building2, 
  Clock, 
  IndianRupee, 
  FileCheck2, 
  Calendar, 
  CheckCircle2, 
  ArrowLeft, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  Globe2,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getServiceById, documents, currentUser } = useGovFlow();
  const navigate = useNavigate();

  const service = getServiceById(id || '');

  if (!service) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Service Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          The requested service ID "{id}" is not registered in the GovFlow catalog.
        </p>
        <Link
          to="/services"
          className="px-4 py-2 bg-gov-blue text-white text-xs font-bold rounded-xl"
        >
          Back to All Services
        </Link>
      </div>
    );
  }

  // Check how many required docs are ready
  const readyDocs = service.requiredDocuments.filter((reqDocName: string) => {
    return documents.some((d: any) => d.name.toLowerCase().includes(reqDocName.toLowerCase()) && d.status === 'verified');
  });

  const docReadinessPercent = Math.round((readyDocs.length / service.requiredDocuments.length) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/services" className="hover:text-gov-blue flex items-center gap-1 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Services</span>
        </Link>
        <span>/</span>
        <span className="text-slate-400">{service.category}</span>
        <span>/</span>
        <span className="text-slate-700 font-semibold truncate max-w-xs">{service.name}</span>
      </div>

      {/* Main Service Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-gov-blue flex items-center justify-center">
              {getCategoryIcon(service.category)}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500">
                {service.category}
              </span>
              <span className="mx-2 text-slate-300">•</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                service.level === 'Central'
                  ? 'bg-blue-50 text-gov-blue border border-blue-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {service.level} Government
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">ID: {service.id}</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-navy leading-tight mb-2">
          {service.name}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-6 flex items-center gap-1.5 font-medium">
          <Building2 className="w-4 h-4 text-slate-400" />
          <span>{service.department} ({service.state})</span>
        </p>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          {service.description}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            to={`/eligibility/${service.id}`}
            className="px-5 py-2.5 bg-gov-blue hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Check Eligibility</span>
          </Link>
          <Link
            to={`/services/${service.id}/apply`}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Apply with Auto-fill</span>
          </Link>
        </div>
      </div>

      {/* Grid: 2 Columns (Details & Meta) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col (2/3): Eligibility, Requirements & Workflow */}
        <div className="lg:col-span-2 space-y-6">
          {/* Eligibility Section */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card">
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-gov-blue" />
              Eligibility Criteria
            </h2>
            <p className="text-xs text-slate-600 mb-4 bg-blue-50/60 p-3 rounded-xl border border-blue-100 text-slate-700 font-medium">
              {service.eligibilitySummary}
            </p>

            <div className="space-y-3">
              {service.eligibilityRules.map((rule) => (
                <div key={rule.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                    <span>{rule.label}</span>
                    <span className="text-[10px] text-gov-blue font-mono bg-blue-50 px-2 py-0.5 rounded uppercase">
                      Rule Type: {rule.type}
                    </span>
                  </div>
                  <p className="text-slate-500 leading-relaxed">
                    {rule.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Stages */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card">
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gov-blue" />
              Standardized Application Workflow
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Orchestrated pipeline stages with statutory time limits.
            </p>

            <div className="space-y-4">
              {service.workflowStages.map((stage, idx) => (
                <div key={idx} className="flex items-start gap-3 relative">
                  {idx < service.workflowStages.length - 1 && (
                    <div className="absolute left-3.5 top-7 w-0.5 h-8 bg-slate-200" />
                  )}
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-gov-blue font-bold text-xs flex items-center justify-center flex-shrink-0 z-10">
                    {idx + 1}
                  </div>
                  <div className="pt-0.5">
                    <h4 className="text-xs font-bold text-slate-800">{stage}</h4>
                    <p className="text-[11px] text-slate-500">
                      {idx === 0 ? 'Citizen consent & auto-filled submission' : idx === 1 ? 'Automated database and certificate verification' : 'Departmental scrutiny & digital dispatch'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Required Documents */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-gov-blue" />
                Required Supporting Documents
              </h2>
              <span className="text-xs font-mono font-bold text-gov-blue bg-blue-50 px-2 py-0.5 rounded">
                {readyDocs.length} of {service.requiredDocuments.length} Ready
              </span>
            </div>

            <div className="space-y-2">
              {service.requiredDocuments.map((doc, idx) => {
                const isReady = readyDocs.some(r => r.toLowerCase().includes(doc.toLowerCase()));
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                      isReady ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isReady ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isReady ? '✓' : idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800">{doc}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isReady ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isReady ? 'Available in Profile' : 'Upload / Fetch DigiLocker'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col (1/3): Key Service Facts */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
              Service Metadata
            </h3>

            <div>
              <span className="text-slate-400 block mb-0.5">Statutory Fee:</span>
              <span className="font-bold text-slate-800 text-sm flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-gov-blue" />
                {service.fee}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Expected Timeline:</span>
              <span className="font-bold text-slate-800 text-sm flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                {service.expectedTimeline}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Official Issuing Source:</span>
              <span className="font-semibold text-gov-blue flex items-center gap-1">
                {service.officialSource}
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Last Registry Verification:</span>
              <span className="font-medium text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {service.lastVerified}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Available Languages:</span>
              <div className="flex flex-wrap gap-1">
                {service.languages.map((l, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-semibold text-slate-600">
                    {l}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100">
                <p className="text-[11px] font-bold text-gov-blue mb-1">
                  Ready to Apply?
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                  GovFlow will auto-fill your verified credentials and prompt for consent before submission.
                </p>
                <Link
                  to={`/services/${service.id}/apply`}
                  className="w-full py-2 bg-gov-blue hover:bg-blue-700 text-white font-bold rounded-lg text-center block transition-colors shadow-sm"
                >
                  Start Auto-filled Form
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
