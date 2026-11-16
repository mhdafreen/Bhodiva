import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, LanguageOption } from '../i18n/languages';
import { changeLanguage } from '../i18n';
import { Check, ArrowRight, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

export const OnboardingLanguagePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState<string>(i18n.language || 'en');

  const handleSelectLanguage = (lang: LanguageOption) => {
    setSelectedLang(lang.code);
    changeLanguage(lang.code);
  };

  const handleContinueAsGuest = () => {
    localStorage.setItem('bodhiva_onboarding_completed', 'true');
    navigate('/upload');
  };

  const handleExplorePlatform = () => {
    localStorage.setItem('bodhiva_onboarding_completed', 'true');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/70 via-white to-slate-50 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto w-full">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 shadow-xl shadow-brand-600/25 mb-4 p-1">
            <img src="/logo.svg" alt="Bodhiva Logo" className="w-14 h-14" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-accent-charcoal tracking-tight mb-2">
            {t('brand.name')}
          </h1>
          <p className="text-sm sm:text-base font-medium text-brand-800">
            {t('brand.tagline')}
          </p>
        </div>

        {/* Step Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 mb-8">
          <div className="text-center max-w-lg mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Step 1 of 2 • Getting Started
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-accent-charcoal mt-3 mb-2">
              {t('onboarding.subtitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('onboarding.description')}
            </p>
          </div>

          {/* 6 Indian Language Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = selectedLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang)}
                  className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50/80 text-brand-950 ring-2 ring-brand-500/20 shadow-md transform scale-[1.01]'
                      : 'border-slate-200/90 hover:border-brand-300 hover:bg-slate-50/80 text-slate-800 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-3xl" role="img" aria-label={lang.name}>
                      {lang.flag}
                    </span>
                    <div>
                      <div className="font-extrabold text-lg flex items-center gap-2">
                        <span>{lang.nativeName}</span>
                        <span className="text-xs font-medium text-slate-500">({lang.name})</span>
                      </div>
                      <div className="text-xs text-brand-700 font-medium mt-0.5">
                        {lang.greeting}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bodhiva Philosophy Pillars */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/70 mb-8 space-y-2 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Our Promise to You:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                <span>Clear everyday language</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                <span>Strict patient privacy</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                <span>Empowering your doctor visits</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleContinueAsGuest}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-lg shadow-brand-600/25 hover:shadow-xl transition-all"
            >
              <span>{t('onboarding.continue')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={handleExplorePlatform}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-base transition-colors"
            >
              Explore Homepage First
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-4">
            {t('onboarding.changeLater')}
          </p>
        </div>
      </div>

      {/* Reassuring privacy notice */}
      <div className="text-center text-xs text-slate-400 max-w-md mx-auto">
        <p>No phone number or payment details required. Bodhiva is free for public medical literacy.</p>
      </div>
    </div>
  );
};
