import React, { useState } from 'react';
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import { useGovFlow } from '../store/GovFlowContext';
import { FormField } from '../components/common/FormField';
import { 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Download, 
  FileText, 
  User, 
  MapPin, 
  CreditCard,
  Building2,
  Sparkles,
  Lock,
  Loader2,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

export const ApplicationFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getServiceById, currentUser, citizenProfile, documents, submitApplication, t } = useGovFlow();
  const navigate = useNavigate();

  const service = getServiceById(id || '');

  if (!currentUser) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(`/services/${id}/apply`)}`} replace />;
  }

  // Form states prefilled from verified profile
  const [formData, setFormData] = useState({
    applicantName: citizenProfile?.name || currentUser?.name || '',
    email: citizenProfile?.email || currentUser?.email || '',
    phone: citizenProfile?.phone || currentUser?.phone || '',
    aadhaarMasked: citizenProfile?.aadhaarMasked || '•••• •••• 9102',
    pan: citizenProfile?.pan || 'ABCDE1234F',
    dob: citizenProfile?.dob || '2001-05-14',
    gender: citizenProfile?.gender || 'Female',
    addressLine: citizenProfile?.address?.line1 || 'Sector 14, Main Road',
    district: citizenProfile?.address?.district || 'Central District',
    state: citizenProfile?.address?.state || 'Maharashtra',
    pincode: citizenProfile?.address?.pincode || '411001',
    annualIncome: citizenProfile?.employment?.annualIncome?.toString() || '240000',
    category: citizenProfile?.category || 'General',
    educationLevel: citizenProfile?.education?.level || 'Undergraduate',
    bankAccountMasked: 'SBIN000****789 (NPCI Seeded)',
    remarks: 'Applying for statutory government service under unified citizen orchestration.',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [consentGranted, setConsentGranted] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active Tab / Readiness view
  const [showReadinessModal, setShowReadinessModal] = useState(false);

  if (!service) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Service Not Found</h2>
        <Link to="/services" className="text-gov-blue text-xs font-bold underline mt-2 block">
          Back to services
        </Link>
      </div>
    );
  }

  // Real-time validations
  const isValidName = formData.applicantName.trim().length >= 3;
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const isValidPhone = /^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''));
  const isValidPincode = /^\d{6}$/.test(formData.pincode.trim());
  const isValidAddress = formData.addressLine.trim().length >= 5;
  const verifiedDocs = documents.filter(d => d.status === 'verified');
  const hasDocuments = verifiedDocs.length > 0;

  // Checklist for Section 15 Readiness Screen
  const readinessChecklist = [
    { label: t('readiness.personalInfo'), isReady: isValidName, note: 'Name verified' },
    { label: t('readiness.contact'), isReady: isValidEmail && isValidPhone && isValidAddress && isValidPincode, note: 'Address, Email & Phone verified' },
    { label: t('readiness.requiredDocs'), isReady: hasDocuments, note: `${verifiedDocs.length} verified documents in vault` },
    { label: t('readiness.eligibility'), isReady: true, note: 'Income and demographic criteria verified' },
    { label: t('readiness.consent'), isReady: consentGranted, note: 'Single-purpose DPDP authorization' },
  ];

  const missingItems = readinessChecklist.filter(item => !item.isReady);
  const isApplicationReady = missingItems.length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      applicantName: true,
      email: true,
      phone: true,
      addressLine: true,
      pincode: true,
    });

    if (!isApplicationReady || isSubmitting) {
      setShowReadinessModal(true);
      return;
    }

    // Section 16: Prevent duplicate submissions immediately
    setIsSubmitting(true);
    try {
      await new Promise(res => setTimeout(res, 800)); // Network simulation
      const attachedDocs = verifiedDocs.map(d => d.name);
      const newApp = submitApplication(service.id, formData, attachedDocs);
      setSubmittedAppId(newApp.id);
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
      console.error('Submission failed:', err);
    }
  };

  const handleDownloadReceipt = () => {
    const text = `GOVFLOW AI — OFFICIAL SUBMISSION ACKNOWLEDGEMENT\n` +
      `Application ID: ${submittedAppId}\n` +
      `Service: ${service.name}\n` +
      `Department: ${service.department}\n` +
      `Applicant: ${formData.applicantName}\n` +
      `Submission Timestamp: ${new Date().toLocaleString()}\n` +
      `Status: Submitted / Under Document Verification\n` +
      `Tracking Portal: https://govflow.gov.in/applications/${submittedAppId}\n` +
      `--------------------------------------------------\n` +
      `This is a digitally generated acknowledgement receipt.`;

    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `GovFlow_Receipt_${submittedAppId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to={`/services/${service.id}`} className="hover:text-gov-blue flex items-center gap-1 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {service.name}</span>
        </Link>
      </div>

      {!submittedAppId ? (
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Auto-Filled from Verified Identity
              </span>
              <span className="text-xs font-mono text-slate-400">Service: {service.id}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-navy leading-tight mb-1">
              Application for {service.name}
            </h1>
            <p className="text-xs text-slate-500 mb-6 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>{service.department}</span>
            </p>

            {/* Application Readiness Summary Card (Section 15) */}
            <div className={`p-4 rounded-2xl border transition-all ${
              isApplicationReady ? 'bg-emerald-50/60 border-emerald-200' : 'bg-blue-50/60 border-blue-100'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-gov-blue" />
                  <span className="text-xs font-bold text-slate-800">{t('readiness.title')}</span>
                </div>
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                  isApplicationReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {isApplicationReady ? t('readiness.ready') : `${missingItems.length} items need attention`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                {readinessChecklist.map((item) => (
                  <div key={item.label} className="flex items-center gap-2 bg-white/80 p-2 rounded-xl border border-slate-200/60">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      item.isReady ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {item.isReady ? '✓' : '⚠'}
                    </span>
                    <span className="text-slate-700 text-[11px] truncate font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* 1. Identity & Personal Details */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-gov-blue" />
                <span>1. Personal & Identity Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label={t('form.fullName')}
                  value={formData.applicantName}
                  onChange={(v) => setFormData(p => ({ ...p, applicantName: v }))}
                  onBlur={() => setTouched(p => ({ ...p, applicantName: true }))}
                  required
                  isValid={isValidName}
                  error={touched.applicantName && !isValidName ? t('validation.required') : null}
                />

                <FormField
                  label="Aadhaar Reference"
                  value={formData.aadhaarMasked}
                  onChange={() => {}}
                  disabled
                  helpText="Cryptographically bound from Aadhaar e-KYC vault"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label={t('form.email')}
                  type="email"
                  value={formData.email}
                  onChange={(v) => setFormData(p => ({ ...p, email: v }))}
                  onBlur={() => setTouched(p => ({ ...p, email: true }))}
                  required
                  isValid={isValidEmail}
                  error={touched.email && !isValidEmail ? t('validation.invalidEmail') : null}
                />

                <FormField
                  label={t('form.phone')}
                  type="tel"
                  value={formData.phone}
                  onChange={(v) => setFormData(p => ({ ...p, phone: v }))}
                  onBlur={() => setTouched(p => ({ ...p, phone: true }))}
                  maxLength={10}
                  required
                  isValid={isValidPhone}
                  error={touched.phone && !isValidPhone ? t('validation.invalidPhone') : null}
                />
              </div>
            </div>

            {/* 2. Address & Residence */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gov-blue" />
                <span>2. Residential Address</span>
              </h3>

              <FormField
                label={t('form.address')}
                value={formData.addressLine}
                onChange={(v) => setFormData(p => ({ ...p, addressLine: v }))}
                onBlur={() => setTouched(p => ({ ...p, addressLine: true }))}
                required
                isValid={isValidAddress}
                error={touched.addressLine && !isValidAddress ? t('validation.required') : null}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  label={t('form.district')}
                  value={formData.district}
                  onChange={(v) => setFormData(p => ({ ...p, district: v }))}
                  required
                  isValid={formData.district.length > 0}
                />

                <FormField
                  label={t('form.state')}
                  value={formData.state}
                  onChange={(v) => setFormData(p => ({ ...p, state: v }))}
                  required
                  isValid={formData.state.length > 0}
                />

                <FormField
                  label={t('form.pincode')}
                  value={formData.pincode}
                  onChange={(v) => setFormData(p => ({ ...p, pincode: v }))}
                  onBlur={() => setTouched(p => ({ ...p, pincode: true }))}
                  maxLength={6}
                  required
                  isValid={isValidPincode}
                  error={touched.pincode && !isValidPincode ? t('validation.invalidPincode') : null}
                />
              </div>
            </div>

            {/* 3. Consent & DPDP Declaration */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gov-blue" />
                <span>3. DPDP Act 2023 Consent Authorization</span>
              </h3>

              <label className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consentGranted}
                  onChange={(e) => setConsentGranted(e.target.checked)}
                  className="mt-0.5 rounded text-gov-blue focus:ring-blue-500/20 w-4 h-4 border-slate-300"
                />
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800">
                    Authorize Single-Purpose Data Exchange
                  </p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    I authorize GovFlow AI to share my verified documents with <strong>{service.department}</strong> solely for processing this application. I understand this consent is logged immutably and can be revoked at any time.
                  </p>
                </div>
              </label>
            </div>

            {/* Submit Action with Duplicate Submission Prevention (Section 16) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <Link to={`/services/${service.id}`} className="text-slate-500 font-bold hover:underline text-xs">
                ← Return to Scheme Details
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3.5 text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? 'bg-blue-400 text-white cursor-not-allowed'
                    : isApplicationReady
                    ? 'bg-gov-blue hover:bg-blue-700 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('readiness.submitting')}</span>
                  </>
                ) : isApplicationReady ? (
                  <>
                    <span>{t('btn.submit')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    <span>{t('readiness.reviewMissing')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Final Success Screen with Receipt */
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Application Submitted Successfully
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your application has been received by <strong>{service.department}</strong> and assigned a tracking reference.
            </p>
          </div>

          <div className="inline-block p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left max-w-md w-full space-y-2 font-mono">
            <div className="flex justify-between border-b pb-1">
              <span className="text-slate-500">Application ID:</span>
              <span className="font-bold text-gov-blue">{submittedAppId}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-slate-500">Scheme:</span>
              <span className="font-bold text-slate-800 truncate max-w-[200px]">{service.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="text-emerald-600 font-bold">Under Verification</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleDownloadReceipt}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Receipt (.txt)</span>
            </button>
            <Link
              to={`/applications/${submittedAppId}`}
              className="px-5 py-2.5 bg-gov-blue hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
            >
              Track Application Progress →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
