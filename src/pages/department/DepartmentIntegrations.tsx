import React, { useState } from 'react';
import { useGovFlow } from '../../store/GovFlowContext';
import { 
  Network, 
  CheckCircle2, 
  Activity, 
  RefreshCw, 
  Sliders, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  Layers,
  Database
} from 'lucide-react';

export const DepartmentIntegrations: React.FC = () => {
  const { integrations, testIntegration } = useGovFlow();
  const [testingId, setTestingId] = useState<string | null>(null);

  const handleTest = async (id: string) => {
    setTestingId(id);
    await testIntegration(id);
    setTestingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Government API Integration Hub
          </h2>
          <p className="text-xs text-slate-500">
            Monitor live status, endpoint health, and exchange latency across national, state, and municipal digital public infrastructure.
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          Sandbox Ready • Transparent Simulators
        </span>
      </div>

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((int) => {
          const isTesting = testingId === int.id;

          return (
            <div
              key={int.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-gov-blue flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    int.status === 'connected'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {int.status === 'connected' ? '🟢 Connected' : '🟡 Sandbox'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-0.5">
                  {int.name}
                </h3>
                <p className="text-[11px] font-semibold text-slate-400 mb-4">
                  {int.type}
                </p>

                {/* Metrics Table */}
                <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Endpoint:</span>
                    <span className="font-mono text-[10px] text-slate-800 truncate max-w-[170px]">
                      {int.endpoint}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Gateway Health:</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {int.health}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Average Latency:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {int.latency} ms
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Total API Calls:</span>
                    <span className="font-mono text-slate-700">
                      {int.totalRequests.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Error Rate:</span>
                    <span className="font-mono text-slate-700">
                      {int.errorRate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-200/60">
                    <span className="text-slate-400">Last Sync:</span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {int.lastSync}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTest(int.id)}
                  disabled={isTesting}
                  className="flex-1 py-2 px-3 bg-gov-blue hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'Testing Ping...' : 'Test Connection'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert(`Adapter configuration for ${int.name} is managed via secure PKI keys in the backend cluster.`)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                  title="Configure Adapter"
                >
                  <Sliders className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
