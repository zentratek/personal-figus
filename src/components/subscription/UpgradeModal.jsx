import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { validatePromoCode, calculatePrice } from '../../services/subscriptionService';

export function UpgradeModal({ reason, onClose, currentUsage }) {
  const { user } = useAuth();
  const [promoCode, setPromoCode] = useState('');
  const [showQr, setShowQr] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);

  const tiers = {
    premium: {
      name: 'Premium',
      price: 10000,
      duration: '3 meses',
      features: [
        '✅ Grupos ILIMITADOS',
        '✅ Sin límite de miembros por grupo',
        '✅ Todo lo incluido en FREE',
        '⚠️ 5 escaneos OCR (mismo límite)'
      ],
      recommended: reason === 'group_size_limit' || reason === 'group_count_limit'
    },
    vip: {
      name: 'VIP',
      price: 20000,
      duration: '3 meses',
      features: [
        '✨ OCR ILIMITADO',
        '✅ Grupos ILIMITADOS',
        '✅ Sin límite de miembros por grupo',
        '✅ Badge VIP en perfil',
        '✅ Soporte prioritario'
      ],
      recommended: reason === 'ocr_limit'
    }
  };

  const getPrice = (tier) => {
    return calculatePrice(tier.price, promoCode);
  };

  const promoValidation = validatePromoCode(promoCode);

  const handleUpgrade = (tierKey) => {
    setSelectedTier(tierKey);
    setShowQr(true);
  };

  const handleSendEmail = () => {
    const tier = tiers[selectedTier];
    const price = getPrice(tier);

    const subject = `[FIGUS] Pago ${tier.name} - ${user.uid}`;
    const body = `
Hola,

Acabo de realizar el pago para activar mi suscripción:

- Usuario: ${user.displayName}
- Email: ${user.email}
- User ID: ${user.uid}
- Tier: ${tier.name}
- Código promocional: ${promoCode || 'Ninguno'}
- Monto pagado: $${price.toLocaleString('es-CO')} COP

Adjunto screenshot del comprobante.

Gracias!
    `.trim();

    window.location.href = `mailto:latinkid2211@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getReasonTitle = () => {
    switch (reason) {
      case 'ocr_limit':
        return '🔒 Llegaste al límite de escaneos';
      case 'group_size_limit':
        return '🔒 Grupos de más de 3 personas requieren upgrade';
      case 'group_count_limit':
        return '🔒 Solo 1 grupo activo en FREE';
      default:
        return '🚀 Upgrade tu cuenta';
    }
  };

  const getReasonDescription = () => {
    switch (reason) {
      case 'ocr_limit':
        return `Ya usaste ${currentUsage} de 5 escaneos gratuitos. Upgrade a VIP para escaneos ilimitados.`;
      case 'group_size_limit':
        return 'Los grupos con más de 3 miembros requieren Premium o VIP.';
      case 'group_count_limit':
        return 'Usuarios FREE solo pueden tener 1 grupo activo. Upgrade para grupos ilimitados.';
      default:
        return 'Desbloquea todas las funciones premium de Figus.';
    }
  };

  if (!showQr) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-auto">

          {/* Header */}
          <h2 className="text-2xl font-bold mb-2">
            {getReasonTitle()}
          </h2>
          <p className="text-[var(--muted)] text-sm mb-6">
            {getReasonDescription()}
          </p>

          {/* Promo Code Input */}
          <div className="mb-6">
            <label className="text-sm text-[var(--muted)] mb-2 block">
              ¿Tenés un código promocional?
            </label>
            <input
              type="text"
              placeholder="Ingresá tu código"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--bg)] border-2 border-[var(--border)] rounded-xl text-[var(--text)] font-mono uppercase"
            />
            {promoValidation.valid && (
              <p className="text-[var(--lime)] text-sm mt-2 font-bold flex items-center gap-2">
                <span>✅</span>
                <span>{promoValidation.description} aplicado!</span>
              </p>
            )}
          </div>

          {/* Tier Cards */}
          <div className="space-y-4">
            {/* Premium Tier */}
            <div className={`bg-[var(--bg)] border-2 rounded-xl p-4 ${
              tiers.premium.recommended ? 'border-[var(--primary)]' : 'border-[var(--border)]'
            }`}>
              {tiers.premium.recommended && (
                <div className="mb-3 flex items-center gap-2">
                  <span className="bg-[var(--primary)] text-white px-3 py-1 rounded-full text-xs font-bold">
                    RECOMENDADO PARA TI
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-[var(--primary)]">
                    Premium
                  </h3>
                  <p className="text-sm text-[var(--muted)]">
                    Grupos ilimitados
                  </p>
                </div>
                <div className="text-right">
                  {promoValidation.valid && (
                    <div className="line-through text-[var(--muted)] text-sm">
                      ${tiers.premium.price.toLocaleString('es-CO')}
                    </div>
                  )}
                  <div className={`text-2xl font-bold ${promoValidation.valid ? 'text-[var(--lime)]' : ''}`}>
                    ${getPrice(tiers.premium).toLocaleString('es-CO')}
                  </div>
                  <div className="text-xs text-[var(--muted)]">
                    / 3 meses
                  </div>
                </div>
              </div>

              <ul className="space-y-2 mb-4 text-sm">
                {tiers.premium.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade('premium')}
                className="w-full py-3 bg-[var(--primary)] text-white font-bold rounded-xl border-2 border-black shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] transition-all"
              >
                Seleccionar Premium
              </button>
            </div>

            {/* VIP Tier */}
            <div className={`bg-[var(--bg)] border-2 rounded-xl p-4 relative ${
              tiers.vip.recommended ? 'border-[var(--lime)]' : 'border-[var(--border)]'
            }`}>
              {tiers.vip.recommended && (
                <div className="absolute -top-3 left-4 bg-[var(--lime)] text-black px-3 py-1 rounded-full text-xs font-bold">
                  ⭐ RECOMENDADO
                </div>
              )}

              <div className="flex items-start justify-between mb-3 mt-2">
                <div>
                  <h3 className="text-xl font-bold text-[var(--lime)]">
                    VIP
                  </h3>
                  <p className="text-sm text-[var(--muted)]">
                    OCR ilimitado
                  </p>
                </div>
                <div className="text-right">
                  {promoValidation.valid && (
                    <div className="line-through text-[var(--muted)] text-sm">
                      ${tiers.vip.price.toLocaleString('es-CO')}
                    </div>
                  )}
                  <div className={`text-2xl font-bold ${promoValidation.valid ? 'text-[var(--lime)]' : ''}`}>
                    ${getPrice(tiers.vip).toLocaleString('es-CO')}
                  </div>
                  <div className="text-xs text-[var(--muted)]">
                    / 3 meses
                  </div>
                </div>
              </div>

              <ul className="space-y-2 mb-4 text-sm">
                {tiers.vip.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade('vip')}
                className="w-full py-3 bg-[var(--lime)] text-black font-bold rounded-xl border-2 border-black shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] transition-all"
              >
                Seleccionar VIP
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 py-3 text-[var(--muted)] font-bold hover:text-[var(--text)] transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  // Payment QR Screen
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-auto">
        <h2 className="text-2xl font-bold mb-4">
          Paso 2: Realizar Pago
        </h2>

        {/* Amount */}
        <div className="bg-[var(--bg)] border-2 border-[var(--border)] rounded-xl p-6 mb-4">
          <div className="text-center mb-4">
            <p className="text-[var(--muted)] text-sm mb-2">
              Monto a transferir:
            </p>
            <p className="text-4xl font-bold text-[var(--lime)]">
              ${getPrice(tiers[selectedTier]).toLocaleString('es-CO')} COP
            </p>
            <p className="text-sm text-[var(--muted)] mt-2">
              Tier: {tiers[selectedTier].name} · {tiers[selectedTier].duration}
            </p>
          </div>

          {/* QR Code */}
          <div className="bg-white p-4 rounded-xl mb-4">
            {/* TODO: Reemplazar con imágenes QR reales en /public/ */}
            <div className="aspect-square bg-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-500 text-sm p-4 text-center">
              <div className="text-4xl mb-2">📱</div>
              <p className="font-bold text-black mb-1">QR Bancolombia</p>
              <p className="text-xs">
                {selectedTier === 'premium' ? 'Premium - $5,000 COP' : 'VIP - $10,000 COP'}
              </p>
              <p className="text-xs mt-2 text-gray-400">
                (Imagen pendiente)
              </p>
            </div>
            {/* Descomentar cuando estén las imágenes:
            <img
              src={selectedTier === 'premium' ? '/qr-premium.png' : '/qr-vip.png'}
              alt="QR Bancolombia"
              className="w-full rounded-lg"
            />
            */}
          </div>

          <div className="text-center">
            <p className="text-sm text-[var(--muted)] mb-1">
              Llave Bancolombia:
            </p>
            <p className="font-mono font-bold text-[var(--lime)] text-lg">
              @bustamante161
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-[var(--surface-2)] border-2 border-[var(--border)] rounded-xl p-4 mb-4">
          <p className="text-sm font-bold mb-2 flex items-center gap-2">
            <span>📱</span>
            <span>Instrucciones:</span>
          </p>
          <ol className="text-sm text-[var(--muted)] space-y-1.5 list-decimal list-inside">
            <li>Escaneá el código QR con la app de Bancolombia</li>
            <li>Transferí el monto exacto mostrado arriba</li>
            <li>Tomá screenshot del comprobante de pago</li>
            <li>Tocá "Ya Pagué" abajo para enviar el comprobante por email</li>
            <li>Recibirás confirmación en menos de 24 horas</li>
          </ol>
        </div>

        {/* Send Email Button */}
        <button
          onClick={handleSendEmail}
          className="w-full py-3 bg-[var(--lime)] text-black font-bold rounded-xl border-2 border-black shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] transition-all mb-3"
        >
          ✉️ Ya Pagué - Enviar Comprobante
        </button>

        <button
          onClick={() => setShowQr(false)}
          className="w-full py-3 text-[var(--muted)] font-bold hover:text-[var(--text)] transition-colors"
        >
          ← Volver
        </button>
      </div>
    </div>
  );
}
