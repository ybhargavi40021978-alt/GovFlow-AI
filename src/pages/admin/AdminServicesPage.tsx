import React, { useState } from 'react';
import { useGovFlow } from '../../store/GovFlowContext';
import { Service, ServiceCategory } from '../../types';
import { 
  Plus, 
  Search, 
  Building2, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  FileText, 
  Layers, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminServicesPage: React.FC = () => {
  const { services, addService } = useGovFlow();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [createdSuccess, setCreatedSuccess] = useState<string | null>(null);

  // New service form state
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('Education');
  const [level, setLevel] = useState<'Central' | 'State' | 'Local'>('Central');
  const [stateName, setStateName] = useState('All-India');
  const [description, setDescription] = useState('');
  const [eligibilitySummary, setEligibilitySummary] = useState('');
  const [incomeLimit, setIncomeLimit] = useState('300000');
  const [requiredDocsInput, setRequiredDocsInput] = useState('Aadhaar Card, Income Certificate, Bank Passbook');
  const [workflowInput, setWorkflowInput] = useState('Application Submitted, Automated Document Verification, Department Review, Sanction Order Issued');
  const [timeline, setTimeline] = useState('7 - 14 business days');
  const [fee, setFee] = useState('₹0 (Free)');
  const [officialSource, setOfficialSource] = useState('digitalindia.gov.in (API Ready)');

  const filteredServices = services.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.department.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
  });

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !department.trim()) return;

    const reqDocs = requiredDocsInput.split(',').map(s => s.trim()).filter(Boolean);
    const workflows = workflowInput.split(',').map(s => s.trim()).filter(Boolean);

    const created = addService({
      name,
      department,
      category,
      level,
      state: stateName,
      description,
      eligibilitySummary,
      eligibilityRules: [
        {
          id: `rule-inc-${Date.now()}`,
          field: 'annualIncome',
          label: 'Family Annual Income Upper Limit (₹)',
          type: 'number',
          max: Number(incomeLimit) || 300000,
          explanation: `Household income must not exceed ₹${Number(incomeLimit).toLocaleString('en-IN')}.`
        },
        {
          id: `rule-res-${Date.now()}`,
          field: 'isResident',
          label: `Legal Resident of ${stateName}?`,
          type: 'boolean',
          requiredValue: true,
          explanation: `Applicant must be an active domiciled resident of ${stateName}.`
        }
      ],
      requiredDocuments: reqDocs.length > 0 ? reqDocs : ['Aadhaar Card', 'Identity Proof'],
      workflowStages: workflows.length > 0 ? workflows : ['Application Submitted', 'Document Verification', 'Approval'],
      expectedTimeline: timeline,
      fee,
      officialSource,
      tags: [category.toLowerCase(), 'government scheme', 'newly registered'],
      lifeEvents: ['Starting College', 'Looking for Employment'],
      isOnline: true,
      languages: ['English', 'Hindi'],
    });

    setIsAddModalOpen(false);
    setCreatedSuccess(created.name);
    // Reset form
    setName('');
    setDescription('');
    setEligibilitySummary('');
    setTimeout(() => setCreatedSuccess(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gov-blue uppercase tracking-wider mb-2">
            <span>System Administrator Console</span>
            <span>•</span>
            <span>Scalable Service Registry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gov-navy tracking-tight">
            Universal Service Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Register and configure new public schemes dynamically. Changes automatically generate live citizen application pages, rule evaluations, and workflow pipelines.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 bg-gov-blue hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Service</span>
        </button>
      </div>

      {createdSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Service "{createdSuccess}" successfully registered and published to the public catalog!</span>
          </div>
          <Link to="/services" className="underline text-emerald-900">
            View in Citizen Catalog →
          </Link>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search registry by name, department, or category..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-gov-blue"
          />
        </div>
        <span className="text-xs font-mono font-bold text-slate-500">
          {filteredServices.length} Registered Configurations
        </span>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Service ID</th>
                <th className="px-5 py-3.5">Service Name</th>
                <th className="px-5 py-3.5">Issuing Department</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Level</th>
                <th className="px-5 py-3.5">Required Proofs</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-gov-blue whitespace-nowrap">
                    {service.id}
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-900">
                    {service.name}
                  </td>
                  <td className="px-5 py-4 text-slate-600 truncate max-w-xs">
                    {service.department}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-semibold">
                      {service.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      service.level === 'Central'
                        ? 'bg-blue-50 text-gov-blue'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {service.level}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                    {service.requiredDocuments.length} Proofs
                  </td>
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <Link
                      to={`/services/${service.id}`}
                      className="text-xs font-bold text-gov-blue hover:underline inline-flex items-center gap-1"
                    >
                      <span>Preview Live</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Service Dynamic Builder Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-elevation border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-gov-blue flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Register New Public Scheme in GovFlow Engine
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dynamic schema ingestion automatically deploys user journeys
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateService} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Service / Scheme Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. National Apprenticeship Promotion Scheme (NAPS)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-gov-blue font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Issuing Ministry / Department *
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Ministry of Skill Development"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Education">Education</option>
                    <option value="Employment">Employment</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Housing">Housing</option>
                    <option value="Financial Assistance">Financial Assistance</option>
                    <option value="Business & MSME">Business & MSME</option>
                    <option value="Transport">Transport</option>
                    <option value="Identity & Certificates">Identity & Certificates</option>
                    <option value="Municipal Services">Municipal Services</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Government Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Central">Central</option>
                    <option value="State">State</option>
                    <option value="Local">Local</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Geographic Scope / State</label>
                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="All-India or specific state"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Description & Citizen Benefits
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed explanation of financial subvention, certification, or statutory rights..."
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Eligibility Summary
                  </label>
                  <input
                    type="text"
                    value={eligibilitySummary}
                    onChange={(e) => setEligibilitySummary(e.target.value)}
                    placeholder="e.g. Enrolled candidate, family income <= ₹3 Lakhs, domicile of India."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Income Rule Threshold (₹)
                  </label>
                  <input
                    type="number"
                    value={incomeLimit}
                    onChange={(e) => setIncomeLimit(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Expected Turnaround (SLA)
                  </label>
                  <input
                    type="text"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Required Documents (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={requiredDocsInput}
                    onChange={(e) => setRequiredDocsInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Workflow Stages (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={workflowInput}
                    onChange={(e) => setWorkflowInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gov-blue hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register & Publish Scheme</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
