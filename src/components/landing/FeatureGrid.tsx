import React from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Languages, BarChart3, HelpCircle, Shield, FileCheck } from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Camera className="w-6 h-6 text-teal-600" />,
      bg: 'bg-teal-50',
      title: t('features.camera.title'),
      desc: t('features.camera.desc')
    },
    {
      icon: <Languages className="w-6 h-6 text-sky-600" />,
      bg: 'bg-sky-50',
      title: t('features.multilingual.title'),
      desc: t('features.multilingual.desc')
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-50',
      title: t('features.ranges.title'),
      desc: t('features.ranges.desc')
    },
    {
      icon: <HelpCircle className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50',
      title: t('features.doctorPrep.title'),
      desc: t('features.doctorPrep.desc')
    },
    {
      icon: <FileCheck className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50',
      title: t('features.safety.title'),
      desc: t('features.safety.desc')
    },
    {
      icon: <Shield className="w-6 h-6 text-slate-700" />,
      bg: 'bg-slate-100',
      title: t('features.privacy.title'),
      desc: t('features.privacy.desc')
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-accent-charcoal mb-4 tracking-tight">
            {t('features.title')}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl border border-slate-200/80 hover:border-brand-300 hover:shadow-lg transition-all duration-300 bg-white flex flex-col group"
            >
              <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-accent-charcoal mb-2.5">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
