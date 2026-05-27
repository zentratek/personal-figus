import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { getSticker, updateStickerStatus } from '../services/stickerService';
import { useSubscription } from '../hooks/useSubscription';
import { incrementOcrUsage } from '../services/subscriptionService';
import { UpgradeModal } from '../components/subscription/UpgradeModal';

// Google Gemini Vision API configuration
const GEMINI_API_KEY = 'AIzaSyDpUrjiO-oILmpRP8TpFamLgvox7Hwfq54';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * OcrScannerScreen - Camera interface for scanning sticker packs
 * Phase 1: Basic camera access and capture ✅
 * Phase 2: AI Vision integration with Gemini ✅
 * Note: Uses official FIFA country codes (e.g., KSA, RSA)
 */
export function OcrScannerScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const subscription = useSubscription(user?.uid);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [packsScanned, setPacksScanned] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [allDetectedNumbers, setAllDetectedNumbers] = useState([]); // Batch accumulator
  const [lastScanCount, setLastScanCount] = useState(0);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const trackRef = useRef(null);

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Tu navegador no soporta acceso a la cámara. Intenta usar HTTPS o un navegador más moderno.');
        return;
      }

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

        // Store video track for flash control
        const videoTrack = stream.getVideoTracks()[0];
        trackRef.current = videoTrack;

        setCameraActive(true);
      }
    } catch (err) {
      console.error('Camera access error:', err);

      // Better error messages based on error type
      let errorMessage = 'No se pudo acceder a la cámara.';

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Permiso de cámara denegado. Ve a la configuración de tu navegador y permite el acceso a la cámara.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = 'No se encontró una cámara en tu dispositivo.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = 'La cámara está siendo usada por otra aplicación. Cierra otras apps que usen la cámara.';
      } else if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
        errorMessage = 'Tu cámara no cumple con los requisitos solicitados.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage = 'Acceso a cámara no soportado. Asegúrate de estar usando HTTPS (o http://localhost).';
      } else if (err.name === 'TypeError') {
        errorMessage = 'Error de configuración. Intenta usar HTTPS o acceder desde http://localhost en lugar de la IP.';
      }

      setError(errorMessage);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      trackRef.current = null;
    }
  };

  const toggleFlash = async () => {
    if (!trackRef.current) return;

    try {
      const capabilities = trackRef.current.getCapabilities();

      // Check if torch (flash) is supported
      if (!capabilities.torch) {
        toast.error('Tu cámara no soporta flash/linterna.');
        return;
      }

      const newFlashState = !flashEnabled;
      await trackRef.current.applyConstraints({
        advanced: [{ torch: newFlashState }]
      });

      setFlashEnabled(newFlashState);
    } catch (err) {
      console.error('Flash toggle error:', err);
      toast.error('No se pudo activar el flash. Asegurate de que tu dispositivo lo soporte.');
    }
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    // CHECK PERMISSION BEFORE SCANNING
    const canScan = await subscription.canUseOcr();
    if (!canScan) {
      setShowUpgradeModal(true);
      return;
    }

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

    // Start AI vision scanning automatically
    await scanImage(imageData);
  };

  const scanImage = async (imageData) => {
    setScanning(true);
    setProgress(0);

    try {
      setProgress(30);

      // Extract base64 data (remove data:image/png;base64, prefix)
      const base64Data = imageData.split(',')[1];

      // Call Gemini Vision API
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: 'Esta es una imagen de figuritas del álbum Panini FIFA World Cup 2026. Cada figurita tiene un código de 2-3 LETRAS MAYÚSCULAS seguido de un ESPACIO y un NÚMERO en la esquina superior derecha. Los códigos pueden ser: (1) Países de 3 letras con números 1-20 (ej: "GER 17", "AUS 3", "ECU 19", "QAT 8", "PAN 19"), (2) "FWC" con números 1-20 (ej: "FWC 1", "FWC 15"), o (3) "CC" con números 1-14 (ej: "CC 1", "CC 7"). Analiza la imagen cuidadosamente y extrae TODOS los códigos que veas. Devuelve SOLAMENTE una lista separada por comas, sin texto adicional. Ejemplo de respuesta correcta: GER 17, AUS 3, FWC 15, CC 7, ECU 19'
              },
              {
                inline_data: {
                  mime_type: 'image/png',
                  data: base64Data
                }
              }
            ]
          }]
        })
      });

      setProgress(60);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error details:', errorText);
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';

      setProgress(80);
      console.log('Gemini Vision response:', text);

      // Extract sticker numbers
      const numbers = extractStickerNumbers(text);
      console.log('Detected stickers:', numbers);

      if (numbers.length === 0) {
        toast.error('No se detectaron figuritas válidas. Asegúrate de que los códigos (ej: GER 17) sean visibles en la esquina superior derecha de cada figurita.', {
          duration: 4000,
        });
      } else {
        // Batch mode: accumulate with previous scans (remove duplicates)
        const combined = [...allDetectedNumbers, ...numbers];
        const uniqueMap = new Map();
        combined.forEach(item => {
          uniqueMap.set(item.display, item);
        });
        const unique = Array.from(uniqueMap.values());

        setAllDetectedNumbers(unique);
        setLastScanCount(numbers.length);
        setPacksScanned(prev => prev + 1);

        // AFTER successful scan, increment counter (only for non-VIP users)
        if (!subscription.isVip) {
          await incrementOcrUsage(user.uid);
        }
      }

      setProgress(100);
    } catch (err) {
      console.error('Vision API error:', err);
      toast.error(`Error al escanear: ${err.message}. Por favor intenta de nuevo.`);
    } finally {
      setScanning(false);
      setProgress(0);
      setCapturedImage(null); // Return to camera view
    }
  };

  const extractStickerNumbers = (text) => {
    // Pattern: 2-3 uppercase letters + space/separator + 1-2 digit number
    // Examples: "GER 17", "AUS 3", "ECU 19", "FWC 15", "CC 7"
    const pattern = /\b([A-Z]{2,3})\s*(\d{1,2})\b/g;
    const matches = [];
    let match;

    while ((match = pattern.exec(text)) !== null) {
      const code = match[1];
      const number = parseInt(match[2]);

      // Validate based on code type
      let isValid = false;
      if (code === 'CC') {
        // Coca-Cola: 1-14
        isValid = number >= 1 && number <= 14;
      } else if (code === 'FWC') {
        // FIFA World Cup: 1-20
        isValid = number >= 1 && number <= 20;
      } else if (code.length === 3) {
        // Country codes: 1-20
        isValid = number >= 1 && number <= 20;
      }

      if (isValid) {
        matches.push({
          code: code,
          number: number,
          display: `${code} ${number}`
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

  const handleFinish = async () => {
    console.log('Finishing with numbers:', allDetectedNumbers);

    if (allDetectedNumbers.length === 0) {
      toast.error('No hay figuritas para agregar al álbum.');
      stopCamera();
      navigate('/');
      return;
    }

    try {
      // Show loading state
      setScanning(true);
      setProgress(0);

      // Update all detected stickers in Firestore
      const total = allDetectedNumbers.length;
      let newCount = 0;
      let repeatedCount = 0;

      for (let i = 0; i < total; i++) {
        const sticker = allDetectedNumbers[i];

        // Get current sticker status
        const currentSticker = await getSticker(user.uid, sticker.display);

        if (!currentSticker) {
          console.warn(`Sticker ${sticker.display} not found in database`);
          continue;
        }

        if (currentSticker.status === 'needed') {
          // First time getting this sticker
          await updateStickerStatus(user.uid, sticker.display, 'owned', 1);
          newCount++;
        } else if (currentSticker.status === 'owned') {
          // Already have one, now it's repeated
          await updateStickerStatus(user.uid, sticker.display, 'repeated', 2);
          repeatedCount++;
        } else if (currentSticker.status === 'repeated') {
          // Already repeated, increment count
          const newCount = currentSticker.count + 1;
          await updateStickerStatus(user.uid, sticker.display, 'repeated', newCount);
          repeatedCount++;
        }

        setProgress(Math.round(((i + 1) / total) * 100));
      }

      setScanning(false);

      // Sort by country code, then by number
      const sorted = [...allDetectedNumbers].sort((a, b) => {
        if (a.code !== b.code) return a.code.localeCompare(b.code);
        return a.number - b.number;
      });

      const displayList = sorted.map(s => s.display).join(', ');
      let message = `✅ Procesadas ${allDetectedNumbers.length} figuritas`;
      if (newCount > 0) message += ` | 🆕 Nuevas: ${newCount}`;
      if (repeatedCount > 0) message += ` | 🔁 Repetidas: ${repeatedCount}`;

      toast.success(message, {
        duration: 4000,
      });

      stopCamera();
      navigate('/album');
    } catch (error) {
      console.error('Error updating album:', error);
      toast.error('Error al actualizar el álbum. Intenta de nuevo.');
      setScanning(false);
    }
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

      {/* Captured image preview (shown briefly during scanning) */}
      {capturedImage && !scanning && (
        <div className="absolute inset-0 bg-black">
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* AI Vision scanning overlay */}
      {scanning && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Escaneando con IA...
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
            Detectando códigos de figuritas...
          </p>
        </div>
      )}

      {/* Overlay guides and instructions */}
      {!capturedImage && cameraActive && (
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

              {/* OCR Scan Counter */}
              {!subscription.loading && (
                <div className="mt-3 pt-3 border-t border-[var(--border)]">
                  {subscription.isFree && (
                    <p className="text-sm text-center text-[var(--muted)]">
                      <span className="text-[var(--lime)] font-bold">{subscription.ocrScansRemaining}</span> escaneos restantes
                    </p>
                  )}
                  {subscription.isVip && (
                    <div className="flex items-center justify-center gap-2 text-[var(--lime)]">
                      <span className="font-bold">✨ VIP</span>
                      <span className="text-sm">OCR ilimitado</span>
                    </div>
                  )}
                </div>
              )}
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
          <div className="absolute top-8 left-8 flex flex-col gap-2 pointer-events-auto">
            {/* Flash toggle button */}
            <button
              onClick={toggleFlash}
              className={`w-12 h-12 rounded-full border-2 border-black shadow-[4px_4px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] transition-all flex items-center justify-center text-2xl ${
                flashEnabled
                  ? 'bg-[var(--lime)] text-black'
                  : 'bg-black/80 backdrop-blur-sm text-white'
              }`}
              title={flashEnabled ? 'Apagar flash' : 'Encender flash'}
            >
              {flashEnabled ? '💡' : '🔦'}
            </button>

            {/* Sticker counter */}
            {allDetectedNumbers.length > 0 && (
              <div className="bg-black/80 backdrop-blur-sm px-4 py-2 rounded-xl border-2 border-[var(--lime)]">
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
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
        {!capturedImage && !scanning && (
          <>
            <button
              onClick={captureImage}
              disabled={!cameraActive}
              className="w-full h-16 bg-[var(--primary)] text-black font-bold text-lg rounded-xl border-2 border-black shadow-[4px_4px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {packsScanned === 0 ? 'Escanear Primer Sobre' : 'Escanear Otro Sobre'}
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

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradeModal
          reason="ocr_limit"
          currentUsage={subscription.ocrScansUsed}
          onClose={() => setShowUpgradeModal(false)}
        />
      )}
    </div>
  );
}
