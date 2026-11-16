import { MedicalReportData } from '../types/medicalReport';

/**
 * Medically accurate, realistic Complete Blood Count (CBC) demonstration report
 * localized into all supported Indian regional languages.
 */
export function getSampleDemonstrationReport(language: string): MedicalReportData {
  const lang = language || 'en';

  if (lang === 'ml') {
    return {
      id: 'sample-cbc-ml',
      isSampleDemonstration: true,
      metadata: {
        patientName: 'സുനിത വർമ്മ (Sunitha Varma)',
        reportDate: '2026-10-24',
        labName: 'DDRC അഗിലസ് ഡയഗ്നോസ്റ്റിക്സ് (DDRC Agilus Diagnostics)',
        reportCategory: 'കംപ്ലീറ്റ് ബ്ലഡ് കൗണ്ട് (Complete Blood Count - CBC)'
      },
      summary: {
        quickOverview: 'നിങ്ങളുടെ കംപ്ലീറ്റ് ബ്ലഡ് കൗണ്ട് (CBC) പരിശോധനാ ഫലം പരിശോധിച്ചു. രക്തത്തിലെ പ്രധാന ഘടകങ്ങളായ ചുവന്ന രക്താണുക്കൾ, വെളുത്ത രക്താണുക്കൾ, പ്ലേറ്റ്‌ലെറ്റുകൾ എന്നിവയാണ് ഇതിൽ പരിശോധിച്ചത്. ആകെ 7 പരിശോധനകളിൽ 2 എണ്ണം സാധാരണ പരിധിക്ക് പുറത്താണ്.',
        importantFindings: [
          'ഹീമോഗ്ലോബിൻ സാധാരണ പരിധിയേക്കാൾ കുറവാണ് (10.1 g/dL). ഇത് ശരീരത്തിന് ആവശ്യത്തിന് ഓക്സിജൻ ലഭിക്കുന്നതിൽ കുറവുണ്ടാക്കാം.',
          'പ്ലേറ്റ്‌ലെറ്റ് അളവ് സാധാരണ പരിധിയിലാണ് (2,40,000 /uL). ഇത് രക്തം കട്ടപിടിക്കാൻ സഹായിക്കുന്നു.',
          'വെളുത്ത രക്താണുക്കളുടെ (WBC) അളവ് സാധാരണ നിലയിലാണ്. അണുബാധയുടെ ലക്ഷണങ്ങൾ കാണുന്നില്ല.'
        ],
        totalTests: 7,
        outOfRangeCount: 2,
        hasUrgentFlags: false,
        urgentAdvice: null
      },
      tests: [
        {
          id: 't-hgb',
          testName: 'ഹീമോഗ്ലോബിൻ - Hemoglobin (Hb)',
          category: 'ഹെമറ്റോളജി (Hematology)',
          measuredValue: 10.1,
          valueString: '10.1',
          unit: 'g/dL',
          referenceRangeRaw: '12.0 – 15.5',
          refMin: 12.0,
          refMax: 15.5,
          status: 'low',
          meaningSimple: 'ശരീരത്തിലെ എല്ലാ അവയവങ്ങളിലേക്കും ഓക്സിജൻ എത്തിക്കുന്ന രക്തത്തിലെ പ്രധാനപ്പെട്ട പ്രോട്ടീനാണ് ഹീമോഗ്ലോബിൻ.',
          resultIndication: 'നിങ്ങളുടെ ഹീമോഗ്ലോബിൻ ലാബ് നിശ്ചയിച്ച പരിധിയേക്കാൾ താഴെയാണ്. ഇതിനാൽ ശരീരത്തിൽ ക്ഷീണവും തളർച്ചയും ഉണ്ടാകാം. അയൺ കുറവോ മറ്റ് കാരണങ്ങളോ ഇതിലേക്ക് നയിക്കാം.',
          clinicalContext: 'ഭക്ഷണരീതി, ആർത്തവസമയത്തെ രക്തനഷ്ടം, ശരീരത്തിൽ ഇരുമ്പിന്റെ ആഗിരണക്കുറവ് എന്നിവ ഇതിനെ സ്വാധീനിക്കാറുണ്ട്.'
        },
        {
          id: 't-rbc',
          testName: 'ആർ.ബി.സി കൗണ്ട് - Total RBC Count',
          category: 'ഹെമറ്റോളജി (Hematology)',
          measuredValue: 3.8,
          valueString: '3.8',
          unit: 'mil/uL',
          referenceRangeRaw: '4.0 – 5.2',
          refMin: 4.0,
          refMax: 5.2,
          status: 'low',
          meaningSimple: 'ശരീരത്തിൽ ഓക്സിജൻ വഹിച്ചുകൊണ്ടുപോകുന്ന ചുവന്ന രക്താണുക്കളുടെ ആകെ എണ്ണമാണിത്.',
          resultIndication: 'ചുവന്ന രക്താണുക്കളുടെ എണ്ണം സാധാരണയേക്കാൾ അല്പം കുറവാണ്. ഇത് കുറഞ്ഞ ഹീമോഗ്ലോബിനുമായി ബന്ധപ്പെട്ടിരിക്കുന്നു.',
          clinicalContext: 'ഇരുമ്പ്, വിറ്റാമിൻ B12, ഫോളിക് ആസിഡ് എന്നിവയുടെ കുറവ് ചുവന്ന രക്താണുക്കളുടെ ഉത്പാദനത്തെ ബാധിക്കാം.'
        },
        {
          id: 't-wbc',
          testName: 'ഡബ്ല്യു.ബി.സി കൗണ്ട് - Total Leucocyte Count (WBC)',
          category: 'ഹെമറ്റോളജി (Hematology)',
          measuredValue: 6800,
          valueString: '6,800',
          unit: '/uL',
          referenceRangeRaw: '4,000 – 11,000',
          refMin: 4000,
          refMax: 11000,
          status: 'normal',
          meaningSimple: 'ശരീരത്തിൽ രോഗാണുക്കളോടും അണുബാധകളോടും പോരാടുന്ന പ്രതിരോധ കോശങ്ങളാണ് വെളുത്ത രക്താണുക്കൾ.',
          resultIndication: 'നിങ്ങളുടെ പ്രതിരോധ കോശങ്ങളുടെ എണ്ണം സാധാരണ പരിധിയിലാണ്. ഇത് മികച്ച പ്രതിരോധശേഷിയെ സൂചിപ്പിക്കുന്നു.',
          clinicalContext: 'പനി, അണുബാധ, മാനസിക സമ്മർദ്ദം എന്നിവ ഉണ്ടാകുമ്പോൾ ഈ അളവിൽ വ്യത്യാസം വരാറുണ്ട്.'
        },
        {
          id: 't-plt',
          testName: 'പ്ലേറ്റ്‌ലെറ്റ് കൗണ്ട് - Platelet Count',
          category: 'ഹെമറ്റോളജി (Hematology)',
          measuredValue: 240000,
          valueString: '2,40,000',
          unit: '/uL',
          referenceRangeRaw: '1,50,000 – 4,50,000',
          refMin: 150000,
          refMax: 450000,
          status: 'normal',
          meaningSimple: 'മുറിവുകൾ ഉണ്ടാകുമ്പോൾ രക്തം കട്ടപിടിക്കാനും അമിതമായ രക്തസ്രാവം തടയാനും സഹായിക്കുന്ന സൂക്ഷ്മ കോശങ്ങളാണ് പ്ലേറ്റ്‌ലെറ്റുകൾ.',
          resultIndication: 'പ്ലേറ്റ്‌ലെറ്റ് അളവ് തികച്ചും സുരക്ഷിതമായ പരിധിയിലാണ്.',
          clinicalContext: 'ഡെങ്കിപ്പനി പോലുള്ള വൈറൽ പനികളിൽ ഈ അളവ് കുറയാറുണ്ട്, എന്നാൽ ഇവിടെ അളവ് സാധാരണ നിലയിലാണ്.'
        },
        {
          id: 't-mcv',
          testName: 'എം.സി.വി - Mean Corpuscular Volume (MCV)',
          category: 'ഹെമറ്റോളജി (Hematology)',
          measuredValue: 84,
          valueString: '84.0',
          unit: 'fL',
          referenceRangeRaw: '80.0 – 99.0',
          refMin: 80.0,
          refMax: 99.0,
          status: 'normal',
          meaningSimple: 'ഓരോ ചുവന്ന രക്താണുവിന്റെയും ശരാശരി വലുപ്പത്തെയാണ് എം.സി.വി സൂചിപ്പിക്കുന്നത്.',
          resultIndication: 'രക്താണുക്കളുടെ വലുപ്പം സാധാരണ നിലയിലാണ്.',
          clinicalContext: 'ഇരുമ്പിന്റെ കുറവ് രക്താണുക്കളുടെ വലുപ്പം കുറയ്ക്കാനും, B12 കുറവ് വലുപ്പം കൂട്ടാനും ഇടയാക്കും.'
        },
        {
          id: 't-neu',
          testName: 'ന്യൂട്രോഫിൽസ് - Neutrophils',
          category: 'ഡിഫറൻഷ്യൽ കൗണ്ട് (Differential)',
          measuredValue: 62,
          valueString: '62',
          unit: '%',
          referenceRangeRaw: '40 – 75',
          refMin: 40,
          refMax: 75,
          status: 'normal',
          meaningSimple: 'ബാക്ടീരിയ മൂലമുണ്ടാകുന്ന അണുബാധകളെ ആദ്യം തടയുന്ന പ്രധാന പ്രതിരോധ കോശങ്ങളാണ് ന്യൂട്രോഫിൽസ്.',
          resultIndication: 'സാധാരണ നിലയിലുള്ള പ്രതിരോധ പ്രവർത്തനം.',
          clinicalContext: 'ബാക്ടീരിയൽ അണുബാധകൾ ഉണ്ടാകുമ്പോൾ ഇത് കൂടാറുണ്ട്.'
        },
        {
          id: 't-lym',
          testName: 'ലിംഫോസൈറ്റ്സ് - Lymphocytes',
          category: 'ഡിഫറൻഷ്യൽ കൗണ്ട് (Differential)',
          measuredValue: 30,
          valueString: '30',
          unit: '%',
          referenceRangeRaw: '20 – 45',
          refMin: 20,
          refMax: 45,
          status: 'normal',
          meaningSimple: 'വൈറസുകളെ പ്രതിരോധിക്കാനും ശരീരത്തിൽ ആന്റിബോഡികൾ നിർമ്മിക്കാനും സഹായിക്കുന്ന പ്രതിരോധ കോശങ്ങൾ.',
          resultIndication: 'സാധാരണ പരിധിയിലുള്ള ഫലം.',
          clinicalContext: 'വൈറൽ അണുബാധകൾക്ക് ശേഷം ഇവയുടെ ശതമാനത്തിൽ വ്യത്യാസങ്ങൾ കാണാറുണ്ട്.'
        }
      ],
      questionsForDoctor: [
        'എന്റെ ഹീമോഗ്ലോബിൻ (10.1 g/dL) കുറയാനുള്ള കാരണം ഭക്ഷണരീതിയാണോ അതോ അയൺ സപ്ലിമെന്റുകൾ ആവശ്യമുണ്ടോ?',
        'ഇരുമ്പിന്റെ കുറവുണ്ടോ എന്ന് പരിശോധിക്കാൻ സിറം ഫെറിറ്റിൻ (Serum Ferritin) ടെസ്റ്റ് ചെയ്യേണ്ടതുണ്ടോ?',
        'ഈ അളവ് വർദ്ധിപ്പിക്കാൻ ഭക്ഷണത്തിൽ എന്തൊക്കെ മാറ്റങ്ങൾ കൊണ്ടുവരണം?',
        'എത്ര മാസങ്ങൾക്ക് ശേഷം ഈ രക്തപരിശോധന വീണ്ടും നടത്തണം?'
      ],
      medicalDisclaimer: 'വിദ്യാഭ്യാസ ആവശ്യങ്ങൾക്ക് മാത്രം: ബോധിവാ മെഡിക്കൽ റിപ്പോർട്ടുകൾ ലളിതമായി വിശദീകരിക്കുകയാണ് ചെയ്യുന്നത്. ഇത് രോഗനിർണ്ണയമോ ചികിത്സയോ അല്ല. ആരോഗ്യപരമായ കാര്യങ്ങൾക്ക് ഡോക്ടറുമായി സംസാരിക്കുക.',
      originalLanguage: 'English',
      targetLanguage: 'ml',
      createdAt: '2026-11-16T10:00:00.000Z'
    };
  }

  // Default English Sample
  return {
    id: 'sample-cbc-en',
    isSampleDemonstration: true,
    metadata: {
      patientName: 'Sunitha Varma',
      reportDate: '2026-10-24',
      labName: 'DDRC Agilus Diagnostics',
      reportCategory: 'Complete Blood Count (CBC)'
    },
    summary: {
      quickOverview: 'Your Complete Blood Count (CBC) examines red blood cells, white blood cells, and platelets. Overall, 5 out of 7 parameters are in healthy ranges, while your hemoglobin and red cell count are mildly below reference values.',
      importantFindings: [
        'Hemoglobin is below the laboratory reference range (10.1 g/dL vs normal 12.0–15.5 g/dL).',
        'Platelet count is healthy at 2,40,000 /uL, ensuring normal blood clotting.',
        'White Blood Cell (WBC) count is well-balanced (6,800 /uL) with no signs of acute infection.'
      ],
      totalTests: 7,
      outOfRangeCount: 2,
      hasUrgentFlags: false,
      urgentAdvice: null
    },
    tests: [
      {
        id: 't-hgb',
        testName: 'Hemoglobin (Hb)',
        category: 'Hematology',
        measuredValue: 10.1,
        valueString: '10.1',
        unit: 'g/dL',
        referenceRangeRaw: '12.0 – 15.5',
        refMin: 12.0,
        refMax: 15.5,
        status: 'low',
        meaningSimple: 'Hemoglobin is the oxygen-carrying protein inside red blood cells that delivers oxygen from lungs to body tissues.',
        resultIndication: 'Your hemoglobin is below this lab\'s reference range. This can sometimes cause mild fatigue, reduced stamina, or pale skin.',
        clinicalContext: 'Common reasons include nutritional iron intake, menstrual flow, or minor absorption differences. Discuss with your physician.'
      },
      {
        id: 't-rbc',
        testName: 'Total RBC Count',
        category: 'Hematology',
        measuredValue: 3.8,
        valueString: '3.8',
        unit: 'mil/uL',
        referenceRangeRaw: '4.0 – 5.2',
        refMin: 4.0,
        refMax: 5.2,
        status: 'low',
        meaningSimple: 'The total count of red blood cells circulating in your bloodstream.',
        resultIndication: 'Slightly below reference range, mirroring the lower hemoglobin level.',
        clinicalContext: 'Bone marrow produces red blood cells with the aid of Iron, Vitamin B12, and Folate.'
      },
      {
        id: 't-wbc',
        testName: 'Total Leucocyte Count (WBC)',
        category: 'Hematology',
        measuredValue: 6800,
        valueString: '6,800',
        unit: '/uL',
        referenceRangeRaw: '4,000 – 11,000',
        refMin: 4000,
        refMax: 11000,
        status: 'normal',
        meaningSimple: 'White blood cells are your immune system\'s primary defense against infections.',
        resultIndication: 'Within optimal range, reflecting stable immune baseline.',
        clinicalContext: 'Rises during acute bacterial or viral infections and physical stress.'
      },
      {
        id: 't-plt',
        testName: 'Platelet Count',
        category: 'Hematology',
        measuredValue: 240000,
        valueString: '2,40,000',
        unit: '/uL',
        referenceRangeRaw: '1,50,000 – 4,50,000',
        refMin: 150000,
        refMax: 450000,
        status: 'normal',
        meaningSimple: 'Cell fragments that help your blood clot properly to stop cuts or wounds from bleeding.',
        resultIndication: 'Well within normal range, supporting healthy blood clotting.',
        clinicalContext: 'Can drop temporarily during viral fevers like Dengue, but your level is stable.'
      },
      {
        id: 't-mcv',
        testName: 'Mean Corpuscular Volume (MCV)',
        category: 'Hematology',
        measuredValue: 84,
        valueString: '84.0',
        unit: 'fL',
        referenceRangeRaw: '80.0 – 99.0',
        refMin: 80.0,
        refMax: 99.0,
        status: 'normal',
        meaningSimple: 'Measures the physical average size of your individual red blood cells.',
        resultIndication: 'Normal red blood cell volume (normocytic).',
        clinicalContext: 'Helps physicians classify whether lower hemoglobin relates to iron or vitamins.'
      },
      {
        id: 't-neu',
        testName: 'Neutrophils',
        category: 'Differential Count',
        measuredValue: 62,
        valueString: '62',
        unit: '%',
        referenceRangeRaw: '40 – 75',
        refMin: 40,
        refMax: 75,
        status: 'normal',
        meaningSimple: 'The most abundant type of white blood cell, specialized in neutralizing bacteria.',
        resultIndication: 'Normal proportion among white blood cells.',
        clinicalContext: 'Fluctuates during immune responses to bacterial activity.'
      },
      {
        id: 't-lym',
        testName: 'Lymphocytes',
        category: 'Differential Count',
        measuredValue: 30,
        valueString: '30',
        unit: '%',
        referenceRangeRaw: '20 – 45',
        refMin: 20,
        refMax: 45,
        status: 'normal',
        meaningSimple: 'Specialized white blood cells that produce antibodies and remember past viruses.',
        resultIndication: 'Healthy distribution within reference limits.',
        clinicalContext: 'Important for long-term immune protection.'
      }
    ],
    questionsForDoctor: [
      'What could be the primary reason for my hemoglobin level being 10.1 g/dL?',
      'Would you recommend checking my Serum Ferritin (iron stores) or Vitamin B12 levels?',
      'Should I focus on dietary iron improvements, or are therapeutic iron supplements advisable?',
      'When would be the best time to repeat this blood test to check my progress?'
    ],
    medicalDisclaimer: 'Educational medical information only. Bodhiva does not provide medical diagnoses or prescriptions. Always consult a qualified physician.',
    originalLanguage: 'English',
    targetLanguage: 'en',
    createdAt: '2026-11-16T10:00:00.000Z'
  };
}
