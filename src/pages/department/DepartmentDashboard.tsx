import React from 'react';
import { useGovFlow } from '../../store/GovFlowContext';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  CheckCheck, 
  Network, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp,
  Activity
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const DepartmentDashboard: React.FC = () => {
  const { currentUser, allApplications, allDocuments, integrations, auditLogs } = useGovFlow();

  const applications = allApplications;
  const documents = allDocuments;

  const totalApps = applications.length;
  const autoValidated = applications.filter(a => a.status === 'under_verification').length;
  const pendingReview = applications.filter(a => a.status === 'department_review').length;
  const completed = applications.filter(a => a.status === 'approved' || a.status === 'completed').length;
  const missingDocs = documents.filter(d => d.status === 'missing').length;

  const workloadData = [
    { category: 'Education', count: applications.filter(a => a.category === 'Education').length || 1 },
    { category: 'Certificates', count: applications.filter(a => a.category === 'Identity & Certificates').length || 1 },
    { category: 'Healthcare', count: applications.filter(a => a.category === 'Healthcare').length || 1 },
    { category: 'Housing', count: 1 },
    { category: 'Agriculture', count: 1 },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards Row (Section 38) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Applications</span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">{totalApps}</div>
          <p className="text-[10px] text-slate-500 mt-0.5">All Central & State</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-blue-600 uppercase">Auto Validated</span>
          <div className="text-2xl font-extrabold text-gov-blue font-mono mt-1">{autoValidated}</div>
          <p className="text-[10px] text-slate-500 mt-0.5">DigiLocker OCR match</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-amber-600 uppercase">Pending Review</span>
          <div className="text-2xl font-extrabold text-amber-600 font-mono mt-1">{pendingReview}</div>
          <p className="text-[10px] text-slate-500 mt-0.5">Officer desk queue</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-rose-600 uppercase">Missing Docs</span>
          <div className="text-2xl font-extrabold text-rose-600 font-mono mt-1">{missingDocs}</div>
          <p className="text-[10px] text-slate-500 mt-0.5">Citizen action required</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-600 uppercase">Completed</span>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">{completed}</div>
          <p className="text-[10px] text-slate-500 mt-0.5">Sanctioned & issued</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">API Health</span>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">99.8%</div>
          <p className="text-[10px] text-slate-500 mt-0.5">42ms average latency</p>
        </div>
      </div>

      {/* Grid: Workload Chart & Queue Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workload Distribution Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Application Workload by Category</h3>
              <p className="text-xs text-slate-500">Live distribution of citizen requests in current sprint</p>
            </div>
            <span className="text-xs font-mono font-bold text-gov-blue bg-blue-50 px-2.5 py-1 rounded-lg">
              Live Synchronized
            </span>
          </div>

          <div className="h-56 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                />
                <Bar dataKey="count" fill="#0066CC" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Center (1 col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Officer Action Center</h3>
            <p className="text-xs text-slate-500 mb-4">Immediate tasks requiring manual desk scrutiny</p>

            <div className="space-y-3 text-xs">
              <Link
                to="/department/applications"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex items-center justify-between block"
              >
                <div>
                  <p className="font-bold text-slate-800">Pending Applications</p>
                  <p className="text-slate-500 text-[11px]">{pendingReview} cases await review</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gov-blue" />
              </Link>

              <Link
                to="/department/documents"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex items-center justify-between block"
              >
                <div>
                  <p className="font-bold text-slate-800">Document Queue</p>
                  <p className="text-slate-500 text-[11px]">Audit newly uploaded files</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gov-blue" />
              </Link>

              <Link
                to="/department/integrations"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex items-center justify-between block"
              >
                <div>
                  <p className="font-bold text-slate-800">Integration Hub</p>
                  <p className="text-slate-500 text-[11px]">5 adapters operational</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gov-blue" />
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Role: {currentUser?.designation || (currentUser?.role === 'dept_admin' ? 'Department Administrator' : 'Department Officer')} ({currentUser?.name || 'Officer Desk'})</span>
          </div>
        </div>
      </div>

      {/* Recent Audit Log Snapshot */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Immutable Audit Activity</h3>
            <p className="text-xs text-slate-500">Chronological activity log recorded across automated and officer operations</p>
          </div>
          <Link to="/department/audit-logs" className="text-xs font-bold text-gov-blue hover:underline">
            View All Audit Logs →
          </Link>
        </div>

        <div className="space-y-2">
          {auditLogs.slice(0, 3).map((log) => (
            <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[11px] text-slate-400">{log.timestamp}</span>
                <span className="font-bold text-slate-800">{log.actor}</span>
                <span className="text-slate-400">•</span>
                <span className="text-gov-blue font-semibold">{log.action}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                log.result === 'Success' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {log.result}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
