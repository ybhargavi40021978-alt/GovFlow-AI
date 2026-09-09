import React, { useState } from 'react';
import { useGovFlow } from '../store/GovFlowContext';
import { GrievanceRecord } from '../types';
import { 
  HelpCircle, 
  Search, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Building2, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

export const GrievancePage: React.FC = () => {
  const { departments, currentUser, grievances, submitGrievance } = useGovFlow();

  const [activeTab, setActiveTab] = useState<'lodge' | 'track'>('lodge');
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [category, setCategory] = useState<string>('Service Delay');
  const [subject, setSubject] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [citizenName, setCitizenName] = useState<string>(currentUser?.name || '');
  const [contactEmail, setContactEmail] = useState<string>(currentUser?.email || '');
  const [contactPhone, setContactPhone] = useState<string>(currentUser?.phone || '');
  const [searchTrackingNo, setSearchTrackingNo] = useState<string>('');
  const [submittedResult, setSubmittedResult] = useState<GrievanceRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const grievanceCategories = [
    'Service Delay',
    'Document Rejection Without Clarification',
    'Disbursal / DBT Bank Transfer Issue',
    'Portal Technical Error / API Failure',
    'Official Misconduct / Harassment',
    'Unfair Refusal of Statutory Benefit',
    'Other Service Deficiency'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDept || !subject || !description || !citizenName || !contactPhone) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const created = submitGrievance({
        userId: currentUser?.id,
        citizenName,
        contactEmail,
        contactPhone,
        department: selectedDept,
        category,
        subject,
        description,
      });
      setSubmittedResult(created);
      setIsSubmitting(false);
      // Clear form
      setSubject('');
      setDescription('');
    }, 800);
  };

  const foundGrievance = grievances.find(g => 
    g.trackingNumber.toLowerCase() === searchTrackingNo.trim().toLowerCase() ||
    g.id.toLowerCase() === searchTrackingNo.trim().toLowerCase()
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-gov-blue uppercase tracking-wider mb-2">
          <HelpCircle className="w-4 h-4 text-gov-blue" />
          <span>National Grievance Orchestration Portal</span>
          <span>•</span>
          <span>CPGRAMS Standardized Framework</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gov-navy tracking-tight">
          Public Grievance Redressal System
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-3xl leading-relaxed">
          Lodge citizen grievances directly with authoritative Central Ministries, State Secretariats, or Local Municipalities. Receive an official Tracking Number with 30-day statutory resolution time limits and automated nodal escalation.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('lodge')}
          className={`pb-2 px-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'lodge'
              ? 'border-gov-blue text-gov-blue'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          1. Lodge a New Grievance
        </button>
        <button
          onClick={() => setActiveTab('track')}
          className={`pb-2 px-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'track'
              ? 'border-gov-blue text-gov-blue'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          2. Track Grievance Status
        </button>
      </div>

      {/* TAB 1: LODGE GRIEVANCE */}
      {activeTab === 'lodge' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
            {submittedResult ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-emerald-900">
                  Grievance Successfully Registered!
                </h3>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  Your grievance has been dispatched to the Nodal Grievance Officer at <strong>{submittedResult.department}</strong>.
                </p>

                <div className="p-4 bg-white rounded-xl border border-emerald-200 inline-block text-left shadow-sm">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Your Official Grievance Tracking Number</span>
                  <span className="text-lg font-mono font-extrabold text-gov-blue tracking-wider block">
                    {submittedResult.trackingNumber}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Submitted: {new Date(submittedResult.submittedAt).toLocaleDateString()} • Resolution Window: 30 Days
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={() => { setSubmittedResult(null); setSearchTrackingNo(submittedResult.trackingNumber); setActiveTab('track'); }}
                    className="px-4 py-2 bg-gov-blue text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Track Live Status →
                  </button>
                  <button
                    onClick={() => setSubmittedResult(null)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    Lodge Another Grievance
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Complainant Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-gov-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Number (for SMS Tracking) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-gov-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Target Department / Ministry *
                    </label>
                    <select
                      required
                      value={selectedDept}
                      onChange={(e) => setSelectedDept(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-gov-blue"
                    >
                      <option value="">-- Select Authority --</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.level === 'Central' ? '🏛️' : d.level === 'State' ? '🏙️' : '🏢'} {d.name} ({d.level})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Grievance Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-gov-blue"
                    >
                      {grievanceCategories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Grievance Subject / Short Summary *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Delay in scholarship direct benefit transfer for 2025-26 academic term"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-gov-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Detailed Grievance Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide specific details: Application acknowledgment numbers, dates of communication, and specific relief requested..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-gov-blue"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Your grievance is protected under the <strong>DPDP Act 2023</strong> and registered on the unified CPGRAMS / State public grievance monitoring architecture.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gov-blue hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Registering with Department Nodal Officer...' : 'Submit Grievance & Get Tracking ID'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Info Sidebar */}
          <div className="space-y-4">
            <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Statutory Time Limits</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Under national citizen charter guidelines, every government department must acknowledge receipt within 48 hours and resolve or provide a reasoned action report within <strong>30 days</strong>.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-gov-blue" />
                <span>Escalation Protocol</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-1.5">
                  <strong className="text-slate-800">Stage 1:</strong> Assigned to Department Public Grievance Officer (PGO).
                </li>
                <li className="flex items-start gap-1.5">
                  <strong className="text-slate-800">Stage 2:</strong> In case of non-resolution in 30 days, auto-escalates to Joint Secretary / Appellate Authority.
                </li>
                <li className="flex items-start gap-1.5">
                  <strong className="text-slate-800">Stage 3:</strong> Review by DARPG / Prime Minister's Office (PMO) grievance wing.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRACK STATUS */}
      {activeTab === 'track' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Track Your Grievance by Tracking Number
            </h3>
            <p className="text-xs text-slate-500">
              Enter your official tracking number (e.g. GRV-2026-XXXX) to check current investigation stage and officer remarks.
            </p>
          </div>

          <div className="flex items-center gap-3 max-w-lg">
            <input
              type="text"
              value={searchTrackingNo}
              onChange={(e) => setSearchTrackingNo(e.target.value)}
              placeholder="Enter Tracking Number (e.g. GRV-2026-...)"
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-gov-blue"
            />
            <button
              onClick={() => {}}
              className="px-4 py-2.5 bg-gov-blue text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              Search Status
            </button>
          </div>

          {foundGrievance ? (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Grievance Tracking Number</span>
                  <span className="text-base font-mono font-extrabold text-gov-blue">{foundGrievance.trackingNumber}</span>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  foundGrievance.status === 'Resolved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : foundGrievance.status === 'Under Investigation'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  Status: {foundGrievance.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-3 border-t border-slate-200">
                <div>
                  <span className="text-slate-400 block font-medium">Department</span>
                  <strong className="text-slate-800">{foundGrievance.department}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Complainant</span>
                  <strong className="text-slate-800">{foundGrievance.citizenName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Lodged On</span>
                  <strong className="text-slate-800">{new Date(foundGrievance.submittedAt).toLocaleString()}</strong>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-slate-400 text-xs block font-medium">Subject</span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{foundGrievance.subject}</p>
                <p className="text-xs text-slate-600 mt-1">{foundGrievance.description}</p>
              </div>

              {/* Resolution Timeline */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Workflow Progress:</span>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-800">Lodged & Transmitted to Department Nodal Officer</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Field Officer Scrutiny & In-Progress Verification</span>
                </div>
              </div>
            </div>
          ) : searchTrackingNo.trim() ? (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              No grievance found with tracking number "{searchTrackingNo}". Please verify your reference number.
            </div>
          ) : (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              Enter a valid tracking reference or lodge a new grievance above to generate one.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
