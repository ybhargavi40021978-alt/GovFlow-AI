import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useGovFlow } from '../../store/GovFlowContext';
import { 
  LayoutDashboard, 
  FileText, 
  FileCheck2, 
  GitMerge, 
  Network, 
  BarChart3, 
  History, 
  Building2, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';

export const DepartmentLayout: React.FC = () => {
  const location = useLocation();
  const { currentUser, allApplications, allDocuments, integrations, auditLogs } = useGovFlow();

  const applications = allApplications;
  const documents = allDocuments;

  const navItems = [
    { label: 'Overview', path: '/department', icon: <LayoutDashboard className="w-4 h-4" /> },
    { 
      label: 'Applications Queue', 
      path: '/department/applications', 
      icon: <FileText className="w-4 h-4" />,
      badge: applications.filter(a => a.status === 'under_verification' || a.status === 'department_review').length 
    },
    { 
      label: 'Document Validation', 
      path: '/department/documents', 
      icon: <FileCheck2 className="w-4 h-4" />,
      badge: documents.filter(d => d.status === 'verification_pending' || d.status === 'missing').length
    },
    { label: 'Workflow Builder', path: '/department/workflows', icon: <GitMerge className="w-4 h-4" /> },
    { 
      label: 'API Integration Hub', 
      path: '/department/integrations', 
      icon: <Network className="w-4 h-4" />,
      badge: integrations.filter(i => i.status === 'connected').length + ' Active'
    },
    { label: 'Analytics & SLA', path: '/department/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Audit Logs', path: '/department/audit-logs', icon: <History className="w-4 h-4" /> },
  ];

  const isActive = (path: string) => {
    if (path === '/department') return location.pathname === '/department';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="bg-slate-50/70 min-h-[calc(100vh-80px)]">
      {/* Top Console Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center font-extrabold text-sm">
              KA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white">
                  GovFlow Department Console
                </h1>
                <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                  Officer Desk
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Department of Revenue & Education Authority • {currentUser?.name || 'Authorized Officer'} (ID: {currentUser?.officialId || currentUser?.id || 'OFF-882'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>DigiLocker Bridge: 38ms</span>
            </div>
            <Link
              to="/dashboard"
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-colors"
            >
              <span>View Citizen Portal</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto pb-1 text-xs font-semibold">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3.5 py-2.5 rounded-t-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
                isActive(item.path)
                  ? 'bg-slate-50/70 text-gov-navy font-bold border-t-2 border-amber-500'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive(item.path) ? 'bg-amber-100 text-amber-800' : 'bg-slate-800 text-slate-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Child Route Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
    </div>
  );
};
