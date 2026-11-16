export interface QualityCheckResult {
  isBlurry: boolean;
  isDark: boolean;
  isLowRes: boolean;
  blurScore: number;       // Higher is sharper
  brightnessScore: number; // 0 (black) to 255 (white)
  resolution: {
    width: number;
    height: number;
  };
  warnings: string[];
}

export interface ReportPage {
  id: string;
  file?: File;
  previewUrl: string;
  pageNumber: number;
  rotation: number; // 0, 90, 180, 270
  name: string;
  size: number; // in bytes
  quality?: QualityCheckResult;
  source: 'camera' | 'gallery' | 'pdf';
  isCheckingQuality?: boolean;
}

export type UploadMode = 'camera' | 'gallery' | 'pdf';

export interface DocumentUploadState {
  pages: ReportPage[];
  activeMode: UploadMode;
  isProcessing: boolean;
  currentStep: 'select' | 'review' | 'processing';
  error: string | null;
}
