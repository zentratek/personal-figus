import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';

/**
 * OcrScannerScreen - Camera interface for scanning sticker packs
 * Phase 1: Basic camera access and capture ✅
 * Phase 2: OCR integration with batch mode
 */
export function OcrScannerScreen() {
  const navigate = useNavigate();
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [packsScanned, setPacksScanned] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [allDetectedNumbers, setAllDetectedNumbers] = useState([]); // Batch accumulator
  const [lastScanCount, setLastScanCount] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',  // Use back camera
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to data URL
    const imageData = canvas.toDataURL('image/png');
    setCapturedImage(imageData);

    // Start OCR scanning
    await scanImage(imageData);
  };

  const scanImage = async (imageData) => {
    setScanning(true);
    setProgress(0);

    try {
      const { data: { text } } = await Tesseract.recognize(
        imageData,
        'eng',
        {
          tessedit_char_whitelist: '0123456789', // Only numbers
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          }
        }
      );

      console.log('OCR result:', text);

      // Extract sticker numbers (1-960 for Copa Mundial 2026)
      const numbers = extractStickerNumbers(text);
      console.log('Detected numbers:', numbers);

      // Batch mode: accumulate with previous scans (remove duplicates)
      const combined = [...allDetectedNumbers, ...numbers];
      const unique = [...new Set(combined)];

      setAllDetectedNumbers(unique);
      setLastScanCount(numbers.length);
      setPacksScanned(prev => prev + 1);

      // Show success feedback
      if (numbers.length === 0) {
        alert('No se detectaron números. Intenta mejorar la iluminación o ingresá manualmente.');
      }
    } catch (err) {
      console.error('OCR error:', err);
      alert('Error al escanear. Intenta de nuevo con mejor iluminación.');
    } finally {
      setScanning(false);
      setProgress(0);
      setCapturedImage(null); // Return to camera view
    }
  };

  const extractStickerNumbers = (text) => {
    // Pattern: 3 uppercase letters + space/separator + 1-2 digit number
    // Examples: "GER 17", "AUS 3", "ECU 19"
    const pattern = /\b([A-Z]{3})\s*(\d{1,2})\b/g;
    const matches = [];
    let match;

    while ((match = pattern.exec(text)) !== null) {
      const countryCode = match[1];
      const number = parseInt(match[2]);

      // Validate: number should be 1-20 (each country has ~20 stickers)
      if (number >= 1 && number <= 20) {
        matches.push({
          code: countryCode,
          number: number,
          display: `${countryCode} ${number}`
        });
      }
    }

    // Remove duplicates by display string
    const unique = matches.filter((item, index, self) =>
      index === self.findIndex(t => t.display === item.display)
    );

    return unique;
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const handleCancel = () => {
    stopCamera();
    navigate('/');
  };

  const handleContinue = () => {
    // Continue to next pack
    setCapturedImage(null);
  };

  const handleFinish = () => {
    // TODO: Navigate to preview screen with all detected numbers
    console.log('Finishing with numbers:', allDetectedNumbers);

    // Sort by country code, then by number
    const sorted = [...allDetectedNumbers].sort((a, b) => {
      if (a.code !== b.code) return a.code.localeCompare(b.code);
      return a.number - b.number;
    });

    const displayList = sorted.map(s => s.display).join(', ');
    alert(`Detectadas ${allDetectedNumbers.length} figuritas de ${packsScanned} sobres:\n\n${displayList}`);
    stopCamera();
    navigate('/');
  };

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-[var(--bg)] flex flex-col items-center justify-center p-6">
        <div className="text-6xl mb-4">📷</div>
        <h2 className="text-xl font-bold mb-2 text-center">Error de Cámara</h2>
        <p className="text-[var(--muted)] text-center mb-6 max-w-md">
          {error}
        </p>
        <button
          onClick={handleCancel}
          className="px-6 py-3 bg-[var(--lime)] text-black font-bold rounded-xl border-2 border-black shadow-[4px_4px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] transition-all"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Video preview */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Captured image preview overlay */}
      {capturedImage && (
        <div className="absolute inset-0 bg-black">
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* Overlay guides and instructions */}
      {!capturedImage && cameraActive && !scanning && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Guide rectangle */}
          <div className="absolute inset-0 m-8">
            <div className="w-full h-full border-4 border-dashed border-[var(--primary)] opacity-50 rounded-xl" />
          </div>

          {/* Instructions */}
          <div className="absolute top-24 left-0 right-0 px-6">
            <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 border-2 border-[var(--lime)]">
              <p className="text-white text-center font-bold">
                {packsScanned === 0
                  ? "Apuntá a las 5 figuritas del primer sobre"
                  : "Apuntá al siguiente sobre"}
              </p>
              <p className="text-[var(--muted)] text-center text-sm mt-1">
                Asegurate de tener buena iluminación
              </p>
            </div>
          </div>

          {/* Pack counter badge */}
          {packsScanned > 0 && (
            <div className="absolute top-8 right-8 pointer-events-auto">
              <div className="bg-[var(--lime)] text-black px-4 py-2 rounded-[10px] font-bold shadow-[4px_4px_0_#000] border-2 border-black">
                {packsScanned} {packsScanned === 1 ? 'sobre' : 'sobres'}
              </div>
            </div>
          )}

          {/* Mini-preview: Total accumulated */}
          {allDetectedNumbers.length > 0 && (
            <div className="absolute top-8 left-8 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-xl border-2 border-[var(--lime)]">
              <p className="text-[var(--lime)] font-mono font-bold text-lg">
                {allDetectedNumbers.length} figus
              </p>
              {lastScanCount > 0 && (
                <p className="text-[var(--muted)] text-xs">
                  +{lastScanCount} último escaneo
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* OCR scanning overlay */}
      {scanning && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Escaneando...
          </h2>
          <div className="w-64 h-3 bg-[var(--surface)] rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-[var(--lime)] transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[var(--lime)] font-mono font-bold text-lg">
            {progress}%
          </p>
          <p className="text-[var(--muted)] text-sm mt-2">
            Detectando números...
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
        {!scanning && (
          <>
            <button
              onClick={captureImage}
              disabled={!cameraActive || scanning}
              className="w-full h-16 bg-[var(--primary)] text-black font-bold text-lg rounded-xl border-2 border-black shadow-[4px_4px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {packsScanned === 0 ? 'Capturar Primer Sobre' : 'Capturar Otro Sobre'}
            </button>

            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-3 bg-[var(--surface)] border-2 border-[var(--border)] rounded-xl text-white font-bold hover:bg-[var(--surface-2)] transition-colors"
              >
                Cancelar
              </button>

              {allDetectedNumbers.length > 0 && (
                <button
                  onClick={handleFinish}
                  className="flex-1 py-3 bg-[var(--lime)] text-black font-bold rounded-xl border-2 border-black shadow-[4px_4px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] transition-all"
                >
                  Terminar ({allDetectedNumbers.length})
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
