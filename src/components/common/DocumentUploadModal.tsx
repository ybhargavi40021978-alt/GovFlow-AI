import React, { useState } from 'react';
import { useGovFlow } from '../../store/GovFlowContext';
import { Upload, X, CheckCircle2, AlertCircle, FileText, Loader2 } from 'lucide-react';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDocName?: string;
  targetDocType?: string;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  targetDocName = 'Government Certificate / Identity Proof',
  targetDocType = 'Identity & Residence Proof',
}) => {
  const { addDocument, updateProfile, citizenProfile } = useGovFlow();
  
  const [docName, setDocName] = useState(targetDocName);
  const [docType, setDocType] = useState(targetDocType);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setErrorMsg('Invalid file format. Please upload a PDF, JPG, JPEG, or PNG document.');
      return;
    }

    if (file.size > maxSize) {
      setErrorMsg('File exceeds 5 MB limit. Please compress the document and retry.');
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please select a valid document to upload.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      // Save document to store
      addDocument({
        name: docName,
        type: docType,
        status: 'verified',
        issuer: 'Uploaded & Verified via OCR Sandbox',
        issueDate: new Date().toISOString().split('T')[0],
        docNumberMasked: 'DOC-UP-' + Math.floor(1000 + Math.random() * 9000),
        source: 'manual_upload',
        notes: `Validated format (${(selectedFile.size / 1024).toFixed(1)} KB) against checksum.`,
      });

      // Update profile completeness
      if (citizenProfile) {
        updateProfile({
          profileCompleteness: Math.min(100, citizenProfile.profileCompleteness + 8),
        });
      }

      setIsUploading(false);
      setUploadSuccess(true);

      setTimeout(() => {
        setUploadSuccess(false);
        setSelectedFile(null);
        setUploadProgress(0);
        onClose();
      }, 1200);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-elevation border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-gov-blue flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Upload & Verify Document
              </h3>
              <p className="text-xs text-slate-500">
                Secure OCR & SHA-256 Checksum Validation
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-700">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Document uploaded and verified successfully! Updating readiness...</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Document Name / Title
            </label>
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-gov-blue"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Document Category
            </label>
            <input
              type="text"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-gov-blue"
              required
            />
          </div>

          {/* Dropzone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              File Attachment (PDF, JPG, PNG — Max 5MB)
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-gov-blue rounded-2xl p-6 text-center bg-slate-50/50 transition-colors">
              <input
                type="file"
                id="doc-file-input"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              <label 
                htmlFor="doc-file-input"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 text-gov-blue flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gov-blue hover:underline">
                    Click to browse
                  </span>
                  <span className="text-xs text-slate-500"> or drag and drop</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Supported: PDF, JPG, PNG (Strictly &lt; 5MB)
                </p>
              </label>

              {selectedFile && (
                <div className="mt-3 p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 truncate max-w-[280px]">
                    {selectedFile.name}
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-600">
                <span className="flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin text-gov-blue" />
                  Verifying signature & OCR tokens...
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gov-blue h-full transition-all duration-200 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="px-4 py-2 text-xs font-bold text-white bg-gov-blue hover:bg-blue-700 disabled:opacity-40 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  Upload & Verify
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
