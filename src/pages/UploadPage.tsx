import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { MedicalDisclaimerBanner } from '../components/common/MedicalDisclaimerBanner';
import { CameraCaptureModal } from '../components/upload/CameraCaptureModal';
import { MultiPageOrganizer } from '../components/upload/MultiPageOrganizer';
import { PdfUploader } from '../components/upload/PdfUploader';
import { GalleryDropzone } from '../components/upload/GalleryDropzone';
import { ProcessingOverlay } from '../components/upload/ProcessingOverlay';
import { rotateImage } from '../utils/imageTransform';
import { analyzeMedicalReport, loadSampleReport } from '../services/geminiService';
import { addReportToVault } from '../services/vaultService';
import { ReportPage, QualityCheckResult, UploadMode } from '../types/upload';
import { Camera, Image, FileText, Sparkles, ShieldCheck, HelpCircle, KeyRound, AlertCircle, ArrowRight, X } from 'lucide-react';

export const UploadPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialMode: UploadMode = searchParams.get('mode') === 'camera' ? 'camera' : 'gallery';
  const [activeTab, setActiveTab] = useState<UploadMode>(initialMode);
  const [pages, setPages] = useState<ReportPage[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(initialMode === 'camera');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle new photo from live camera
  const handlePhotoCaptured = (dataUrl: string, quality: QualityCheckResult) => {
    const newPage: ReportPage = {
      id: `cam-${Date.now()}-${pages.length + 1}`,
      previewUrl: dataUrl,
      pageNumber: pages.length + 1,
      rotation: 0,
      name: `Camera Snapshot (Page ${pages.length + 1})`,
      size: Math.round(dataUrl.length * 0.75),
      quality,
      source: 'camera'
    };

    setPages(prev => [...prev, newPage]);
  };

  // Handle pages from gallery selection
  const handleImagesSelected = (newPages: ReportPage[]) => {
    setPages(prev => {
      const startNum = prev.length;
      const reindexed = newPages.map((p, idx) => ({
        ...p,
        pageNumber: startNum + idx + 1
      }));
      return [...prev, ...reindexed];
    });
  };

  // Handle pages from PDF extraction
  const handlePdfPagesExtracted = (pdfPages: ReportPage[]) => {
    setPages(prev => {
      const startNum = prev.length;
      const reindexed = pdfPages.map((p, idx) => ({
        ...p,
        pageNumber: startNum + idx + 1
      }));
      return [...prev, ...reindexed];
    });
  };

  // Rotate a specific page 90 degrees clockwise
  const handleRotatePage = async (pageId: string) => {
    const pageIndex = pages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) return;

    const page = pages[pageIndex];
    const nextRotation = (page.rotation + 90) % 360;

    try {
      const newUrl = await rotateImage(page.previewUrl, 90);
      setPages(prev => {
        const updated = [...prev];
        updated[pageIndex] = {
          ...page,
          previewUrl: newUrl,
          rotation: 0
        };
        return updated;
      });
    } catch (err) {
      setPages(prev => {
        const updated = [...prev];
        updated[pageIndex] = { ...page, rotation: nextRotation };
        return updated;
      });
    }
  };

  // Remove a page and re-index page numbers
  const handleRemovePage = (pageId: string) => {
    setPages(prev => {
      const filtered = prev.filter(p => p.id !== pageId);
      return filtered.map((p, idx) => ({
        ...p,
        pageNumber: idx + 1
      }));
    });
  };

  // Move page position in sequence
  const handleMovePage = (index: number, direction: 'left' | 'right') => {
    if (
      (direction === 'left' && index === 0) ||
      (direction === 'right' && index === pages.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    const reordered = [...pages];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const updated = reordered.map((p, idx) => ({
      ...p,
      pageNumber: idx + 1
    }));
    setPages(updated);
  };

  // Add another page launcher
  const handleAddAnotherPage = (mode: 'camera' | 'gallery') => {
    if (mode === 'camera') {
      setIsCameraOpen(true);
    } else {
      setActiveTab('gallery');
    }
  };

  // Confirm and start live Gemini AI analysis
  const handleConfirmAndAnalyze = async () => {
    if (pages.length === 0) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const pageDataUrls = pages.map(p => p.previewUrl);
      const report = await analyzeMedicalReport({
        pages: pageDataUrls,
        language: i18n.language
      });

      sessionStorage.setItem('bodhiva_active_report', JSON.stringify(report));
      addReportToVault(report);
      setIsProcessing(false);
      navigate(`/analysis/${report.id}`);
    } catch (err: any) {
      setIsProcessing(false);
      console.warn('Analysis error:', err);

      if (err.code === 'API_KEY_MISSING') {
        setApiKeyModalOpen(true);
      } else {
        setErrorMessage(err.message || 'Failed to process report with AI. Please check image clarity and try again.');
      }
    }
  };

  // Load demonstration sample in current language
  const handleLoadSampleDemo = () => {
    const sample = loadSampleReport(i18n.language);
    sessionStorage.setItem('bodhiva_active_report', JSON.stringify(sample));
    addReportToVault(sample);
    setApiKeyModalOpen(false);
    navigate(`/analysis/${sample.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <MedicalDisclaimerBanner compact />
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Document Ingestion Engine
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-accent-charcoal mt-3 mb-2 tracking-tight">
            {t('upload.title')}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            {t('upload.subtitle')}
          </p>
        </div>

        {/* Global Error Notice */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-700 font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Multi-Page Review Mode (if pages have already been added) */}
        {pages.length > 0 ? (
          <MultiPageOrganizer
            pages={pages}
            onRotatePage={handleRotatePage}
            onRemovePage={handleRemovePage}
            onMovePage={handleMovePage}
            onAddAnotherPage={handleAddAnotherPage}
            onConfirmAndAnalyze={handleConfirmAndAnalyze}
            isProcessing={isProcessing}
          />
        ) : (
          /* Initial Upload Selection View */
          <div className="space-y-6">
            {/* 3 Primary Input Method Switcher */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg p-2 sm:p-3">
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('camera');
                    setIsCameraOpen(true);
                  }}
                  className={`flex items-center justify-center gap-2 py-3.5 px-3 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
                    activeTab === 'camera'
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="truncate">{t('upload.cameraTab')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('gallery')}
                  className={`flex items-center justify-center gap-2 py-3.5 px-3 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
                    activeTab === 'gallery'
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Image className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="truncate">{t('upload.galleryTab')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('pdf')}
                  className={`flex items-center justify-center gap-2 py-3.5 px-3 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
                    activeTab === 'pdf'
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="truncate">{t('upload.pdfTab')}</span>
                </button>
              </div>
            </div>

            {/* Active Mode Panel */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-10">
              {activeTab === 'camera' && (
                <div className="text-center space-y-6 py-4">
                  <div className="w-20 h-20 rounded-3xl bg-teal-50 border border-teal-100 text-brand-600 flex items-center justify-center mx-auto shadow-inner">
                    <Camera className="w-10 h-10 animate-bounce" />
                  </div>
                  <div className="max-w-md mx-auto">
                    <h3 className="text-xl font-bold text-accent-charcoal mb-2">
                      Take a photo with your mobile camera
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Capture physical printed lab reports directly with our smart document guide.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-lg shadow-brand-600/25 transition-all inline-flex items-center gap-2.5"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Open Live Camera Viewfinder</span>
                  </button>
                </div>
              )}

              {activeTab === 'gallery' && (
                <GalleryDropzone onImagesSelected={handleImagesSelected} />
              )}

              {activeTab === 'pdf' && (
                <PdfUploader onPagesExtracted={handlePdfPagesExtracted} />
              )}

              {/* Guarantees bar */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-600" />
                  Ephemeral guest processing
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-600" />
                  Automatic blur & lighting check
                </span>
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-brand-600" />
                  Multi-page support
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Safety Charter Banner */}
        <MedicalDisclaimerBanner />
      </main>

      {/* Live Camera Viewfinder Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onPhotoCaptured={handlePhotoCaptured}
      />

      {/* Processing Animation Overlay */}
      {isProcessing && <ProcessingOverlay pageCount={pages.length} />}

      {/* Transparent API Key Notification Modal */}
      {apiKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-brand-600 flex items-center justify-center">
                <KeyRound className="w-6 h-6" />
              </div>
              <button
                onClick={() => setApiKeyModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-accent-charcoal">
                Gemini API Key Required for Live Extraction
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To extract and analyze physical documents with live Google Gemini Multimodal Vision, add your key to <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono font-bold text-brand-700">.env</code> as <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono font-bold text-brand-700">VITE_GEMINI_API_KEY</code> or on Vercel as <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono font-bold text-brand-700">GEMINI_API_KEY</code>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200/80 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
                Live Demonstration Available
              </span>
              <p className="text-xs text-brand-900 leading-relaxed">
                Would you like to explore an authentic, medically accurate Complete Blood Count (CBC) report analyzed in <strong>{i18n.language.toUpperCase()}</strong>?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleLoadSampleDemo}
                className="w-full sm:flex-1 px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <span>View Sample Report ({i18n.language.toUpperCase()})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setApiKeyModalOpen(false)}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
