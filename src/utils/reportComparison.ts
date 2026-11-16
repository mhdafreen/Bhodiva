import { MedicalReportData, TestResultItem } from '../types/medicalReport';

export interface ParameterComparisonItem {
  testName: string;
  category: string;
  previousValue: number | null;
  previousValueString: string;
  previousUnit: string | null;
  currentValue: number | null;
  currentValueString: string;
  currentUnit: string | null;
  referenceRange: string | null;
  refMin: number | null;
  refMax: number | null;
  delta: number | null;
  deltaPercent: number | null;
  trajectory: 'increased' | 'decreased' | 'stable' | 'incomparable';
  isFavorable: boolean | null; // true if moving towards healthy normal range, false if moving away
  trajectoryExplanation: string;
  isUnitMismatch: boolean;
}

export interface ReportComparisonResult {
  previousReport: {
    id: string;
    title: string;
    date: string | null;
    labName: string | null;
  };
  currentReport: {
    id: string;
    title: string;
    date: string | null;
    labName: string | null;
  };
  matchedParameters: ParameterComparisonItem[];
  unmatchedPrevious: string[];
  unmatchedCurrent: string[];
  overallSummary: string;
}

/**
 * Normalizes test name for accurate cross-report matching
 */
function normalizeTestKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s*\([^)]*\)/g, '') // remove parentheses like (Hb) or regional names
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Compares two medical reports parameter-by-parameter with clinical range awareness
 */
