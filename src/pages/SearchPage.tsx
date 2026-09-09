import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useGovFlow } from '../store/GovFlowContext';
import { ServiceCard } from '../components/cards/ServiceCard';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Building2, 
  FileCheck2,
  Bot,
  Lightbulb
} from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { services, t } = useGovFlow();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [query, setQuery] = useState(queryParam);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsAnalyzing(true);
      setSearchParams({ q: query.trim() });
      setTimeout(() => setIsAnalyzing(false), 300);
    }
  };

  // Conversational Intent Matching
  const searchResults = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return services;

    return services.filter(service => {
      // Direct keyword matches
      const matchName = service.name.toLowerCase().includes(q);
      const matchDesc = service.description.toLowerCase().includes(q);
      const matchDept = service.department.toLowerCase().includes(q);
      const matchCategory = service.category.toLowerCase().includes(q);
      const matchTags = service.tags.some(tag => tag.toLowerCase().includes(q) || q.includes(tag.toLowerCase()));
      const matchLifeEvents = service.lifeEvents.some(le => le.toLowerCase().includes(q) || q.includes(le.toLowerCase()));

      // Semantic Intent patterns
      let intentMatch = false;
      if ((q.includes('student') || q.includes('college') || q.includes('education') || q.includes('study') || q.includes('fee') || q.includes('scholarship')) && service.category === 'Education') {
        intentMatch = true;
      }
      if ((q.includes('income') || q.includes('caste') || q.includes('certificate') || q.includes('tehsildar') || q.includes('domicile') || q.includes('tahsildar')) && (service.category === 'Identity & Certificates' || service.category === 'Education')) {
        intentMatch = true;
      }
      if ((q.includes('house') || q.includes('home') || q.includes('building') || q.includes('pmay') || q.includes('flat') || q.includes('housing')) && service.category === 'Housing') {
        intentMatch = true;
      }
      if ((q.includes('farm') || q.includes('crop') || q.includes('kisan') || q.includes('agriculture') || q.includes('land')) && service.category === 'Agriculture') {
        intentMatch = true;
      }
      if ((q.includes('business') || q.includes('msme') || q.includes('startup') || q.includes('loan') || q.includes('shop')) && service.category === 'Business & MSME') {
        intentMatch = true;
      }
      if ((q.includes('health') || q.includes('hospital') || q.includes('treatment') || q.includes('ayushman') || q.includes('medical')) && service.category === 'Healthcare') {
        intentMatch = true;
      }
      if ((q.includes('job') || q.includes('career') || q.includes('work') || q.includes('unemployed') || q.includes('skill')) && service.category === 'Employment') {
        intentMatch = true;
      }

      return matchName || matchDesc || matchDept || matchCategory || matchTags || matchLifeEvents || intentMatch;
    });
  }, [services, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-gov-blue text-xs font-bold border border-blue-200 shadow-sm">
          <Bot className="w-3.5 h-3.5 text-gov-saffron" />
          <span>Natural Language Service Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gov-navy tracking-tight">
          Tell us what you need. We'll find the right services.
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Type naturally in everyday words. GovFlow AI converts your personal requirements into statutory schemes, required proofs, and workflow steps.
        </p>
      </div>

      {/* Big Conversational Search Input */}
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="bg-white p-2.5 rounded-3xl shadow-elevation border border-slate-200/90 flex flex-col sm:flex-row items-center gap-2">
          <div className="flex items-center gap-3 w-full px-3 py-2">
            <Search className="w-5 h-5 text-gov-blue flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 'I am a student looking for financial support' or 'I need help getting a house'"
              className="w-full text-xs sm:text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-gov-blue hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span>Analyze Intent</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Suggested Prompts */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-400 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            Try searching:
          </span>
          {[
            '“I am a student looking for financial support”',
            '“I want to start a small business”',
            '“I need help getting a house”',
            '“I am a farmer looking for crop assistance”',
            '“I need an income certificate”',
          ].map((promptText, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                const clean = promptText.replace(/“|”/g, '');
                setQuery(clean);
                setSearchParams({ q: clean });
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-gov-blue transition-colors text-[11px] font-medium text-slate-700"
            >
              {promptText}
            </button>
          ))}
        </div>
      </div>

      {/* Semantic Intent Explanation Banner (If searched) */}
      {query.trim() && (
        <div className="max-w-4xl mx-auto p-5 rounded-2xl bg-gradient-to-r from-blue-50/70 to-slate-50 border border-blue-200/80 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-gov-blue">
            <Sparkles className="w-4 h-4 text-gov-saffron" />
            <span>AI Intent Interpretation for: "{query}"</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Identified <strong className="text-slate-900">{searchResults.length} relevant schemes</strong> across Central and State government authorities. Review the match percentages below to inspect criteria and auto-fill your application.
          </p>
        </div>
      )}

      {/* Search Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            {query ? `Matched Services (${searchResults.length})` : `All Government Services (${services.length})`}
          </h2>
          {query && (
            <button
              onClick={() => { setQuery(''); setSearchParams({}); }}
              className="text-xs font-bold text-gov-blue hover:underline"
            >
              Reset Search
            </button>
          )}
        </div>

        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((service) => (
              <ServiceCard key={service.id} service={service} highlightMatch />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 max-w-md mx-auto">
            <Bot className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No matching services found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              We couldn't match your query with an active scheme. Try broader terms like "scholarship", "farmer", or "housing".
            </p>
            <Link
              to="/services"
              className="text-xs font-bold text-gov-blue hover:underline"
            >
              Browse All Services
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
