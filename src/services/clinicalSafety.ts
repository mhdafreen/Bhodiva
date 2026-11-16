import { MedicalReportData } from '../types/medicalReport';

/**
 * Validates and sanitizes AI-generated medical explanations to enforce clinical safety:
 * 1. Prohibits direct disease diagnoses ("You have disease X") -> reframes to educational range observation.
 * 2. Prohibits medication or dosage recommendations -> reframes to physician consultation.
 * 3. Enforces standard educational disclaimer.
 */
export function enforceClinicalSafety(report: MedicalReportData): MedicalReportData {
  const sanitized = { ...report };

  // Diagnostic forbidden phrase patterns
  const diagnosticPatterns = [
    /\byou have\s+(type\s+[12]\s+)?(diabetes|cancer|anemia|leukemia|cirrhosis|kidney disease|hypertension|hypothyroidism|hyperthyroidism)\b/gi,
    /\bdiagnosed with\b/gi,
    /\bsuffers from\b/gi,
    /\bpatient has\b/gi
  ];

  // Prescription / dosage forbidden patterns
  const prescriptionPatterns = [
    /\b(take|prescribe|dose|dosage)\s+(\d+(\.\d+)?\s*(mg|mcg|ml|tablets?|capsules?))\b/gi,
    /\bstop taking\s+([a-zA-Z]+)\b/gi,
    /\bstart taking\s+([a-zA-Z]+)\b/gi
  ];

  // Sanitize test result indications
  sanitized.tests = sanitized.tests.map((test) => {
    let indication = test.resultIndication;

    // Check and reframe diagnostic claims
    for (const pattern of diagnosticPatterns) {
      if (pattern.test(indication)) {
        indication = indication.replace(
          pattern,
          'Your result is outside the standard reference range, which may suggest discussing this with your doctor regarding'
        );
      }
    }

    // Check and eliminate medication suggestions
    for (const pattern of prescriptionPatterns) {
      if (pattern.test(indication)) {
        indication = indication.replace(
          pattern,
          'discuss appropriate treatments or dietary adjustments with your physician'
        );
      }
    }

    return {
      ...test,
      resultIndication: indication
    };
  });

  // Ensure mandatory medical disclaimer is present and unaltered
  sanitized.medicalDisclaimer = 
    "Educational Medical Information Only. Bodhiva explains laboratory reports in plain language. It does not provide medical diagnoses, clinical prescriptions, or healthcare treatment plans. Always discuss your results with a certified medical practitioner.";

  return sanitized;
}
