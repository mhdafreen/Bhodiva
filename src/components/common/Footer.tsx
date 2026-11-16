import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center p-0.5">
                <img src="/logo.svg" alt="Bodhiva" className="w-9 h-9" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">BODHIVA</span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              {t('brand.tagline')}. Bodhiva is an empathetic AI healthcare companion designed to help ordinary people, families, and elderly citizens understand complex laboratory test reports in their preferred native language.
            </p>
            <div className="flex items-center gap-3 text-xs text-brand-400 pt-2">
              <span className="flex items-center gap-1.5 bg-brand-950/70 text-brand-300 border border-brand-800 px-3 py-1 rounded-full font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Zero Data Selling
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 rounded-full font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Gemini Multimodal AI
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/upload" className="hover:text-brand-400 transition-colors">
                  {t('nav.upload')}
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="hover:text-brand-400 transition-colors">
                  {t('nav.howItWorks')}
                </Link>
              </li>
              <li>
                <Link to="/onboarding/language" className="hover:text-brand-400 transition-colors">
                  Change Language
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Medical Safety */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Trust & Safety</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/disclaimer" className="hover:text-brand-400 transition-colors">
                  Medical Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-brand-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <span className="text-xs text-slate-500">ISO/DISHA Compliance Ready</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Explicit Medical Notice */}
        <div className="py-8 border-b border-slate-800/80 text-xs text-slate-400 leading-relaxed">
          <p className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
            <strong className="text-amber-400 block mb-1">Medical Education Notice:</strong>
            {t('footer.medicalNotice')}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} BODHIVA. {t('footer.rights')}</p>
          <div className="flex items-center gap-2">
            <span>Built with care for health literacy</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>across India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
