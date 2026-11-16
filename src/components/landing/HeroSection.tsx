import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Camera, FileUp, ShieldCheck, CheckCircle2, Sparkles, HeartPulse } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
      {/* Background soft ambient accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-brand-100/50 via-brand-50/20 to-transparent pointer-events-none rounded-b-[4rem] -z-10 blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Tag badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-800 text-xs sm:text-sm font-semibold mb-6 shadow-sm animate-fadeIn">
            <HeartPulse className="w-4 h-4 text-brand-600 animate-pulse" />
            <span>{t('hero.badge')}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-accent-charcoal tracking-tight leading-[1.15] mb-6">
            {t('hero.title')}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal leading-relaxed mb-10 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md sm:max-w-none mx-auto mb-8">
            <Link
              to="/upload?mode=camera"
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-7 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-lg shadow-brand-600/25 hover:shadow-xl hover:shadow-brand-600/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Camera className="w-5 h-5 text-brand-100" />
              <span>{t('hero.ctaCamera')}</span>
            </Link>

            <Link
              to="/upload?mode=file"
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border-2 border-slate-200/80 hover:border-brand-300 shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <FileUp className="w-5 h-5 text-brand-600" />
              <span>{t('hero.ctaUpload')}</span>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              100% Free to use
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              No login or phone number required
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-600" />
              6 Indian languages supported
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
