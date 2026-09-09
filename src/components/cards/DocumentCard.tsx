import React from 'react';
import { DocumentItem } from '../../types';
import { 
  FileCheck2, 
  AlertTriangle, 
  XCircle, 
  RotateCw, 
  Download, 
  Upload, 
  CloudDownload, 
  Building,
  Check
} from 'lucide-react';

interface DocumentCardProps {
  document: DocumentItem;
  onUploadClick?: () => void;
  onDigiLockerPull?: () => void;
}

export const getDocumentStatusBadge = (status: string) => {
  switch (status) {
    case 'verified':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
          <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
          Verified
        </span>
      );
    case 'expiring_soon':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          Expiring Soon
        </span>
      );
    case 'missing':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          Missing
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
          <RotateCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
          Verification Pending
        </span>
      );
  }
};

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onUploadClick,
  onDigiLockerPull,
}) => {
  return (
    <div className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between ${
      document.status === 'missing' 
        ? 'border-rose-200/90 bg-rose-50/20' 
        : document.status === 'expiring_soon'
        ? 'border-amber-200/90 bg-amber-50/20'
        : 'border-slate-200/90 hover:border-blue-300 hover:shadow-card'
    }`}>
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-gov-blue">
            <FileCheck2 className="w-5 h-5" />
          </div>
          {getDocumentStatusBadge(document.status)}
        </div>

        <h3 className="text-sm font-bold text-slate-900 mb-0.5">
          {document.name}
        </h3>
        <p className="text-[11px] font-semibold text-slate-500 mb-3">
          {document.type}
        </p>

        {/* Metadata info */}
        <div className="space-y-1.5 py-2.5 border-y border-slate-100 text-xs mb-3 text-slate-600">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Issuer:</span>
            <span className="font-medium text-slate-700 truncate max-w-[170px] text-right">
              {document.issuer}
            </span>
          </div>

          {document.docNumberMasked && (
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Reference:</span>
              <span className="font-mono text-slate-800 font-semibold">
                {document.docNumberMasked}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Source:</span>
            <span className={`px-1.5 py-0.2 rounded font-mono font-semibold text-[10px] ${
              document.source === 'digilocker'
                ? 'bg-blue-50 text-blue-700'
                : document.source === 'api_setu'
                ? 'bg-purple-50 text-purple-700'
                : 'bg-slate-100 text-slate-700'
            }`}>
              {document.source === 'digilocker' ? 'DigiLocker (Demo)' : document.source === 'api_setu' ? 'API Setu (Sandbox)' : 'Manual Upload'}
            </span>
          </div>
        </div>

        {document.notes && (
          <p className="text-[11px] text-slate-500 italic mb-4">
            {document.notes}
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex items-center gap-2">
        {document.status === 'missing' ? (
          <>
            <button
              type="button"
              onClick={onDigiLockerPull}
              className="flex-1 py-2 px-2.5 text-xs font-bold text-white bg-gov-blue hover:bg-blue-700 rounded-xl transition-colors flex items-center justify-center gap-1 shadow-sm"
            >
              <CloudDownload className="w-3.5 h-3.5" />
              <span>Fetch DigiLocker</span>
            </button>
            <button
              type="button"
              onClick={onUploadClick}
              className="py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload</span>
            </button>
          </>
        ) : (
          <div className="w-full flex items-center justify-between text-[11px]">
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Ready for Auto-Fill
            </span>
            <button
              type="button"
              onClick={onUploadClick}
              className="text-xs text-gov-blue font-bold hover:underline"
            >
              Re-upload / Update
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
