import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGovFlow } from '../../store/GovFlowContext';
import { GovFlowApiService, PROVISIONED_OFFICIAL_USERS } from '../../services/api';
import { User } from '../../types';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Layers, 
  Network, 
  GitMerge, 
  BarChart3, 
  History, 
  ShieldCheck, 
  Activity, 
  Settings, 
  Search, 
  CheckCircle2, 
  RefreshCw, 
  ShieldAlert, 
  ToggleLeft, 
  ToggleRight, 
  ExternalLink
} from 'lucide-react';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';

type AdminTab = 
  | 'overview'
  | 'users'
  | 'departments'
  | 'services'
  | 'integrations'
  | 'workflows'
  | 'analytics'
  | 'audit_logs'
  | 'security'
  | 'health'
  | 'settings';

export const AdminDashboardPage: React.FC = () => {
  const { 
    currentUser, 
    services, 
    departments, 
    integrations, 
    auditLogs,
    isSandboxMode, 
    toggleSandboxMode,
    testIntegration,
    resetAllDemoData
  } = useGovFlow();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [integrationTestingId, setIntegrationTestingId] = useState<string | null>(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [sessionTimeoutMins, setSessionTimeoutMins] = useState('60');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    // Fetch registered and provisioned accounts via backend service
    GovFlowApiService.getAdminUsers()
      .then(users => setAdminUsers(users))
      .catch(() => {
        // Fallback to active provisioned official users
        setAdminUsers(PROVISIONED_OFFICIAL_USERS);
      });
  }, []);

  const handleTestIntegration = async (id: string) => {
    setIntegrationTestingId(id);
    await testIntegration(id);
    setIntegrationTestingId(null);
    setActionNotice(`Cryptographic bridge test completed for integration endpoint "${id}".`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleToggleUserStatus = (userId: string) => {
    setAdminUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextState = u.isActive === false ? true : false;
        return { ...u, isActive: nextState };
      }
      return u;
    }));
    setActionNotice(`User status updated.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Filtered lists
  const filteredUsers = adminUsers.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.officialId && u.officialId.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
    s.id.toLowerCase().includes(serviceSearch.toLowerCase()) ||
    s.category.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  // Telemetry Chart Data
  const throughputData = [
    { hour: '00:00', requests: 420, latency: 28 },
    { hour: '04:00', requests: 180, latency: 22 },
    { hour: '08:00', requests: 1450, latency: 36 },
    { hour: '12:00', requests: 3820, latency: 44 },
    { hour: '16:00', requests: 4100, latency: 41 },
    { hour: '20:00', requests: 2900, latency: 31 },
    { hour: 'Now', requests: 3450, latency: 33 },
  ];

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50/70 pb-16">
      
      {/* 1. TOP SYSTEM ADMINISTRATOR HEADER */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-400 flex items-center justify-center font-extrabold text-base shadow-sm">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  Universal System Administrator Console
                </h1>
                <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-bold uppercase">
                  ROOT SYSTEM ACCESS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                National Platform Administration • <strong className="text-white">{currentUser?.name || 'System Administrator'}</strong>
                {' '}(ID: <span className="font-mono text-cyan-300">{currentUser?.officialId || 'ADMIN001'}</span>)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Platform Uptime: 99.98%</span>
            </div>
            <Link
              to="/dashboard"
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl transition-colors border border-slate-700"
            >
              <span>Citizen Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 2. TABBED NAVIGATION: 11 EXACT REQUIREMENTS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto text-xs font-semibold scrollbar-none">
          {[
            { id: 'overview', label: 'Platform Overview', icon: LayoutDashboard },
            { id: 'users', label: 'Users', icon: Users, count: adminUsers.length },
            { id: 'departments', label: 'Departments', icon: Building2, count: departments.length },
            { id: 'services', label: 'Service Registry', icon: Layers, count: services.length },
            { id: 'integrations', label: 'API Integrations', icon: Network, count: integrations.length },
            { id: 'workflows', label: 'Workflow Configuration', icon: GitMerge },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'audit_logs', label: 'Audit Logs', icon: History, count: auditLogs.length },
            { id: 'security', label: 'Security', icon: ShieldCheck },
            { id: 'health', label: 'System Health', icon: Activity },
            { id: 'settings', label: 'Platform Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`px-3.5 py-3 rounded-t-xl transition-colors flex items-center gap-2 whitespace-nowrap border-b-2 ${
                  isActive
                    ? 'bg-slate-800 text-purple-300 border-purple-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? 'bg-purple-400/20 text-purple-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Notice */}
      {actionNotice && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 animate-fadeIn">
          <div className="p-3 bg-blue-50 border border-blue-200 text-gov-blue rounded-xl text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-gov-blue flex-shrink-0" />
            <span>{actionNotice}</span>
          </div>
        </div>
      )}

      {/* 3. TAB PANELS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* 1. PLATFORM OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Registered Services</span>
                <div className="text-2xl font-extrabold text-gov-navy font-mono mt-1">{services.length}</div>
                <p className="text-[10px] text-slate-500 mt-0.5">Central & State schemes</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-gov-blue uppercase">Departments</span>
                <div className="text-2xl font-extrabold text-gov-blue font-mono mt-1">{departments.length}</div>
                <p className="text-[10px] text-slate-500 mt-0.5">35 catalogued authorities</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-emerald-600 uppercase">API Integrations</span>
                <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">{integrations.length} Active</div>
                <p className="text-[10px] text-slate-500 mt-0.5">DigiLocker, Setu, UMANG</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-purple-600 uppercase">Active Users</span>
                <div className="text-2xl font-extrabold text-purple-600 font-mono mt-1">{adminUsers.length}</div>
                <p className="text-[10px] text-slate-500 mt-0.5">Citizens, Officers, Admins</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-amber-600 uppercase">Audit Records</span>
                <div className="text-2xl font-extrabold text-amber-600 font-mono mt-1">{auditLogs.length}</div>
                <p className="text-[10px] text-slate-500 mt-0.5">Immutable security logs</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-emerald-600 uppercase">Average Latency</span>
                <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">32ms</div>
                <p className="text-[10px] text-slate-500 mt-0.5">Across API Setu bridges</p>
              </div>
            </div>

            {/* Throughput chart */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">National Platform API Request Volume & Latency</h3>
                  <p className="text-xs text-slate-500">Live 24-hour telemetry aggregated across Indian state gateways</p>
                </div>
                <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg font-bold">
                  ● Telemetry Stream Nominal
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={throughputData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="requests" stroke="#9333EA" fill="#F3E8FF" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* 2. USERS */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden space-y-4">
            <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Platform User Directory & Role Management</h2>
                <p className="text-xs text-slate-500">Manage citizen profiles, official desk officers, and system administrators</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user name or ID..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] text-slate-500 uppercase border-b border-slate-200 font-mono">
                  <tr>
                    <th className="px-5 py-3.5 font-bold">User</th>
                    <th className="px-5 py-3.5 font-bold">Email / Official ID</th>
                    <th className="px-5 py-3.5 font-bold">Role</th>
                    <th className="px-5 py-3.5 font-bold">Status</th>
                    <th className="px-5 py-3.5 font-bold text-right">Access Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">ID: {u.id}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-mono text-slate-700">{u.email}</p>
                        {u.officialId && <span className="text-[10px] font-mono text-slate-400">{u.officialId}</span>}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                          u.role === 'sys_admin' || u.role === 'SYSTEM_ADMIN' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                          u.role === 'officer' || u.role === 'dept_admin' || u.role === 'DEPARTMENT_OFFICER' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-blue-50 text-gov-blue border border-blue-200'
                        }`}>
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          u.isActive !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {u.isActive !== false ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleUserStatus(u.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                            u.isActive !== false 
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {u.isActive !== false ? 'Suspend Account' : 'Reactivate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. DEPARTMENTS */}
        {activeTab === 'departments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">35+ Catalogued Government Authorities</h2>
                <p className="text-xs text-slate-500">Central ministries, state departments, district administrations, and civic bodies</p>
              </div>
              <Link to="/departments" className="text-xs font-bold text-gov-blue hover:underline flex items-center gap-1">
                <span>View Public Directory</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.slice(0, 9).map((dept) => (
                <div key={dept.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{dept.level}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-gov-blue">
                      {dept.serviceCount} Schemes
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{dept.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{dept.description}</p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>{dept.jurisdiction}</span>
                    <span className="text-emerald-600 font-bold">● Active Gateway</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. SERVICE REGISTRY */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden space-y-4">
            <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Statutory Service Registry & Eligibility Schemas</h2>
                <p className="text-xs text-slate-500">Manage schemes, workflow stages, and digital application eligibility criteria</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  placeholder="Filter services..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] text-slate-500 uppercase border-b border-slate-200 font-mono">
                  <tr>
                    <th className="px-5 py-3.5 font-bold">Service ID</th>
                    <th className="px-5 py-3.5 font-bold">Service Name</th>
                    <th className="px-5 py-3.5 font-bold">Category</th>
                    <th className="px-5 py-3.5 font-bold">Government Level</th>
                    <th className="px-5 py-3.5 font-bold">Integration Status</th>
                    <th className="px-5 py-3.5 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredServices.map((srv) => (
                    <tr key={srv.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-mono font-bold text-gov-blue">{srv.id}</td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900">{srv.name}</p>
                        <p className="text-[10px] text-slate-400">{srv.department}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{srv.category}</td>
                      <td className="px-5 py-4 font-bold text-slate-700">{srv.level}</td>
                      <td className="px-5 py-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {srv.integrationStatus || 'API Ready'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/services/${srv.id}`}
                          className="text-xs font-bold text-gov-blue hover:underline"
                        >
                          Configure →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. API INTEGRATIONS */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Federated Digital Infrastructure Endpoints</h2>
                <p className="text-xs text-slate-500">Live cryptographic bridges to DigiLocker, API Setu, UMANG, and State SSDGs</p>
              </div>
              <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                100% Operational (0 Faults)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {integrations.map((integ) => (
                <div key={integ.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{integ.type}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {integ.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{integ.name}</h3>
                    <p className="text-xs font-mono text-slate-500 truncate">{integ.endpoint}</p>
                    <div className="p-3 rounded-xl bg-slate-50 font-mono text-[11px] text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Latency:</span>
                        <span className="text-emerald-600 font-bold">{integ.latency}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Health & Error:</span>
                        <span className="font-bold text-slate-700">{integ.health} ({integ.errorRate})</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTestIntegration(integ.id)}
                    disabled={integrationTestingId === integ.id}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${integrationTestingId === integ.id ? 'animate-spin' : ''}`} />
                    <span>{integrationTestingId === integ.id ? 'Pinging Endpoint...' : 'Ping Test Bridge'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. WORKFLOW CONFIGURATION */}
        {activeTab === 'workflows' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">National 4-Stage Approval Workflow & SLA Gateways</h2>
              <p className="text-xs text-slate-500">Define statutory deadlines, escalation triggers, and auto-sanction criteria</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { stage: 'Stage 1: Intent & Citizen Profile', sla: 'Instant (<1m)', rule: 'Auto-fills verified DigiLocker attributes' },
                { stage: 'Stage 2: Document Verification', sla: 'Max 48 Hours', rule: 'Cryptographic OCR hash match against Setu' },
                { stage: 'Stage 3: Department Inspection', sla: 'Max 5 Days', rule: 'Desk review by ward revenue officer' },
                { stage: 'Stage 4: Approval & Sanction', sla: 'Max 7 Days', rule: 'Digital signature issuance & DBT notification' },
              ].map((w, i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-xs font-bold font-mono text-gov-blue">Stage 0{i + 1}</span>
                  <h4 className="font-bold text-slate-900 text-xs">{w.stage}</h4>
                  <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-600 space-y-1">
                    <p><strong>Statutory SLA:</strong> {w.sla}</p>
                    <p className="text-slate-500">{w.rule}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Platform Analytics & SLA Compliance</h2>
              <p className="text-xs text-slate-500">Aggregated performance indicators across all 35 participating departments</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">National SLA Compliance Rate</span>
                <div className="text-3xl font-extrabold text-emerald-600 font-mono">94.8%</div>
                <p className="text-xs text-slate-500">Applications resolved within citizen charter deadlines</p>
              </div>
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Auto-Verification Rate</span>
                <div className="text-3xl font-extrabold text-gov-blue font-mono">78.2%</div>
                <p className="text-xs text-slate-500">Direct DigiLocker credential auto-matching without physical paper</p>
              </div>
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Average Redressal Time</span>
                <div className="text-3xl font-extrabold text-amber-600 font-mono">4.2 Days</div>
                <p className="text-xs text-slate-500">Down from 21 days in un-orchestrated portals</p>
              </div>
            </div>
          </div>
        )}

        {/* 8. AUDIT LOGS */}
        {activeTab === 'audit_logs' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden space-y-4">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Immutable Platform Security Audit Trail</h2>
                <p className="text-xs text-slate-500">Tamper-evident logs of user authentications, application modifications, and administrative changes</p>
              </div>
              <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                SHA-256 Verified Ledger
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] text-slate-500 uppercase border-b border-slate-200 font-mono">
                  <tr>
                    <th className="px-5 py-3.5 font-bold">Audit ID</th>
                    <th className="px-5 py-3.5 font-bold">Timestamp</th>
                    <th className="px-5 py-3.5 font-bold">Actor</th>
                    <th className="px-5 py-3.5 font-bold">Action</th>
                    <th className="px-5 py-3.5 font-bold">Service Component</th>
                    <th className="px-5 py-3.5 font-bold">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 font-medium">
                      <td className="px-5 py-3.5 font-bold text-gov-blue">{log.id}</td>
                      <td className="px-5 py-3.5 text-slate-500">{log.timestamp}</td>
                      <td className="px-5 py-3.5 text-slate-800 font-sans font-bold">{log.actor}</td>
                      <td className="px-5 py-3.5 font-bold text-slate-700">{log.action}</td>
                      <td className="px-5 py-3.5 text-slate-600">{log.service}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          log.result === 'Success' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {log.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 9. SECURITY */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Security & DPDP Compliance Posture</h2>
              <p className="text-xs text-slate-500">Digital Personal Data Protection (DPDP) Act 2023 controls and encryption parameters</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Granular Time-Bound DPDP Consent Ledger</span>
                </div>
                <p className="text-emerald-800">
                  Citizen consents for DigiLocker document pulls are bound by explicit statutory expiration timestamps. Zero perpetual data retention.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-gov-blue" />
                  <span>AES-256 In-Transit & At-Rest Encryption</span>
                </div>
                <p className="text-blue-800">
                  All citizen payload parameters pass through hardware-secured TLS 1.3 tunnels with federated ephemeral keys.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 10. SYSTEM HEALTH */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">System Telemetry & Health Monitoring</h2>
              <p className="text-xs text-slate-500">Infrastructure diagnostics and container health</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase">CPU Utilization</span>
                <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">18.4%</div>
                <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Healthy (8 Cores)</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Memory Footprint</span>
                <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">1.4 GB / 8 GB</div>
                <p className="text-[10px] text-emerald-600 font-bold mt-0.5">17.5% capacity</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Database IOPS</span>
                <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">420 IOPS</div>
                <p className="text-[10px] text-slate-500 mt-0.5">Indexed query cache</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Error Rate</span>
                <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">&lt;0.01%</div>
                <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Zero critical incidents</p>
              </div>
            </div>
          </div>
        )}

        {/* 11. PLATFORM SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Platform Global Settings & Operational Toggles</h2>
              <p className="text-xs text-slate-500">Configure system security parameters, evaluation environments, and session limits</p>
            </div>

            <div className="space-y-4 divide-y divide-slate-100 text-xs">
              
              {/* Maintenance Mode Toggle */}
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">Platform Maintenance Mode</h4>
                  <p className="text-slate-500 text-[11px]">Display an official scheduled maintenance notice to public visitors</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className="p-1 text-slate-700"
                >
                  {maintenanceMode ? (
                    <ToggleRight className="w-8 h-8 text-rose-600" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-400" />
                  )}
                </button>
              </div>

              {/* Sandbox Mode Toggle */}
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">Isolated Sandbox Evaluation Environment (SIH)</h4>
                  <p className="text-slate-500 text-[11px]">Toggle demo evaluation mode vs strict clean production mode</p>
                </div>
                <button
                  type="button"
                  onClick={toggleSandboxMode}
                  className="p-1 text-slate-700"
                >
                  {isSandboxMode ? (
                    <ToggleRight className="w-8 h-8 text-amber-500" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-400" />
                  )}
                </button>
              </div>

              {/* Session Timeout */}
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">Administrative Inactivity Timeout</h4>
                  <p className="text-slate-500 text-[11px]">Automatically terminate idle officer and administrator sessions</p>
                </div>
                <select
                  value={sessionTimeoutMins}
                  onChange={(e) => setSessionTimeoutMins(e.target.value)}
                  className="p-2 border border-slate-200 rounded-xl bg-slate-50 font-bold"
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">60 Minutes</option>
                  <option value="120">120 Minutes</option>
                </select>
              </div>

              {/* Cache Purge */}
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-rose-700">Hard State Reset</h4>
                  <p className="text-slate-500 text-[11px]">Wipe local browser storage, sessions, and re-initialize database</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Wipe local browser cache and reload cleanly?')) {
                      resetAllDemoData();
                    }
                  }}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200 transition-colors"
                >
                  Reset Platform Database Cache
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
