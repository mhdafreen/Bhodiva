import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { MedicalDisclaimerBanner } from '../components/common/MedicalDisclaimerBanner';
import { getVaultReports, deleteReportFromVault } from '../services/vaultService';
import { MedicalReportData } from '../types/medicalReport';
import {
  FileText,
  Calendar,
  Building,
  Upload,
  GitCompare,
  Trash2,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  HeartPulse
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [reports, setReports] = useState<MedicalReportData[]>([]);

  useEffect(() => {
    const list = getVaultReports(i18n.language);
    setReports(list);
  }, [i18n.language]);

  const handleDelete = (reportId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this report from your vault?')) {
      const updated = deleteReportFromVault(reportId, i18n.language);
      setReports(updated);
    }
  };

  const handleOpenReport = (report: MedicalReportData) => {
    sessionStorage.setItem('bodhiva_active_report', JSON.stringify(report));
    navigate(`/analysis/${report.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <MedicalDisclaimerBanner compact />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Personal Health Vault • Private Session</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome to Your Health Records
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Access your previous diagnostic lab results, compare historical test trends over time, and understand how your health metrics evolve.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              to="/upload"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-teal-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Upload className="w-4 h-4" />
              <span>Analyze New Report</span>
            </Link>

            <Link
              to="/compare"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm transition-all"
            >
              <GitCompare className="w-4 h-4" />
              <span>Compare Reports</span>
            </Link>
          </div>
        </div>

        {/* Quick Access Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-brand-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Vault Records</span>
              <h4 className="text-xl font-black text-slate-800">{reports.length} Reports</h4>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Active Language</span>
              <h4 className="text-xl font-black text-slate-800">{i18n.language.toUpperCase()}</h4>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Data Retention</span>
              <h4 className="text-xl font-black text-slate-800">Private & Local</h4>
            </div>
          </div>
        </div>

        {/* Previously Uploaded Reports List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-accent-charcoal">
              Your Medical Reports ({reports.length})
            </h2>
            <Link
              to="/compare"
              className="text-xs font-bold text-brand-700 hover:underline flex items-center gap-1"
            >
              <span>Track changes across dates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {reports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {reports.map((r) => {
                const outOfRange = r.summary.outOfRangeCount;
                return (
                  <div
                    key={r.id}
                    onClick={() => handleOpenReport(r)}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-brand-300 p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 group"
                  >
                    <div>
                      {/* Top tags */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                        <span className="font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200/60">
                          {r.metadata.reportCategory}
                        </span>
                        <div className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{r.metadata.reportDate || 'Date: N/A'}</span>
                        </div>
                      </div>

                      {/* Title & Lab */}
                      <div className="pt-3">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                          {r.metadata.reportCategory}
                        </h3>
                        {r.metadata.labName && (
                          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                            <Building className="w-3.5 h-3.5 text-slate-400" />
                            <span>{r.metadata.labName}</span>
                          </p>
                        )}
                      </div>

                      {/* Summary Snippet */}
                      <p className="text-xs text-slate-600 line-clamp-2 mt-3 leading-relaxed">
                        {r.summary.quickOverview}
                      </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        {outOfRange > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            {outOfRange} out of range
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            All normal
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleDelete(r.id, e)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete report"
                          aria-label="Delete report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="flex items-center gap-1 text-xs font-bold text-brand-700 group-hover:translate-x-0.5 transition-transform">
                          <span>View</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm space-y-4">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">
                Your Health Vault is Empty
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                Upload your first laboratory report to store and compare results privately.
              </p>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-bold text-sm shadow-md"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Report Now</span>
              </Link>
            </div>
          )}
        </div>

        {/* Safety Charter Banner */}
        <MedicalDisclaimerBanner />
      </main>

      <Footer />
    </div>
  );
};
