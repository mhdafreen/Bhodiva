import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Check, Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguageOption } from '../../i18n/languages';
import { changeLanguage } from '../../i18n';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation();

  if (!isOpen) return null;

  const handleSelectLanguage = (lang: LanguageOption) => {
    changeLanguage(lang.code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 transition-all transform scale-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="language-modal-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 id="language-modal-title" className="text-lg font-bold text-accent-charcoal">
                Choose Language / ഭാഷ തിരഞ്ഞെടുക്കുക
              </h3>
              <p className="text-xs text-slate-500">
                Explanations will be generated in your chosen language
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            aria-label="Close language selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = i18n.language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelectLanguage(lang)}
                className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/70 text-brand-950 ring-2 ring-brand-500/20 shadow-sm'
                    : 'border-slate-200/90 hover:border-brand-300 hover:bg-slate-50/80 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl" role="img" aria-label={lang.name}>
                    {lang.flag}
                  </span>
                  <div>
                    <div className="font-bold text-base flex items-center gap-1.5">
                      <span>{lang.nativeName}</span>
                      <span className="text-xs font-normal text-slate-500">({lang.name})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {lang.region}
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
