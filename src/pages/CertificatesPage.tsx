import React, { useState } from 'react';
import { useGovFlow } from '../store/GovFlowContext';
import { ServiceCard } from '../components/cards/ServiceCard';
import { Link } from 'react-router-dom';
import { 
  Award, 
  Search, 
  MapPin, 
  FileCheck2, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  ExternalLink,
  Info
} from 'lucide-react';

interface CertificateDefinition {
  title: string;
  category: string;
  issuingAuthority: string;
  authorityType: 'State Revenue' | 'Municipal / Health' | 'Judicial / Police' | 'Medical Board';
  timeline: string;
  keyRequirements: string[];
  serviceId?: string;
  state: string;
}

export const CertificatesPage: React.FC = () => {
  const { services, currentUser, citizenProfile } = useGovFlow();
  const [selectedState, setSelectedState] = useState<string>(citizenProfile?.address?.state || 'Karnataka');
  const [searchQuery, setSearchQuery] = useState('');

  const indianStates = [
    'Karnataka',
    'Maharashtra',
    'Tamil Nadu',
    'Telangana',
    'Andhra Pradesh',
    'Delhi',
    'Uttar Pradesh',
    'Gujarat',
    'West Bengal',
    'Punjab'
  ];

  const certificatesCatalogue: CertificateDefinition[] = [
    {
      title: 'Birth Certificate',
      category: 'Vital Statistics',
      issuingAuthority: 'Municipal Corporation / Town Panchayat / Village Health Sub-Centre',
      authorityType: 'Municipal / Health',
      timeline: '3 - 7 working days',
      keyRequirements: ['Hospital Birth Discharge Summary / Form-1', 'Parents Aadhaar Cards', 'Marriage Registration Certificate'],
      serviceId: 'SRV-CERT-019',
      state: 'All-India'
    },
    {
      title: 'Death Certificate',
      category: 'Vital Statistics',
      issuingAuthority: 'Municipal Health Officer / Registrar of Births and Deaths',
      authorityType: 'Municipal / Health',
      timeline: '3 - 5 working days',
      keyRequirements: ['Hospital Cause of Death Medical Certificate', 'Cremation / Burial Ground Receipt', 'Deceased Aadhaar Card'],
      serviceId: 'SRV-CERT-019',
      state: 'All-India'
    },
    {
      title: 'Marriage Registration Certificate',
      category: 'Legal & Family',
      issuingAuthority: 'Sub-Registrar Office (Inspector General of Registration)',
      authorityType: 'State Revenue',
      timeline: '7 - 14 working days',
      keyRequirements: ['Proof of Marriage (Wedding Card / Temple Receipt)', 'Age & Address Proof of Bride & Groom', 'Witness Identity Proofs (3 witnesses)'],
      state: 'All-India'
    },
    {
      title: 'Income & Asset Certificate',
      category: 'Revenue & Finance',
      issuingAuthority: 'Tehsildar / Taluk Executive Magistrate',
      authorityType: 'State Revenue',
      timeline: '7 - 10 working days',
      keyRequirements: ['Salary Slip / Income Tax Return / Employer Affidavit', 'Aadhaar Card', 'Ration Card / Recent Electricity Bill'],
      serviceId: 'SRV-CERT-020',
      state: 'Karnataka'
    },
    {
      title: 'Domicile / Nativity Certificate',
      category: 'Citizenship & Residence',
      issuingAuthority: 'Sub-Divisional Magistrate (SDM) / Tehsildar',
      authorityType: 'State Revenue',
      timeline: '7 - 14 working days',
      keyRequirements: ['Proof of continuous stay for 7+ years', 'School Study Certificates', 'Parental Land / House Tax Receipts'],
      serviceId: 'SRV-CERT-022',
      state: 'All-India'
    },
    {
      title: 'Caste / Community Certificate',
      category: 'Affirmative Action',
      issuingAuthority: 'Revenue Inspector / Tehsildar / Assistant Commissioner',
      authorityType: 'State Revenue',
      timeline: '10 - 15 working days',
      keyRequirements: ['School Transfer Certificate (TC) mentioning caste', 'Family Tree (Vamsha Vruksha) Affidavit', 'Aadhaar Card'],
      serviceId: 'SRV-CERT-021',
      state: 'Karnataka'
    },
    {
      title: 'Unique Disability ID (UDID) & Medical Certificate',
      category: 'Welfare & Inclusion',
      issuingAuthority: 'District Medical Authority / Chief Medical Officer (CMO)',
      authorityType: 'Medical Board',
      timeline: '15 - 30 working days',
      keyRequirements: ['Government Hospital Medical Assessment', 'Recent Color Passport Photo', 'Aadhaar Card'],
      serviceId: 'SRV-CERT-023',
      state: 'All-India'
    },
    {
      title: 'Character & Background Verification Certificate',
      category: 'Police & Public Safety',
      issuingAuthority: 'District Superintendent of Police / City Police Commissionerate',
      authorityType: 'Judicial / Police',
      timeline: '7 - 14 working days',
      keyRequirements: ['Aadhaar Card', 'Address Proof', 'No Criminal Record Verification through CCTNS database'],
      state: 'All-India'
    },
    {
      title: 'Solvency Certificate',
      category: 'Commercial & Tenders',
      issuingAuthority: 'District Collector / Deputy Commissioner (Revenue)',
      authorityType: 'State Revenue',
      timeline: '14 - 21 working days',
      keyRequirements: ['Immovable Property Valuation Report by Approved Valuer', 'Encumbrance Certificate (15 Years)', 'Latest Land Tax Receipts'],
      state: 'All-India'
    },
    {
      title: 'Residential Status Certificate (Local Body)',
      category: 'Residence Verification',
      issuingAuthority: 'Gram Panchayat Secretary / Ward Revenue Inspector',
      authorityType: 'Municipal / Health',
      timeline: '3 - 5 working days',
      keyRequirements: ['Aadhaar Card', 'Electricity Meter Bill / Municipal Property Tax Challan'],
      state: 'All-India'
    }
  ];

  const filteredCerts = certificatesCatalogue.filter(c => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = c.title.toLowerCase().includes(q);
      const matchesAuth = c.issuingAuthority.toLowerCase().includes(q);
      const matchesCat = c.category.toLowerCase().includes(q);
      if (!matchesTitle && !matchesAuth && !matchesCat) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-gov-blue uppercase tracking-wider mb-2">
          <Award className="w-4 h-4 text-gov-blue" />
          <span>Statutory Certificates Registry</span>
          <span>•</span>
          <span>Authoritative Department Routing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gov-navy tracking-tight">
          Government Certificates & Statutory Records
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-3xl leading-relaxed">
          GovFlow AI automatically maps your resident location to the authoritative issuing officer (Tehsildar, Municipal Registrar, District Medical Board, or Police Commissionerate) and orchestrates digital proofs.
        </p>
      </div>

      {/* Jurisdiction Locator Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-blue-50 p-5 rounded-2xl border border-blue-200/70 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gov-blue text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Issuing Jurisdiction Router
            </h3>
            <p className="text-xs text-slate-600">
              Authority rules and digital fee structures adapt dynamically based on your state.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Your State:</span>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-gov-blue"
          >
            {indianStates.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search certificates (e.g. Birth, Income, Caste, Domicile, Disability, Solvency)..."
          className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-gov-blue shadow-sm"
        />
      </div>

      {/* Certificates Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCerts.map((cert, index) => {
          const matchedService = services.find(s => s.id === cert.serviceId);

          return (
            <div 
              key={index}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-card-hover transition-all duration-200 p-6 flex flex-col justify-between"
            >
              <div>
                {/* Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
                    {cert.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    cert.authorityType === 'State Revenue'
                      ? 'bg-blue-50 text-gov-blue border border-blue-200'
                      : cert.authorityType === 'Municipal / Health'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : cert.authorityType === 'Medical Board'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {cert.authorityType}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 leading-snug mb-1">
                  {cert.title}
                </h3>

                {/* Authoritative Issuing Department */}
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 mb-3 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Authoritative Issuing Body in {selectedState}:
                  </span>
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span>{cert.issuingAuthority}</span>
                  </p>
                </div>

                {/* Requirements Checklist */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Mandatory Required Proofs:
                  </span>
                  {cert.keyRequirements.map((req, rIdx) => (
                    <div key={rIdx} className="flex items-start gap-1.5 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500 font-medium">
                  Expected Timeline: <strong className="text-slate-800">{cert.timeline}</strong>
                </span>

                {matchedService ? (
                  <Link
                    to={`/services/${matchedService.id}`}
                    className="py-2 px-4 bg-gov-blue text-white hover:bg-blue-700 text-xs font-bold rounded-xl transition-colors shadow-sm"
                  >
                    Apply with Auto-fill →
                  </Link>
                ) : (
                  <Link
                    to={`/services?category=Identity%20%26%20Certificates&q=${encodeURIComponent(cert.title)}`}
                    className="py-2 px-3 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold rounded-xl transition-colors"
                  >
                    View Official Flow
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
