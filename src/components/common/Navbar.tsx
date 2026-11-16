import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../i18n/languages';
import { LanguageModal } from './LanguageModal';

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === i18n.language) || SUPPORTED_LANGUAGES[0];

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/dashboard', label: t('nav.dashboard') },
    { to: '/compare', label: 'Compare Reports' },
    { to: '/settings', label: 'Settings' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Brand */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 p-0.5 shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
                <img src="/logo.svg" alt="Bodhiva Logo" className="w-10 h-10" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold tracking-tight text-accent-charcoal group-hover:text-brand-700 transition-colors">
                    BODHIVA
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full border border-brand-200/50">
                    <ShieldCheck className="w-3 h-3 text-brand-600" />
                    Medical Clarity
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 hidden md:block">
                  {t('brand.tagline')}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-3 text-sm font-medium text-slate-600">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-2 rounded-xl transition-colors hover:text-brand-700 hover:bg-slate-50 ${
                    location.pathname === link.to ? 'text-brand-700 font-semibold bg-brand-50/50' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Language Switcher & Action CTA */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Language Pill */}
              <button
                onClick={() => setIsLangModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/40 text-slate-700 text-sm font-medium transition-all shadow-sm"
                title="Change Language"
                aria-label="Select preferred language"
              >
                <span className="text-base">{currentLang.flag}</span>
                <span className="font-semibold text-brand-800">{currentLang.nativeName}</span>
                <Globe className="w-4 h-4 text-slate-400" />
              </button>

              {/* Upload Report CTA Button */}
              <Link
                to="/upload"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-600/20 hover:shadow-lg hover:shadow-brand-600/30 transition-all group"
              >
                <span>{t('nav.startFree')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={() => setIsLangModalOpen(true)}
                className="p-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
                aria-label="Language selection"
              >
                <span>{currentLang.flag}</span>
                <span>{currentLang.code.toUpperCase()}</span>
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-fadeIn">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-700 hover:bg-brand-50 hover:text-brand-700 font-medium text-base transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsLangModalOpen(true);
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-brand-600" />
                  <span>Language / ഭാഷ: {currentLang.nativeName}</span>
                </div>
                <span>{currentLang.flag}</span>
              </button>

              <Link
                to="/upload"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-600 text-white font-semibold shadow-md shadow-brand-600/20"
              >
                <span>{t('nav.startFree')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Language Selector Modal */}
      <LanguageModal isOpen={isLangModalOpen} onClose={() => setIsLangModalOpen(false)} />
    </>
  );
};
