import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { ShieldCheck, Lock, Trash2, EyeOff, Server } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-12 space-y-8">
          {/* Header */}
          <div className="border-b border-slate-100 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-brand-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black text-accent-charcoal tracking-tight mb-2">
              Privacy, Security & Data Handling Policy
            </h1>
            <p className="text-slate-500 text-sm">
              Your medical privacy is our absolute priority. Here is how your data is treated.
            </p>
          </div>

          {/* Privacy Principles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60">
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-3">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Ephemeral by Default</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Guest uploads are processed in memory and deleted automatically within 24 hours. A "Delete Report Now" button allows immediate permanent erasure.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center mb-3">
                <EyeOff className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">No AI Model Training</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your medical reports are never used to train, retrain, or fine-tune public foundation AI models. API terms strictly guarantee confidentiality.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">End-to-End Encryption</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                All communications between your browser and our processing nodes use modern TLS 1.3 encryption. Private storage objects are protected by Row Level Security (RLS).
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Zero Commercial Data Selling</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We never monetize patient data, sell lists to pharmaceutical marketers, or provide records to insurance companies.
              </p>
            </div>
          </div>

          {/* Detailed Policy Text */}
          <section className="space-y-4 pt-4 border-t border-slate-100 text-sm text-slate-600 leading-relaxed">
            <h2 className="text-lg font-bold text-slate-800">
              Information We Collect & Process
            </h2>
            <p>
              When you upload a report or take a photograph, Bodhiva extracts only the parameters necessary for laboratory analysis: patient name (if detected), test names, numeric values, measurement units, reference ranges, and laboratory comments.
            </p>
            <p>
              Personal identifiers (such as home address, contact number, or government IDs that might appear in lab headers) are excluded from analytical storage.
            </p>

            <h2 className="text-lg font-bold text-slate-800 pt-2">
              Compliance with Indian & International Standards
            </h2>
            <p>
              Bodhiva is architected to align with the core security principles of the Digital Information Security in Healthcare Act (DISHA) and the Digital Personal Data Protection Act (DPDPA) in India, alongside international HIPAA data privacy best practices.
            </p>
          </section>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <Link to="/" className="text-brand-700 font-semibold text-sm hover:underline">
              &larr; Return to Homepage
            </Link>
            <Link to="/upload" className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md">
              Start Anonymous Analysis
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
