import React, { useState, useEffect } from 'react';
import { useGovFlow } from '../../store/GovFlowContext';
import { GovFlowLogo } from './GovFlowLogo';
import { 
  User, 
  Search, 
  FileText, 
  CheckCircle2, 
  Settings, 
  Building2,
  ShieldCheck,
  Sparkles,
  GraduationCap,
  HeartPulse,
  Briefcase,
  Tractor,
  Home,
  Factory,
  Car,
  Users,
  Award,
  ArrowRight,
  Cpu,
  Layers,
  Check
} from 'lucide-react';

interface SplashScreenProps {
  onComplete: (isAuthenticated: boolean) => void;
  forceQuick?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, forceQuick = false }) => {
  const { currentUser, accessibility } = useGovFlow();
  const reduceMotion = accessibility.reduceMotion;

  // 20-Second Sequence Stages (Section 2):
  // 1 (0–3s, 0–15%): Logo — Simple GovFlow AI logo with animated connected points
  // 2 (3–6s, 15–30%): Brand — GovFlow AI + "One Citizen. One Profile. Every Service. One Smart Journey."
  // 3 (6–9s, 30–45%): Citizen — "Connecting citizens to government services..." (Citizen -> GovFlow AI)
  // 4 (9–12s, 45–60%): Services — 9 Categories appearing and connecting to GovFlow AI
  // 5 (12–15s, 60–75%): Intelligence — "Understanding your service needs..." (Need -> Discovery -> Eligibility -> Documents)
  // 6 (15–18s, 75–90%): Automation — "Preparing smart workflows..." (App -> Validation -> Verification -> Dept -> Status)
  // 7 (18–20s, 90–100%): Ready — "GovFlow AI is ready" -> Smooth transition
  const [stage, setStage] = useState<number>(reduceMotion ? 7 : 1);
  const [progress, setProgress] = useState<number>(reduceMotion ? 100 : 0);
  const [loadingMessage, setLoadingMessage] = useState<string>('Initializing GovFlow AI...');
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [showManualSkip, setShowManualSkip] = useState<boolean>(false);

  useEffect(() => {
    // Reduced motion: instant graceful fade
    if (reduceMotion) {
      setProgress(100);
      setLoadingMessage('GovFlow AI is ready');
      const timer = setTimeout(() => {
        handleFinish();
      }, 350);
      return () => clearTimeout(timer);
    }

    // First visit: 20,000ms (20-second branded product introduction)
    // Returning visit in session: ~1,500ms swift transition
    const totalDuration = forceQuick ? 1500 : 20000;
    const intervalTime = 50;
    const stepIncrement = 100 / (totalDuration / intervalTime);

    // Skip button appears after 8 seconds to preserve user choice
    const fallbackTimer = setTimeout(() => {
      setShowManualSkip(true);
    }, forceQuick ? 800 : 8000);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + stepIncrement;
        if (next >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(fallbackTimer);
    };
  }, [reduceMotion, forceQuick]);

  // Synchronize 20-second stages and exact status messages based on progress
  useEffect(() => {
    if (reduceMotion) return;

    // Stage 1 (0–3s, 0–15%): Logo
    if (progress < 15) {
      setStage(1);
      setLoadingMessage('Initializing GovFlow AI Architecture...');
    } 
    // Stage 2 (3–6s, 15–30%): Brand
    else if (progress < 30) {
      setStage(2);
      setLoadingMessage('One Citizen. One Profile. Every Service.');
    } 
    // Stage 3 (6–9s, 30–45%): Citizen
    else if (progress < 45) {
      setStage(3);
      setLoadingMessage('Connecting citizens to government services...');
    } 
    // Stage 4 (9–12s, 45–60%): Services
    else if (progress < 60) {
      setStage(4);
      setLoadingMessage('Discovering 35+ Central & State Ministries...');
    } 
    // Stage 5 (12–15s, 60–75%): Intelligence
    else if (progress < 75) {
      setStage(5);
      setLoadingMessage('Understanding your service needs & eligibility...');
    } 
    // Stage 6 (15–18s, 75–90%): Automation
    else if (progress < 90) {
      setStage(6);
      setLoadingMessage('Preparing smart workflows & verification pipelines...');
    } 
    // Stage 7 (18–20s, 90–100%): Ready
    else {
      setStage(7);
      setLoadingMessage('GovFlow AI is ready');
      const finishTimer = setTimeout(() => {
        handleFinish();
      }, 500);
      return () => clearTimeout(finishTimer);
    }
  }, [progress, reduceMotion]);

  const handleFinish = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete(!!currentUser);
    }, 500);
  };

  // 9 Core Government Service Categories for Stage 4 (9–12s)
  const serviceCategories = [
    { label: 'Education', icon: <GraduationCap className="w-3.5 h-3.5 text-blue-400" /> },
    { label: 'Healthcare', icon: <HeartPulse className="w-3.5 h-3.5 text-rose-400" /> },
    { label: 'Employment', icon: <Briefcase className="w-3.5 h-3.5 text-amber-400" /> },
    { label: 'Agriculture', icon: <Tractor className="w-3.5 h-3.5 text-emerald-400" /> },
    { label: 'Housing', icon: <Home className="w-3.5 h-3.5 text-purple-400" /> },
    { label: 'Business', icon: <Factory className="w-3.5 h-3.5 text-indigo-400" /> },
    { label: 'Transport', icon: <Car className="w-3.5 h-3.5 text-cyan-400" /> },
    { label: 'Welfare', icon: <Users className="w-3.5 h-3.5 text-orange-400" /> },
    { label: 'Certificates', icon: <Award className="w-3.5 h-3.5 text-teal-400" /> },
  ];

  // Stage 5: Intelligence Flow (12–15s)
  const intelligenceSteps = [
    { name: 'Need', icon: <Search className="w-3.5 h-3.5 text-blue-400" /> },
    { name: 'Service Discovery', icon: <Layers className="w-3.5 h-3.5 text-cyan-400" /> },
    { name: 'Eligibility', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> },
    { name: 'Documents', icon: <FileText className="w-3.5 h-3.5 text-purple-400" /> },
  ];

  // Stage 6: Automation Flow (15–18s)
  const automationSteps = [
    { name: 'Application', icon: <FileText className="w-3 h-3 text-blue-400" /> },
    { name: 'Validation', icon: <Check className="w-3 h-3 text-emerald-400" /> },
    { name: 'Verification', icon: <ShieldCheck className="w-3 h-3 text-teal-400" /> },
    { name: 'Department', icon: <Building2 className="w-3 h-3 text-amber-400" /> },
    { name: 'Status', icon: <Cpu className="w-3 h-3 text-purple-400" /> },
  ];

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[#040914] via-[#08172D] to-[#02060D] text-white select-none transition-opacity duration-500 px-4 py-8 overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      role="status"
      aria-live="polite"
      aria-label="GovFlow AI Initialization Screen"
    >
      {/* Background Animated Civic Tech Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-teal-500/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,#000_70%,transparent_100%)] opacity-50" />
      </div>

      {/* Top Header: Architecture Badge & Systems */}
      <div className="relative z-10 w-full max-w-4xl flex items-center justify-between text-xs text-slate-400">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-slate-300 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>National Smart Service Orchestration Platform</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 font-medium">
          <span className="text-slate-300">DigiLocker</span>
          <span>•</span>
          <span className="text-slate-300">API Setu</span>
          <span>•</span>
          <span className="text-slate-300">UMANG</span>
          <span>•</span>
          <span className="text-slate-300">CPGRAMS</span>
        </div>
      </div>

      {/* Centerpiece: 20-Second Dynamic Product Sequence */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto max-w-2xl w-full px-4">
        
        {/* Stage 1 (0–3s): Simple GovFlow AI Logo */}
        <div className="relative mb-5 flex items-center justify-center">
          <div 
            className={`absolute inset-0 rounded-full bg-blue-500/20 blur-2xl transition-all duration-1000 ${
              stage >= 1 ? 'opacity-100 scale-125' : 'opacity-0 scale-75'
            }`} 
          />

          <div 
            className={`p-6 sm:p-7 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-2xl transition-all duration-1000 transform ${
              stage >= 1 ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
            }`}
          >
            <GovFlowLogo 
              size="splash" 
              variant="symbol" 
              theme="white" 
              animated={stage >= 2} 
            />
          </div>
        </div>

        {/* Stage 2 (3–6s): Brand & Master Tagline */}
        <div 
          className={`transition-all duration-700 ${
            stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <div className="flex items-center justify-center gap-2.5">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
              GovFlow
            </h1>
            <span className="px-2.5 py-0.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/30 font-mono text-sm sm:text-base font-bold tracking-wider">
              AI
            </span>
          </div>

          <p className="text-xs sm:text-sm font-medium text-slate-300 tracking-wide max-w-md mx-auto mt-2 leading-relaxed">
            One Citizen. One Profile. Every Service. One Smart Journey.
          </p>
        </div>

        {/* Stage 3 (6–9s): Citizen -> GovFlow AI Visual Flow */}
        <div 
          className={`transition-all duration-700 mt-5 w-full max-w-md ${
            stage === 3 ? 'opacity-100 scale-100 block' : stage > 3 ? 'hidden' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
              <User className="w-4 h-4 text-blue-400" />
              <span>Citizen</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 animate-pulse" />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
              <Cpu className="w-4 h-4 text-teal-400" />
              <span>GovFlow AI Orchestration</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Connecting citizens to unified government digital infrastructure</p>
        </div>

        {/* Stage 4 (9–12s): 9 Government Service Categories Appearing */}
        <div 
          className={`transition-all duration-700 mt-5 w-full ${
            stage === 4 ? 'opacity-100 scale-100 block' : stage > 4 ? 'hidden' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="text-xs text-slate-300 font-semibold mb-2.5 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Connecting Unified Service Domains</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-2 bg-white/[0.03] p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
            {serviceCategories.map((cat, i) => (
              <div 
                key={cat.label} 
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-500 ${
                  progress >= 45 + i * 1.5 
                    ? 'bg-white/10 border border-white/20 text-white scale-105 shadow-sm' 
                    : 'opacity-30 text-slate-500'
                }`}
              >
                {cat.icon}
                <span className="text-[9px] sm:text-[10px] font-semibold">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stage 5 (12–15s): Intelligence Pipeline (Need -> Discovery -> Eligibility -> Documents) */}
        <div 
          className={`transition-all duration-700 mt-5 w-full max-w-lg ${
            stage === 5 ? 'opacity-100 scale-100 block' : stage > 5 ? 'hidden' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="text-xs text-slate-300 font-semibold mb-2.5 flex items-center justify-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>Understanding Your Service Needs</span>
          </div>
          <div className="flex items-center justify-between gap-1 sm:gap-2 bg-white/[0.03] p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
            {intelligenceSteps.map((step, i) => (
              <React.Fragment key={step.name}>
                <div className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-500 flex-1 ${
                  progress >= 60 + i * 3.5 ? 'bg-white/10 border border-white/20 text-white' : 'opacity-35 text-slate-500'
                }`}>
                  {step.icon}
                  <span className="text-[10px] font-semibold whitespace-nowrap">{step.name}</span>
                </div>
                {i < intelligenceSteps.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Stage 6 (15–18s): Automation Pipeline (App -> Validation -> Verification -> Dept -> Status) */}
        <div 
          className={`transition-all duration-700 mt-5 w-full max-w-xl ${
            stage === 6 ? 'opacity-100 scale-100 block' : stage > 6 ? 'hidden' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="text-xs text-slate-300 font-semibold mb-2.5 flex items-center justify-center gap-1.5">
            <Settings className="w-3.5 h-3.5 text-teal-400" />
            <span>Preparing Smart Department Workflows</span>
          </div>
          <div className="flex items-center justify-between gap-1 sm:gap-2 bg-white/[0.03] p-2.5 rounded-2xl border border-white/10 backdrop-blur-sm">
            {automationSteps.map((step, i) => (
              <React.Fragment key={step.name}>
                <div className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-500 flex-1 ${
                  progress >= 75 + i * 2.8 ? 'bg-white/10 border border-white/20 text-white' : 'opacity-35 text-slate-500'
                }`}>
                  {step.icon}
                  <span className="text-[10px] font-semibold">{step.name}</span>
                </div>
                {i < automationSteps.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-slate-500 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Stage 7 (18–20s): Ready State */}
        <div 
          className={`transition-all duration-700 mt-5 ${
            stage === 7 ? 'opacity-100 scale-100 block' : 'hidden'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>GovFlow AI is ready</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {currentUser 
              ? `Session Verified: ${currentUser.name} • Opening Dashboard...` 
              : 'Launching Universal Government Service Orchestration Platform...'}
          </p>
        </div>

        {/* Progress Bar & Dynamic Status Tracker */}
        <div className="mt-8 w-full max-w-xs sm:max-w-md space-y-3">
          {/* Progress Bar Track */}
          <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/15">
            <div 
              className="bg-gradient-to-r from-blue-500 via-teal-400 to-blue-400 h-full rounded-full transition-all duration-200 ease-out shadow-[0_0_14px_rgba(59,130,246,0.7)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dynamic Status Text & Percentage */}
          <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
            <span className="truncate pr-2 font-sans font-medium text-slate-200 text-left">
              {loadingMessage}
            </span>
            <span className="text-teal-300 font-bold">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Skip Button (Appears after 8s for user autonomy) */}
        {showManualSkip && (
          <button
            onClick={handleFinish}
            className="mt-6 px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-semibold transition-colors border border-white/15 animate-fadeIn flex items-center gap-1.5 mx-auto"
          >
            <span>Skip to GovFlow AI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Bottom Compliance & Security Footer */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
          <span>Zero Centralized Storage • Tokenized Digital Public Infrastructure</span>
        </div>

        <div className="text-slate-500">
          Digital Personal Data Protection (DPDP) Act 2023 Architecture
        </div>
      </div>
    </div>
  );
};
