import React, { useState } from 'react';
import { useGovFlow } from '../store/GovFlowContext';
import { 
  User, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  FileText, 
  Lock, 
  Save, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';

import { Navigate, Link } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { currentUser, citizenProfile, updateProfile, documents, consents } = useGovFlow();

  if (!currentUser) {
    return <Navigate to="/login?redirect=/profile" replace />;
  }

  if (!citizenProfile) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-gov-blue flex items-center justify-center mx-auto">
          <User className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Officer / Administrator Account</h2>
        <p className="text-xs text-slate-500">
          You are currently signed in as an institutional persona (<span className="font-semibold">{currentUser.name}</span>, Role: {currentUser.role}). Institutional accounts manage services and applications in the console.
        </p>
        <div className="pt-2 flex flex-col gap-2">
          <Link
            to="/department"
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Go to Department Console
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Switch to Citizen Persona
          </Link>
        </div>
      </div>
    );
  }

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: citizenProfile.name,
    email: citizenProfile.email,
    phone: citizenProfile.phone,
    addressLine: citizenProfile.address.line1,
    district: citizenProfile.address.district,
    state: citizenProfile.address.state,
    pincode: citizenProfile.address.pincode,
    annualIncome: citizenProfile.employment.annualIncome,
    occupation: citizenProfile.employment.occupation,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: {
        ...citizenProfile.address,
        line1: formData.addressLine,
        district: formData.district,
        state: formData.state,
        pincode: formData.pincode,
      },
      employment: {
        ...citizenProfile.employment,
        occupation: formData.occupation,
        annualIncome: Number(formData.annualIncome),
      },
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-gov-blue uppercase tracking-wider mb-2">
          <span>Single Citizen Profile</span>
          <span>•</span>
          <span>One Identity for All Services</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gov-navy tracking-tight">
          Citizen Master Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Your unified profile credentials auto-populate across central, state, and local portals. Data is cryptographically anchored to official registers.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully! All application auto-fills updated.</span>
        </div>
      )}

      {/* Completeness Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gov-navy text-white flex items-center justify-center text-xl font-bold">
              {citizenProfile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{citizenProfile.name}</h2>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ✓ Verified Citizen
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Citizen ID: {citizenProfile.id} • Aadhaar: {citizenProfile.aadhaarMasked}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
              Profile Completeness
            </span>
            <span className="text-2xl font-extrabold font-mono text-gov-blue">
              {citizenProfile.profileCompleteness}%
            </span>
          </div>
        </div>

        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-4">
          <div 
            className="bg-gov-blue h-full rounded-full transition-all duration-500"
            style={{ width: `${citizenProfile.profileCompleteness}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-bold">✓ Demographics</span>
            <span>•</span>
            <span className="text-emerald-600 font-bold">✓ DigiLocker Marksheet</span>
            <span>•</span>
            <span className="text-amber-600 font-bold">⚠ Domicile Certificate (Missing)</span>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
            >
              Edit Permitted Fields
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* Main Profile Form / Details */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Demographics */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-gov-blue" />
              Identity & Contact Details
            </h3>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
              UIDAI Aadhaar Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-500 mb-1">Full Legal Name</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                  isEditing ? 'bg-white border-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-500 mb-1">Date of Birth</label>
              <input
                type="text"
                disabled
                value={citizenProfile.dob}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-500 mb-1">Gender</label>
              <input
                type="text"
                disabled
                value={citizenProfile.gender}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-500 mb-1">Aadhaar (Masked)</label>
              <input
                type="text"
                disabled
                value={citizenProfile.aadhaarMasked}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-500 mb-1">PAN Card</label>
              <input
                type="text"
                disabled
                value={citizenProfile.pan}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-500 mb-1">Mobile Number (Active OTP)</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                  isEditing ? 'bg-white border-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Address */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gov-blue" />
              Residential Address
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Postal Jurisdiction</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-500 mb-1">Street Address</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.addressLine}
                onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                  isEditing ? 'bg-white border-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-500 mb-1">District</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                  isEditing ? 'bg-white border-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-500 mb-1">PIN Code</label>
              <input
                type="text"
                disabled={!isEditing}
                maxLength={6}
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border font-mono ${
                  isEditing ? 'bg-white border-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Education & Employment */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-gov-blue" />
              Academic & Socio-Economic Tier
            </h3>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
              DigiLocker Linked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-500 mb-1">Highest Education Level</label>
              <input
                type="text"
                disabled
                value={citizenProfile.education.level}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-500 mb-1">Category</label>
              <input
                type="text"
                disabled
                value={citizenProfile.category}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-500 mb-1">Annual Family Income (₹)</label>
              <input
                type="number"
                disabled={!isEditing}
                value={formData.annualIncome}
                onChange={(e) => setFormData({ ...formData, annualIncome: Number(e.target.value) })}
                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                  isEditing ? 'bg-white border-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gov-blue hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
