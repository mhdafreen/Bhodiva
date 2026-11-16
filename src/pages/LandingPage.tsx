import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { MedicalDisclaimerBanner } from '../components/common/MedicalDisclaimerBanner';
import { HeroSection } from '../components/landing/HeroSection';
import { SampleReportPreview } from '../components/landing/SampleReportPreview';
import { HowItWorks } from '../components/landing/HowItWorks';
import { FeatureGrid } from '../components/landing/FeatureGrid';
import { LanguageShowcase } from '../components/landing/LanguageShowcase';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top compact safety banner */}
      <MedicalDisclaimerBanner compact />

      {/* Main navigation */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Live Interactive Sample Report Preview */}
        <SampleReportPreview />

        {/* How It Works */}
        <HowItWorks />

        {/* Features Grid */}
        <FeatureGrid />

        {/* Multilingual Regional Showcase */}
        <LanguageShowcase />

        {/* Full Medical Disclaimer Callout */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MedicalDisclaimerBanner />
        </div>
      </main>

      {/* Comprehensive Footer */}
      <Footer />
    </div>
  );
};
