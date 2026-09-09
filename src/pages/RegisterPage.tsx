import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGovFlow } from '../store/GovFlowContext';
import { GovFlowLogo } from '../components/common/GovFlowLogo';
import { FormField, PasswordRulesChecklist } from '../components/common/FormField';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Lock,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export const RegisterPage: React.FC = () => {
  const { register, isAuthenticating, t } = useGovFlow();
  const navigate = useNavigate();

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [category, setCategory] = useState<'General' | 'OBC' | 'SC' | 'ST' | 'EWS'>('General');
  const [agreedConsent, setAgreedConsent] = useState(true);

  // Field Touched / Blur state for real-time validation
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time Field Validations
  const isValidName = name.trim().length >= 3;
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isValidPhone = /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''));
  const isValidPincode = /^\d{6}$/.test(pincode.trim());
  const isValidPassword = 
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const isPasswordMatch = confirmPassword.length > 0 && password === confirmPassword;

  // Errors for display
  const nameError = touched.name && !isValidName ? t('validation.required') : null;
  const emailError = touched.email && !isValidEmail ? t('validation.invalidEmail') : null;
  const phoneError = touched.phone && !isValidPhone ? t('validation.invalidPhone') : null;
  const pincodeError = touched.pincode && !isValidPincode ? t('validation.invalidPincode') : null;
  const confirmPasswordError = 
    touched.confirmPassword && !isPasswordMatch ? t('validation.passwordsMismatch') : null;

  const isFormValid = 
    isValidName && 
    isValidEmail && 
    isValidPhone && 
    isValidPincode && 
    isValidPassword && 
    isPasswordMatch && 
    agreedConsent;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mark all touched
    setTouched({
      name: true,
      email: true,
      phone: true,
      pincode: true,
      password: true,
      confirmPassword: true,
    });

    if (!isFormValid || isSubmitting) return;

    // Prevent duplicate submissions immediately (Section 16)
    setIsSubmitting(true);
    try {
      await register(name.trim(), email.trim(), phone.trim(), state, category, password);
      navigate('/dashboard');
    } catch (err) {
      setIsSubmitting(false);
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Branded Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="flex justify-center">
          <GovFlowLogo size="lg" variant="symbol" animated />
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-gov-navy tracking-tight">
          {t('nav.register')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          {t('hero.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Registration Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Full Name */}
            <FormField
              label={t('form.fullName')}
              value={name}
              onChange={setName}
              onBlur={() => setTouched(p => ({ ...p, name: true }))}
              placeholder={t('form.fullNamePlaceholder')}
              required
              isValid={isValidName}
              error={nameError}
              icon={<User className="w-4 h-4" />}
            />

            {/* Email & Mobile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label={t('form.email')}
                type="email"
                value={email}
                onChange={setEmail}
                onBlur={() => setTouched(p => ({ ...p, email: true }))}
                placeholder={t('form.emailPlaceholder')}
                required
                isValid={isValidEmail}
                error={emailError}
                icon={<Mail className="w-4 h-4" />}
              />

              <FormField
                label={t('form.phone')}
                type="tel"
                value={phone}
                onChange={setPhone}
                onBlur={() => setTouched(p => ({ ...p, phone: true }))}
                placeholder={t('form.phonePlaceholder')}
                maxLength={10}
                required
                isValid={isValidPhone}
                error={phoneError}
                icon={<Phone className="w-4 h-4" />}
              />
            </div>

            {/* State & Pincode Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  {t('form.state')} <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-gov-blue focus:ring-2 focus:ring-blue-500/20 font-medium appearance-none text-xs"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <FormField
                label={t('form.pincode')}
                value={pincode}
                onChange={setPincode}
                onBlur={() => setTouched(p => ({ ...p, pincode: true }))}
                placeholder={t('form.pincodePlaceholder')}
                maxLength={6}
                required
                isValid={isValidPincode}
                error={pincodeError}
              />
            </div>

            {/* Social Category */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                {t('form.category')}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-gov-blue focus:ring-2 focus:ring-blue-500/20 font-medium text-xs"
              >
                <option value="General">General</option>
                <option value="OBC">OBC (Other Backward Classes)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
              </select>
            </div>

            {/* Password & Live Requirements Checklist */}
            <FormField
              label={t('form.password')}
              type="password"
              value={password}
              onChange={setPassword}
              onBlur={() => setTouched(p => ({ ...p, password: true }))}
              placeholder="Create security password"
              required
              isValid={isValidPassword}
            />
            <PasswordRulesChecklist password={password} />

            {/* Confirm Password */}
            <FormField
              label={t('form.confirmPassword')}
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              onBlur={() => setTouched(p => ({ ...p, confirmPassword: true }))}
              placeholder="Re-enter password"
              required
              isValid={isPasswordMatch}
              error={confirmPasswordError}
              helpText={isPasswordMatch ? t('validation.passwordsMatch') : undefined}
            />

            {/* DPDP Consent Architecture Agreement */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedConsent}
                  onChange={(e) => setAgreedConsent(e.target.checked)}
                  className="mt-0.5 rounded text-gov-blue focus:ring-blue-500/20 w-4 h-4 border-slate-300"
                />
                <span className="text-slate-600 text-[11px] leading-relaxed">
                  I consent to GovFlow AI orchestrating my digital credentials via DigiLocker and API Setu in accordance with the <strong>DPDP Act 2023</strong>. I retain full rights to revoke data sharing at any time.
                </span>
              </label>
              {!agreedConsent && (
                <p className="text-rose-500 text-[11px] mt-1">{t('validation.consentRequired')}</p>
              )}
            </div>

            {/* Submit Button with Duplicate Submission Protection (Section 16) */}
            <button
              type="submit"
              disabled={isSubmitting || isAuthenticating}
              className={`w-full py-3 text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${
                isSubmitting || isAuthenticating
                  ? 'bg-blue-400 text-white cursor-not-allowed'
                  : 'bg-gov-blue hover:bg-blue-700 text-white'
              }`}
            >
              {isSubmitting || isAuthenticating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('btn.submitting')}</span>
                </>
              ) : (
                <>
                  <span>{t('btn.register')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-slate-500 text-xs">
                Already registered?{' '}
                <Link to="/login" className="font-bold text-gov-blue hover:underline">
                  {t('nav.login')}
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Informative Side Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-[#0B192C] to-[#1E3E62] text-white p-6 rounded-3xl border border-slate-800 shadow-elevation">
            <h3 className="text-base font-extrabold mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>What Happens Next?</span>
            </h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-cyan-300 font-mono text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-400/30">
                  1
                </span>
                <span>
                  <strong>Clean Initial Profile:</strong> Your account starts with 20% completeness. No fake applications or pre-populated documents.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-cyan-300 font-mono text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-400/30">
                  2
                </span>
                <span>
                  <strong>Connect DigiLocker:</strong> Fetch verified Aadhaar, PAN, and certificates with 1 click.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-cyan-300 font-mono text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-400/30">
                  3
                </span>
                <span>
                  <strong>Real Recommendations:</strong> As you fill verified details, genuine scheme recommendations unlock dynamically.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
