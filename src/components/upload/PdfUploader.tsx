import React, { useState, useRef } from 'react';
import { FileText, AlertCircle, RefreshCw, CheckCircle, Trash2 } from 'lucide-react';
import { extractPagesFromPdf, ExtractedPdfPage } from '../../utils/pdfExtractor';
import { inspectImageQuality } from '../../utils/imageQuality';
import { ReportPage } from '../../types/upload';

interface PdfUploaderProps {
  onPagesExtracted: (pages: ReportPage[]) => void;
}

export const PdfUploader: React.FC<PdfUploaderProps> = ({ onPagesExtracted }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const MAX_FILE_SIZE_MB = 25;

  const handleFile = async (file: File) => {
    setErrorMessage(null);

    // Validate type
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('Please select a valid PDF diagnostic report file.');
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrorMessage(`PDF file is too large. Maximum supported size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setSelectedFile(file);
    setIsExtracting(true);
    setProgress({ current: 0, total: 1 });

    try {
      const extracted: ExtractedPdfPage[] = await extractPagesFromPdf(
        file,
        (current, total) => setProgress({ current, total })
      );

      if (extracted.length === 0) {
        setErrorMessage('Could not render pages from this PDF. Please check if the file is encrypted or damaged.');
        setIsExtracting(false);
        return;
      }

      // Convert extracted PDF pages into standard ReportPage objects with quality checks
      const reportPages: ReportPage[] = [];
      for (const p of extracted) {
        const quality = await inspectImageQuality(p.dataUrl);
        reportPages.push({
          id: `pdf-page-${Date.now()}-${p.pageNumber}`,
          file,
          previewUrl: p.dataUrl,
          pageNumber: p.pageNumber,
          rotation: 0,
          name: `${file.name} (Page ${p.pageNumber})`,
          size: Math.round(file.size / extracted.length),
          quality,
          source: 'pdf'
        });
      }

      onPagesExtracted(reportPages);
    } catch (err: any) {
      console.error('PDF extraction failed:', err);
      setErrorMessage(
        err.name === 'PasswordException'
          ? 'This PDF report is password protected. Please unlock it before uploading.'
          : 'Failed to process PDF report. Please try converting it to images or upload via camera.'
      );
    } finally {
      setIsExtracting(false);
      setProgress(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Dropzone Container */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isExtracting && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-brand-500 bg-brand-50/80 scale-[1.01]'
            : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50/70 bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
            <FileText className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-lg font-bold text-accent-charcoal mb-1">
              Drag & Drop your Lab PDF here
            </h4>
            <p className="text-xs sm:text-sm text-slate-500">
              or <span className="text-brand-600 font-semibold underline">browse files</span> on your computer or mobile
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-4 text-xs text-slate-400">
            <span>Standard PDF reports</span>
            <span>•</span>
            <span>Up to {MAX_FILE_SIZE_MB}MB</span>
            <span>•</span>
            <span>Multi-page supported</span>
          </div>
        </div>
      </div>

      {/* Extraction in progress */}
      {isExtracting && (
        <div className="p-6 rounded-2xl bg-brand-50/80 border border-brand-200/80 text-brand-950 flex flex-col items-center justify-center space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2 font-bold text-sm">
            <RefreshCw className="w-4 h-4 animate-spin text-brand-600" />
            <span>
              Extracting and validating PDF pages {progress ? `(${progress.current} of ${progress.total})` : ''}...
            </span>
          </div>
          <div className="w-full max-w-xs bg-brand-200/60 rounded-full h-2 overflow-hidden">
            <div
              className="bg-brand-600 h-full transition-all duration-300"
              style={{
                width: progress && progress.total > 0
                  ? `${Math.round((progress.current / progress.total) * 100)}%`
                  : '50%'
              }}
            />
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={handleClear}
            className="text-rose-700 font-bold hover:underline flex-shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Selected File Badge */}
      {selectedFile && !isExtracting && !errorMessage && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 truncate">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold text-slate-800 truncate">{selectedFile.name}</span>
            <span className="text-slate-400 flex-shrink-0">
              ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
            </span>
          </div>
          <button
            onClick={handleClear}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-200/60 transition"
            title="Remove file"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
