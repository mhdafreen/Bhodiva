import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MedicalDisclaimerBannerProps {
  compact?: boolean;
}

export const MedicalDisclaimerBanner: React.FC<MedicalDisclaimerBannerProps> = ({ compact = false }) => {
  const { t } = useTranslation();

  if (compact) {
    return (
      <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2 text-xs text-amber-900 flex items-center justify-between">
        <div className="flex items-center space-x-2 max-w-5xl mx-auto w-full">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span className="font-medium truncate sm:whitespace-normal">
            {t('disclaimer.short')}
          </span>
          <Link to="/disclaimer" className="text-amber-800 underline hover:text-amber-950 font-semibold ml-auto flex-shrink-0">
            Learn More
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 my-6 text-amber-950 shadow-sm">
      <div className="flex items-start space-x-3.5">
        <div className="bg-amber-100 p-2 rounded-xl flex-shrink-0 text-amber-700 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div className="text-sm leading-relaxed">
          <h4 className="font-semibold text-amber-900 mb-1 flex items-center gap-1.5">
            <span>Important Medical Disclaimer</span>
            <span className="text-[11px] font-normal uppercase tracking-wider bg-amber-200/60 text-amber-800 px-2 py-0.5 rounded-full">
              Educational Only
            </span>
          </h4>
          <p className="text-amber-900/90">
            {t('disclaimer.banner')}
          </p>
          <div className="mt-2.5 flex items-center gap-4 text-xs font-medium text-amber-800">
            <Link to="/disclaimer" className="underline hover:text-amber-950">
              Read our full safety & ethics charter &rarr;
            </Link>
            <span className="text-amber-300">•</span>
            <Link to="/privacy" className="underline hover:text-amber-950">
              How your privacy is protected
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
