import React from 'react';
import { useGovFlow } from '../../store/GovFlowContext';
import { 
  LogOut, 
  CheckCircle2, 
  X,
  Lock,
  RotateCcw,
  ShieldCheck,
  LogIn,
  Layers
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const DemoRoleBanner: React.FC = () => {
  const { 
    currentUser, 
    isSandboxMode,
    toggleSandboxMode,
    logout, 
    logoutMessage, 
    clearLogoutMessage,
    resetAllDemoData 
  } = useGovFlow();
  
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-slate-900 text-slate-300 text-xs border-b border-slate-800 select-none">
      {/* Logout / Notification Toast */}
      {logoutMessage && (
        <div className="bg-emerald-700 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-between shadow-inner animate-fadeIn">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <CheckCircle2 className="w-4 h-4 text-emerald-200 flex-shrink-0" />
            <span>{logoutMessage}</span>
            <button 
              onClick={clearLogoutMessage} 
              className="ml-auto text-emerald-200 hover:text-white p-0.5"
              aria-label="Dismiss message"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto py-1.5 px-4 flex flex-wrap items-center justify-between gap-2">
        {/* Left Side: Environment Badge & Session Status */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 font-bold text-blue-300 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-400/30">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>GovFlow Federated Orchestration Layer</span>
          </span>

          {currentUser ? (
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>
                Authenticated: <strong className="text-white">{currentUser.name}</strong> ({currentUser.role.replace('_', ' ').toUpperCase()})
              </span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Public Visitor Mode (Unauthenticated)</span>
            </span>
          )}

          <span className="hidden xl:inline text-slate-400 text-[11px]">
            Strict DPDP Act 2023 compliance • Zero hardcoded users
          </span>
        </div>

        {/* Right Side: Quick Action & Session Controls */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <>
              {currentUser.role === 'citizen' && (
                <Link
                  to="/dashboard"
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-900/40 text-blue-200 hover:bg-blue-800/60 transition-colors border border-blue-700/50"
                >
                  My Dashboard
                </Link>
              )}
              {(currentUser.role === 'officer' || currentUser.role === 'dept_admin' || currentUser.role === 'DEPARTMENT_OFFICER') && (
                <Link
                  to="/officer/dashboard"
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-900/40 text-amber-200 hover:bg-amber-800/60 transition-colors border border-amber-700/50"
                >
                  Officer Console
                </Link>
              )}
              {(currentUser.role === 'sys_admin' || currentUser.role === 'SYSTEM_ADMIN') && (
                <Link
                  to="/admin/dashboard"
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-900/40 text-purple-200 hover:bg-purple-800/60 transition-colors border border-purple-700/50"
                >
                  Admin Console
                </Link>
              )}

              {/* Secure Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold bg-rose-950/60 text-rose-300 hover:bg-rose-900/80 hover:text-white transition-all border border-rose-800/40"
                title="End session and destroy private cache"
              >
                <LogOut className="w-3 h-3 text-rose-400" />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold bg-gov-blue text-white hover:bg-blue-700 transition-all shadow-xs"
            >
              <LogIn className="w-3 h-3" />
              <span>Multi-Role Sign In</span>
            </Link>
          )}

          {/* Reset Browser Storage State */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset local application state cache and reload cleanly?')) {
                resetAllDemoData();
              }
            }}
            title="Reset local application database"
            className="p-1 rounded bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors ml-1"
            aria-label="Reset local database"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
