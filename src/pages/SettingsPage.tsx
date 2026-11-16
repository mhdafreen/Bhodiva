import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { MedicalDisclaimerBanner } from '../components/common/MedicalDisclaimerBanner';
import { SUPPORTED_LANGUAGES } from '../i18n/languages';
import { changeLanguage } from '../i18n';
import { clearEntireVault } from '../services/vaultService';
import {
  Settings,
  Globe,
  Trash2,
  ShieldCheck,
  Check,
  Lock,
  UserCheck
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to permanently delete all your stored medical reports and chat history? This action cannot be undone.')) {
      clearEntireVault();
      setClearedNotice(true);
      setTimeout(() => setClearedNotice(false), 3500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <MedicalDisclaimerBanner compact />
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-slate-200">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-brand-600 flex items-center justify-center">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-accent-charcoal">
              Account & Privacy Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage your preferred language, anonymous session, and data deletion rights
            </p>
          </div>
        </div>

        {/* Notice on successful deletion */}
        {clearedNotice && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>All local medical reports, cached analyses, and conversation logs have been permanently erased.</span>
          </div>
        )}

        {/* 1. Language Preference */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-brand-600" />
            <div>
              <h2 className="text-lg font-bold text-accent-charcoal">
                Preferred Regional Language
              </h2>
              <p className="text-xs text-slate-500">
                Medical report explanations, test meanings, and AI conversations will use this language
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = i18n.language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`p-4 rounded-2xl border text-left transition flex items-center justify-between ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50/70 text-brand-950 ring-2 ring-brand-500/20 font-bold'
                      : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <span className="text-xl block mb-1">{lang.flag}</span>
                    <span className="text-sm block">{lang.nativeName}</span>
                    <span className="text-[11px] text-slate-400 font-normal">({lang.name})</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-brand-600 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Privacy & Session Status */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            <div>
              <h2 className="text-lg font-bold text-accent-charcoal">
                Session & Privacy Governance
              </h2>
              <p className="text-xs text-slate-500">
                How your medical records are handled
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1 text-xs sm:text-sm text-slate-600">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-brand-600" />
                <div>
                  <span className="font-bold text-slate-900 block">Session Type: Anonymous Guest</span>
                  <span className="text-xs text-slate-500">No email or mobile number stored on public servers</span>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                Active
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-brand-600" />
                <div>
                  <span className="font-bold text-slate-900 block">AI Model Training Policy</span>
                  <span className="text-xs text-slate-500">Zero data retention for training public LLM models</span>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-slate-200 text-slate-700 font-bold text-xs rounded-full">
                Protected
              </span>
            </div>
          </div>
        </div>

        {/* 3. Permanent Data Deletion (Right to be Forgotten) */}
        <div className="bg-white rounded-3xl border border-rose-200/90 shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 text-rose-900">
            <Trash2 className="w-5 h-5 text-rose-600" />
            <div>
              <h2 className="text-lg font-bold text-rose-950">
                Data Deletion & Privacy Rights
              </h2>
              <p className="text-xs text-rose-800">
                Permanently erase all stored reports from your local device
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            If you are using a shared computer, internet cafe, or wish to erase all your diagnostic test records, you can permanently delete all stored data with a single action.
          </p>

          <button
            onClick={handleClearAllData}
            className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/20 transition flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Permanently Delete All Medical Data</span>
          </button>
        </div>

        {/* Safety Charter Banner */}
        <MedicalDisclaimerBanner />
      </main>

      <Footer />
    </div>
  );
};
