import React, { useState } from 'react';
import { useGovFlow } from '../store/GovFlowContext';
import { DocumentCard } from '../components/cards/DocumentCard';
import { DocumentUploadModal } from '../components/common/DocumentUploadModal';
import { 
  FileCheck2, 
  Upload, 
  CloudDownload, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const { documents, pullFromDigiLocker } = useGovFlow();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [targetDoc, setTargetDoc] = useState<{ name: string; type: string } | undefined>();

  const filterOptions = [
    { id: 'all', label: `All Proofs (${documents.length})` },
    { id: 'verified', label: `Verified (${documents.filter(d => d.status === 'verified').length})` },
    { id: 'expiring_soon', label: `Expiring Soon (${documents.filter(d => d.status === 'expiring_soon').length})` },
    { id: 'missing', label: `Missing (${documents.filter(d => d.status === 'missing').length})` },
  ];

  const filteredDocs = documents.filter(doc => {
    if (selectedFilter !== 'all' && doc.status !== selectedFilter) return false;
    return true;
  });

  const handleOpenUpload = (name?: string, type?: string) => {
    setTargetDoc(name && type ? { name, type } : undefined);
    setIsUploadModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gov-blue uppercase tracking-wider mb-2">
            <span>Document Intelligence</span>
            <span>•</span>
            <span>DigiLocker & API Setu Vault</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gov-navy tracking-tight">
            Your Civic Documents
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Centralized document intelligence keeps your certificates verified and up to date, eliminating repeated physical uploads across ministries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => pullFromDigiLocker('Domicile / Residence Certificate')}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <CloudDownload className="w-4 h-4 text-cyan-300" />
            <span>Fetch from DigiLocker (Demo)</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenUpload()}
            className="px-4 py-2.5 bg-gov-blue hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Security & Verification Guarantee Banner */}
      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-gov-blue flex-shrink-0" />
          <div>
            <h4 className="font-bold text-slate-900">
              Federated Identity & Zero-Knowledge Verification
            </h4>
            <p className="text-slate-600 mt-0.5">
              Documents are fetched directly from issuing authorities (UIDAI, NSDL, State Revenue Boards) using cryptographic signatures.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-gov-blue font-bold px-2.5 py-1 bg-white rounded-lg border border-blue-200 shadow-sm whitespace-nowrap">
          SHA-256 Verified
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelectedFilter(opt.id)}
            className={`px-4 py-2 text-xs font-bold border-b-2 -mb-px transition-colors whitespace-nowrap ${
              selectedFilter === opt.id
                ? 'border-gov-blue text-gov-blue font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            onUploadClick={() => handleOpenUpload(doc.name, doc.type)}
            onDigiLockerPull={() => pullFromDigiLocker(doc.type)}
          />
        ))}
      </div>

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        targetDocName={targetDoc?.name}
        targetDocType={targetDoc?.type}
      />
    </div>
  );
};
