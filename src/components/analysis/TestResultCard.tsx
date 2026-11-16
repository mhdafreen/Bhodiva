import React, { useState } from 'react';
import { TestResultItem } from '../../types/medicalReport';
import { VisualRangeGauge } from './VisualRangeGauge';
import {
  CheckCircle2,
  ArrowDownRight,
  ArrowUpRight,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Activity,
  AlertCircle
} from 'lucide-react';

interface TestResultCardProps {
  test: TestResultItem;
}

export const TestResultCard: React.FC<TestResultCardProps> = ({ test }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isLow = test.status === 'low';
  const isHigh = test.status === 'high';
  const isNormal = test.status === 'normal';

  return (
    <div
      className={`bg-white rounded-3xl border transition-all duration-300 shadow-sm hover:shadow-md ${
        isLow
          ? 'border-amber-200/90 hover:border-amber-300'
          : isHigh
          ? 'border-rose-200/90 hover:border-rose-300'
          : 'border-slate-200/90 hover:border-brand-300'
      }`}
    >
      <div className="p-6 sm:p-7 space-y-5">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {test.category}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-accent-charcoal mt-1.5">
              {test.testName}
            </h3>
          </div>

          {/* Status Badge */}
          <div className="flex-shrink-0">
            {isLow && (
              <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300/80 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm">
                <ArrowDownRight className="w-4 h-4 text-amber-700" />
                Below Reference Range
              </span>
            )}
            {isHigh && (
              <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-900 border border-rose-300/80 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm">
                <ArrowUpRight className="w-4 h-4 text-rose-700" />
                Above Reference Range
              </span>
            )}
            {isNormal && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300/80 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                Within Reference Range
              </span>
            )}
            {!isLow && !isHigh && !isNormal && (
              <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 border border-slate-300 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold">
                <AlertCircle className="w-4 h-4 text-slate-500" />
                Qualitative Parameter
              </span>
            )}
          </div>
        </div>

        {/* Value Details and Gauge */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Measured Value Callout */}
          <div className="md:col-span-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-500 block mb-0.5">
              Your Measured Result
            </span>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-3xl sm:text-4xl font-black ${
                  isLow ? 'text-amber-600' : isHigh ? 'text-rose-600' : 'text-slate-900'
                }`}
              >
                {test.valueString}
              </span>
              <span className="text-base font-bold text-slate-500">
                {test.unit || ''}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-2 font-medium">
              Lab Reference: <strong className="text-slate-700">{test.referenceRangeRaw || 'N/A'}</strong>
            </div>
          </div>

          {/* Interactive Range Gauge */}
          <div className="md:col-span-8">
            <VisualRangeGauge
              measuredValue={test.measuredValue}
              valueString={test.valueString}
              unit={test.unit}
              refMin={test.refMin}
              refMax={test.refMax}
              referenceRangeRaw={test.referenceRangeRaw}
              status={test.status}
            />
          </div>
        </div>

        {/* Primary Layman Understanding Box */}
        <div className="space-y-3 pt-2">
          {/* Meaning Box */}
          <div className="bg-brand-50/50 p-4 sm:p-5 rounded-2xl border border-brand-100/80 space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-brand-600" />
              <span>What is this test in plain words?</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {test.meaningSimple}
            </p>
          </div>

          {/* Result Indication Box */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border space-y-1.5 ${
              isLow
                ? 'bg-amber-50/60 border-amber-200/80 text-amber-950'
                : isHigh
                ? 'bg-rose-50/60 border-rose-200/80 text-rose-950'
                : 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950'
            }`}
          >
            <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>What does your result indicate?</span>
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed font-normal">
              {test.resultIndication}
            </p>
          </div>
        </div>

        {/* Expandable Clinical Context (Influencing Factors) */}
        {test.clinicalContext && (
          <div className="pt-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between py-2 text-xs font-bold text-slate-500 hover:text-brand-700 transition"
            >
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-brand-600" />
                <span>What factors can influence this test? (Diet, Hydration, Fasting)</span>
              </span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isExpanded && (
              <div className="mt-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-600 leading-relaxed animate-fadeIn">
                <p>{test.clinicalContext}</p>
                <p className="text-[11px] text-slate-400 mt-2 italic">
                  * Note: Laboratory results should always be interpreted together with your doctor in the context of your overall medical history.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
