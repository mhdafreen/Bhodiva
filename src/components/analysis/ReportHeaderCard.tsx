import React from 'react';
import { FileText, Calendar, Building, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { MedicalReportData } from '../../types/medicalReport';

interface ReportHeaderCardProps {
  report: MedicalReportData;
  activeLanguage: string;
}

export const ReportHeaderCard: React.FC<ReportHeaderCardProps> = ({ report, activeLanguage }) => {
  const hasOutliers = report.summary.outOfRangeCount > 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
      {/* Top Meta Details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              {report.metadata.reportCategory}
            </span>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {activeLanguage.toUpperCase()} Mode
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-accent-charcoal mt-2 mb-1">
            Clinical Lab Report Breakdown
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Educational translation & reference guide • Not a diagnosis
          </p>
        </div>

        {/* Patient / Lab Info Tags */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-600">
          {report.metadata.patientName && (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl font-medium">
              <FileText className="w-4 h-4 text-brand-600" />
              <span>{report.metadata.patientName}</span>
            </div>
          )}
          {report.metadata.reportDate && (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl font-medium">
              <Calendar className="w-4 h-4 text-brand-600" />
              <span>{report.metadata.reportDate}</span>
            </div>
          )}
          {report.metadata.labName && (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl font-medium">
              <Building className="w-4 h-4 text-brand-600" />
              <span>{report.metadata.labName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Numerical Stats Tally */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
            Total Parameters
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-800">
            {report.summary.totalTests}
          </span>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-0.5">
            Within Range
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-700">
            {report.summary.totalTests - report.summary.outOfRangeCount}
          </span>
        </div>

        <div className={`p-4 rounded-2xl border ${
          hasOutliers ? 'bg-amber-50/80 border-amber-200' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className={`text-[11px] font-bold uppercase tracking-wider block mb-0.5 ${
            hasOutliers ? 'text-amber-800' : 'text-slate-400'
          }`}>
            Outside Range
          </span>
          <span className={`text-2xl sm:text-3xl font-black ${
            hasOutliers ? 'text-amber-700' : 'text-slate-700'
          }`}>
            {report.summary.outOfRangeCount}
          </span>
        </div>

        <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-200/80">
          <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block mb-0.5">
            AI Range Verification
          </span>
          <span className="text-xs font-bold text-teal-900 flex items-center gap-1 mt-1">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            Lab-Calibrated
          </span>
        </div>
      </div>

      {/* Executive Layman Overview Narrative */}
      <div className="space-y-4 pt-1">
        <div className="bg-brand-50/50 p-5 rounded-2xl border border-brand-100/90 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>High-Level Summary</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            {report.summary.quickOverview}
          </p>
        </div>

        {/* Bullet Key Findings */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Important Highlights from this Document
          </h4>
          <div className="space-y-2">
            {report.summary.importantFindings.map((finding, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700"
              >
                <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{finding}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
