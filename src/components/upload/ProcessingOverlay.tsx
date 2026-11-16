import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, ShieldCheck, HeartPulse } from 'lucide-react';

interface ProcessingOverlayProps {
  pageCount: number;
  onCompleted?: () => void;
}

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ pageCount }) => {
  const { t } = useTranslation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    { title: 'Validating Image Sharpness & Page Alignment', desc: 'Ensuring all text, numbers, and units are legible' },
    { title: 'Reading Medical Parameters & Reference Ranges', desc: 'Analyzing laboratory measurements and units' },
    { title: 'Synthesizing Simple Explanations in Your Language', desc: 'Translating clinical terminology into plain terms' },
    { title: 'Compiling Doctor Discussion Questions', desc: 'Preparing personalized questions for your consultation' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2400);

    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 text-center space-y-6">
        {/* Animated Icon */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-3xl bg-brand-500/20 animate-ping" />
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 text-white flex items-center justify-center shadow-lg shadow-brand-600/30">
            <HeartPulse className="w-10 h-10 animate-pulse" />
          </div>
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            AI Clinical Understanding In Progress
          </span>
          <h3 className="text-2xl font-extrabold text-accent-charcoal mt-3 mb-1">
            Analyzing {pageCount} {pageCount === 1 ? 'Page' : 'Pages'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('upload.processing')}
          </p>
        </div>

        {/* Dynamic Progress Timeline */}
        <div className="space-y-3 text-left py-2">
          {steps.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={idx}
                className={`flex items-start gap-3 p-3 rounded-2xl transition-all ${
                  isCurrent
                    ? 'bg-brand-50/80 border border-brand-200 shadow-sm'
                    : isDone
                    ? 'text-slate-700'
                    : 'text-slate-400 opacity-60'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                  )}
                </div>
                <div>
                  <div className={`text-xs sm:text-sm font-bold ${isCurrent ? 'text-brand-950' : ''}`}>
                    {step.title}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {step.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Privacy Note */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          <span>Encrypted processing • Ephemeral session</span>
        </div>
      </div>
    </div>
  );
};
