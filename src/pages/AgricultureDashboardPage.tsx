import React, { useState } from 'react';
import { useGovFlow } from '../store/GovFlowContext';
import { ServiceCard } from '../components/cards/ServiceCard';
import { Link } from 'react-router-dom';
import { 
  Tractor, 
  Sprout, 
  CloudRain, 
  ShieldCheck, 
  TrendingUp, 
  Coins, 
  FileCheck, 
  Fish, 
  Milk, 
  Compass, 
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const AgricultureDashboardPage: React.FC = () => {
  const { services, currentUser } = useGovFlow();
  const [activeTab, setActiveTab] = useState<'All' | 'Crops' | 'Insurance' | 'Credit' | 'Dairy & Fisheries'>('All');

  // Filter agriculture-related schemes
  const agriServices = services.filter(s => 
    s.category === 'Agriculture' || 
    s.tags.includes('farmer') || 
    s.tags.includes('agriculture') ||
    s.tags.includes('crop')
  );

  const tabs = ['All', 'Crops', 'Insurance', 'Credit', 'Dairy & Fisheries'];

  const displayedServices = agriServices.filter(s => {
    if (activeTab === 'Crops') return s.tags.includes('crop') || s.tags.includes('soil');
    if (activeTab === 'Insurance') return s.tags.includes('insurance');
    if (activeTab === 'Credit') return s.tags.includes('loan') || s.tags.includes('kcc') || s.tags.includes('dbt');
    if (activeTab === 'Dairy & Fisheries') return s.tags.includes('fisheries') || s.tags.includes('dairy') || s.tags.includes('livestock');
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
          <Tractor className="w-4 h-4 text-emerald-600" />
          <span>Kisan Orchestration Hub</span>
          <span>•</span>
          <span>Integrated Agri-Digital Ecosystem</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gov-navy tracking-tight">
          Agriculture & Farmers Service Portal
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-3xl leading-relaxed">
          Comprehensive access to national and state agricultural schemes: PM-KISAN direct income support, PMFBY crop insurance, Kisan Credit Cards, soil health testing, micro-irrigation, and dairy & fisheries grants.
        </p>
      </div>

      {/* Kisan Quick Insights Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-200/70">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3">
            <Coins className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">PM-KISAN Income</h3>
          <p className="text-xl font-extrabold text-slate-900 mt-0.5">₹6,000 / Year</p>
          <p className="text-[11px] text-emerald-700 mt-1">3 equal DBT installments of ₹2,000 directly to bank account</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-5 rounded-2xl border border-blue-200/70">
          <div className="w-8 h-8 rounded-xl bg-gov-blue text-white flex items-center justify-center mb-3">
            <CloudRain className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">PMFBY Crop Insurance</h3>
          <p className="text-xl font-extrabold text-slate-900 mt-0.5">1.5% - 2% Premium</p>
          <p className="text-[11px] text-blue-700 mt-1">Subsidized comprehensive risk coverage from sowing to post-harvest</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-200/70">
          <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-3">
            <Sprout className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Kisan Credit Card (KCC)</h3>
          <p className="text-xl font-extrabold text-slate-900 mt-0.5">4% Interest Rate</p>
          <p className="text-[11px] text-amber-700 mt-1">Collateral-free credit up to ₹3 Lakhs with prompt repayment subvention</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-2xl border border-purple-200/70">
          <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-3">
            <Fish className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-purple-900 uppercase tracking-wider">Fisheries & Dairy</h3>
          <p className="text-xl font-extrabold text-slate-900 mt-0.5">Up to 60% Subsidy</p>
          <p className="text-[11px] text-purple-700 mt-1">PM Matsya Sampada Yojana & National Livestock Mission grants</p>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {displayedServices.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <Tractor className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No services found for this tab</h3>
          <p className="text-xs text-slate-500 mt-1">Switch to "All" to browse all agriculture schemes.</p>
        </div>
      )}

      {/* Official External Platforms Integration Bar */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold">Integrated Authoritative Agri-Platforms</h3>
            <p className="text-xs text-slate-400">Direct digital orchestration through API Setu and Government gateways.</p>
          </div>
          <span className="text-[10px] font-mono px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
            • Live Registry Sync
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <a href="https://pmkisan.gov.in" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-between">
            <div>
              <strong className="block text-slate-200">PM-KISAN Portal</strong>
              <span className="text-[10px] text-slate-400">Beneficiary Status & e-KYC</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <a href="https://pmfby.gov.in" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-between">
            <div>
              <strong className="block text-slate-200">PMFBY Portal</strong>
              <span className="text-[10px] text-slate-400">Crop Insurance Calculator</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <a href="https://enam.gov.in" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-between">
            <div>
              <strong className="block text-slate-200">e-NAM Mandi</strong>
              <span className="text-[10px] text-slate-400">National Commodity Rates</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <a href="https://soilhealth.dac.gov.in" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-between">
            <div>
              <strong className="block text-slate-200">Soil Health Portal</strong>
              <span className="text-[10px] text-slate-400">Geotagged Soil Reports</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
