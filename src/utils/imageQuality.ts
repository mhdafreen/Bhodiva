import { QualityCheckResult } from '../types/upload';

/**
 * Validates image quality (blur, lighting, resolution) using client-side canvas heuristics.
 */
export async function inspectImageQuality(imageSource: string | File): Promise<QualityCheckResult> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    let objectUrl = '';
    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else {
      objectUrl = URL.createObjectURL(imageSource);
      img.src = objectUrl;
    }

    img.onload = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);

      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;

      // 1. Resolution Check
      const isLowRes = width < 750 || height < 600;

      // Create downscaled canvas for fast heuristic inspection (max 400px wide)
      const canvas = document.createElement('canvas');
      const maxSampleDim = 400;
      const scale = Math.min(1, maxSampleDim / Math.max(width, height));
      canvas.width = Math.max(50, Math.floor(width * scale));
      canvas.height = Math.max(50, Math.floor(height * scale));

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({
          isBlurry: false,
          isDark: false,
          isLowRes,
          blurScore: 100,
          brightnessScore: 128,
          resolution: { width, height },
          warnings: isLowRes ? ['Low resolution image'] : []
        });
        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // 2. Brightness Check (Average Luminance)
      let totalLuminance = 0;
      const grayPixels: number[] = new Array(canvas.width * canvas.height);

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Standard perceptual luminance formula
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        totalLuminance += lum;
        grayPixels[i / 4] = lum;
      }

      const pixelCount = canvas.width * canvas.height;
      const avgBrightness = totalLuminance / pixelCount;
      const isDark = avgBrightness < 55; // Threshold for poor lighting / underexposed paper

      // 3. Blur Detection (Laplacian Variance Heuristic)
      // High variance in neighbor gradients = sharp edges/text. Low variance = blurry.
      let laplacianSum = 0;
      let laplacianSqSum = 0;
      let evaluatedEdges = 0;

      const w = canvas.width;
      const h = canvas.height;

      for (let y = 1; y < h - 1; y += 2) {
        for (let x = 1; x < w - 1; x += 2) {
          const idx = y * w + x;
          // Discrete 3x3 Laplacian kernel approximation:
          // [ 0,  1,  0 ]
          // [ 1, -4,  1 ]
          // [ 0,  1,  0 ]
          const center = grayPixels[idx];
          const top = grayPixels[idx - w];
          const bottom = grayPixels[idx + w];
          const left = grayPixels[idx - 1];
          const right = grayPixels[idx + 1];

          const laplacian = top + bottom + left + right - 4 * center;
          laplacianSum += laplacian;
          laplacianSqSum += laplacian * laplacian;
          evaluatedEdges++;
        }
      }

      const meanLaplacian = evaluatedEdges > 0 ? laplacianSum / evaluatedEdges : 0;
      const variance = evaluatedEdges > 0 ? laplacianSqSum / evaluatedEdges - meanLaplacian * meanLaplacian : 0;

      // Lower variance indicates blurred text edges
      const isBlurry = variance < 38;

      const warnings: string[] = [];
      if (isBlurry) {
        warnings.push('Image appears blurry. Text might be hard to read.');
      }
      if (isDark) {
        warnings.push('Photo lighting is dim. Make sure test values are well illuminated.');
      }
      if (isLowRes) {
        warnings.push('Low image resolution. Higher resolution provides more accurate extraction.');
      }

      resolve({
        isBlurry,
        isDark,
        isLowRes,
        blurScore: Math.round(variance),
        brightnessScore: Math.round(avgBrightness),
        resolution: { width, height },
        warnings
      });
    };

    img.onerror = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      resolve({
        isBlurry: false,
        isDark: false,
        isLowRes: false,
        blurScore: 50,
        brightnessScore: 128,
        resolution: { width: 0, height: 0 },
        warnings: ['Unable to analyze image quality']
      });
    };
  });
}
