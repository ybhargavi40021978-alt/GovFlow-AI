import React, { useState } from 'react';
import { Check, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

export interface FormFieldProps {
  id?: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'number';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  error?: string | null;
  isValid?: boolean;
  helpText?: string;
  maxLength?: number;
  icon?: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  loading = false,
  error = null,
  isValid = false,
  helpText,
  maxLength,
  icon,
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  // Determine state styles
  let stateBorder = 'border-slate-200 focus-within:border-gov-blue focus-within:ring-2 focus-within:ring-blue-500/20';
  let stateBg = 'bg-slate-50';

  if (disabled) {
    stateBorder = 'border-slate-200 opacity-60';
    stateBg = 'bg-slate-100 cursor-not-allowed';
  } else if (error) {
    stateBorder = 'border-rose-400 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20';
    stateBg = 'bg-rose-50/40';
  } else if (isValid && value.length > 0) {
    stateBorder = 'border-emerald-400 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20';
    stateBg = 'bg-emerald-50/20';
  }

  return (
    <div className={`space-y-1.5 text-xs ${className}`}>
      {/* Label & Required Indicator */}
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="block font-semibold text-slate-700 select-none">
          {label} {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
        {maxLength && (
          <span className="text-[10px] text-slate-400 font-mono">
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      {/* Input Container */}
      <div 
        className={`relative flex items-center rounded-xl border transition-all duration-200 ${stateBorder} ${stateBg}`}
      >
        {/* Leading Icon */}
        {icon && (
          <div className="pl-3.5 pr-1 text-slate-400 flex items-center pointer-events-none">
            {icon}
          </div>
        )}

        {/* Input Element */}
        <input
          id={inputId}
          type={effectiveType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined}
          className="w-full py-2.5 px-3 bg-transparent text-slate-900 placeholder-slate-400 font-medium focus:outline-none text-xs"
        />

        {/* Status Indicators: Loading / Valid / Error / Password Toggle */}
        <div className="pr-3 flex items-center gap-1.5 flex-shrink-0">
          {loading && (
            <div className="flex items-center gap-1 text-[11px] text-blue-600 font-medium" title="Checking...">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden sm:inline">Checking...</span>
            </div>
          )}

          {!loading && isValid && value.length > 0 && !error && (
            <div className="flex items-center text-emerald-600 animate-fadeIn" title="Valid">
              <Check className="w-4 h-4 stroke-[2.5]" />
            </div>
          )}

          {!loading && error && (
            <div className="flex items-center text-rose-500 animate-fadeIn" title={error}>
              <AlertCircle className="w-4 h-4" />
            </div>
          )}

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 p-0.5 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Error Message with Icon + Text (Accessible) */}
      {error && (
        <p id={`${inputId}-error`} className="text-rose-600 text-[11px] font-medium flex items-center gap-1 animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}

      {/* Help Text */}
      {!error && helpText && (
        <p id={`${inputId}-help`} className="text-slate-500 text-[11px]">
          {helpText}
        </p>
      )}
    </div>
  );
};

// Real-Time Password Strength Checklist Component (Section 13)
export const PasswordRulesChecklist: React.FC<{ password: string }> = ({ password }) => {
  const rules = [
    { label: 'Minimum 8 characters', pass: password.length >= 8 },
    { label: 'At least 1 uppercase letter (A-Z)', pass: /[A-Z]/.test(password) },
    { label: 'At least 1 lowercase letter (a-z)', pass: /[a-z]/.test(password) },
    { label: 'At least 1 number (0-9)', pass: /[0-9]/.test(password) },
    { label: 'At least 1 special character (@$!%*?&)', pass: /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1.5 animate-fadeIn">
      <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
        Password Requirements
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-slate-600">
        {rules.map((r) => (
          <div key={r.label} className={`flex items-center gap-1.5 font-medium ${r.pass ? 'text-emerald-700' : 'text-slate-400'}`}>
            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
              r.pass ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
            }`}>
              {r.pass ? '✓' : '•'}
            </span>
            <span>{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
