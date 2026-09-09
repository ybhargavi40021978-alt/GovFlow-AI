import React from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, Clock, CheckCircle2, AlertCircle, Activity } from 'lucide-react';

export const DepartmentAnalytics: React.FC = () => {
  // Volume over time (last 7 days)
  const volumeData = [
    { day: 'Mon', applications: 124, validated: 98 },
    { day: 'Tue', applications: 156, validated: 122 },
    { day: 'Wed', applications: 189, validated: 154 },
    { day: 'Thu', applications: 210, validated: 180 },
    { day: 'Fri', applications: 245, validated: 215 },
    { day: 'Sat', applications: 130, validated: 110 },
    { day: 'Sun', applications: 95, validated: 85 },
  ];

  // API Latency over time
  const latencyData = [
    { time: '08:00', latency: 42 },
    { time: '10:00', latency: 48 },
    { time: '12:00', latency: 62 },
    { time: '14:00', latency: 55 },
    { time: '16:00', latency: 45 },
    { time: '18:00', latency: 39 },
    { time: '20:00', latency: 36 },
  ];

  // Category Distribution
  const categoryData = [
    { name: 'Education', value: 42, color: '#0066CC' },
    { name: 'Certificates', value: 28, color: '#0284C7' },
    { name: 'Healthcare', value: 14, color: '#10B981' },
    { name: 'Housing', value: 10, color: '#F97316' },
    { name: 'Others', value: 6, color: '#8B5CF6' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Service Performance & SLA Analytics
        </h2>
        <p className="text-xs text-slate-500">
          System telemetry, API adapter response latency, and citizen application velocity.
        </p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Avg SLA Turnaround</span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">4.2 Days</div>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-2">
            ↓ 68% Faster than legacy
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">DigiLocker Match Rate</span>
          <div className="text-2xl font-extrabold text-gov-blue font-mono mt-1">96.4%</div>
          <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-2">
            High Confidence
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">API Exchange Latency</span>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">45 ms</div>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-2">
            Optimal Throughput
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">First-Time Pass Rate</span>
          <div className="text-2xl font-extrabold text-purple-600 font-mono mt-1">91.8%</div>
          <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full inline-block mt-2">
            Due to Readiness Meter
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Intake & Validation Volume */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Application Intake & Validation</h3>
              <p className="text-xs text-slate-500">Weekly intake vs automated verification volume</p>
            </div>
            <span className="text-xs font-mono font-bold text-gov-blue bg-blue-50 px-2 py-0.5 rounded">
              7-Day Sprint
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066CC" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0066CC" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }} />
                <Area type="monotone" dataKey="applications" stroke="#0066CC" strokeWidth={2.5} fillOpacity={1} fill="url(#colorApp)" name="Applications Submitted" />
                <Area type="monotone" dataKey="validated" stroke="#10B981" strokeWidth={2.5} fillOpacity={0} name="Auto Validated" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* API Response Time Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">API Gateway Latency (ms)</h3>
              <p className="text-xs text-slate-500">DigiLocker & API Setu round-trip exchange time</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Avg 45ms
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }} />
                <Line type="monotone" dataKey="latency" stroke="#F97316" strokeWidth={3} dot={{ r: 4, fill: '#F97316' }} name="Latency (ms)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
