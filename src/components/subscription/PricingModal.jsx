import { X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';
import { UpgradeModal } from './UpgradeModal';

/**
 * PricingModal - Shows pricing comparison for all tiers
 * Displayed proactively from HomeScreen
 */
export function PricingModal({ onClose }) {
  const { user } = useAuth();
  const subscription = useSubscription(user?.uid);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');

  const handleUpgrade = (tier) => {
    // Determine reason based on tier
    const reason = tier === 'vip' ? 'ocr_limit' : 'group_count_limit';
    setSelectedReason(reason);
    setShowUpgradeModal(true);
  };

  const plans = [
    {
      id: 'free',
      name: 'FREE',
      price: 'Gratis',
      priceDetail: 'Para siempre',
      color: 'var(--muted)',
      bgColor: 'var(--surface)',
      features: [
        { text: '5 escaneos OCR', included: true },
        { text: '1 grupo activo', included: true },
        { text: 'Máx 3 miembros por grupo', included: true },
        { text: 'Intercambios ilimitados', included: true },
        { text: 'Grupos ilimitados', included: false },
        { text: 'OCR ilimitado', included: false },
      ],
      current: subscription?.tier === 'free' && !subscription?.isActive,
      cta: null
    },
    {
      id: 'premium',
      name: 'PREMIUM',
      price: '$10,000',
      priceDetail: '/ 3 meses',
      color: 'var(--primary)',
      bgColor: 'var(--surface-2)',
      features: [
        { text: '5 escaneos OCR', included: true, muted: true },
        { text: 'Grupos ILIMITADOS', included: true, highlight: true },
        { text: 'Miembros ILIMITADOS por grupo', included: true, highlight: true },
        { text: 'Intercambios ilimitados', included: true },
        { text: 'Soporte prioritario', included: true },
        { text: 'OCR ilimitado', included: false },
      ],
      badge: 'Ideal para grupos grandes',
      current: subscription?.isPremium,
      cta: 'Upgrade a Premium'
    },
    {
      id: 'vip',
      name: 'VIP',
      price: '$20,000',
      priceDetail: '/ 3 meses',
      color: 'var(--lime)',
      bgColor: 'var(--surface-3)',
      features: [
        { text: 'OCR ILIMITADO', included: true, highlight: true },
        { text: 'Grupos ILIMITADOS', included: true, highlight: true },
        { text: 'Miembros ILIMITADOS', included: true, highlight: true },
        { text: 'Intercambios ilimitados', included: true },
        { text: 'Soporte prioritario', included: true },
        { text: 'Badge VIP en perfil', included: true },
      ],
      badge: 'Más popular',
      recommended: true,
      current: subscription?.isVip,
      cta: 'Upgrade a VIP'
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-[var(--surface)] border-b-2 border-[var(--border)] p-6 flex justify-between items-center z-10">
            <div>
              <h2 className="text-2xl font-bold mb-1">Planes y Precios</h2>
              <p className="text-[var(--muted)] text-sm">
                Elegí el plan que mejor se adapte a tus necesidades
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-[var(--surface-2)] border-2 border-[var(--border)] flex items-center justify-center hover:bg-[var(--surface-3)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Plan Info */}
          {!subscription.loading && (
            <div className="p-6 border-b-2 border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  {subscription.isFree && '🎯'}
                  {subscription.isPremium && '⭐'}
                  {subscription.isVip && '✨'}
                </div>
                <div>
                  <p className="text-sm text-[var(--muted)]">Tu plan actual:</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold" style={{ color: subscription.tierColor }}>
                      {subscription.tierDisplayName}
                    </p>
                    {subscription.isActive && (
                      <span className="text-xs text-[var(--muted)]">
                        · Válido hasta {subscription.expiresAt?.toLocaleDateString('es-ES')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Plans Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`
                    relative rounded-xl border-2 p-6 transition-all
                    ${plan.current ? 'border-[var(--lime)] bg-[var(--lime)]/5' : 'border-[var(--border)]'}
                    ${plan.recommended ? 'scale-105 shadow-lg' : ''}
                  `}
                  style={{ backgroundColor: plan.current ? undefined : plan.bgColor }}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold border-2 border-black"
                        style={{
                          backgroundColor: plan.recommended ? 'var(--lime)' : 'var(--primary)',
                          color: 'black'
                        }}
                      >
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Current Badge */}
                  {plan.current && (
                    <div className="absolute -top-3 right-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--lime)] text-black border-2 border-black">
                        ACTIVO
                      </span>
                    </div>
                  )}

                  {/* Plan Name */}
                  <div className="text-center mb-6 mt-2">
                    <h3
                      className="text-2xl font-bold mb-2"
                      style={{ color: plan.color }}
                    >
                      {plan.name}
                    </h3>
                    <div>
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.priceDetail && (
                        <span className="text-[var(--muted)] text-sm ml-2">
                          {plan.priceDetail}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start gap-2 text-sm ${
                          feature.muted ? 'text-[var(--muted)]' : ''
                        }`}
                      >
                        <span className="flex-shrink-0 mt-0.5">
                          {feature.included ? (
                            <span
                              className={feature.highlight ? 'text-[var(--lime)]' : 'text-[var(--primary)]'}
                            >
                              ✓
                            </span>
                          ) : (
                            <span className="text-[var(--muted)]">✗</span>
                          )}
                        </span>
                        <span className={feature.highlight ? 'font-bold' : ''}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  {plan.cta && !plan.current && (
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      className="w-full py-3 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] transition-all"
                      style={{
                        backgroundColor: plan.color,
                        color: plan.id === 'vip' ? 'black' : 'white'
                      }}
                    >
                      {plan.cta}
                    </button>
                  )}

                  {plan.current && (
                    <div className="w-full py-3 rounded-xl font-bold text-center border-2 border-[var(--lime)] bg-[var(--lime)]/10 text-[var(--lime)]">
                      Plan Actual
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Info Box */}
            <div className="mt-8 p-4 rounded-xl bg-[var(--surface-2)] border-2 border-[var(--border)]">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div className="flex-1">
                  <p className="text-sm font-bold mb-1">¿Tenés un código promocional?</p>
                  <p className="text-xs text-[var(--muted)]">
                    Si te compartieron un código especial, podés ingresarlo durante el proceso de upgrade para obtener descuentos exclusivos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-[var(--surface)] border-t-2 border-[var(--border)] p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[var(--muted)]">
                <p>💳 Pago seguro vía QR Bancolombia</p>
                <p>📧 Activación en menos de 24 horas</p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-[var(--surface-2)] border-2 border-[var(--border)] rounded-xl font-bold hover:bg-[var(--surface-3)] transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradeModal
          reason={selectedReason}
          onClose={() => setShowUpgradeModal(false)}
        />
      )}
    </>
  );
}
