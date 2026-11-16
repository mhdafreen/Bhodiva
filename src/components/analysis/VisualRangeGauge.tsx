import React from 'react';
import { TestStatus } from '../../types/medicalReport';

interface VisualRangeGaugeProps {
  measuredValue: number | null;
  valueString: string;
  unit: string | null;
  refMin: number | null;
  refMax: number | null;
  referenceRangeRaw: string | null;
  status: TestStatus;
}

export const VisualRangeGauge: React.FC<VisualRangeGaugeProps> = ({
  measuredValue,
  valueString,
  unit,
  refMin,
  refMax,
  referenceRangeRaw,
  status
}) => {
  // If no numeric range is provided or value is non-numeric (e.g. "Negative", "Nil")
  if (refMin === null || refMax === null || measuredValue === null || isNaN(measuredValue)) {
    return (
      <div className="py-2.5 px-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
        <span>Lab Reference: <strong className="text-slate-700">{referenceRangeRaw || 'Qualitative / Not provided'}</strong></span>
        <span className="text-slate-400 font-medium">Standard test calibration</span>
      </div>
    );
  }

  // Calculate gauge marker position percentage
  // Normal range occupies the central 50% (from 25% to 75%)
  // Below range occupies 0% to 25%
  // Above range occupies 75% to 100%
  const rangeSpan = Math.max(0.001, refMax - refMin);
  let pointerPercent = 50;

  if (measuredValue < refMin) {
    const lowSpan = rangeSpan * 0.5;
    const lowDelta = Math.max(0, refMin - measuredValue);
    const lowRatio = Math.min(1, lowDelta / lowSpan);
    // 25% down to 5%
    pointerPercent = Math.max(6, 25 - lowRatio * 20);
  } else if (measuredValue > refMax) {
    const highSpan = rangeSpan * 0.5;
    const highDelta = Math.max(0, measuredValue - refMax);
    const highRatio = Math.min(1, highDelta / highSpan);
    // 75% up to 95%
    pointerPercent = Math.min(94, 75 + highRatio * 20);
  } else {
    // Inside reference range (25% to 75%)
    const normalRatio = (measuredValue - refMin) / rangeSpan;
    pointerPercent = 25 + normalRatio * 50;
  }

  const isLow = status === 'low';
  const isHigh = status === 'high';

  return (
    <div className="pt-2 pb-1 space-y-2 select-none">
      {/* Visual Track */}
      <div className="relative pt-6">
        {/* Floating Marker Pointer */}
        <div
          className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500"
          style={{ left: `${pointerPercent}%` }}
        >
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-black shadow-md border whitespace-nowrap ${
              isLow
                ? 'bg-amber-500 text-white border-amber-600 shadow-amber-500/20'
                : isHigh
                ? 'bg-rose-500 text-white border-rose-600 shadow-rose-500/20'
                : 'bg-emerald-600 text-white border-emerald-700 shadow-emerald-600/20'
            }`}
          >
            {valueString} {unit}
          </span>
          <div
            className={`w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] mt-0.5 ${
              isLow ? 'border-t-amber-500' : isHigh ? 'border-t-rose-500' : 'border-t-emerald-600'
            }`}
          />
        </div>

        {/* 3-Zone Range Bar */}
        <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden flex shadow-inner">
          {/* Below Zone */}
          <div className="w-[25%] bg-gradient-to-r from-amber-300 to-amber-400 h-full border-r border-white/60" />
          {/* Reference / Normal Zone */}
          <div className="w-[50%] bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 h-full" />
          {/* Above Zone */}
          <div className="w-[25%] bg-gradient-to-r from-rose-400 to-rose-500 h-full border-l border-white/60" />
        </div>
      </div>

      {/* Axis Labels */}
      <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 px-1">
        <span className="text-amber-700 font-bold flex items-center gap-1">
          &lt; {refMin} <span className="hidden sm:inline text-slate-400 font-normal">Low</span>
        </span>
        <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-center">
          Reference Range: {refMin} – {refMax} {unit}
        </span>
        <span className="text-rose-700 font-bold flex items-center gap-1">
          &gt; {refMax} <span className="hidden sm:inline text-slate-400 font-normal">High</span>
        </span>
      </div>
    </div>
  );
};
