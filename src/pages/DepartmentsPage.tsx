import React, { useState, useMemo } from 'react';
import { useGovFlow } from '../store/GovFlowContext';
import { Department } from '../types';
import { getIntegrationBadge } from '../components/cards/ServiceCard';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  ExternalLink, 
  ArrowRight, 
  Layers, 
  Globe2, 
  ShieldCheck, 
  FileText,
  MapPin,
  Landmark
} from 'lucide-react';

export const DepartmentsPage: React.FC = () => {
  const { departments, services } = useGovFlow();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const levels = ['All', 'Central', 'State', 'District', 'Municipal'];

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    departments.forEach(d => d.categories.forEach(c => set.add(c)));
    return ['All', ...Array.from(set)];
  }, [departments]);

  const filteredDepartments = useMemo(() => {
    return departments.filter(dept => {
      // Level filter
      if (selectedLevel !== 'All' && dept.level !== selectedLevel) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'All' && !dept.categories.includes(selectedCategory as any)) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = dept.name.toLowerCase().includes(q);
        const matchesMinistry = dept.ministry?.toLowerCase().includes(q);
        const matchesDesc = dept.description.toLowerCase().includes(q);
        const matchesServices = dept.services.some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesMinistry && !matchesDesc && !matchesServices) {
          return false;
        }
      }
      return true;
    });
  }, [departments, selectedLevel, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-gov-blue uppercase tracking-wider mb-2">
          <Landmark className="w-4 h-4 text-gov-blue" />
          <span>Government of India • Unified Department Directory</span>
          <span>•</span>
          <span>{departments.length} Authorities Catalogued</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gov-navy tracking-tight">
          Government Departments & Agencies
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-3xl leading-relaxed">
          Explore authoritative Central Ministries, State Secretariats, District Collectorates, and Local Municipal Corporations orchestrating digital services across India.
        </p>
      </div>

      {/* Controls Bar: Search & Level Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by department name, ministry, or service domain (e.g. Education, Finance, Agriculture)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-gov-blue"
            />
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap mr-1">Tier:</span>
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedLevel === lvl
                    ? 'bg-gov-blue text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-thin">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Domain:</span>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-100 text-gov-blue border border-blue-200 font-bold'
                  : 'bg-slate-50 text-slate-600 border border-slate-200/80 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map((dept) => {
          // Count linked live services
          const linkedCount = services.filter(s => 
            s.department.toLowerCase().includes(dept.name.toLowerCase()) || 
            (dept.ministry && s.department.toLowerCase().includes(dept.ministry.toLowerCase()))
          ).length;

          return (
            <div 
              key={dept.id} 
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-card-hover transition-all duration-200 p-6 flex flex-col justify-between"
            >
              <div>
                {/* Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    dept.level === 'Central'
                      ? 'bg-blue-50 text-gov-blue border border-blue-200'
                      : dept.level === 'State'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : dept.level === 'District'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {dept.level} Government
                  </span>

                  {getIntegrationBadge(dept.integrationStatus)}
                </div>

                {/* Department Name & Ministry */}
                <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
                  {dept.name}
                </h3>
                {dept.ministry && (
                  <p className="text-xs text-gov-blue font-semibold mb-2 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{dept.ministry}</span>
                  </p>
                )}

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {dept.description}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Services Catalogued</span>
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-blue-500" />
                      {dept.serviceCount} Services
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Jurisdiction</span>
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      {dept.jurisdiction}
                    </span>
                  </div>
                </div>

                {/* Sample Services List */}
                <div className="space-y-1 mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Key Digital Services:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {dept.services.slice(0, 3).map((srv, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[11px] leading-tight">
                        <span className="text-gov-blue font-bold">•</span>
                        <span className="line-clamp-1">{srv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer: Action Links */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  to={`/services?q=${encodeURIComponent(dept.name)}`}
                  className="font-bold text-gov-blue hover:text-blue-700 flex items-center gap-1"
                >
                  <span>Browse {linkedCount > 0 ? `${linkedCount} Services` : 'Services'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {dept.officialSource && (
                  <a
                    href={dept.officialSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-[11px]"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredDepartments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No departments match your filter</h3>
          <p className="text-xs text-slate-500 mt-1">Try clearing the search keywords or selecting All tiers.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedLevel('All'); setSelectedCategory('All'); }}
            className="mt-4 px-4 py-2 bg-gov-blue text-white rounded-xl text-xs font-bold"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
