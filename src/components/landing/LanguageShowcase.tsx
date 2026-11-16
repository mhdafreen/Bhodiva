import React from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../../i18n/languages';
import { changeLanguage } from '../../i18n';
import { Check } from 'lucide-react';

export const LanguageShowcase: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <section className="py-20 bg-brand-50/40 border-t border-brand-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-100/70 px-3 py-1 rounded-full">
            Linguistic Accessibility
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-accent-charcoal mt-3 mb-4 tracking-tight">
            Healthcare in your mother tongue
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Language should never be a barrier to understanding your health. Tap any language to switch the entire application instantly.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isActive = i18n.language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`p-5 rounded-2xl border text-center transition-all transform hover:-translate-y-1 ${
                  isActive
                    ? 'bg-white border-brand-600 shadow-lg ring-2 ring-brand-500/20'
                    : 'bg-white/80 border-slate-200 hover:border-brand-300 hover:bg-white shadow-sm'
                }`}
              >
                <div className="text-3xl mb-2">{lang.flag}</div>
                <div className="font-extrabold text-base text-accent-charcoal mb-0.5">
                  {lang.nativeName}
                </div>
                <div className="text-xs text-slate-500 mb-2 font-medium">
                  {lang.name}
                </div>
                {isActive ? (
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Active</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400">Tap to switch</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
