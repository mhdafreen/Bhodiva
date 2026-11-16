import * as pdfjsLib from 'pdfjs-dist';

// Configure worker for pdfjs-dist
if (typeof window !== 'undefined' && 'Worker' in window) {
  // Use official CDN fallback for worker script to avoid bundling complications with Vite asset hashing
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export interface ExtractedPdfPage {
  pageNumber: number;
  dataUrl: string;
  width: number;
  height: number;
  textSnippet: string;
}

/**
 * Extracts all pages of a PDF file as renderable image DataURLs
 */
export async function extractPagesFromPdf(
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<ExtractedPdfPage[]> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  const extractedPages: ExtractedPdfPage[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    
    // Scale for crisp readable medical report rendering (1.5x)
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (ctx) {
      await (page.render({
        canvasContext: ctx,
        viewport,
        canvas: canvas as any
      } as any)).promise;

      // Extract a quick text snippet for quick diagnosis
      const textContent = await page.getTextContent();
      const textSnippet = textContent.items
        .slice(0, 30)
        .map((item: any) => item.str || '')
        .join(' ');

      extractedPages.push({
        pageNumber: pageNum,
        dataUrl: canvas.toDataURL('image/jpeg', 0.90),
        width: Math.round(viewport.width),
        height: Math.round(viewport.height),
        textSnippet
      });
    }

    if (onProgress) {
      onProgress(pageNum, numPages);
    }
  }

  return extractedPages;
}
