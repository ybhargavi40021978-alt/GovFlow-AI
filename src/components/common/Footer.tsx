import React from 'react';
import { Link } from 'react-router-dom';
import { GovFlowLogo } from './GovFlowLogo';
import { useGovFlow } from '../../store/GovFlowContext';
import { ShieldCheck, Eye, Cookie, RotateCcw, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setIsAccessibilityOpen, setIsCookieModalOpen, resetAllDemoData } = useGovFlow();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-10 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand & Vision */}
          <div className="col-span-2 md:col-span-1">
            <GovFlowLogo size="md" showTagline className="text-white brightness-125 mb-4" />
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Intelligent government service orchestration platform connecting DigiLocker, API Setu, and Central, State, and Local authorities into one unified citizen journey.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Orchestration Active
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5">
              Service Discovery
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  All 13 Categories
                </Link>
              </li>
              <li>
                <Link to="/#life-events" className="hover:text-white transition-colors">
                  Life-Event Based Hubs
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-white transition-colors">
                  Conversational AI Search
                </Link>
              </li>
              <li>
                <Link to="/services/SRV-EDU-001" className="hover:text-white transition-colors">
                  PM Post-Matric Scholarship
                </Link>
              </li>
              <li>
                <Link to="/services/SRV-REV-002" className="hover:text-white transition-colors">
                  Income Certificate
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Citizen */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5">
              Citizen Journey
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Unified Dashboard
                </Link>
              </li>
              <li>
                <Link to="/applications" className="hover:text-white transition-colors">
                  My Applications Tracking
                </Link>
              </li>
              <li>
                <Link to="/documents" className="hover:text-white transition-colors">
                  Document Intelligence
                </Link>
              </li>
              <li>
                <Link to="/consent" className="hover:text-white transition-colors">
                  Consent Management
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  Citizen Profile & Readiness
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Departments & Admin */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5">
              Gov Tech Console
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/department" className="hover:text-white transition-colors flex items-center gap-1">
                  Department Console
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/department/applications" className="hover:text-white transition-colors">
                  Application Queue
                </Link>
              </li>
              <li>
                <Link to="/department/documents" className="hover:text-white transition-colors">
                  Document Validation Queue
                </Link>
              </li>
              <li>
                <Link to="/department/integrations" className="hover:text-white transition-colors">
                  API Integration Hub
                </Link>
              </li>
              <li>
                <Link to="/admin/services" className="hover:text-white transition-colors">
                  Service Registry Builder
                </Link>
              </li>
              <li>
                <Link to="/department/audit-logs" className="hover:text-white transition-colors">
                  Audit Logs & Traceability
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Support & Compliance */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5">
              Privacy & Trust
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-gov-blue" />
                  Privacy Center
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => setIsCookieModalOpen(true)}
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <Cookie className="w-3.5 h-3.5 text-amber-500" />
                  Cookie Settings
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsAccessibilityOpen(true)}
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-400" />
                  Accessibility Controls
                </button>
              </li>
              <li>
                <Link to="/accessibility" className="hover:text-white transition-colors">
                  WCAG Accessibility Guide
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (window.confirm('Reset demo state to initial demonstration dataset?')) {
                      resetAllDemoData();
                    }
                  }}
                  className="text-amber-400/80 hover:text-amber-300 transition-colors flex items-center gap-1.5 pt-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Demo State
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Card */}
        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 mb-8 text-xs text-slate-300 leading-relaxed">
          <p className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Prototype Concept & Demonstration Notice
          </p>
          <p>
            GovFlow AI is an innovative civic technology prototype demonstrating intelligent orchestration and citizen-centric UX across government digital services. Actual service availability, eligibility rules, and statutory application processing remain under the authoritative jurisdiction of the respective Central, State, and Municipal Government departments. Simulated API adapters illustrate DigiLocker and API Setu data exchange.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 GovFlow AI. Built with pride for Indian digital public infrastructure.</p>
          <div className="flex items-center space-x-4">
            <Link to="/privacy" className="hover:text-slate-400">Privacy Notice</Link>
            <span className="text-slate-700">•</span>
            <Link to="/cookies" className="hover:text-slate-400">Cookies Policy</Link>
            <span className="text-slate-700">•</span>
            <Link to="/accessibility" className="hover:text-slate-400">Accessibility</Link>
            <span className="text-slate-700">•</span>
            <span className="font-mono text-slate-400">v2.4-Orchestrator</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
