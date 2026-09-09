import React from 'react';
import { useGovFlow } from '../store/GovFlowContext';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Database, Eye, CheckCircle2, ArrowRight } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const { consents, currentUser } = useGovFlow();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-gov-blue uppercase tracking-wider mb-2">
          <span>Trust & Transparency</span>
          <span>•</span>
          <span>Digital Personal Data Protection (DPDP) Principles</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gov-navy tracking-tight">
          Privacy Center & Architecture
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          GovFlow AI is built on the principle of data minimization and federated identity. We connect public digital infrastructure without unnecessarily centralizing citizen records.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-gov-blue flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Consent-Based Access</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Data attributes are shared strictly with the authorized department for the duration of the application processing lifecycle. You can revoke permissions anytime via the Consent Manager.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Federated Architecture</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Certificates remain stored in authoritative repositories (DigiLocker, State Revenue Portals). GovFlow acts as an intelligent orchestration layer, passing cryptographic pointers rather than copying raw databases.
          </p>
        </div>
      </div>

      {/* DPDP Principles Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4 text-xs">
        <h3 className="text-base font-bold text-slate-900">
          Core Civic Privacy Principles
        </h3>

        <div className="space-y-3">
          {[
            { title: 'Purpose Limitation', desc: 'Data is utilized solely for statutory scheme verification and never for behavioral ads or third-party resale.' },
            { title: 'Data Minimization', desc: 'Forms only request the specific data fields mandated by official department government orders.' },
            { title: 'Storage Limitation', desc: 'Temporary application drafts are scrubbed automatically upon final sanction order delivery.' },
            { title: 'Traceability & Audit Logs', desc: 'Every data access event by officers is recorded on an immutable cryptographic audit trail.' }
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-800">{item.title}</h4>
                <p className="text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Manage Active Permissions</h4>
          <p className="text-xs text-slate-600">
            {currentUser 
              ? `Review the ${consents.length} departments currently authorized to verify your documents.`
              : 'Review department authorizations or log in to manage your active consent tokens.'}
          </p>
        </div>
        <Link
          to={currentUser ? "/consent" : "/login"}
          className="px-4 py-2 bg-gov-blue hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
        >
          <span>{currentUser ? "Open Consent Manager" : "Log In to View Consents"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
