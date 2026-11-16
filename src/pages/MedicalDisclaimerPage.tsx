import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { ShieldAlert, AlertTriangle, Stethoscope, HeartPulse, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MedicalDisclaimerPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-12 space-y-8">
          {/* Header */}
          <div className="border-b border-slate-100 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black text-accent-charcoal tracking-tight mb-2">
              Bodhiva Medical Safety & Ethics Charter
            </h1>
            <p className="text-slate-500 text-sm">
              Last updated: November 2026 • Core Clinical Governance Principles
            </p>
          </div>

          {/* Section 1: Non-Diagnostic Purpose */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-brand-600" />
              1. Educational Nature — Not a Diagnostic Tool
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Bodhiva is developed to assist patients, families, and caregivers in comprehending complex medical terminology, standard measurement units, and laboratory-printed reference ranges. <strong>Bodhiva does not provide medical diagnoses, treatment protocols, surgical recommendations, or prescription instructions.</strong>
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              An abnormal lab result alone does not confirm disease. Clinical interpretation requires in-person medical evaluation by a certified physician considering age, biological sex, clinical history, current medications, fasting state, and symptom presentation.
            </p>
          </section>

          {/* Section 2: Zero Hallucination Guarantee */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              2. Scientific Fidelity & Zero Hallucination Principle
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our artificial intelligence pipeline is architected under strict scientific safeguards:
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1.5">
              <li>Values and units are extracted directly from the physical or digital report without modification.</li>
              <li>We never invent missing lab parameters or substitute synthetic reference ranges when a lab has provided its own calibration numbers.</li>
              <li>If any test name, number, or unit is blurred, folded, or illegible, Bodhiva explicitly reports it as indeterminate rather than making assumptions.</li>
            </ul>
          </section>

          {/* Section 3: Emergency Protocols */}
          <section className="p-5 rounded-2xl bg-rose-50/80 border border-rose-200 text-rose-950 space-y-2">
            <h3 className="font-bold flex items-center gap-2 text-rose-900">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              Emergency Healthcare Situations
            </h3>
            <p className="text-xs sm:text-sm text-rose-900/90 leading-relaxed">
              If you or a loved one are experiencing acute symptoms such as severe chest pain, sudden shortness of breath, sudden numbness, uncontrolled bleeding, or loss of consciousness, do not rely on digital applications. Please call emergency services (112 / 108 in India) or visit the nearest hospital emergency department immediately.
            </p>
          </section>

          {/* Section 4: Empowering Doctor-Patient Relationships */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-brand-600" />
              3. AI to Assist, Never Replace Doctors
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our primary objective is to empower the patient with clear questions to ask their doctor during their next clinical consultation. We believe informed patients have better discussions with their healthcare providers.
            </p>
          </section>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <Link to="/" className="text-brand-700 font-semibold text-sm hover:underline">
              &larr; Return to Homepage
            </Link>
            <Link to="/upload" className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md">
              Understand a Report
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
