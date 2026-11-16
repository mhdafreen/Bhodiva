import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, HelpCircle, ArrowDownRight, Stethoscope } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../i18n/languages';
import { changeLanguage } from '../../i18n';

export const SampleReportPreview: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Container card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
        {/* Card Header with Language Switcher */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <span className="text-xs uppercase tracking-wider text-brand-300 font-semibold block">
                {t('sample.badge')}
              </span>
              <h3 className="text-lg font-bold text-white">
                {t('sample.title')}
              </h3>
            </div>
          </div>

          {/* Quick inline language switcher */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 mr-1 hidden md:inline">Language preview:</span>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  i18n.language === lang.code
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {lang.nativeName}
              </button>
            ))}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Main Test Row */}
          <div className="bg-slate-50/70 border border-slate-200/70 rounded-2xl p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Parameter / ടെസ്റ്റ്
                </span>
                <h4 className="text-xl sm:text-2xl font-extrabold text-accent-charcoal">
                  {t('sample.testName')}
                </h4>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300/70 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm">
                  <ArrowDownRight className="w-4 h-4 text-amber-700" />
                  {t('sample.status')}
                </span>
              </div>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-5">
              <div>
                <span className="text-xs font-medium text-slate-500 block">Your Result</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-600">
                  {t('sample.measuredValue')}
                </span>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-500 block">Lab Reference Range</span>
                <span className="text-base sm:text-lg font-bold text-slate-700">
                  {t('sample.refRange')}
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <span className="text-xs font-medium text-slate-500 block">Sample Status</span>
                <span className="text-sm font-semibold text-emerald-700 flex items-center gap-1">
                  ✓ Verified by Lab Standards
                </span>
              </div>
            </div>

            {/* Visual Range Indicator Bar */}
            <div className="mt-6 pt-4 border-t border-slate-200/60">
              <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
                <span className="text-amber-600 font-bold">Below Range (&lt;12.0)</span>
                <span className="text-emerald-700 font-bold">Normal Range (12.0 – 15.5)</span>
                <span className="text-rose-600 font-bold">Above Range (&gt;15.5)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 relative overflow-hidden flex">
                <div className="w-[30%] bg-amber-400 h-full" />
                <div className="w-[45%] bg-emerald-400 h-full" />
                <div className="w-[25%] bg-rose-400 h-full" />
              </div>
              <div className="flex justify-start pl-[20%] mt-1">
                <div className="flex items-center gap-1 text-[11px] font-black text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-300">
                  ▲ Your value: 10.1 g/dL
                </div>
              </div>
            </div>
          </div>

          {/* Bodhiva Explanation Box */}
          <div className="bg-brand-50/60 border border-brand-200/70 rounded-2xl p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 text-brand-900 font-bold text-base">
              <HelpCircle className="w-5 h-5 text-brand-700" />
              <span>What does this mean for your body?</span>
            </div>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              {t('sample.explanation')}
            </p>
          </div>

          {/* Doctor Discussion Suggestion Box */}
          <div className="bg-blue-50/60 border border-blue-200/70 rounded-2xl p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-base">
              <Stethoscope className="w-5 h-5 text-blue-700" />
              <span>Recommended question for your doctor</span>
            </div>
            <p className="text-slate-800 text-sm sm:text-base font-medium italic bg-white/80 p-3.5 rounded-xl border border-blue-100">
              "{t('sample.question')}"
            </p>
          </div>
        </div>

        {/* Reassuring note footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-slate-400" />
            Values are purely illustrative. Upload your real report to get exact personalized breakdowns.
          </span>
        </div>
      </div>
    </div>
  );
};
