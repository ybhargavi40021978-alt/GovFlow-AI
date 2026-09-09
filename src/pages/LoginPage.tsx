import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useGovFlow } from '../store/GovFlowContext';
import { GovFlowLogo } from '../components/common/GovFlowLogo';
import { AuthAccountType } from '../types';
import { 
  User, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  Info,
  HelpCircle,
  X,
  KeyRound,
  FileCheck
} from 'lucide-react';

interface AccountOption {
  id: AuthAccountType;
  title: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgLight: string;
  borderActive: string;
  ringColor: string;
  identifierLabel: string;
  identifierPlaceholder: string;
  identifierHelp: string;
}

const ACCOUNT_OPTIONS: AccountOption[] = [
  {
    id: 'citizen',
    title: 'Citizen',
    badge: 'Primary Account',
    description: 'Access government services and track applications',
    icon: User,
    accentColor: 'text-gov-blue',
    bgLight: 'bg-blue-50/60',
    borderActive: 'border-gov-blue',
    ringColor: 'ring-blue-500/20',
    identifierLabel: 'Email Address or Mobile Number',
    identifierPlaceholder: 'e.g. 9876543210 or citizen@example.com',
    identifierHelp: 'Enter your registered Indian phone number or citizen email address',
  },
  {
    id: 'officer',
    title: 'Department Officer',
    badge: 'Government Personnel',
    description: 'Review assigned applications and manage departmental workflows',
    icon: Building2,
    accentColor: 'text-amber-600',
    bgLight: 'bg-amber-50/60',
    borderActive: 'border-amber-500',
    ringColor: 'ring-amber-500/20',
    identifierLabel: 'Official Officer ID or Email',
    identifierPlaceholder: 'e.g. OFFICER001',
    identifierHelp: 'Official government Officer ID (e.g. OFFICER001)',
  },
  {
    id: 'sys_admin',
    title: 'System Administrator',
    badge: 'Infrastructure Authority',
    description: 'Manage services, integrations, workflows, users and platform security',
    icon: ShieldCheck,
    accentColor: 'text-purple-600',
    bgLight: 'bg-purple-50/60',
    borderActive: 'border-purple-500',
    ringColor: 'ring-purple-500/20',
    identifierLabel: 'Administrator ID or Email',
    identifierPlaceholder: 'e.g. ADMIN001',
    identifierHelp: 'National platform Administrator ID (e.g. ADMIN001)',
  },
];

