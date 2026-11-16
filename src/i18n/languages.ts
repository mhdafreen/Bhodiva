export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  region: string;
  greeting: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    region: 'Universal',
    greeting: 'Welcome to Bodhiva',
    flag: '🌐'
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    region: 'Kerala',
    greeting: 'ബോധിവാ-യിലേക്ക് സ്വാഗതം',
    flag: '🌴'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    region: 'North & Central India',
    greeting: 'बोधिव में आपका स्वागत है',
    flag: '🇮🇳'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    region: 'Tamil Nadu & Puducherry',
    greeting: 'போதிவாவிற்கு நல்வரவு',
    flag: '🏛️'
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    region: 'Karnataka',
    greeting: 'ಬೋಧಿವಗೆ ಸುಸ್ವಾಗತ',
    flag: '🌾'
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    region: 'Andhra Pradesh & Telangana',
    greeting: 'బోధివాకు స్వాగతం',
    flag: '☀️'
  }
];

export const DEFAULT_LANGUAGE = 'en';
