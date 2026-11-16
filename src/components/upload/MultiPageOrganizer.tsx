import React from 'react';
import { RotateCw, Trash2, ArrowLeft, ArrowRight, Plus, AlertTriangle, CheckCircle2, FileText, Camera } from 'lucide-react';
import { ReportPage } from '../../types/upload';

interface MultiPageOrganizerProps {
  pages: ReportPage[];
  onRotatePage: (pageId: string) => void;
  onRemovePage: (pageId: string) => void;
  onMovePage: (index: number, direction: 'left' | 'right') => void;
  onAddAnotherPage: (mode: 'camera' | 'gallery') => void;
  onConfirmAndAnalyze: () => void;
  isProcessing?: boolean;
}

export const MultiPageOrganizer: React.FC<MultiPageOrganizerProps> = ({
  pages,
  onRotatePage,
  onRemovePage,
  onMovePage,
  onAddAnotherPage,
  onConfirmAndAnalyze,
  isProcessing = false
}) => {
  const hasWarnings = pages.some(p => p.quality && p.quality.warnings.length > 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
            <h3 className="text-xl font-extrabold text-accent-charcoal">
              Review Report Pages ({pages.length} {pages.length === 1 ? 'Page' : 'Pages'} Added)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ensure pages are in the correct sequence and orientation. Rotate if sideways.
          </p>
        </div>

        {/* Add Page Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddAnotherPage('camera')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-bold border border-brand-200 transition"
          >
            <Camera className="w-3.5 h-3.5 text-brand-600" />
            <span>Add via Camera</span>
          </button>
          <button
            onClick={() => onAddAnotherPage('gallery')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add File</span>
          </button>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {pages.map((page, index) => {
          const isFirst = index === 0;
          const isLast = index === pages.length - 1;
          const warnings = page.quality?.warnings || [];

          return (
            <div
              key={page.id}
              className="bg-slate-50/80 rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group"
            >
              {/* Card Header */}
              <div className="px-4 py-2.5 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-brand-600" />
                  Page {index + 1}
                </span>
                <span className="text-[11px] font-medium text-slate-500 uppercase">
                  {page.source}
                </span>
              </div>

              {/* Thumbnail Container */}
              <div className="relative aspect-[3/4] bg-slate-900/5 flex items-center justify-center p-3 overflow-hidden">
                <img
                  src={page.previewUrl}
                  alt={`Report page ${index + 1}`}
                  style={{ transform: `rotate(${page.rotation}deg)` }}
                  className="max-h-full max-w-full object-contain rounded-lg shadow transition-transform duration-300"
                />

                {/* Quality Warning Pill Overlay */}
                {warnings.length > 0 && (
                  <div className="absolute bottom-2 left-2 right-2 bg-amber-950/90 text-amber-200 text-[11px] p-2 rounded-xl backdrop-blur-sm border border-amber-500/40 shadow-lg flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2 leading-tight">
                      {warnings[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Controls */}
              <div className="p-3 bg-white border-t border-slate-200/80 flex items-center justify-between gap-1 text-slate-600">
                {/* Reorder Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onMovePage(index, 'left')}
                    disabled={isFirst}
                    className={`p-1.5 rounded-lg border text-xs transition ${
                      isFirst
                        ? 'opacity-30 cursor-not-allowed border-slate-200'
                        : 'hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                    title="Move page earlier"
                    aria-label="Move earlier"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onMovePage(index, 'right')}
                    disabled={isLast}
                    className={`p-1.5 rounded-lg border text-xs transition ${
                      isLast
                        ? 'opacity-30 cursor-not-allowed border-slate-200'
                        : 'hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                    title="Move page later"
                    aria-label="Move later"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Rotate Button */}
                <button
                  onClick={() => onRotatePage(page.id)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-300 text-xs font-semibold transition"
                  title="Rotate 90 degrees"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Rotate</span>
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => onRemovePage(page.id)}
                  className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                  title="Remove this page"
                  aria-label="Remove page"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advisory Alert if Any Warning is Present */}
      {hasWarnings && (
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 flex items-start gap-3 text-xs sm:text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Quality Inspection Notice</span>
            <p className="text-amber-900/90">
              One or more pages have lighting or sharpness alerts. Our AI can still process these, but if any numbers were blurred, you can retake them for the most accurate results.
            </p>
          </div>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <CheckCircle2 className="w-4 h-4 text-brand-600" />
          <span>{pages.length} document {pages.length === 1 ? 'page' : 'pages'} verified & ready for extraction</span>
        </div>

        <button
          onClick={onConfirmAndAnalyze}
          disabled={isProcessing || pages.length === 0}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-extrabold text-base shadow-xl shadow-brand-600/25 transition-all flex items-center justify-center gap-2.5 transform hover:-translate-y-0.5"
        >
          <span>Confirm & Analyze Report Now</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
