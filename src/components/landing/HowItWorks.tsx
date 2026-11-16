import React from 'react';
import { Camera, Cpu, HeartHandshake, CheckCircle } from 'lucide-react';

export const HowItWorks: React.FC = () => {

  const steps = [
    {
      num: '01',
      icon: <Camera className="w-6 h-6 text-brand-600" />,
      title: '1. Capture or Upload',
      desc: 'Snap a photo of your printed lab report using your mobile phone camera, choose from your gallery, or drop a digital PDF.',
      highlight: 'Multi-page support & real-time blur check'
    },
    {
      num: '02',
      icon: <Cpu className="w-6 h-6 text-sky-600" />,
      title: '2. Clinical AI Extraction',
      desc: 'Our Gemini Multimodal AI extracts measured numbers, units, and laboratory-specific reference ranges with zero hallucination.',
      highlight: 'Strict medical data validation'
    },
    {
      num: '03',
      icon: <HeartHandshake className="w-6 h-6 text-emerald-600" />,
      title: '3. Understand in Your Language',
      desc: 'Read what tests mean in simple Malayalam, Hindi, Tamil, Telugu, Kannada, or English. Get custom questions prepared for your doctor.',
      highlight: 'Empathetic & non-alarming guidance'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-accent-charcoal mt-3 mb-4 tracking-tight">
            How Bodhiva works
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            No complicated apps or medical training needed. Designed to be accessible and comfortable for everyone, including elderly family members.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center shadow-inner">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-black text-slate-200">{step.num}</span>
                </div>
                <h3 className="text-xl font-bold text-accent-charcoal mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {step.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-brand-700">
                <CheckCircle className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <span>{step.highlight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
