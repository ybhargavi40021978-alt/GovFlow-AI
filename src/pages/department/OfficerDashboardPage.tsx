import React, { useState } from 'react';
import { useGovFlow } from '../../store/GovFlowContext';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileCheck2, 
  GitMerge, 
  Building2, 
  Bell, 
  BarChart3, 
  ShieldCheck, 
  Search, 
  Filter, 
  Check, 
  X, 
  ArrowRight, 
  Download, 
  RefreshCw,
  Eye,
  Layers,
  ChevronRight,
  ExternalLink,
  Users,
  Activity,
  Ban
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

type OfficerTab = 
  | 'assigned_apps'
  | 'pending_verification'
  | 'doc_verification'
  | 'app_review'
  | 'workflow_status'
  | 'dept_services'
  | 'notifications'
  | 'reports';

export const OfficerDashboardPage: React.FC = () => {
  const { 
    currentUser, 
    currentRole, 
    allApplications, 
    allDocuments, 
    services, 
    departments,
    updateApplicationStage,
    updateApplicationStatus,
    updateDocumentStatus,
    auditLogs
  } = useGovFlow();

  const [activeTab, setActiveTab] = useState<OfficerTab>('assigned_apps');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Applications & Documents from store
  const applications = allApplications;
  const documents = allDocuments;

  // Filtered lists
  const assignedApps = applications.filter(a => 
    a.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingVerificationApps = applications.filter(a => 
    a.status === 'under_verification' || a.status === 'department_review'
  );

  const pendingDocs = documents.filter(d => 
    d.status === 'verification_pending' || d.status === 'missing'
  );

  const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0];

  const handleVerifyDocument = (docId: string, docName: string) => {
    const officerSign = currentUser?.name ? `Verified by ${currentUser.name}` : 'Verified by Officer Desk';
    updateDocumentStatus(docId, 'verified', officerSign);
    setActionSuccess(`Document "${docName}" has been successfully verified via simulated DigiLocker cryptographic audit.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleAdvanceStage = (appId: string, currentStageIdx: number) => {
    const targetApp = applications.find(a => a.id === appId) || selectedApp;
    if (!targetApp) return;
    const nextIdx = Math.min(currentStageIdx + 1, (targetApp.stages?.length || 4) - 1);
    updateApplicationStage(appId, nextIdx, 'current', reviewNote || 'Stage advanced after officer desk examination.');
    if (nextIdx === (targetApp.stages?.length || 4) - 1) {
      updateApplicationStatus(appId, 'approved', 'Sanction granted by departmental authority.');
    }
    setActionSuccess(`Application ${appId} progressed to next statutory workflow stage.`);
    setReviewNote('');
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleRejectApp = (appId: string) => {
    if (!appId) return;
    updateApplicationStatus(appId, 'rejected', reviewNote || 'Incomplete documentation or discrepancy in eligibility declaration.');
    setActionSuccess(`Application ${appId} has been marked with discrepancy/rejection notes.`);
    setReviewNote('');
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // Workload Chart Data
  const workloadData = [
    { name: 'Education', count: applications.filter(a => a.category === 'Education').length || 2 },
    { name: 'Certificates', count: applications.filter(a => a.category === 'Identity & Certificates').length || 3 },
    { name: 'Agriculture', count: applications.filter(a => a.category === 'Agriculture').length || 1 },
    { name: 'Healthcare', count: applications.filter(a => a.category === 'Healthcare').length || 1 },
    { name: 'MSME', count: applications.filter(a => a.category === 'Business & MSME').length || 1 },
  ];

  const statusDistribution = [
    { name: 'Auto Validated', value: applications.filter(a => a.status === 'under_verification').length || 1, color: '#3B82F6' },
    { name: 'Pending Review', value: applications.filter(a => a.status === 'department_review').length || 2, color: '#F59E0B' },
    { name: 'Approved', value: applications.filter(a => a.status === 'approved' || a.status === 'completed').length || 3, color: '#10B981' },
    { name: 'Flagged', value: applications.filter(a => a.status === 'rejected').length || 1, color: '#EF4444' },
  ];

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50/70 pb-16">
      
      {/* 1. TOP OFFICIAL IDENTITY & JURISDICTION BAR */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center font-extrabold text-base shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  Department Officer Console
                </h1>
                <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-bold uppercase">
                  {currentRole === 'dept_admin' ? 'Department Admin' : 'Desk Officer'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentUser?.designation || 'Revenue & Public Service Authority'} • 
                Authenticated Officer: <strong className="text-white">{currentUser?.name || 'Officer Desk'}</strong> 
                {' '}(ID: {currentUser?.officialId || currentUser?.id || 'OFF-8821'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>DigiLocker OCR Bridge: 32ms</span>
            </div>
            <Link
              to="/dashboard"
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl transition-colors border border-slate-700"
            >
              <span>View Citizen View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 2. TABBED NAVIGATION: 8 EXACT SECTIONS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto text-xs font-semibold scrollbar-none">
          {[
            { id: 'assigned_apps', label: 'Assigned Applications', icon: FileText, count: applications.length },
            { id: 'pending_verification', label: 'Pending Verification', icon: Clock, count: pendingVerificationApps.length },
            { id: 'doc_verification', label: 'Document Verification', icon: FileCheck2, count: pendingDocs.length },
            { id: 'app_review', label: 'Application Review', icon: CheckCircle2 },
            { id: 'workflow_status', label: 'Workflow Status', icon: GitMerge },
            { id: 'dept_services', label: 'Department Services', icon: Layers, count: services.length },
            { id: 'notifications', label: 'Notifications', icon: Bell, count: 2 },
            { id: 'reports', label: 'Reports', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as OfficerTab)}
                className={`px-3.5 py-3 rounded-t-xl transition-colors flex items-center gap-2 whitespace-nowrap border-b-2 ${
                  isActive
                    ? 'bg-slate-800 text-amber-300 border-amber-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? 'bg-amber-400/20 text-amber-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Success Toast */}
      {actionSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 animate-fadeIn">
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        </div>
      )}

      {/* 3. MAIN TAB CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* TAB 1: ASSIGNED APPLICATIONS */}
        {activeTab === 'assigned_apps' && (
          <div className="space-y-6">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Assigned Total</span>
                <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">{applications.length}</div>
                <p className="text-[10px] text-slate-500 mt-0.5">Under this desk</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-blue-600 uppercase">Auto Validated</span>
                <div className="text-2xl font-extrabold text-gov-blue font-mono mt-1">{pendingVerificationApps.length}</div>
                <p className="text-[10px] text-slate-500 mt-0.5">DigiLocker OCR match</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-amber-600 uppercase">Pending Review</span>
                <div className="text-2xl font-extrabold text-amber-600 font-mono mt-1">
                  {applications.filter(a => a.status === 'department_review').length || 2}
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">Officer scrutiny</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-emerald-600 uppercase">Sanctioned</span>
                <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">
                  {applications.filter(a => a.status === 'approved' || a.status === 'completed').length || 3}
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">SLA met within 7 days</p>
              </div>
            </div>

            {/* Applications Queue Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Live Application Scrutiny Queue</h2>
                  <p className="text-xs text-slate-500">Applications assigned to your departmental jurisdiction</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search applicant or scheme..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[11px] text-slate-500 uppercase border-b border-slate-200 font-mono">
                    <tr>
                      <th className="px-5 py-3.5 font-bold">App ID</th>
                      <th className="px-5 py-3.5 font-bold">Applicant</th>
                      <th className="px-5 py-3.5 font-bold">Service & Category</th>
                      <th className="px-5 py-3.5 font-bold">Current Stage</th>
                      <th className="px-5 py-3.5 font-bold">Status</th>
                      <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {assignedApps.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-4 font-mono font-bold text-gov-blue">
                          {app.id}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-900">{app.applicantName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Submitted: {app.submittedAt}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-800">{app.serviceName}</p>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {app.category}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono text-[11px] text-amber-700 font-semibold">
                          {app.currentStage}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                            app.status === 'approved' || app.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : app.status === 'rejected'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {app.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAppId(app.id);
                              setActiveTab('app_review');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                          >
                            <span>Examine</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PENDING VERIFICATION */}
        {activeTab === 'pending_verification' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold">Pending Document & Identity Verification Desk</p>
                <p className="mt-0.5 text-amber-800">
                  Applications awaiting authoritative scrutiny before issuance or disbursement. Cross-checked with DigiLocker verified credential hashes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingVerificationApps.map((app) => (
                <div key={app.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-gov-blue">{app.id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        {app.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{app.serviceName}</h3>
                    <p className="text-xs text-slate-500">Applicant: <strong>{app.applicantName}</strong></p>
                    <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-600 space-y-1">
                      <p>• Attached Proofs: <strong>{app.attachedDocuments?.length || 2} documents</strong></p>
                      <p>• Current Stage: <strong>{app.currentStage}</strong></p>
                      <p>• Priority: <strong>{app.priority}</strong></p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">Submitted: {app.submittedAt}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAppId(app.id);
                        setActiveTab('app_review');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-gov-blue hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1"
                    >
                      <span>Review Proofs</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DOCUMENT VERIFICATION */}
        {activeTab === 'doc_verification' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900">Authoritative DigiLocker Document Verification</h2>
                <p className="text-xs text-slate-500">Audit cryptographic integrity and verify citizen certificates</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[11px] text-slate-500 uppercase border-b border-slate-200 font-mono">
                    <tr>
                      <th className="px-5 py-3.5 font-bold">Document Name</th>
                      <th className="px-5 py-3.5 font-bold">Issuing Authority</th>
                      <th className="px-5 py-3.5 font-bold">Status</th>
                      <th className="px-5 py-3.5 font-bold">Verification Method</th>
                      <th className="px-5 py-3.5 font-bold text-right">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50">
                        <td className="px-5 py-4 font-bold text-slate-900">
                          {doc.name}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {doc.issuer}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            doc.status === 'verified' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : doc.status === 'missing' 
                              ? 'bg-rose-50 text-rose-700' 
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {doc.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs font-mono text-slate-500">
                          DigiLocker Cryptographic PKI
                        </td>
                        <td className="px-5 py-4 text-right">
                          {doc.status !== 'verified' ? (
                            <button
                              type="button"
                              onClick={() => handleVerifyDocument(doc.id, doc.name)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Verify Proof</span>
                            </button>
                          ) : (
                            <span className="text-xs text-emerald-600 font-bold flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Digitally Signed</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: APPLICATION REVIEW */}
        {activeTab === 'app_review' && (
          !selectedApp ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-card space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">No Applications in Review Queue</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                  There are currently no active applications assigned for departmental review. When citizens submit applications, they will appear here for scrutiny and approval.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('assigned_apps')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Return to Assigned Applications</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Application Details Card (2 cols) */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-gov-blue uppercase bg-blue-50 px-2 py-0.5 rounded">
                        Application Review Mode
                      </span>
                      <h2 className="text-base font-bold text-slate-900 mt-1">
                        {selectedApp.serviceName} ({selectedApp.id})
                      </h2>
                    </div>
                    <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      {selectedApp.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50">
                      <p className="text-[10px] text-slate-400">Applicant</p>
                      <p className="font-bold text-slate-800 mt-0.5">{selectedApp.applicantName}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50">
                      <p className="text-[10px] text-slate-400">Category</p>
                      <p className="font-bold text-slate-800 mt-0.5">{selectedApp.category}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50">
                      <p className="text-[10px] text-slate-400">Submission Date</p>
                      <p className="font-bold text-slate-800 mt-0.5 font-mono">{selectedApp.submittedAt}</p>
                    </div>
                  </div>

                  {/* Form Data Scrutiny */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs text-slate-800">Submitted Form Parameters</h4>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-1">
                      {selectedApp.formData ? (
                        Object.entries(selectedApp.formData).map(([k, v]) => (
                          <div key={k} className="flex items-center justify-between py-0.5">
                            <span className="text-slate-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                            <span className="text-slate-900 font-bold">{String(v)}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400">Default schema parameters auto-validated from Citizen Vault.</p>
                      )}
                    </div>
                  </div>

                  {/* Action Panel */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <label className="block font-bold text-xs text-slate-800">
                      Departmental Review Notes & Audit Remarks
                    </label>
                    <textarea
                      rows={3}
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      placeholder="Enter statutory inspection remarks or grounds for approval/rejection..."
                      className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />

                    {selectedApp.status === 'withdrawn' ? (
                      <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-900 text-xs space-y-1">
                        <div className="flex items-center gap-2 font-bold">
                          <Ban className="w-4 h-4 text-rose-600" />
                          <span>Status: Withdrawn</span>
                        </div>
                        <p className="text-[11px] text-slate-700">
                          Citizen withdrew on <strong>{selectedApp.withdrawnAt || selectedApp.updatedAt}</strong>. Reason: <strong>{selectedApp.withdrawalReason || 'Not specified'}</strong>.
                        </p>
                        <p className="text-[10px] text-rose-700 font-semibold pt-0.5">
                          Statutory actions and workflow advancement are permanently suspended.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleAdvanceStage(selectedApp.id, 1)}
                          className="px-4 py-2 bg-gov-blue hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-sm"
                        >
                          <Check className="w-4 h-4" />
                          <span>Advance Stage / Approve</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectApp(selectedApp.id)}
                          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-colors border border-rose-200 inline-flex items-center gap-1.5"
                        >
                          <X className="w-4 h-4" />
                          <span>Request Re-submission / Discrepancy</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar: Select Another Application */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-card space-y-3">
                  <h3 className="font-bold text-xs text-slate-800">Queue Index</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {applications.map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setSelectedAppId(app.id)}
                        className={`w-full p-3 rounded-xl text-left border transition-all text-xs ${
                          selectedApp?.id === app.id
                            ? 'border-gov-blue bg-blue-50/70 font-bold'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-gov-blue">{app.id}</span>
                          <span className="text-[10px] text-slate-400">{app.status}</span>
                        </div>
                        <p className="text-slate-800 truncate mt-1">{app.applicantName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{app.serviceName}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {/* TAB 5: WORKFLOW STATUS */}
        {activeTab === 'workflow_status' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
              <h2 className="text-base font-bold text-slate-900">4-Stage Statutory SLA Workflow Status</h2>
              <p className="text-xs text-slate-500">Real-time status progression of active citizen application pipelines</p>

              <div className="space-y-4 pt-2">
                {applications.slice(0, 5).map((app) => (
                  <div key={app.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="font-mono font-bold text-gov-blue text-xs">{app.id}</span>
                        <h4 className="font-bold text-slate-900 text-xs">{app.serviceName} • {app.applicantName}</h4>
                      </div>
                      <span className="text-[10px] font-mono bg-white border border-slate-200 px-2 py-0.5 rounded font-semibold text-slate-600">
                        SLA: 7 Days (Statutory)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                      {(app.stages || [
                        { name: 'Submitted', status: 'completed' },
                        { name: 'Document Validation', status: 'current' },
                        { name: 'Department Review', status: 'pending' },
                        { name: 'Approval', status: 'pending' }
                      ]).map((st, i) => (
                        <div 
                          key={i} 
                          className={`p-2 rounded-xl border ${
                            st.status === 'completed' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : st.status === 'current'
                              ? 'bg-blue-50 text-gov-blue border-blue-300 shadow-xs'
                              : 'bg-white text-slate-400 border-slate-200'
                          }`}
                        >
                          <div className="truncate">{st.name}</div>
                          <span className="text-[9px] font-mono uppercase">{st.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: DEPARTMENT SERVICES */}
        {activeTab === 'dept_services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Department Service Catalog</h2>
                <p className="text-xs text-slate-500">Government schemes and services managed by your departmental authority</p>
              </div>
              <span className="text-xs font-bold text-gov-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                {services.length} Registered Services
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((srv) => (
                <div key={srv.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-gov-blue">{srv.id}</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{srv.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{srv.description}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400">{srv.category}</span>
                    <span className="font-bold text-gov-blue">{srv.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Official Escalations & Notifications</h2>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white border-l-4 border-amber-500 border-slate-200 shadow-sm flex items-start gap-3">
                <Bell className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">SLA Alert: Application GF-2026-89421</h4>
                    <span className="text-[10px] font-mono text-slate-400">10m ago</span>
                  </div>
                  <p className="text-xs text-slate-600">Pending verification milestone approaches 48 hours. Scrutiny inspection required.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border-l-4 border-gov-blue border-slate-200 shadow-sm flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-gov-blue mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">DigiLocker Integration Health Check</h4>
                    <span className="text-[10px] font-mono text-slate-400">1h ago</span>
                  </div>
                  <p className="text-xs text-slate-600">State Service Delivery Gateway (SSDG) response latency optimal (28ms average).</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Department Throughput & SLA Reports</h2>
                <p className="text-xs text-slate-500">Audit-ready monthly efficiency analytics</p>
              </div>
              <button
                type="button"
                onClick={() => alert('Official departmental report exported in PDF/CSV format.')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Report (PDF)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Workload by Domain</h3>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={workloadData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Statutory Status Breakdown</h3>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs mt-2">
                  {statusDistribution.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
