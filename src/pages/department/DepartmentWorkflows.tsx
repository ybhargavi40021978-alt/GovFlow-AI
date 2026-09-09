import React, { useState } from 'react';
import { useGovFlow } from '../../store/GovFlowContext';
import { GitMerge, ArrowRight, CheckCircle2, Clock, Plus, ShieldCheck } from 'lucide-react';

export const DepartmentWorkflows: React.FC = () => {
  const { services } = useGovFlow();
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');

  const activeService = services.find(s => s.id === selectedServiceId) || services[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Workflow Automation & Pipeline Visualizer
          </h2>
          <p className="text-xs text-slate-500">
            Configure, inspect, and simulate orchestrated service delivery milestones across state and central departments.
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-gov-blue bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
          Reusable Workflow Engine
        </span>
      </div>

      {/* Select Service */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
          Target Service Pipeline:
        </label>
        <select
          value={selectedServiceId}
          onChange={(e) => setSelectedServiceId(e.target.value)}
          className="w-full sm:w-auto flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.department})
            </option>
          ))}
        </select>
      </div>

      {/* Visual Workflow Canvas */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-8">
        <div>
          <span className="text-[10px] font-mono font-bold text-gov-blue uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded">
            Pipeline Architecture
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-2">
            {activeService.name}
          </h3>
          <p className="text-xs text-slate-500">
            Statutory turnaround target: {activeService.expectedTimeline} • Issuing Authority: {activeService.department}
          </p>
        </div>

        {/* Stages Horizontal/Vertical Chain */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {activeService.workflowStages.map((stage, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/80 hover:border-blue-300 transition-all flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-gov-blue text-white font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Stage {idx + 1}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 leading-snug mb-1">
                  {stage}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {idx === 0
                    ? 'Citizen identity e-KYC and auto-filled data verification.'
                    : idx === 1
                    ? 'DigiLocker certificate checksum & database validation.'
                    : idx === 2
                    ? 'Officer desk field check and scrutiny.'
                    : idx === 3
                    ? 'Statutory sanction digital signing.'
                    : 'Disbursement via PFMS DBT / QR Certificate issuance.'}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Automated SLA</span>
                <span className="text-emerald-700 font-bold">Compliant</span>
              </div>
            </div>
          ))}
        </div>

        {/* Engine Rules Info */}
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center gap-3 text-xs text-slate-700">
          <ShieldCheck className="w-5 h-5 text-gov-blue flex-shrink-0" />
          <p>
            This workflow engine orchestrates across DigiLocker, API Setu, and State portals. When an application satisfies automated validation rules, it advances without manual clerical delays.
          </p>
        </div>
      </div>
    </div>
  );
};
