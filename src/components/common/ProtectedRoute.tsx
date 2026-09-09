import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useGovFlow } from '../../store/GovFlowContext';
import { UserRole } from '../../types';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const isRoleMatch = (userRole: UserRole | string | null | undefined, allowedRoles?: (UserRole | string)[]): boolean => {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  if (!userRole) return false;
  if (allowedRoles.includes(userRole)) return true;
  if (
    (userRole === 'DEPARTMENT_OFFICER' || userRole === 'officer') &&
    (allowedRoles.includes('officer') || allowedRoles.includes('DEPARTMENT_OFFICER'))
  ) {
    return true;
  }
  if (
    (userRole === 'SYSTEM_ADMIN' || userRole === 'sys_admin') &&
    (allowedRoles.includes('sys_admin') || allowedRoles.includes('SYSTEM_ADMIN'))
  ) {
    return true;
  }
  return false;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { currentUser, currentRole } = useGovFlow();
  const location = useLocation();

  // If not logged in at all (Visitor)
  if (!currentUser) {
    return (
      <Navigate 
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`} 
        replace 
        state={{ from: location.pathname }}
      />
    );
  }

  // If logged in, but role is not authorized for this specific section
  if (allowedRoles && !isRoleMatch(currentRole, allowedRoles)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-card text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-gov-navy">Access Restricted</h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Your active account (<span className="font-semibold text-slate-700">{currentUser.name}</span>, Role: <span className="font-semibold text-gov-blue">{currentRole}</span>) does not have authorization to view this area.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            {currentRole === 'citizen' && (
              <Link
                to="/dashboard"
                className="w-full py-2.5 px-4 bg-gov-blue hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Citizen Dashboard
              </Link>
            )}
            {(currentRole === 'officer' || currentRole === 'dept_admin' || currentRole === 'DEPARTMENT_OFFICER') && (
              <Link
                to="/department"
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Department Console
              </Link>
            )}
            {(currentRole === 'sys_admin' || currentRole === 'SYSTEM_ADMIN') && (
              <Link
                to="/admin/dashboard"
                className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Admin Console
              </Link>
            )}
            <Link
              to="/login"
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Switch Account / Role
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
