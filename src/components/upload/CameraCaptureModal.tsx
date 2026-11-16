import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, X, RefreshCw, Check, AlertTriangle, Flashlight, AlertCircle } from 'lucide-react';
import { inspectImageQuality } from '../../utils/imageQuality';
import { QualityCheckResult } from '../../types/upload';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoCaptured: (dataUrl: string, quality: QualityCheckResult) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onPhotoCaptured
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [qualityCheck, setQualityCheck] = useState<QualityCheckResult | null>(null);
  const [isCheckingQuality, setIsCheckingQuality] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  // Stop video stream safely
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
  }, []);

  // Start native camera stream
  const startCamera = useCallback(async (mode: 'environment' | 'user') => {
    stopStream();
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access is not directly supported by this browser. You can still use your device camera below.');
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Check available devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter(d => d.kind === 'videoinput');
      setHasMultipleCameras(videoInputs.length > 1);

    } catch (err: any) {
      console.warn('Camera access denied or failed:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera permissions in your browser or use the file upload fallback.');
      } else {
        setCameraError('Could not start live camera view. Use the native capture button below.');
      }
    }
  }, [stopStream]);

  // Lifecycle when modal opens/closes
  useEffect(() => {
    if (isOpen && !capturedPhoto) {
      startCamera(facingMode);
    } else {
      stopStream();
    }
    return () => {
      stopStream();
    };
  }, [isOpen, facingMode, capturedPhoto, startCamera, stopStream]);

  // Flip camera (rear/front)
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Toggle flashlight / torch if supported
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    const capabilities: any = track.getCapabilities?.() || {};

    if (capabilities.torch) {
      try {
        await (track as any).applyConstraints({
          advanced: [{ torch: !isTorchOn }]
        });
        setIsTorchOn(!isTorchOn);
      } catch (e) {
        console.warn('Failed to toggle torch:', e);
      }
    }
  };

  // Capture still from video stream
  const takeSnapshot = async () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    stopStream();
    setCapturedPhoto(dataUrl);

    // Run quality heuristic
    setIsCheckingQuality(true);
    const quality = await inspectImageQuality(dataUrl);
    setQualityCheck(quality);
    setIsCheckingQuality(false);
  };

  // Fallback native input capture
  const handleNativeFallbackCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setCapturedPhoto(dataUrl);
      setIsCheckingQuality(true);
      const quality = await inspectImageQuality(dataUrl);
      setQualityCheck(quality);
      setIsCheckingQuality(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setQualityCheck(null);
    startCamera(facingMode);
  };

  const handleConfirm = () => {
    if (capturedPhoto && qualityCheck) {
      onPhotoCaptured(capturedPhoto, qualityCheck);
      onClose();
      setCapturedPhoto(null);
      setQualityCheck(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-600/30 text-brand-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {capturedPhoto ? 'Review Captured Photo' : 'Document Camera Viewfinder'}
              </h3>
              <p className="text-xs text-slate-400">
                {capturedPhoto ? 'Check sharpness and orientation' : 'Hold phone steady over medical sheet'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopStream();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
            aria-label="Close camera"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder / Preview Body */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[360px] overflow-hidden">
          {!capturedPhoto ? (
            <>
              {/* Active Video Feed */}
              {!cameraError ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    ref={videoRef}
                    playsInline
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Document Viewfinder Overlay Guide */}
                  <div className="absolute inset-6 sm:inset-10 border-2 border-dashed border-teal-400/70 rounded-2xl pointer-events-none flex flex-col justify-between p-4 shadow-[0_0_50px_rgba(13,148,136,0.2)]">
                    <div className="flex justify-between items-start">
                      <div className="w-6 h-6 border-t-4 border-l-4 border-teal-400 rounded-tl-lg" />
                      <div className="w-6 h-6 border-t-4 border-r-4 border-teal-400 rounded-tr-lg" />
                    </div>
                    <div className="text-center">
                      <span className="bg-slate-950/75 text-teal-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-teal-500/30 backdrop-blur-sm">
                        Align edges of lab report inside frame
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="w-6 h-6 border-b-4 border-l-4 border-teal-400 rounded-bl-lg" />
                      <div className="w-6 h-6 border-b-4 border-r-4 border-teal-400 rounded-br-lg" />
                    </div>
                  </div>
                </div>
              ) : (
                /* Fallback error view with native trigger */
                <div className="p-8 text-center text-white max-w-md">
                  <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                  <h4 className="text-lg font-bold mb-2">Camera Access Notice</h4>
                  <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                    {cameraError}
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg transition"
                  >
                    Open Device Camera Directly
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleNativeFallbackCapture}
                  />
                </div>
              )}
            </>
          ) : (
            /* Review Captured Photo */
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
              <img
                src={capturedPhoto}
                alt="Captured medical sheet"
                className="max-h-[60vh] max-w-full rounded-2xl object-contain shadow-2xl border border-slate-700"
              />

              {/* Quality Assessment Feedback Badge */}
              {isCheckingQuality ? (
                <div className="absolute top-6 bg-slate-900/90 text-teal-400 text-xs font-bold px-4 py-2 rounded-full border border-teal-500/40 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Checking image sharpness & lighting...
                </div>
              ) : qualityCheck && (
                <div className="absolute top-6 flex flex-col items-center gap-2 max-w-sm px-4">
                  {qualityCheck.warnings.length === 0 ? (
                    <div className="bg-emerald-950/90 text-emerald-300 text-xs font-bold px-4 py-2 rounded-full border border-emerald-500/40 flex items-center gap-2 shadow-lg">
                      <Check className="w-4 h-4 stroke-[3]" />
                      Clear photo! Good lighting & sharpness.
                    </div>
                  ) : (
                    <div className="bg-amber-950/95 text-amber-200 text-xs font-medium px-4 py-2.5 rounded-2xl border border-amber-500/40 shadow-xl space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-300">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Quality Alert</span>
                      </div>
                      {qualityCheck.warnings.map((w, idx) => (
                        <p key={idx} className="text-[11px] leading-tight text-amber-200/90">
                          • {w}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Controls Bottom Bar */}
        <div className="p-5 bg-slate-900 border-t border-slate-800">
          {!capturedPhoto ? (
            <div className="flex items-center justify-around sm:justify-between max-w-md mx-auto w-full">
              {/* Optional Camera Controls */}
              {hasMultipleCameras ? (
                <button
                  onClick={toggleFacingMode}
                  className="p-3 text-slate-300 hover:text-white rounded-2xl bg-slate-800 hover:bg-slate-700 transition"
                  title="Switch Camera (Front/Rear)"
                  aria-label="Switch camera"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              ) : (
                <div className="w-11" />
              )}

              {/* Shutter Button */}
              <button
                onClick={takeSnapshot}
                disabled={!!cameraError}
                className="w-18 h-18 p-1.5 rounded-full border-4 border-teal-400/40 hover:border-teal-400 bg-white active:scale-95 transition-all shadow-xl group"
                aria-label="Take picture"
              >
                <div className="w-14 h-14 rounded-full bg-brand-600 group-hover:bg-brand-500 transition-colors flex items-center justify-center text-white">
                  <Camera className="w-6 h-6" />
                </div>
              </button>

              {/* Flashlight Toggle or Native File Trigger */}
              <button
                onClick={toggleTorch}
                className={`p-3 rounded-2xl transition ${
                  isTorchOn
                    ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30'
                    : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700'
                }`}
                title="Toggle Torch / Flashlight"
                aria-label="Toggle flashlight"
              >
                <Flashlight className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleNativeFallbackCapture}
              />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                onClick={handleRetake}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white text-sm font-semibold transition"
              >
                Retake Photo
              </button>
              <button
                onClick={handleConfirm}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirm & Add Page</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
