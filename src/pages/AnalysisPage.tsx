import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { MedicalDisclaimerBanner } from '../components/common/MedicalDisclaimerBanner';
import { ReportHeaderCard } from '../components/analysis/ReportHeaderCard';
import { ReportFilters } from '../components/analysis/ReportFilters';
import { TestResultCard } from '../components/analysis/TestResultCard';
import { DoctorPrepSheet } from '../components/analysis/DoctorPrepSheet';
import { ChatDrawer } from '../components/chat/ChatDrawer';
import { MedicalReportData } from '../types/medicalReport';
import { loadSampleReport } from '../services/geminiService';
import { ArrowLeft, Sparkles, FileSearch, MessageSquare, Bot } from 'lucide-react';

export const AnalysisPage: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const { i18n } = useTranslation();
  const [report, setReport] = useState<MedicalReportData | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'out_of_range' | 'normal'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // AI Chat Drawer State
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // 1. Try to load saved report from sessionStorage
    const stored = sessionStorage.getItem('bodhiva_active_report');
    if (stored) {
      try {
        const parsed: MedicalReportData = JSON.parse(stored);
        setReport(parsed);
        return;
      } catch (e) {
        console.warn('Failed to parse stored report');
      }
    }

    // 2. Fallback: load authentic demonstration sample in current language
    const sample = loadSampleReport(i18n.language);
    setReport(sample);
  }, [reportId, i18n.language]);

  // Extract unique categories from test items
  const categories = useMemo(() => {
    if (!report) return [];
    const set = new Set(report.tests.map(t => t.category).filter(Boolean));
    return Array.from(set);
  }, [report]);

  // Filter test results dynamically based on search, status, and category
  const filteredTests = useMemo(() => {
    if (!report) return [];

    return report.tests.filter((test) => {
      // 1. Search filter
      const matchesSearch =
        !searchQuery.trim() ||
        test.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.meaningSimple.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Status filter
      if (selectedStatus === 'out_of_range') {
        if (test.status !== 'low' && test.status !== 'high') return false;
      } else if (selectedStatus === 'normal') {
        if (test.status !== 'normal') return false;
      }

      // 3. Category filter
      if (selectedCategory !== 'all' && test.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [report, searchQuery, selectedStatus, selectedCategory]);

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
          <span className="text-sm font-semibold text-slate-500">Loading Medical Breakdown...</span>
        </div>
      </div>
    );
  }

  const normalCount = report.tests.filter(t => t.status === 'normal').length;
  const outOfRangeCount = report.tests.filter(t => t.status === 'low' || t.status === 'high').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      <MedicalDisclaimerBanner compact />
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Navigation & Status Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-brand-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Upload Another Lab Report</span>
          </Link>

          <div className="flex items-center gap-2">
            {report.isSampleDemonstration && (
              <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Sample Demonstration
              </span>
            )}
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask AI Assistant</span>
            </button>
          </div>
        </div>

        {/* 1. Header Overview & Stats Card */}
        <ReportHeaderCard report={report} activeLanguage={i18n.language} />

        {/* Inline AI Assistant Callout Banner */}
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center p-2.5 border border-teal-500/30">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Have questions about these numbers?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Ask Bodhiva AI to explain test meanings, dietary factors, or terms in simple language.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsChatOpen(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat with this Report</span>
          </button>
        </div>

        {/* 2. Interactive Filters & Search */}
        <ReportFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          totalCount={report.tests.length}
          outOfRangeCount={outOfRangeCount}
          normalCount={normalCount}
        />

        {/* 3. Filtered Test Cards List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-accent-charcoal">
              Detailed Parameter Explanations ({filteredTests.length} of {report.tests.length})
            </h2>
            {selectedStatus !== 'all' || searchQuery || selectedCategory !== 'all' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus('all');
                  setSelectedCategory('all');
                }}
                className="text-xs font-bold text-brand-700 hover:underline"
              >
                Clear all filters
              </button>
            ) : null}
          </div>

          {filteredTests.length > 0 ? (
            <div className="space-y-6">
              {filteredTests.map((test) => (
                <TestResultCard key={test.id} test={test} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 shadow-sm space-y-3">
              <FileSearch className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No matching tests found
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                No laboratory tests matched "{searchQuery}" under the selected filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus('all');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* 4. Doctor Discussion Prep Sheet (Printable / Shareable) */}
        <DoctorPrepSheet report={report} />

        {/* Safety Charter Banner */}
        <MedicalDisclaimerBanner />
      </main>

      {/* Floating Chat Trigger Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsChatOpen(true)}
          className="flex items-center gap-3 px-5 py-3.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-2xl shadow-brand-600/40 hover:shadow-brand-600/50 hover:scale-105 active:scale-95 transition-all group border-2 border-white/20"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span>Chat with Report</span>
        </button>
      </div>

      {/* AI Context-Aware Chat Drawer */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        report={report}
        language={i18n.language}
      />

      <Footer />
    </div>
  );
};
