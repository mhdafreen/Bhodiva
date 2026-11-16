import { MedicalReportData } from '../types/medicalReport';
import { getSampleDemonstrationReport } from './clinicalSampleData';

const VAULT_STORAGE_KEY = 'bodhiva_saved_reports';

/**
 * Creates two realistic reports across time (January vs June) for comparison demonstration
 */
function createComparativeSampleReports(lang: string = 'en'): MedicalReportData[] {
  // June Report (Current / Baseline)
  const juneReport = getSampleDemonstrationReport(lang);
  juneReport.id = 'report-sample-june-2026';
  juneReport.metadata.reportDate = '2026-06-15';
  juneReport.metadata.reportCategory = 'Complete Blood Count (June 2026)';

  // January Report (Earlier baseline with lower hemoglobin)
  const janReport: MedicalReportData = JSON.parse(JSON.stringify(juneReport));
  janReport.id = 'report-sample-jan-2026';
  janReport.metadata.reportDate = '2026-01-10';
  janReport.metadata.reportCategory = 'Complete Blood Count (January 2026)';
  janReport.summary.quickOverview = lang === 'ml'
    ? 'ജനുവരിയിലെ രക്തപരിശോധനയിൽ ഹീമോഗ്ലോബിന്റെ അളവ് 9.3 g/dL ആയിരുന്നു.'
    : 'In January, your hemoglobin was 9.3 g/dL, indicating lower oxygen-carrying capacity.';

  // Adjust test values for January
  janReport.tests = janReport.tests.map(t => {
    if (t.id === 't-hgb') {
      return { ...t, measuredValue: 9.3, valueString: '9.3', status: 'low' };
    }
    if (t.id === 't-rbc') {
      return { ...t, measuredValue: 3.5, valueString: '3.5', status: 'low' };
    }
    if (t.id === 't-plt') {
      return { ...t, measuredValue: 210000, valueString: '2,10,000' };
    }
    return t;
  });

  return [juneReport, janReport];
}

/**
 * Retrieves all reports stored in the user's Health Vault
 */
export function getVaultReports(lang: string = 'en'): MedicalReportData[] {
  const data = localStorage.getItem(VAULT_STORAGE_KEY);
  if (data) {
    try {
      const parsed: MedicalReportData[] = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse vault reports');
    }
  }

  // Pre-seed with comparative sample reports if empty
  const defaultReports = createComparativeSampleReports(lang);
  saveVaultReports(defaultReports);
  return defaultReports;
}

/**
 * Saves reports array to vault
 */
export function saveVaultReports(reports: MedicalReportData[]): void {
  try {
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(reports));
  } catch (e) {
    console.warn('Storage limit reached');
  }
}

/**
 * Appends a newly analyzed report to the user's vault
 */
export function addReportToVault(report: MedicalReportData): void {
  const current = getVaultReports(report.targetLanguage);
  // Avoid duplicate ID
  const filtered = current.filter(r => r.id !== report.id);
  const updated = [report, ...filtered];
  saveVaultReports(updated);
}

/**
 * Deletes a single report from vault
 */
export function deleteReportFromVault(reportId: string, lang: string = 'en'): MedicalReportData[] {
  const current = getVaultReports(lang);
  const updated = current.filter(r => r.id !== reportId);
  saveVaultReports(updated);
  return updated;
}

/**
 * Clears the entire vault (privacy deletion)
 */
export function clearEntireVault(): void {
  localStorage.removeItem(VAULT_STORAGE_KEY);
  sessionStorage.removeItem('bodhiva_active_report');
}
