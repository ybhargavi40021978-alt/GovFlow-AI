import React, { useState } from 'react';
import { useGovFlow } from '../../store/GovFlowContext';
import { Application, ApplicationStatus } from '../../types';
import { getStatusBadge } from '../../components/cards/ApplicationCard';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  X, 
  Building2, 
  FileText, 
  Send,
  Sparkles,
  ArrowRight,
  Ban,
  AlertTriangle
} from 'lucide-react';

export const DepartmentApplications: React.FC = () => {
  const { allApplications, updateApplicationStatus, updateApplicationStage } = useGovFlow();

  const applications = allApplications;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [reviewApp, setReviewApp] = useState<Application | null>(null);
  const [officerNoteInput, setOfficerNoteInput] = useState('');

  const filteredApps = applications.filter(app => {
    if (selectedStatus !== 'all' && app.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = app.id.toLowerCase().includes(q);
      const matchCitizen = app.applicantName.toLowerCase().includes(q);
      const matchService = app.serviceName.toLowerCase().includes(q);
      if (!matchId && !matchCitizen && !matchService) return false;
    }
    return true;
  });

  const handleApprove = (app: Application) => {
    updateApplicationStatus(app.id, 'approved', officerNoteInput || 'Approved after institutional and document scrutiny.');
    setReviewApp(null);
    setOfficerNoteInput('');
  };

  const handleReject = (app: Application) => {
    updateApplicationStatus(app.id, 'rejected', officerNoteInput || 'Rejected due to criteria non-compliance.');
    setReviewApp(null);
    setOfficerNoteInput('');
  };

  const handleAdvanceStage = (app: Application) => {
    const nextPendingIdx = app.stages.findIndex(s => s.status === 'pending');
    const currentIdx = app.stages.findIndex(s => s.status === 'current');

    if (currentIdx !== -1) {
      updateApplicationStage(app.id, currentIdx, 'completed', 'Stage completed by officer desk');
    }
    if (nextPendingIdx !== -1) {
      updateApplicationStage(app.id, nextPendingIdx, 'current', 'Active in desk verification');
    }
    setReviewApp(null);
    setOfficerNoteInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Application Scrutiny & Queue Management
          </h2>
          <p className="text-xs text-slate-500">
            Inspect citizen submissions, cross-verify DigiLocker attachments, and approve or advance workflow stages.
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-gov-blue bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
          {filteredApps.length} Cases in Worklist
        </span>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, citizen name, or scheme..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-gov-blue"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Cases' },
            { id: 'under_verification', label: 'Under Verification' },
            { id: 'department_review', label: 'Desk Review' },
            { id: 'approved', label: 'Approved' },
            { id: 'rejected', label: 'Rejected' },
            { id: 'withdrawn', label: 'Withdrawn' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStatus(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedStatus === st.id
                  ? 'bg-gov-blue text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">App ID</th>
                <th className="px-5 py-3.5">Citizen Name</th>
                <th className="px-5 py-3.5">Service & Department</th>
                <th className="px-5 py-3.5">Submitted</th>
                <th className="px-5 py-3.5">Current Stage</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-gov-blue whitespace-nowrap">
                    {app.id}
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-800 whitespace-nowrap">
                    {app.applicantName}
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-800 line-clamp-1">{app.serviceName}</p>
                    <p className="text-[11px] text-slate-400 truncate max-w-xs">{app.department}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {app.submittedAt.split(' ')[0]}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {app.currentStage}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => {
                        setReviewApp(app);
                        setOfficerNoteInput(app.officerNotes || '');
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-gov-blue hover:text-white rounded-lg text-xs font-bold text-slate-700 transition-colors flex items-center gap-1 inline-flex"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Scrutinize</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Scrutiny Drawer Modal */}
      {reviewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-elevation border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-xs text-gov-blue bg-blue-100 px-2.5 py-1 rounded-lg">
                  {reviewApp.id}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {reviewApp.serviceName}
                  </h3>
                  <p className="text-xs text-slate-500">Applicant: {reviewApp.applicantName}</p>
                </div>
              </div>
              <button
                onClick={() => setReviewApp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {/* Withdrawn Status Authoritative Banner */}
              {reviewApp.status === 'withdrawn' && (
                <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ban className="w-5 h-5 text-rose-600" />
                      <span className="font-extrabold text-sm text-slate-900">Status: Withdrawn</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                      PROCESSING LOCKED
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 pt-1 border-t border-rose-200/60">
                    <div>
                      <span className="text-slate-400 block font-medium">Withdrawn At:</span>
                      <span className="font-mono font-bold text-slate-800">{reviewApp.withdrawnAt || reviewApp.updatedAt}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Withdrawal Reason:</span>
                      <span className="font-bold text-rose-700">{reviewApp.withdrawalReason || 'Not specified'}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 italic">
                    The citizen has formally withdrawn this application. Statutory review, stage transitions, and sanctions are suspended.
                  </p>
                </div>
              )}

              {/* Submission Data Snapshot */}
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                  Auto-Filled Form Payload
                </h4>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3">
                  {Object.entries(reviewApp.formData).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-slate-400 font-mono text-[10px] block uppercase">{k}:</span>
                      <span className="font-bold text-slate-800 text-xs">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attached Documents */}
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                  Attached Verified Documents ({reviewApp.attachedDocuments.length})
                </h4>
                <div className="space-y-2">
                  {reviewApp.attachedDocuments.map((doc, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gov-blue" />
                        <span className="font-semibold text-slate-800">{doc}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ✓ Cryptographically Matched
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Officer Note */}
              <div>
                <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block mb-1">
                  Department Officer Remarks & Audit Notes
                </label>
                <textarea
                  rows={3}
                  value={officerNoteInput}
                  onChange={(e) => setOfficerNoteInput(e.target.value)}
                  placeholder="Enter remarks for statutory decision or request additional verification..."
                  disabled={reviewApp.status === 'withdrawn'}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-gov-blue text-xs disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              {reviewApp.status === 'withdrawn' ? (
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                    <Ban className="w-4 h-4 text-rose-600" />
                    <span>Status: Withdrawn. Normal statutory processing is suspended.</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setReviewApp(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Close Record
                  </button>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleReject(reviewApp)}
                    className="px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Application</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAdvanceStage(reviewApp)}
                      className="px-4 py-2 text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>Advance Stage</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApprove(reviewApp)}
                      className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Issue Sanction</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