export function compareReports(
  previousReport: MedicalReportData,
  currentReport: MedicalReportData,
  language: string = 'en'
): ReportComparisonResult {
  const matchedParameters: ParameterComparisonItem[] = [];
  const currentUsedKeys = new Set<string>();

  // Map of current tests by normalized key
  const currentMap = new Map<string, TestResultItem>();
  for (const test of currentReport.tests) {
    const key = normalizeTestKey(test.testName);
    currentMap.set(key, test);
  }

  for (const prevTest of previousReport.tests) {
    const key = normalizeTestKey(prevTest.testName);
    const currTest = currentMap.get(key);

    if (currTest) {
      currentUsedKeys.add(key);

      const prevVal = prevTest.measuredValue;
      const currVal = currTest.measuredValue;
      const isUnitMismatch = 
        Boolean(prevTest.unit && currTest.unit && prevTest.unit.trim().toLowerCase() !== currTest.unit.trim().toLowerCase());

      let delta: number | null = null;
      let deltaPercent: number | null = null;
      let trajectory: 'increased' | 'decreased' | 'stable' | 'incomparable' = 'stable';
      let isFavorable: boolean | null = null;
      let trajectoryExplanation = '';

      if (isUnitMismatch) {
        trajectory = 'incomparable';
        trajectoryExplanation = language === 'ml'
          ? `ഈ രണ്ട് പരിശോധനകളിലും ഉപയോഗിച്ചിരിക്കുന്ന യൂണിറ്റുകൾ വ്യത്യസ്തമാണ് (${prevTest.unit} vs ${currTest.unit}). അതിനാൽ നേരിട്ട് താരതമ്യം സാധ്യമല്ല.`
          : `Units differ between reports (${prevTest.unit} vs ${currTest.unit}). Direct comparison cannot be made reliably without laboratory conversion.`;
      } else if (prevVal !== null && currVal !== null) {
        delta = Number((currVal - prevVal).toFixed(2));
        if (prevVal !== 0) {
          deltaPercent = Number(((delta / prevVal) * 100).toFixed(1));
        }

        const refMin = currTest.refMin ?? prevTest.refMin;
        const refMax = currTest.refMax ?? prevTest.refMax;

        if (Math.abs(delta) < 0.05) {
          trajectory = 'stable';
          trajectoryExplanation = language === 'ml'
            ? 'കഴിഞ്ഞ പരിശോധനയുമായി താരതമ്യം ചെയ്യുമ്പോൾ ഈ അളവിൽ പ്രകടമായ മാറ്റമില്ലാതെ സ്ഥിരമായി നിൽക്കുന്നു.'
            : 'Value has remained virtually unchanged compared to the previous report.';
        } else if (delta > 0) {
          trajectory = 'increased';
          // Check if moving towards or away from normal
          if (refMin !== null && refMax !== null) {
            const wasLow = prevVal < refMin;
            const nowNormal = currVal >= refMin && currVal <= refMax;
            if (wasLow && nowNormal) {
              isFavorable = true;
              trajectoryExplanation = language === 'ml'
                ? `അളവ് വർദ്ധിച്ച് സാധാരണ പരിധിയിലേക്ക് (${refMin} - ${refMax}) എത്തിച്ചേർന്നിരിക്കുന്നു. ഇത് അനുകൂലമായ മാറ്റമാണ്.`
                : `Value increased and moved into the healthy reference range (${refMin} – ${refMax}). This represents positive progress.`;
            } else if (currVal > refMax) {
              isFavorable = false;
              trajectoryExplanation = language === 'ml'
                ? `അളവ് വർദ്ധിച്ച് സാധാരണ പരിധിയേക്കാൾ കൂടുതലായിട്ടുണ്ട്. ഡോക്ടറുമായി സംസാരിക്കുക.`
                : `Value increased above the laboratory reference ceiling (${refMax}). Consult your doctor regarding this trend.`;
            } else {
              isFavorable = true;
              trajectoryExplanation = language === 'ml'
                ? `അളവ് ${delta > 0 ? '+' : ''}${delta} ${currTest.unit || ''} വർദ്ധിച്ചിട്ടുണ്ട്.`
                : `Value increased by +${delta} ${currTest.unit || ''}.`;
            }
          } else {
            trajectoryExplanation = `Increased by +${delta} ${currTest.unit || ''}.`;
          }
        } else {
          trajectory = 'decreased';
          if (refMin !== null && refMax !== null) {
            const wasHigh = prevVal > refMax;
            const nowNormal = currVal >= refMin && currVal <= refMax;
            if (wasHigh && nowNormal) {
              isFavorable = true;
              trajectoryExplanation = language === 'ml'
                ? `അളവ് കുറഞ്ഞ് സാധാരണ പരിധിയിലേക്ക് എത്തിയിരിക്കുന്നു. ഇത് മികച്ച മാറ്റമാണ്.`
                : `Value decreased towards the healthy reference range. This represents favorable stabilization.`;
            } else if (currVal < refMin) {
              isFavorable = false;
              trajectoryExplanation = language === 'ml'
                ? `അളവ് കുറഞ്ഞ് സാധാരണ പരിധിയേക്കാൾ താഴെയായിട്ടുണ്ട്. ഡോക്ടറോട് ചോദിക്കുക.`
                : `Value decreased below the reference range minimum (${refMin}).`;
            } else {
              trajectoryExplanation = `Decreased by ${delta} ${currTest.unit || ''}.`;
            }
          } else {
            trajectoryExplanation = `Decreased by ${delta} ${currTest.unit || ''}.`;
          }
        }
      }

      matchedParameters.push({
        testName: currTest.testName,
        category: currTest.category,
        previousValue: prevVal,
        previousValueString: prevTest.valueString,
        previousUnit: prevTest.unit,
        currentValue: currVal,
        currentValueString: currTest.valueString,
        currentUnit: currTest.unit,
        referenceRange: currTest.referenceRangeRaw || prevTest.referenceRangeRaw,
        refMin: currTest.refMin ?? prevTest.refMin,
        refMax: currTest.refMax ?? prevTest.refMax,
        delta,
        deltaPercent,
        trajectory,
        isFavorable,
        trajectoryExplanation,
        isUnitMismatch
      });
    }
  }

  // Find unmatched parameters
  const unmatchedPrevious = previousReport.tests
    .filter(t => !currentMap.has(normalizeTestKey(t.testName)))
    .map(t => t.testName);

  const unmatchedCurrent = currentReport.tests
    .filter(t => !currentUsedKeys.has(normalizeTestKey(t.testName)))
    .map(t => t.testName);

  // Overall summary
  const improvedCount = matchedParameters.filter(p => p.isFavorable === true).length;
  const overallSummary = language === 'ml'
    ? `${previousReport.metadata.reportDate || 'മുമ്പത്തെ'} റിപ്പോർട്ടുമായി താരതമ്യം ചെയ്യുമ്പോൾ, പരിശോധിച്ച ${matchedParameters.length} പാരാമീറ്ററുകളിൽ ${improvedCount} എണ്ണം അനുകൂലമായ മാറ്റം കാണിക്കുന്നു. വിശദമായ മാറ്റങ്ങൾ താഴെ കാണാം.`
    : `Comparing report from ${previousReport.metadata.reportDate || 'earlier'} with ${currentReport.metadata.reportDate || 'recent'}: ${matchedParameters.length} common parameters were tracked, with ${improvedCount} showing favorable movement towards standard reference ranges.`;

  return {
    previousReport: {
      id: previousReport.id,
      title: previousReport.metadata.reportCategory,
      date: previousReport.metadata.reportDate,
      labName: previousReport.metadata.labName
    },
    currentReport: {
      id: currentReport.id,
      title: currentReport.metadata.reportCategory,
      date: currentReport.metadata.reportDate,
      labName: currentReport.metadata.labName
    },
    matchedParameters,
    unmatchedPrevious,
    unmatchedCurrent,
    overallSummary
  };
}
