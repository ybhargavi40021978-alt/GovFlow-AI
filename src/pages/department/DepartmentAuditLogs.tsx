import React, { useState } from 'react';
import { useGovFlow } from '../../store/GovFlowContext';
import { History, Search, Filter, ShieldCheck, Download } from 'lucide-react';

export const DepartmentAuditLogs: React.FC = () => {
  const { auditLogs } = useGovFlow();
  const [searchQuery, setSearchQuery] = useState('');
  const [resultFilter, setResultFilter] = useState('all');

  const filteredLogs = auditLogs.filter(log => {
    if (resultFilter !== 'all' && log.result !== resultFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchActor = log.actor.toLowerCase().includes(q);
      const matchAction = log.action.toLowerCase().includes(q);
      const matchService = log.service.toLowerCase().includes(q);
      const matchDetails = log.details.toLowerCase().includes(q);
      if (!matchActor && !matchAction && !matchService && !matchDetails) return false;
    }
    return true;
  });

  const handleExportLogs = () => {
    const jsonStr = JSON.stringify(auditLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GovFlow_Audit_Trail_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Immutable Audit Trail & Regulatory Logs
          </h2>
          <p className="text-xs text-slate-500">
            Cryptographically sealed timeline of all citizen consent transactions, officer decisions, and system validations.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportLogs}
          className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log (JSON)</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by actor, action, or scheme..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-gov-blue"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'Success', label: 'Success' },
            { id: 'Manual Review', label: 'Manual Review' },
            { id: 'Warning', label: 'Warning' },
            { id: 'Error', label: 'Error' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setResultFilter(r.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                resultFilter === r.id
                  ? 'bg-gov-blue text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-5 py-3.5">Timestamp</th>
              <th className="px-5 py-3.5">Actor & Role</th>
              <th className="px-5 py-3.5">Action Executed</th>
              <th className="px-5 py-3.5">Target Scheme</th>
              <th className="px-5 py-3.5">Result</th>
              <th className="px-5 py-3.5">Technical Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                  {log.timestamp}
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <p className="font-bold text-slate-800">{log.actor}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{log.actorRole}</p>
                </td>
                <td className="px-5 py-4 font-bold text-gov-blue whitespace-nowrap">
                  {log.action}
                </td>
                <td className="px-5 py-4 text-slate-700 whitespace-nowrap">
                  {log.service}
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    log.result === 'Success'
                      ? 'bg-emerald-100 text-emerald-800'
                      : log.result === 'Manual Review'
                      ? 'bg-blue-100 text-gov-blue'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {log.result}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-500 text-[11px] max-w-sm">
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
