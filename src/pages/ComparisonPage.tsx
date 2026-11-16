import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { MedicalDisclaimerBanner } from '../components/common/MedicalDisclaimerBanner';
import { getVaultReports } from '../services/vaultService';
import { compareReports, ReportComparisonResult } from '../utils/reportComparison';
import { MedicalReportData } from '../types/medicalReport';
import {
  GitCompare,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  AlertTriangle,
  Calendar,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export const ComparisonPage: React.FC = () => {
  const { i18n } = useTranslation();
  const [vaultReports, setVaultReports] = useState<MedicalReportData[]>([]);
  const [prevReportId, setPrevReportId] = useState<string>('');
  const [currReportId, setCurrReportId] = useState<string>('');

  useEffect(() => {
    const list = getVaultReports(i18n.language);
    setVaultReports(list);

    if (list.length >= 2) {
      // Pick earlier report for prev, later for curr
      setPrevReportId(list[1].id);
      setCurrReportId(list[0].id);
    } else if (list.length === 1) {
      setCurrReportId(list[0].id);
    }
  }, [i18n.language]);

  const previousReport = useMemo(() => {
    return vaultReports.find(r => r.id === prevReportId) || null;
  }, [vaultReports, prevReportId]);

  const currentReport = useMemo(() => {
    return vaultReports.find(r => r.id === currReportId) || null;
  }, [vaultReports, currReportId]);

  const comparisonResult: ReportComparisonResult | null = useMemo(() => {
    if (!previousReport || !currentReport || previousReport.id === currentReport.id) {
      return null;
    }
    return compareReports(previousReport, currentReport, i18n.language);
  }, [previousReport, currentReport, i18n.language]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <MedicalDisclaimerBanner compact />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Two-Report Delta Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-accent-charcoal tracking-tight">
            Compare Medical Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Track how your laboratory values have changed over time with unit verification and clinical direction awareness.
          </p>
        </div>

        {/* Report Selectors */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Select Reports to Compare
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Previous Report Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                1. Earlier Baseline Report
              </label>
              <select
                value={prevReportId}
                onChange={(e) => setPrevReportId(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="">Choose earlier report...</option>
                {vaultReports.map((r) => (
                  <option key={`prev-${r.id}`} value={r.id}>
                    {r.metadata.reportCategory} — {r.metadata.reportDate || 'No date'}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Report Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                2. Later / Current Report
              </label>
              <select
                value={currReportId}
                onChange={(e) => setCurrReportId(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="">Choose later report...</option>
                {vaultReports.map((r) => (
                  <option key={`curr-${r.id}`} value={r.id}>
                    {r.metadata.reportCategory} — {r.metadata.reportDate || 'No date'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {prevReportId === currReportId && prevReportId !== '' && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Please select two different reports to perform historical trajectory comparison.</span>
            </div>
          )}
        </div>

        {/* Comparison Output */}
        {comparisonResult ? (
          <div className="space-y-6">
            {/* Overview Card */}
            <div className="bg-gradient-to-br from-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Historical Trajectory Summary</span>
              </div>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                {comparisonResult.overallSummary}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  Earlier: {comparisonResult.previousReport.date || 'N/A'}
                </span>
                <span>&rarr;</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  Recent: {comparisonResult.currentReport.date || 'N/A'}
                </span>
                <span>•</span>
                <span>{comparisonResult.matchedParameters.length} common parameters analyzed</span>
              </div>
            </div>

            {/* Parameter Trajectory Cards */}
            <div className="space-y-4">
              <h3 className="text-xl font-black text-accent-charcoal">
                Parameter-by-Parameter Changes
              </h3>

              <div className="space-y-4">
                {comparisonResult.matchedParameters.map((item, idx) => {
                  const isUp = item.trajectory === 'increased';
                  const isDown = item.trajectory === 'decreased';
                  const isSame = item.trajectory === 'stable';
                  const isMismatch = item.isUnitMismatch;

                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-4 hover:border-brand-300 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                            {item.category}
                          </span>
                          <h4 className="text-lg sm:text-xl font-extrabold text-accent-charcoal mt-1">
                            {item.testName}
                          </h4>
                        </div>

                        {/* Delta Badge */}
                        <div>
                          {!isMismatch && item.delta !== null ? (
                            <span
                              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm ${
                                item.isFavorable === true
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : item.isFavorable === false
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-slate-100 text-slate-800 border border-slate-200'
                              }`}
                            >
                              {isUp && <ArrowUpRight className="w-4 h-4" />}
                              {isDown && <ArrowDownRight className="w-4 h-4" />}
                              {isSame && <Minus className="w-4 h-4" />}
                              <span>
                                {item.delta > 0 ? `+${item.delta}` : item.delta} {item.currentUnit}
                              </span>
                              {item.deltaPercent !== null && (
                                <span className="text-[10px] opacity-75">
                                  ({item.deltaPercent > 0 ? `+${item.deltaPercent}` : item.deltaPercent}%)
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold border border-amber-200">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Unit Difference
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Values Comparison Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-1">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                            Earlier Value ({comparisonResult.previousReport.date || 'Earlier'})
                          </span>
                          <span className="text-xl sm:text-2xl font-black text-slate-700">
                            {item.previousValueString} <span className="text-xs font-semibold text-slate-400">{item.previousUnit}</span>
                          </span>
                        </div>

                        <div className="bg-brand-50/70 p-4 rounded-2xl border border-brand-200/70">
                          <span className="text-[11px] font-bold text-brand-800 uppercase tracking-wider block mb-0.5">
                            Recent Value ({comparisonResult.currentReport.date || 'Recent'})
                          </span>
                          <span className="text-xl sm:text-2xl font-black text-brand-950">
                            {item.currentValueString} <span className="text-xs font-semibold text-brand-700">{item.currentUnit}</span>
                          </span>
                        </div>

                        <div className="col-span-2 sm:col-span-1 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                            Standard Reference
                          </span>
                          <span className="text-sm font-bold text-slate-700">
                            {item.referenceRange ? `${item.referenceRange} ${item.currentUnit || ''}` : 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Trajectory Explanation Narrative */}
                      <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 text-xs sm:text-sm text-slate-700 leading-relaxed flex items-start gap-2.5">
                        <TrendingUp className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                        <p>{item.trajectoryExplanation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm space-y-3">
            <GitCompare className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">
              Select two reports to visualize trends
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              Choose an earlier baseline report and a more recent test report from your vault dropdown above.
            </p>
          </div>
        )}

        {/* Safety Charter Banner */}
        <MedicalDisclaimerBanner />
      </main>

      <Footer />
    </div>
  );
};
