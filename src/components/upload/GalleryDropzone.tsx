import React, { useState, useRef } from 'react';
import { Image, AlertCircle, RefreshCw } from 'lucide-react';
import { inspectImageQuality } from '../../utils/imageQuality';
import { fileToDataUrl } from '../../utils/imageTransform';
import { ReportPage } from '../../types/upload';

interface GalleryDropzoneProps {
  onImagesSelected: (pages: ReportPage[]) => void;
}

export const GalleryDropzone: React.FC<GalleryDropzoneProps> = ({ onImagesSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processFiles = async (fileList: FileList | File[]) => {
    setErrorMessage(null);
    const validFiles: File[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (validTypes.includes(file.type) || /\.(jpe?g|png)$/i.test(file.name)) {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) {
      setErrorMessage('Please select supported image formats (JPG, JPEG, PNG).');
      return;
    }

    setIsProcessing(true);
    try {
      const newPages: ReportPage[] = [];

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const dataUrl = await fileToDataUrl(file);
        const quality = await inspectImageQuality(dataUrl);

        newPages.push({
          id: `img-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
          file,
          previewUrl: dataUrl,
          pageNumber: i + 1,
          rotation: 0,
          name: file.name,
          size: file.size,
          quality,
          source: 'gallery'
        });
      }

      onImagesSelected(newPages);
    } catch (err) {
      console.error('Failed to process selected images:', err);
      setErrorMessage('Error reading images. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-brand-500 bg-brand-50/80 scale-[1.01]'
            : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50/70 bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && processFiles(e.target.files)}
        />

        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center mx-auto shadow-inner">
            <Image className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-lg font-bold text-accent-charcoal mb-1">
              Select Photos from your Gallery
            </h4>
            <p className="text-xs sm:text-sm text-slate-500">
              Drop one or multiple photos here, or <span className="text-brand-600 font-semibold underline">browse gallery</span>
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-4 text-xs text-slate-400">
            <span>JPG, JPEG, PNG</span>
            <span>•</span>
            <span>Multiple pages supported</span>
            <span>•</span>
            <span>Auto quality check</span>
          </div>
        </div>
      </div>

      {isProcessing && (
        <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 text-brand-900 flex items-center justify-center gap-2 text-sm font-semibold animate-fadeIn">
          <RefreshCw className="w-4 h-4 animate-spin text-brand-600" />
          <span>Validating image clarity and preparing pages...</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-700 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
