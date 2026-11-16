export type TestStatus = 'normal' | 'high' | 'low' | 'indeterminate';

export interface TestResultItem {
  id: string;
  testName: string;
  category: string;
  measuredValue: number | null;
  valueString: string;
  unit: string | null;
  referenceRangeRaw: string | null;
  refMin: number | null;
  refMax: number | null;
  status: TestStatus;
  meaningSimple: string;
  resultIndication: string;
  clinicalContext: string;
}

export interface ReportSummary {
  quickOverview: string;
  importantFindings: string[];
  totalTests: number;
  outOfRangeCount: number;
  hasUrgentFlags: boolean;
  urgentAdvice: string | null;
}

export interface ReportMetadata {
  patientName: string | null;
  reportDate: string | null;
  labName: string | null;
  reportCategory: string; // e.g. "Complete Blood Count", "Lipid Profile", "Liver Function"
}

export interface MedicalReportData {
  id: string;
  metadata: ReportMetadata;
  summary: ReportSummary;
  tests: TestResultItem[];
  questionsForDoctor: string[];
  medicalDisclaimer: string;
  originalLanguage: string;
  targetLanguage: string;
  createdAt: string;
  isSampleDemonstration?: boolean;
}
