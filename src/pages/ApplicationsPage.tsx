import React, { useState } from 'react';
import { useGovFlow } from '../store/GovFlowContext';
import { ApplicationCard } from '../components/cards/ApplicationCard';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Plus, 
  ArrowRight,
  Inbox
} from 'lucide-react';

export const ApplicationsPage: React.FC = () => {
  const { applications, t } = useGovFlow();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const statusOptions = [
    { id: 'all', label: 'All Applications' },
    { id: 'under_verification', label: 'Under Verification' },
    { id: 'department_review', label: 'Department Review' },
    { id: 'approved', label: 'Approved' },
    { id: 'withdrawn', label: 'Withdrawn' },
  ];

  const filteredApps = applications.filter(app => {
    if (selectedStatus !== 'all' && app.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = app.id.toLowerCase().includes(q);
      const matchService = app.serviceName.toLowerCase().includes(q);
      const matchDept = app.department.toLowerCase().includes(q);
      if (!matchId && !matchService && !matchDept) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gov-blue uppercase tracking-wider mb-2">
            <span>Unified Citizen Portal</span>
            <span>•</span>
            <span>Cross-Department Orchestration</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gov-navy tracking-tight">
            My Government Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Track statutory schemes and certificate requests across Central, State, and Municipal departments in one single real-time dashboard.
          </p>
        </div>

        <Link
          to="/services"
          className="px-5 py-2.5 bg-gov-blue hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for New Service</span>
        </Link>
      </div>

      {/* When user has 0 applications at all: Strict "No applications yet" rule without fake data */}
      {applications.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white rounded-3xl border border-slate-200 max-w-md mx-auto shadow-card space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-gov-blue mx-auto flex items-center justify-center border border-blue-100">
            <Inbox className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {t('withdrawal.emptyApps')}
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              You haven't submitted any scheme applications yet. Browse verified government services to get started.
            </p>
          </div>
          <Link
            to="/services"
            className="px-5 py-2.5 bg-gov-blue hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors inline-flex items-center gap-2"
          >
            <span>Browse Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <>
          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID (e.g. GF-2026) or scheme name..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-gov-blue"
              />
            </div>

            {/* Status Pill Filters */}
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {statusOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedStatus(opt.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedStatus === opt.id
                      ? 'bg-gov-blue text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Applications Grid */}
          {filteredApps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApps.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 max-w-md mx-auto">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No applications match filter</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Try adjusting your search query or check the "All Applications" tab.
              </p>
              <button
                onClick={() => { setSelectedStatus('all'); setSearchQuery(''); }}
                className="text-xs font-bold text-gov-blue hover:underline"
              >
                Clear Filter
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
