import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGovFlow } from '../store/GovFlowContext';
import { LIFE_EVENTS_CONFIG } from '../store/mockData';
import { ServiceCategory } from '../types';
import { CategoryCard } from '../components/cards/CategoryCard';
import { LifeEventCard } from '../components/cards/LifeEventCard';
import { ServiceCard } from '../components/cards/ServiceCard';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Network, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  Database, 
  Lock, 
  Globe2, 
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Building2,
  Share2,
  Users,
  Eye
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t, services, currentLanguage } = useGovFlow();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLifeEventId, setSelectedLifeEventId] = useState<string>('starting-college');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/services');
    }
  };

  // Extract categories and counts
  const allCategories: ServiceCategory[] = [
    'Education',
    'Identity & Certificates',
    'Housing',
    'Agriculture',
    'Healthcare',
    'Employment',
    'Financial Assistance',
    'Business & MSME',
    'Transport',
    'Social Welfare',
    'Land & Property',
    'Municipal Services',
    'Grievance & Citizen Services'
  ];

  const categoryCounts = allCategories.map(cat => ({
    category: cat,
    count: services.filter(s => s.category === cat).length || 1,
  }));

  const activeLifeEvent = LIFE_EVENTS_CONFIG.find(e => e.id === selectedLifeEventId) || LIFE_EVENTS_CONFIG[1];
  const lifeEventServices = services.filter(s => activeLifeEvent.recommendedServices.includes(s.id));

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-slate-50 border-b border-slate-200/60">
        {/* Subtle geometric civic background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* AI Powered pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-gov-blue text-xs font-bold shadow-sm mb-6 animate-fadeIn">
              <Sparkles className="w-3.5 h-3.5 text-gov-saffron animate-pulse" />
              <span>{t('hero.badge')}</span>
            </div>

            {/* Main Headings */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-gov-navy leading-[1.1] mb-6">
              <span>One Citizen. One Profile. </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gov-blue via-cyan-600 to-amber-600">
                Every Government Service.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Discover, understand, apply and track government services through one intelligent digital journey.
            </p>

            {/* Conversational Search Box */}
            <form 
              onSubmit={handleSearchSubmit}
              className="max-w-3xl mx-auto bg-white p-2.5 rounded-2xl shadow-elevation border border-slate-200/80 flex flex-col sm:flex-row items-center gap-2 mb-4"
            >
              <div className="flex items-center gap-3 w-full px-3 py-2">
                <Search className="w-5 h-5 text-gov-blue flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What do you need help with? (e.g. 'I need financial support for my education')"
                  className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-gov-blue hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>Find Services</span>
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick search tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 mb-8">
              <span className="font-semibold text-slate-400">Popular queries:</span>
              <button
                type="button"
                onClick={() => setSearchQuery("I want financial support for my education")}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-gov-blue transition-colors font-medium"
              >
                Education Support
              </button>
              <button
                type="button"
                onClick={() => setSearchQuery("PM-KISAN instalment and farmer subsidy")}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-gov-blue transition-colors font-medium"
              >
                PM-KISAN Subsidy
              </button>
              <button
                type="button"
                onClick={() => setSearchQuery("PMAY urban housing subsidy")}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-gov-blue transition-colors font-medium"
              >
                Housing Subsidy
              </button>
              <button
                type="button"
                onClick={() => setSearchQuery("Udyam MSME loan support")}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-gov-blue transition-colors font-medium"
              >
                MSME Support
              </button>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/services"
                className="px-6 py-3 rounded-xl bg-gov-blue hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md transition-colors flex items-center gap-2"
              >
                <span>Explore Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/services?category=Education"
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
              >
                <span>Find Services by Category</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

            {/* Quick Specialized Directory Gateways */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mt-10">
              <Link 
                to="/departments" 
                className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all text-left group shadow-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-gov-blue flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Building2 className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-gov-blue">35+ Departments</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">Central & State Directory</p>
              </Link>

              <Link 
                to="/certificates" 
                className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all text-left group shadow-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <FileCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-gov-blue">Certificates Hub</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">10 Statutory Records</p>
              </Link>

              <Link 
                to="/agriculture" 
                className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all text-left group shadow-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-gov-blue">Agriculture Portal</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">PM-KISAN, PMFBY & Credit</p>
              </Link>

              <Link 
                to="/grievances" 
                className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all text-left group shadow-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-gov-blue">Public Grievances</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">CPGRAMS Redressal & Tracking</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Visual Architecture Illustration */}
        <div className="max-w-5xl mx-auto px-4 mt-16">
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-gov-navy to-slate-900 p-6 sm:p-8 text-white shadow-2xl border border-slate-800 overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-800/60">
                    Ecosystem Orchestration Flow
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold mt-2">
                    How GovFlow AI Coordinates the Indian Civic Infrastructure
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/50 px-3 py-1 rounded-lg border border-emerald-800/60">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Federated Sandbox
                </div>
              </div>

              {/* 3-Tier Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 1: Citizen Persona */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                        01
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">Single Profile</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-100 mb-1">One Citizen Profile</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Citizen inputs intent in natural language. Zero repeated entry of Aadhaar, DoB, and address across multiple ministry forms.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-blue-300 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Auto-filled Verified Credentials</span>
                  </div>
                </div>

                {/* Step 2: GovFlow AI Orchestrator */}
                <div className="bg-gradient-to-b from-blue-600/20 to-blue-900/40 border-2 border-blue-400/40 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gov-saffron text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
                    Intelligent Core
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3 mt-1">
                      <div className="w-8 h-8 rounded-lg bg-gov-saffron/20 text-orange-400 flex items-center justify-center font-bold text-xs">
                        02
                      </div>
                      <span className="text-[11px] text-cyan-400 font-mono">AI + Rule Engine</span>
                    </div>
                    <h4 className="font-bold text-sm text-white mb-1">GovFlow AI Orchestrator</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Interprets queries, evaluates deterministic eligibility rules, verifies required proofs, and manages citizen data consents.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-cyan-300 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Cross-Department Synchronization</span>
                  </div>
                </div>

                {/* Step 3: Digital Ecosystem */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        03
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">Decentralized</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-100 mb-1">Connected Gov Infrastructure</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      API Setu, DigiLocker, and Central/State portals receive completed, schema-validated applications without portal replacement.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-emerald-300 font-medium">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Statutory Authority Maintained</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST & INTEGRATION ECOSYSTEM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-gov-blue uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Open Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            {t('trust.heading')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto mt-1">
            {t('trust.sub')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'DigiLocker', type: 'National Vault', status: 'Demo Integration', badge: 'bg-blue-50 text-blue-700' },
            { name: 'API Setu', type: 'API Exchange', status: 'API Ready', badge: 'bg-emerald-50 text-emerald-700' },
            { name: 'UMANG', type: 'App Gateway', status: 'Integration Ready', badge: 'bg-purple-50 text-purple-700' },
            { name: 'Department APIs', type: 'Central Ministries', status: 'Direct Sync Ready', badge: 'bg-amber-50 text-amber-700' },
            { name: 'State Services', type: 'State Portals', status: 'Adapter Ready', badge: 'bg-cyan-50 text-cyan-700' },
            { name: 'Local Services', type: 'Municipal Bodies', status: 'API Enabled', badge: 'bg-indigo-50 text-indigo-700' },
          ].map((item, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:border-blue-300 hover:shadow-card-hover transition-all text-center flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 mx-auto flex items-center justify-center font-bold text-xs text-gov-navy mb-2">
                  <Database className="w-4 h-4 text-gov-blue" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">{item.name}</h4>
                <p className="text-[11px] text-slate-400 mb-3">{item.type}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border border-current/20 ${item.badge}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. THE PROBLEM VS GOVFLOW AI (SECTION 54 & 83) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/60">
              Why GovFlow AI Matters
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mt-3 leading-tight">
              Government services are digital. The journey is still fragmented.
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              India has built world-class digital public infrastructure. The remaining hurdle is the friction of navigating across independent portals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4 font-bold text-sm">
                ✕
              </div>
              <h3 className="text-base font-bold text-white mb-2">Multiple Portals</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Citizens must locate dozens of separate websites, learn disparate UI designs, and remember separate credentials for each department.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4 font-bold text-sm">
                ✕
              </div>
              <h3 className="text-base font-bold text-white mb-2">Repeated Information</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The exact same basic information (Aadhaar, income declaration, bank passbook, address proof) is requested over and over again.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4 font-bold text-sm">
                ✕
              </div>
              <h3 className="text-base font-bold text-white mb-2">Disconnected Tracking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Citizens struggle to know where their application stands across different ministries without visiting each individual portal daily.
              </p>
            </div>
          </div>

          {/* Solution Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/60 via-gov-navy to-blue-900/60 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gov-blue text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <Sparkles className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  GovFlow AI connects the journey without replacing the underlying services.
                </h4>
                <p className="text-xs text-blue-200">
                  Federated consent, auto-fill orchestration, and unified tracking under one civic interface.
                </p>
              </div>
            </div>
            <Link
              to="/services"
              className="px-5 py-2.5 rounded-xl bg-gov-blue hover:bg-blue-600 text-white text-xs font-bold shadow transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <span>See How It Works</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. ANIMATED SERVICE NETWORK (SECTION 20: INTERACTIVE ORCHESTRATION ECOSYSTEM) */}
      <section id="network" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#070F1E] via-gov-navy to-[#050C18] text-white p-6 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Background Ambient Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-cyan-300 mb-3 backdrop-blur-md">
              <Network className="w-3.5 h-3.5 text-cyan-400" />
              <span>National Civic Infrastructure Orchestration</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              The Connected Government Service Network
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed font-normal">
              GovFlow AI orchestrates existing Indian digital infrastructure through standardized schemas without duplicating citizen databases.
            </p>
          </div>

          {/* Interactive Network Diagram */}
          <div className="relative z-10 max-w-5xl mx-auto">
            {/* Center Core Hub: GovFlow AI */}
            <div className="flex flex-col items-center justify-center mb-8 sm:mb-12">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-500 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse" />
                <div className="relative px-6 py-4 rounded-2xl bg-slate-900 border border-blue-400/40 shadow-2xl flex items-center gap-3 text-center">
                  <div className="w-10 h-10 rounded-xl bg-gov-blue text-white flex items-center justify-center font-black text-base shadow">
                    GF
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-white">GovFlow AI</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Orchestration Hub
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-mono">
                      Active Gateway • 100% DPDP Act Compliant
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Orbiting Ecosystem Nodes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  id: 'digilocker',
                  name: 'DigiLocker',
                  authority: 'Ministry of Electronics & IT (MeitY)',
                  desc: 'Cryptographically signed citizen credentials & certificates.',
                  badge: 'Sandbox',
                  badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
                  protocol: 'OAuth 2.0 / OpenID',
                  latency: '24ms',
                  icon: <FileCheck className="w-5 h-5 text-blue-400" />
                },
                {
                  id: 'apisetu',
                  name: 'API Setu',
                  authority: 'National e-Governance Division (NeGD)',
                  desc: 'Unified exchange bridge connecting departmental backends.',
                  badge: 'Integration Ready',
                  badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
                  protocol: 'REST / Open API 3.0',
                  latency: '32ms',
                  icon: <Network className="w-5 h-5 text-emerald-400" />
                },
                {
                  id: 'umang',
                  name: 'UMANG Platform',
                  authority: 'NeGD / Digital India',
                  desc: 'Unified mobile application gateway with 1,200+ statutory schemes.',
                  badge: 'Demo Integration',
                  badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
                  protocol: 'e-Gov App Bridge',
                  latency: '45ms',
                  icon: <Sparkles className="w-5 h-5 text-purple-400" />
                },
                {
                  id: 'aadhaar',
                  name: 'UIDAI Aadhaar',
                  authority: 'Unique Identification Authority of India',
                  desc: 'Secure demographic verification, e-KYC, and DBT seed mapping.',
                  badge: 'Sandbox',
                  badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
                  protocol: 'UIDAI 2.5 Auth API',
                  latency: '19ms',
                  icon: <ShieldCheck className="w-5 h-5 text-amber-400" />
                },
                {
                  id: 'ssdg',
                  name: 'State Gateways (SSDG)',
                  authority: '28 States & 8 Union Territories',
                  desc: 'State Service Delivery Gateways for domicile, caste & local welfare.',
                  badge: 'Integration Ready',
                  badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
                  protocol: 'State e-Seva Adapter',
                  latency: '52ms',
                  icon: <Building2 className="w-5 h-5 text-cyan-400" />
                },
                {
                  id: 'ministries',
                  name: 'Central Ministries & PFMS',
                  authority: 'DBT Bharat, NSP, MoF, MoMSME',
                  desc: 'Direct Benefit Transfer & Public Financial Management System.',
                  badge: 'Integration Ready',
                  badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
                  protocol: 'PFMS DBT Direct API',
                  latency: '41ms',
                  icon: <Database className="w-5 h-5 text-rose-400" />
                },
              ].map((node) => (
                <div 
                  key={node.id}
                  className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-blue-400/40 hover:bg-white/[0.08] transition-all backdrop-blur-sm flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                        {node.icon}
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${node.badgeColor}`}>
                        {node.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {node.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{node.authority}</p>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                        {node.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{node.protocol}</span>
                    <span className="text-emerald-400 font-semibold">{node.latency}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Transparent Protocol Architecture Note */}
            <div className="mt-8 p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <p className="text-xs text-slate-400 leading-relaxed max-w-3xl mx-auto">
                <span className="font-semibold text-slate-300">Architecture Guarantee: </span>
                GovFlow AI connects directly with authoritative endpoints using cryptographic verification tokens. We never create a centralized duplicate repository of citizen records. All integrations operate in demonstration mode compliant with simulated API Setu standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AUTHENTIC INDIAN CIVIC DOMAIN SHOWCASE (SECTION 19) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-gov-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Citizen Journeys
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Tailored for Every Indian Citizen
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            From educational grants to agricultural subsidies and enterprise loans, discover services designed for your life situation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              role: 'Students & Scholars',
              badge: 'Education',
              desc: 'PM Vidya Lakshmi collateral-free education loans, Central Sector Scholarships, and instant DigiLocker marksheets.',
              icon: '🎓',
              link: '/services?category=Education',
            },
            {
              role: 'Farmers & Agronomists',
              badge: 'Agriculture',
              desc: 'PM-KISAN ₹6,000 annual income support, PMFBY crop loss insurance, and PM-KUSUM solar pumps.',
              icon: '🌾',
              link: '/services?category=Agriculture',
            },
            {
              role: 'Job Seekers & Youth',
              badge: 'Employment',
              desc: 'National Career Service (NCS) verification, Skill India certificates, and PMKVY vocational allowances.',
              icon: '💼',
              link: '/services?category=Employment',
            },
            {
              role: 'MSME Entrepreneurs',
              badge: 'Business',
              desc: 'PMEGP 35% margin subsidy, instant Udyam registration, and collateral-free MUDRA loans.',
              icon: '🏢',
              link: '/services?category=Business%20%26%20MSME',
            },
            {
              role: 'Healthcare & Families',
              badge: 'Healthcare',
              desc: 'Ayushman Bharat PM-JAY ₹5L cashless hospital cover, ABHA Digital Health ID, and Jan Aushadhi medicines.',
              icon: '🏥',
              link: '/services?category=Healthcare',
            },
            {
              role: 'Housing & Families',
              badge: 'Housing',
              desc: 'Pradhan Mantri Awas Yojana (PMAY) interest subsidies, One Nation One Ration Card, and tap water connections.',
              icon: '🏠',
              link: '/services?category=Housing',
            },
            {
              role: 'Senior Citizens',
              badge: 'Social Welfare',
              desc: 'IGNOAPS national pensions, Jeevan Pramaan digital life certificate from home, and Vayoshri assistive devices.',
              icon: '🧓',
              link: '/services?category=Social%20Welfare',
            },
            {
              role: 'Digital Citizens',
              badge: 'Identity',
              desc: 'Aadhaar updates, PAN-Aadhaar linking, DigiLocker digital driving licenses, and DPDP consent controls.',
              icon: '🇮🇳',
              link: '/services?category=Identity%20%26%20Certificates',
            },
          ].map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover hover:border-blue-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-gov-blue transition-colors">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-gov-blue transition-colors">
                  {item.role}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-gov-blue gap-1">
                <span>View Schemes</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. LIFE-EVENT BASED SERVICE HUBS (SECTION 16) */}
      <section id="life-events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-gov-saffron uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Citizen-Centric Design
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {t('lifeEvents.title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('lifeEvents.subtitle')}
          </p>
        </div>

        {/* 6 Event Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {LIFE_EVENTS_CONFIG.map((event) => (
            <LifeEventCard
              key={event.id}
              {...event}
              isActive={event.id === selectedLifeEventId}
              onSelect={() => setSelectedLifeEventId(event.id)}
            />
          ))}
        </div>

        {/* Dynamic Recommended Services Drawer for Selected Life Event */}
        <div className="bg-gradient-to-r from-blue-50/70 to-slate-50 border border-blue-200/80 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeLifeEvent.emoji}</span>
                <h3 className="text-lg font-bold text-slate-900">
                  Recommended Schemes for {activeLifeEvent.title}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeLifeEvent.description}
              </p>
            </div>
            <Link
              to="/services"
              className="text-xs font-bold text-gov-blue hover:underline flex items-center gap-1"
            >
              <span>Explore All {services.length} Registered Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {lifeEventServices.map((service) => (
              <ServiceCard key={service.id} service={service} highlightMatch />
            ))}
          </div>
        </div>
      </section>

      {/* 5. 13 SERVICE CATEGORIES (SECTION 15) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-gov-blue uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Complete Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              What can we help you with?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse government services across 13 civic domains.
            </p>
          </div>
          <Link
            to="/services"
            className="px-4 py-2 rounded-xl bg-gov-blue hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span>{t('btn.viewAll')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categoryCounts.map(({ category, count }) => (
            <CategoryCard
              key={category}
              category={category}
              count={count}
              onClick={() => navigate(`/services?category=${encodeURIComponent(category)}`)}
            />
          ))}
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-gov-blue uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Four Steps
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            How GovFlow AI Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Transforming a fragmented multi-portal application into a streamlined citizen flow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Tell Us What You Need',
              desc: 'Use natural everyday language. No need to understand government department boundaries or ministry titles.',
              icon: <Search className="w-5 h-5 text-blue-600" />,
            },
            {
              step: '02',
              title: 'Discover Relevant Services',
              desc: 'AI matches your needs to official central, state, and local schemes with transparent qualification reasons.',
              icon: <Sparkles className="w-5 h-5 text-gov-saffron" />,
            },
            {
              step: '03',
              title: 'Prepare & Auto-fill',
              desc: 'Evaluate preliminary eligibility, verify documents via DigiLocker, and auto-populate authorized forms.',
              icon: <FileCheck className="w-5 h-5 text-emerald-600" />,
            },
            {
              step: '04',
              title: 'Track Everything',
              desc: 'Follow status across different ministries on a unified multi-stage timeline with timely push notifications.',
              icon: <Clock className="w-5 h-5 text-purple-600" />,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-2xl font-extrabold font-mono text-slate-300">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. WITHOUT GOVFLOW AI vs WITH GOVFLOW AI COMPARISON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-gov-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            The Civic Transformation
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Without GovFlow AI vs With GovFlow AI
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            See how smart orchestration removes bureaucratic friction for Indian citizens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Without GovFlow AI */}
          <div className="rounded-3xl p-6 sm:p-8 bg-rose-50/50 border border-rose-200 shadow-sm space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Without GovFlow AI (Fragmented Reality)</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold mt-0.5">✕</span>
                <span><strong>50+ Separate Portals:</strong> Citizens must remember dozens of separate URLs, logins, and passwords for central, state, and local bodies.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold mt-0.5">✕</span>
                <span><strong>Redundant Physical Uploads:</strong> Aadhaar, income, and caste certificates scanned and re-uploaded endlessly for every application.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold mt-0.5">✕</span>
                <span><strong>Hidden Deadlines:</strong> Citizens miss out on scholarships, farmer subsidies, or business incentives because alerts aren't proactive.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold mt-0.5">✕</span>
                <span><strong>Black Box Processing:</strong> Citizens have no visibility into whose desk an application is sitting on or why rejections occur.</span>
              </li>
            </ul>
          </div>

          {/* With GovFlow AI */}
          <div className="rounded-3xl p-6 sm:p-8 bg-emerald-50/50 border border-emerald-200 shadow-sm space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>With GovFlow AI (Intelligent Orchestration)</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>One Unified Journey:</strong> Search and apply for any central or state scheme from a single intuitive civic interface.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>DigiLocker Auto-Pull:</strong> Verified government documents pulled once into a private vault with 100% DPDP consent control.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Proactive AI Matching:</strong> Instant eligibility calculations recommend schemes right when you become eligible.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Transparent 4-Stage Tracking:</strong> Real-time stage tracking with audit logging and direct officer notes.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 8. WHO IS GOVFLOW AI FOR? */}
      <section id="who-its-for" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-gov-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Ecosystem Impact
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Who is GovFlow AI for?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Built to empower all key stakeholders across India's digital governance landscape.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Citizens */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card hover:shadow-elevation transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-gov-blue flex items-center justify-center border border-blue-100">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Citizens & Families</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Students, farmers, MSME entrepreneurs, women, senior citizens, and job seekers discovering schemes and tracking approvals in 22 languages.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="text-[11px] font-bold text-gov-blue flex items-center gap-1">
                Personalized Vault & Auto-Fill
              </span>
            </div>
          </div>

          {/* Department Officers */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card hover:shadow-elevation transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Department Officers</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Desk reviewers and field verifiers reviewing pre-verified digital applications, verifying DigiLocker documents, and reducing turnaround time by 60%.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                Streamlined Queue & Stage Updates
              </span>
            </div>
          </div>

          {/* Department Admins */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card hover:shadow-elevation transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Department Administrators</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ministry leaders analyzing scheme uptake, identifying bottlenecks across districts, configuring multi-stage workflows, and monitoring SLAs.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                Real-Time SLA & Bottleneck Analytics
              </span>
            </div>
          </div>

          {/* System Admins */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card hover:shadow-elevation transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                <Network className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">System Administrators</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Platform architects registering new department services dynamically, orchestrating API Setu endpoints, and monitoring security audit logs.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="text-[11px] font-bold text-purple-600 flex items-center gap-1">
                Service Catalog & API Setu Bridge
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 9. AI RECOMMENDATION & DOCUMENT INTELLIGENCE SHOWCASE */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Recommendation Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gov-blue uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  AI Recommendation Engine
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  94% Rule Match
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
                PM Post-Matric Scholarship for Higher Education
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Ministry of Social Justice & Empowerment
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 mb-6 text-xs">
                <p className="font-semibold text-slate-700 mb-2">
                  Citizens qualify automatically based on verified attributes:
                </p>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Enrolled in recognized undergraduate technical degree</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Annual family income within official scheme threshold</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Active Aadhaar Direct Benefit Transfer (DBT) link</span>
                </div>
                <div className="flex items-center gap-2 text-amber-700">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Proactive alert: Certificate renewal recommended before deadline</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <p className="text-[11px] text-slate-400 italic">
                *Preliminary eligibility assessment with transparent qualification reasons.
              </p>
              <Link
                to="/eligibility/SRV-EDU-001"
                className="px-4 py-2 bg-gov-blue hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors whitespace-nowrap"
              >
                Check Eligibility
              </Link>
            </div>
          </div>

          {/* Document Intelligence Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gov-saffron uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                  DigiLocker & DPDP Consent Vault
                </span>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full font-mono">
                  Verified Simulation
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
                Zero Unauthorized Data Sharing
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Automated document pull with granular time-bound consent
              </p>

              <div className="space-y-2 mb-6">
                <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <FileCheck className="w-4 h-4 text-gov-blue" />
                    <div>
                      <p className="font-bold text-slate-800">Aadhaar Card</p>
                      <p className="text-[10px] text-slate-400">UIDAI API Setu • Instant Verification</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    ✓ Verified
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <FileCheck className="w-4 h-4 text-gov-blue" />
                    <div>
                      <p className="font-bold text-slate-800">Educational Certificates</p>
                      <p className="text-[10px] text-slate-400">DigiLocker Cryptographic Signature</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    ✓ Tamper Proof
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-gov-blue" />
                    <div>
                      <p className="font-bold text-slate-800">DPDP Act 2023 Consent Token</p>
                      <p className="text-[10px] text-blue-700">Single-purpose, 90-day time-bound token</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    Revocable
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <Link
                to="/services"
                className="text-xs font-bold text-gov-blue hover:underline flex items-center gap-1"
              >
                <span>Browse Scheme Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
              >
                Log In to Experience
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. NATIONAL SCALE & ABOUT */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="rounded-3xl bg-gradient-to-br from-gov-navy to-slate-900 text-white p-8 sm:p-12 border border-slate-800 shadow-elevation">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/60">
              National Digital Stack
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
              Orchestrating India's Digital Civic Infrastructure
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              GovFlow AI connects seamlessly with DigiLocker, API Setu, UMANG, and State Service Delivery Gateways.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 mb-1">
                40+
              </div>
              <p className="text-xs text-slate-300 font-semibold">Service Categories</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Central, State & Local</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 mb-1">
                20+
              </div>
              <p className="text-xs text-slate-300 font-semibold">Live Schemas</p>
              <p className="text-[10px] text-slate-500 mt-0.5">API Setu Standardized</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mb-1">
                100%
              </div>
              <p className="text-xs text-slate-300 font-semibold">DPDP Compliant</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Isolated Citizen Vaults</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-3xl sm:text-4xl font-extrabold text-purple-400 mb-1">
                22
              </div>
              <p className="text-xs text-slate-300 font-semibold">Official Languages</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Multilingual Ready</p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FINAL LANDING CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-blue-50/80 border border-blue-200/80 shadow-card">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gov-navy mb-3">
            Government services shouldn't feel complicated.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mb-8 max-w-xl mx-auto">
            One citizen. One profile. Every service. One smart journey. Experience the future of public service delivery today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-gov-blue hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md transition-colors flex items-center gap-2"
            >
              <span>Create Your Profile</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/services"
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs sm:text-sm font-bold shadow-sm transition-colors"
            >
              Explore 500+ Public Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

