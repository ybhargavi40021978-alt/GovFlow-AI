import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGovFlow } from '../store/GovFlowContext';
import { ServiceCard } from '../components/cards/ServiceCard';
import { ServiceCategory } from '../types';
import { 
  Search, 
  Filter, 
  X, 
  RotateCcw, 
  Building2, 
  Layers, 
  MapPin, 
  FileCheck2,
  Sparkles 
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { services, t } = useGovFlow();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category') || 'All';
  const initialLevel = searchParams.get('level') || 'All';
  const initialSearch = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedLevel, setSelectedLevel] = useState<string>(initialLevel);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [onlyOnline, setOnlyOnline] = useState<boolean>(false);

  const categories: string[] = [
    'All',
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
    'Municipal Services',
  ];

  const levels = ['All', 'Central', 'State', 'Local'];

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      // Category filter
      if (selectedCategory !== 'All' && service.category !== selectedCategory) {
        return false;
      }
      // Level filter
      if (selectedLevel !== 'All' && service.level !== selectedLevel) {
        return false;
      }
      // Online filter
      if (onlyOnline && !service.isOnline) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = service.name.toLowerCase().includes(q);
        const matchesDesc = service.description.toLowerCase().includes(q);
        const matchesDept = service.department.toLowerCase().includes(q);
        const matchesTags = service.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesDept && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }, [services, selectedCategory, selectedLevel, searchQuery, onlyOnline]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedLevel('All');
    setSearchQuery('');
    setOnlyOnline(false);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-gov-blue uppercase tracking-wider mb-2">
          <span>Unified Service Registry</span>
          <span>•</span>
          <span>{services.length} Total Services</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gov-navy tracking-tight">
          Government Digital Services
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Discover centralized, state, and local services with standardized eligibility rules and automated document orchestration.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by service name, department, or keyword (e.g. scholarship, income, housing)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-gov-blue"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap mr-1">Level:</span>
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

          {/* Online toggle */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 select-none whitespace-nowrap">
            <input
              type="checkbox"
              checked={onlyOnline}
              onChange={(e) => setOnlyOnline(e.target.checked)}
              className="w-4 h-4 text-gov-blue rounded border-slate-300 focus:ring-blue-500"
            />
            <span>100% Online Only</span>
          </label>
        </div>

        {/* Category horizontal scrolling bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-slate-100 pt-3">
          <span className="text-xs font-semibold text-slate-400 whitespace-nowrap mr-1">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500">
          Showing <span className="font-bold text-slate-800">{filteredServices.length}</span> services
        </p>

        {(selectedCategory !== 'All' || selectedLevel !== 'All' || searchQuery || onlyOnline) && (
          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-gov-blue hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All Filters
          </button>
        )}
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} highlightMatch />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200/80 shadow-sm max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No services found</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">
            We couldn't find any services matching your criteria. Try adjusting your search query or reset the filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-gov-blue text-white text-xs font-bold rounded-xl shadow-sm hover:bg-blue-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
