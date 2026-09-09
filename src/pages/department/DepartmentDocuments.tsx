import React, { useState } from 'react';
import { useGovFlow } from '../../store/GovFlowContext';
import { DocumentItem, DocumentStatus } from '../../types';
import { getDocumentStatusBadge } from '../../components/cards/DocumentCard';
import { 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Eye, 
  ShieldCheck, 
  Search,
  Filter
} from 'lucide-react';

export const DepartmentDocuments: React.FC = () => {
  const { currentUser, allDocuments, updateDocumentStatus } = useGovFlow();
  const documents = allDocuments;
  const [filter, setFilter] = useState<string>('all');
  const [inspectDoc, setInspectDoc] = useState<DocumentItem | null>(null);

  const filteredDocs = documents.filter(d => {
    if (filter !== 'all' && d.status !== filter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Document Validation & Registry Queue
          </h2>
          <p className="text-xs text-slate-500">
            Audit citizen-uploaded documents, inspect digital signatures, and approve proofs for scheme auto-fills.
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          DigiLocker OCR Sync Active
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        {[
          { id: 'all', label: `All Documents (${documents.length})` },
          { id: 'verified', label: `Verified (${documents.filter(d => d.status === 'verified').length})` },
          { id: 'expiring_soon', label: `Expiring (${documents.filter(d => d.status === 'expiring_soon').length})` },
          { id: 'missing', label: `Missing (${documents.filter(d => d.status === 'missing').length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`px-3 py-1.5 text-xs font-bold border-b-2 -mb-px transition-colors ${
              filter === t.id
                ? 'border-gov-blue text-gov-blue font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-5 py-3.5">Document Title</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Source</th>
              <th className="px-5 py-3.5">Issuer / Authority</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDocs.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4 font-bold text-slate-800">
                  {doc.name}
                </td>
                <td className="px-5 py-4 text-slate-600 font-medium">
                  {doc.type}
                </td>
                <td className="px-5 py-4">
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-100 text-slate-700">
                    {doc.source}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-500 text-[11px]">
                  {doc.issuer}
                </td>
                <td className="px-5 py-4">
                  {getDocumentStatusBadge(doc.status)}
                </td>
                <td className="px-5 py-4 text-right space-x-2">
                  {doc.status !== 'verified' ? (
                    <button
                      type="button"
                      onClick={() => updateDocumentStatus(doc.id, 'verified', `Verified by ${currentUser?.name || 'Officer Desk'}`)}
                      className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-colors"
                    >
                      Verify
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => updateDocumentStatus(doc.id, 'expiring_soon', 'Flagged by Officer desk')}
                      className="px-3 py-1 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-600 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Flag
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