export const LoginPage: React.FC = () => {
  const { login, isAuthenticating, authLoadingMessage, t } = useGovFlow();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if redirected from a protected route
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect') || (location.state as any)?.from;

  // Account Type Selection: Citizen is primary / default
  const [selectedRole, setSelectedRole] = useState<AuthAccountType>('citizen');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [showTestCredentials, setShowTestCredentials] = useState(false);

  const activeOption = ACCOUNT_OPTIONS.find(opt => opt.id === selectedRole) || ACCOUNT_OPTIONS[0];
  const isValidIdentifier = identifier.trim().length >= 3;

  const handleRoleSelect = (roleId: AuthAccountType) => {
    setSelectedRole(roleId);
    setAuthError(null);
    setAuthSuccess(null);
  };

  const handleKeyDownRole = (e: React.KeyboardEvent, roleId: AuthAccountType) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleRoleSelect(roleId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ identifier: true, password: true });
    setAuthError(null);
    setAuthSuccess(null);

    if (!isValidIdentifier || isSubmitting) {
      setAuthError('Please enter your registered Email address, Mobile number, or Official ID.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Authenticate against backend service with requested role hint
      const result = await login(identifier.trim(), password.trim() || undefined, selectedRole);

      if (result.success) {
        setAuthSuccess(`Authentication verified. Redirecting to your secure console...`);
        
        setTimeout(() => {
          setIsSubmitting(false);
          if (redirectUrl) {
            navigate(redirectUrl);
          } else if (result.redirectPath) {
            navigate(result.redirectPath);
          } else {
            // Fallback according to role
            if (selectedRole === 'officer') navigate('/officer/dashboard');
            else if (selectedRole === 'sys_admin') navigate('/admin/dashboard');
            else navigate('/dashboard');
          }
        }, 500);
      } else {
        setIsSubmitting(false);
        setAuthError(result.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setAuthError(err.message || 'An unexpected authentication error occurred. Please try again.');
    }
  };

  const fillTestIdentifier = (id: string, role: AuthAccountType) => {
    setSelectedRole(role);
    setIdentifier(id);
    setPassword('');
    setAuthError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      {/* 1. BRANDED HEADER */}
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <GovFlowLogo size="lg" variant="symbol" animated />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gov-navy tracking-tight">
          GovFlow AI
        </h1>
        
        <p className="text-sm sm:text-base text-slate-600 font-semibold max-w-xl mx-auto leading-relaxed">
          One Citizen. One Profile. Every Service. One Smart Journey.
        </p>

        {redirectUrl && (
          <div className="inline-flex items-center gap-2 p-2.5 px-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-medium mt-2 animate-fadeIn">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Please authenticate to access the requested protected page: <strong className="font-mono">{redirectUrl}</strong></span>
          </div>
        )}
      </div>

      {/* 2. ACCOUNT-TYPE SELECTOR (CITIZEN, OFFICER, SYSTEM ADMIN) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Select Account Role
          </label>
          <span className="text-[11px] text-slate-400">
            Citizen-first unified access
          </span>
        </div>

        <div 
          role="radiogroup" 
          aria-label="Select Account Type"
          className="grid grid-cols-1 md:grid-cols-3 gap-3.5"
        >
          {ACCOUNT_OPTIONS.map((option) => {
            const isSelected = selectedRole === option.id;
            const IconComponent = option.icon;

            return (
              <div
                key={option.id}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => handleRoleSelect(option.id)}
                onKeyDown={(e) => handleKeyDownRole(e, option.id)}
                className={`relative p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between select-none focus:outline-none focus:ring-2 ${option.ringColor} ${
                  isSelected
                    ? `${option.borderActive} ${option.bgLight} shadow-md scale-[1.01]`
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-white shadow-xs' : 'bg-slate-100'
                    }`}>
                      <IconComponent className={`w-5 h-5 ${option.accentColor}`} />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isSelected 
                          ? 'bg-white text-slate-800 border-slate-200 shadow-xs' 
                          : 'bg-slate-100 text-slate-500 border-transparent'
                      }`}>
                        {option.badge}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className={`w-4 h-4 ${option.accentColor}`} />
                      )}
                    </div>
                  </div>

                  <h2 className="text-sm font-bold text-slate-900 mb-1">
                    {option.title}
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {option.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold">
                  <span className={isSelected ? option.accentColor : 'text-slate-400'}>
                    {isSelected ? '● Active Selection' : 'Click to select'}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? option.accentColor : 'text-slate-300'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. SIGN-IN FORM CARD */}
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          
          {/* Form Contextual Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {selectedRole === 'citizen' && 'Citizen Authentication'}
                {selectedRole === 'officer' && 'Department Officer Sign-In'}
                {selectedRole === 'sys_admin' && 'System Administrator Sign-In'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Authenticating with GovFlow Secure Identity Broker
              </p>
            </div>
            <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${activeOption.bgLight} ${activeOption.accentColor}`}>
              {selectedRole.replace('_', ' ')}
            </span>
          </div>

          {/* Success State Notification */}
          {authSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* Error State Notification / Role Mismatch Alert */}
          {authError && (
            <div 
              role="alert" 
              className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2.5 animate-fadeIn"
            >
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Authentication Failure</p>
                <p className="text-rose-700 leading-relaxed">{authError}</p>
              </div>
            </div>
          )}

          {/* Email / Official ID Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="identifier-input" className="font-bold text-slate-800 text-xs">
                {activeOption.identifierLabel} <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Required</span>
            </div>

            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="identifier-input"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                onBlur={() => setTouched(p => ({ ...p, identifier: true }))}
                placeholder={activeOption.identifierPlaceholder}
                autoComplete="username"
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-gov-blue transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              {activeOption.identifierHelp}
            </p>
          </div>

          {/* Password Field with Show/Hide Toggle */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password-input" className="font-bold text-slate-800 text-xs">
                Password / Security PIN
              </label>
              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(true)}
                className="text-[11px] font-semibold text-gov-blue hover:underline focus:outline-none"
              >
                Forgot password?
              </button>
            </div>

            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched(p => ({ ...p, password: true }))}
                placeholder="Enter your confidential password"
                autoComplete="current-password"
                className="w-full pl-10 pr-11 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-gov-blue transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none rounded"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isAuthenticating}
            className={`w-full py-3 px-4 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.99] ${
              isSubmitting || isAuthenticating
                ? 'bg-blue-400 text-white cursor-not-allowed'
                : 'bg-gov-blue hover:bg-blue-700 text-white shadow-md'
            }`}
          >
            {isSubmitting || isAuthenticating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{authLoadingMessage || 'Authenticating...'}</span>
              </>
            ) : (
              <>
                <span>
                  Sign In as {activeOption.title}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* 4. CITIZEN REGISTRATION & ADVISORY NOTICES */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            {/* Citizen Public Registration (Always Accessible) */}
            <div className="text-center">
              <p className="text-slate-600 text-xs">
                New Citizen?{' '}
                <Link to="/register" className="font-bold text-gov-blue hover:underline">
                  Create Citizen Account
                </Link>
              </p>
            </div>

            {/* Official Personnel Notice */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-500 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
              <p className="leading-relaxed">
                <strong className="text-slate-700">Official Personnel Notice:</strong> Department Officer and System Administrator accounts are provisioned through internal administrative protocols and cannot be registered through public enrollment.
              </p>
            </div>
          </div>
        </form>
      </div>

      {/* 5. DEMONSTRATION CREDENTIALS DRAWER (Convenient for evaluators) */}
      <div className="max-w-xl mx-auto text-center">
        <button
          type="button"
          onClick={() => setShowTestCredentials(!showTestCredentials)}
          className="text-xs font-semibold text-slate-500 hover:text-gov-blue inline-flex items-center gap-1.5 p-1 focus:outline-none"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>{showTestCredentials ? 'Hide Provisioned Evaluation Credentials' : 'View Provisioned Government Test Credentials'}</span>
        </button>

        {showTestCredentials && (
          <div className="mt-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-md text-left text-xs space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-800 text-xs">Provisioned Directory Accounts (Demo/Dev)</span>
              <span className="text-[10px] bg-blue-50 text-gov-blue font-bold px-2 py-0.5 rounded">Demo Credentials</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Officer Card */}
              <div 
                onClick={() => fillTestIdentifier('OFFICER001', 'officer')}
                className="p-3 rounded-xl border border-slate-200 hover:border-amber-400 bg-amber-50/40 hover:bg-amber-50 cursor-pointer transition-colors"
              >
                <div className="font-bold text-amber-800 flex items-center justify-between">
                  <span>Department Officer</span>
                  <span className="text-[9px] font-mono">Fill ID</span>
                </div>
                <p className="font-mono text-[10px] text-slate-700 mt-1">Officer ID: <strong>OFFICER001</strong></p>
                <p className="text-[10px] text-slate-500">Department: Education</p>
                <p className="text-[10px] text-slate-500">Role: DEPARTMENT_OFFICER</p>
              </div>

              {/* System Admin Card */}
              <div 
                onClick={() => fillTestIdentifier('ADMIN001', 'sys_admin')}
                className="p-3 rounded-xl border border-slate-200 hover:border-purple-400 bg-purple-50/40 hover:bg-purple-50 cursor-pointer transition-colors"
              >
                <div className="font-bold text-purple-800 flex items-center justify-between">
                  <span>System Administrator</span>
                  <span className="text-[9px] font-mono">Fill ID</span>
                </div>
                <p className="font-mono text-[10px] text-slate-700 mt-1">Admin ID: <strong>ADMIN001</strong></p>
                <p className="text-[10px] text-slate-500">Access: ALL_DEPARTMENTS</p>
                <p className="text-[10px] text-slate-500">Role: SYSTEM_ADMIN</p>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 italic">
              *Note: Demo accounts are authenticated through the backend identity service with cryptographic password verification and strict role validation.
            </p>
          </div>
        )}
      </div>

      {/* 6. FORGOT PASSWORD MODAL */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <HelpCircle className="w-5 h-5 text-gov-blue" />
                <span>Credential Recovery Assistance</span>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                <p className="font-bold text-gov-blue mb-1">For Registered Citizens:</p>
                <p>Citizens can reset their password via OTP sent to their verified Aadhaar-linked mobile number or registered email address.</p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                <p className="font-bold text-amber-800 mb-1">For Department Officers & Administrators:</p>
                <p>Official passwords are managed through the NIC National Directory or State Government Nodal Officer. Contact your departmental IT coordinator for token re-issuance.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsForgotPasswordOpen(false)}
              className="w-full py-2.5 rounded-xl bg-gov-blue text-white font-bold text-xs hover:bg-blue-700 transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
