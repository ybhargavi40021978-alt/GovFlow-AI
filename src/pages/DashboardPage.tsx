import React, { useState } from 'react';
import { useGovFlow } from '../store/GovFlowContext';
import { Link, useNavigate } from 'react-router-dom';
import { ServiceCard } from '../components/cards/ServiceCard';
import { ApplicationCard } from '../components/cards/ApplicationCard';
import { DocumentCard } from '../components/cards/DocumentCard';
import { DocumentUploadModal } from '../components/common/DocumentUploadModal';
import { GovFlowLogo } from '../components/common/GovFlowLogo';
import { 
  Search, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Bell, 
  ShieldCheck, 
  ArrowRight, 
  Plus, 
  Upload, 
  FileQuestion,
  FolderOpen
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    currentUser,
    citizenProfile, 
    myApplications, 
    myDocuments, 
    myNotifications,
    pullFromDigiLocker,
    recommendedServices,
    isProfileSufficientForRecommendations,
    isAuthenticating,
    authLoadingMessage,
    setIsAssistantOpen
  } = useGovFlow();

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const applications = myApplications;
  const documents = myDocuments;
  const notifications = myNotifications;
  const profileName = citizenProfile?.name || currentUser?.name || 'Citizen';
  const completeness = citizenProfile?.profileCompleteness ?? 20;

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const verifiedDocsCount = documents.filter(d => d.status === 'verified').length;
  const expiringDocsCount = documents.filter(d => d.status === 'expiring_soon').length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/services');
    }
  };

  // If authenticating / loading personalized dashboard
  if (isAuthenticating) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="p-4 rounded-3xl bg-blue-50 border border-blue-100 animate-pulse">
          <GovFlowLogo size="lg" variant="symbol" animated />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-800">
            {authLoadingMessage}
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            Scoping private records strictly to your authenticated session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-gov-navy via-[#1A365D] to-gov-navy text-white rounded-3xl p-6 sm:p-10 shadow-elevation border border-slate-800 relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-semibold mb-4 border border-white/15">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>GovFlow Citizen Profile • Session Scoped</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Welcome to GovFlow AI, {profileName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mb-6 font-normal">
            Your single authenticated portal for discovering, preparing, checking eligibility, and tracking all Indian public services.
          </p>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 max-w-xl">
            <div className="flex items-center gap-2 px-3 flex-1">
              <Search className="w-4 h-4 text-cyan-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you need help with? (e.g. 'Scholarships', 'Farmer support')..."
                className="w-full text-xs text-white placeholder-slate-300 bg-transparent focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-gov-blue hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors shadow"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Stats & Profile Completeness Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Profile Completeness Card (Section 19 Requirement) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Profile Completeness</span>
              <span className="text-sm font-extrabold font-mono text-gov-blue">
                {completeness}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-2">
              <div 
                className="bg-gov-blue h-full rounded-full transition-all duration-500" 
                style={{ width: `${completeness}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              {completeness < 40 
                ? 'Complete your profile to receive personalized service recommendations.' 
                : completeness < 100
                ? 'Add documents to your vault to achieve 100% readiness for 1-click applications.'
                : 'Your profile is fully verified for instant auto-fill.'}
            </p>
          </div>
          <Link
            to="/profile"
            className="text-xs font-bold text-gov-blue hover:underline mt-3 block"
          >
            Complete Profile →
          </Link>
        </div>

        {/* Applications Stat */}
        <Link
          to="/applications"
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:border-blue-300 hover:shadow-card-hover transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase">My Applications</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-gov-blue flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {applications.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {applications.length === 0 
                ? 'No active applications' 
                : `${applications.filter(a => a.status === 'under_verification').length} in active verification`}
            </p>
          </div>
          <span className="text-xs font-bold text-gov-blue flex items-center gap-1 mt-2">
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        {/* Documents Stat */}
        <Link
          to="/documents"
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:border-blue-300 hover:shadow-card-hover transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase">Document Vault</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {verifiedDocsCount} <span className="text-xs font-normal text-slate-400">/ {documents.length}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {documents.length === 0 
                ? 'Vault is empty' 
                : expiringDocsCount > 0 
                ? `${expiringDocsCount} expiring soon` 
                : 'All proofs in good standing'}
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-2">
            <span>Vault Details</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        {/* Notifications Stat */}
        <Link
          to="/notifications"
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:border-blue-300 hover:shadow-card-hover transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase">Alerts & Updates</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-gov-saffron flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {unreadNotifs} <span className="text-xs font-normal text-slate-400">unread</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {unreadNotifs > 0 ? 'Actionable updates pending' : 'All caught up'}
            </p>
          </div>
          <span className="text-xs font-bold text-gov-saffron flex items-center gap-1 mt-2">
            <span>Open Notifications</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </Link>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
          Quick Actions
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            to="/services"
            className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all text-center text-xs font-bold text-slate-800 flex flex-col items-center gap-1.5"
          >
            <Search className="w-4 h-4 text-gov-blue" />
            <span>Find Service</span>
          </Link>
          <Link
            to="/services/SRV-EDU-001"
            className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all text-center text-xs font-bold text-slate-800 flex flex-col items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Check Eligibility</span>
          </Link>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all text-center text-xs font-bold text-slate-800 flex flex-col items-center gap-1.5"
          >
            <Upload className="w-4 h-4 text-emerald-600" />
            <span>Upload Document</span>
          </button>
          <Link
            to="/applications"
            className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all text-center text-xs font-bold text-slate-800 flex flex-col items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-purple-600" />
            <span>Track Application</span>
          </Link>
          <Link
            to="/consent"
            className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all text-center text-xs font-bold text-slate-800 flex flex-col items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Manage Consent</span>
          </Link>
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all text-center text-xs font-bold text-slate-800 flex flex-col items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-gov-saffron" />
            <span>Ask Assistant</span>
          </button>
        </div>
      </div>

      {/* Recommended For You (Section 20 Requirement) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Recommended For Your Profile
            </h2>
            <p className="text-xs text-slate-500">
              Algorithmic recommendations matched with your authorized citizen attributes.
            </p>
          </div>
          <Link to="/services" className="text-xs font-bold text-gov-blue hover:underline">
            View All Schemes →
          </Link>
        </div>

        {isProfileSufficientForRecommendations && recommendedServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedServices.map((service) => (
              <ServiceCard key={service.id} service={service} highlightMatch />
            ))}
          </div>
        ) : (
          /* Real Profile Prompt (No fabricated recommendations) */
          <div className="p-8 rounded-3xl bg-blue-50/70 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="space-y-1 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-blue">
                <Sparkles className="w-4 h-4 text-gov-saffron" />
                <span>Personalized Scheme Matcher</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800">
                Complete your profile to receive more relevant service recommendations.
              </h3>
              <p className="text-xs text-slate-500">
                GovFlow AI analyzes your authorized education, employment, and category details to suggest welfare schemes you are eligible for without data fabrication.
              </p>
            </div>
            <Link
              to="/profile"
              className="px-5 py-2.5 bg-gov-blue hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors whitespace-nowrap"
            >
              Complete Profile
            </Link>
          </div>
        )}
      </div>

      {/* Active Applications Section (Section 18 Requirement: Empty State) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Active Applications
            </h2>
            <p className="text-xs text-slate-500">
              Cross-department tracking with real-time milestone synchronisation.
            </p>
          </div>
          <Link to="/applications" className="text-xs font-bold text-gov-blue hover:underline">
            Manage All Applications →
          </Link>
        </div>

        {applications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.slice(0, 3).map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        ) : (
          /* Exact Section 18 Clean Empty State */
          <div className="p-8 rounded-3xl bg-white border border-dashed border-slate-300 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800">
                You haven't submitted any applications yet.
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Explore government services, check eligibility with zero paperwork, and apply with 1-click verified credentials.
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gov-blue hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
            >
              <span>Explore Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Document Vault Section (Section 18 Requirement: Empty State) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Your Civic Documents
            </h2>
            <p className="text-xs text-slate-500">
              Certified credentials available for zero-friction auto-fill applications.
            </p>
          </div>
          <Link to="/documents" className="text-xs font-bold text-gov-blue hover:underline">
            Open Document Vault →
          </Link>
        </div>

        {documents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {documents.slice(0, 3).map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onUploadClick={() => setIsUploadOpen(true)}
                onDigiLockerPull={() => pullFromDigiLocker(doc.type)}
              />
            ))}
          </div>
        ) : (
          /* Exact Section 18 Clean Empty State */
          <div className="p-8 rounded-3xl bg-white border border-dashed border-slate-300 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <FileQuestion className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800">
                No documents have been added yet.
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Connect your DigiLocker account or securely upload digital certificates to enable automated verification.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={() => setIsUploadOpen(true)}
                className="px-4 py-2 bg-gov-blue hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add / Connect Documents</span>
              </button>
              <button
                onClick={() => pullFromDigiLocker('Aadhaar Card')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Simulate DigiLocker Fetch
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
};
