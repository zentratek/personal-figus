#!/bin/bash

# Script para activar suscripciones de Figus
# Uso: ./activate-subscription.sh

set -e

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     FIGUS - Activar Suscripción          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"
echo ""

# 1. Pedir User ID
echo -e "${YELLOW}📝 Paso 1: Información del Usuario${NC}"
read -p "Ingresa el User ID del usuario: " USER_ID

if [ -z "$USER_ID" ]; then
    echo -e "${RED}❌ Error: User ID no puede estar vacío${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✓${NC} User ID: $USER_ID"
echo ""

# 2. Seleccionar Tier
echo -e "${YELLOW}📦 Paso 2: Selecciona el Plan${NC}"
echo "1) Premium ($10,000 COP - 3 meses)"
echo "2) VIP ($20,000 COP - 3 meses)"
read -p "Selecciona una opción (1 o 2): " TIER_OPTION

case $TIER_OPTION in
    1)
        TIER="premium"
        TIER_NAME="Premium"
        BASE_PRICE=10000
        OCR_LIMIT=5
        ;;
    2)
        TIER="vip"
        TIER_NAME="VIP"
        BASE_PRICE=20000
        OCR_LIMIT=999999
        ;;
    *)
        echo -e "${RED}❌ Opción inválida${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✓${NC} Tier seleccionado: $TIER_NAME"
echo ""

# 3. Código Promocional
echo -e "${YELLOW}🎟️  Paso 3: Código Promocional${NC}"
read -p "¿El usuario usó código CSF2026? (s/n): " USED_PROMO

PROMO_CODE="null"
AMOUNT=$BASE_PRICE

if [[ "$USED_PROMO" == "s" || "$USED_PROMO" == "S" ]]; then
    PROMO_CODE='"CSF2026"'
    AMOUNT=$((BASE_PRICE / 2))
    echo -e "${GREEN}✓${NC} Código aplicado - Precio: \$$AMOUNT COP"
else
    echo -e "${GREEN}✓${NC} Sin código - Precio: \$$AMOUNT COP"
fi

echo ""

# 4. Calcular fechas
echo -e "${YELLOW}📅 Paso 4: Calculando fechas...${NC}"

# Fecha actual en formato ISO
ACTIVATED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Fecha válida hasta (3 meses = 92 días)
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    VALID_UNTIL=$(date -u -v+92d +"%Y-%m-%dT%H:%M:%SZ")
else
    # Linux
    VALID_UNTIL=$(date -u -d "+92 days" +"%Y-%m-%dT%H:%M:%SZ")
fi

echo -e "${GREEN}✓${NC} Fecha de activación: $ACTIVATED_AT"
echo -e "${GREEN}✓${NC} Válido hasta: $VALID_UNTIL"
echo ""

# 5. Confirmación
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📋 RESUMEN:${NC}"
echo "  User ID: $USER_ID"
echo "  Tier: $TIER_NAME"
echo "  Monto: \$$AMOUNT COP"
echo "  Código: ${PROMO_CODE//\"/}"
echo "  Válido hasta: $VALID_UNTIL"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

read -p "¿Confirmar activación? (s/n): " CONFIRM

if [[ "$CONFIRM" != "s" && "$CONFIRM" != "S" ]]; then
    echo -e "${RED}❌ Activación cancelada${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}🔄 Activando suscripción en Firebase...${NC}"
echo ""

# 6. Crear archivo temporal con los datos
TMP_FILE=$(mktemp)

cat > $TMP_FILE << EOF
{
  "subscription": {
    "tier": "$TIER",
    "ocrScansUsed": 0,
    "ocrScansLimit": $OCR_LIMIT,
    "validUntil": {"_seconds": $(date -d "$VALID_UNTIL" +%s), "_nanoseconds": 0},
    "activatedAt": {"_seconds": $(date -d "$ACTIVATED_AT" +%s), "_nanoseconds": 0},
    "history": [
      {
        "tier": "$TIER",
        "activatedAt": {"_seconds": $(date -d "$ACTIVATED_AT" +%s), "_nanoseconds": 0},
        "validUntil": {"_seconds": $(date -d "$VALID_UNTIL" +%s), "_nanoseconds": 0},
        "promoCode": $PROMO_CODE,
        "amount": $AMOUNT
      }
    ]
  }
}
EOF

# 7. Actualizar Firestore
cd /home/juan/projects/personal/panini/app

firebase firestore:update "users/$USER_ID" subscription.tier "$TIER" \
    subscription.ocrScansUsed 0 \
    subscription.ocrScansLimit $OCR_LIMIT 2>/dev/null

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ ¡SUSCRIPCIÓN ACTIVADA EXITOSAMENTE!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "📧 Ahora podés responder el email del usuario con:"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "¡Hola!"
    echo ""
    echo "Tu suscripción $TIER_NAME ha sido activada exitosamente ✅"
    echo ""
    echo "• Plan: $TIER_NAME"
    echo "• Duración: 3 meses"
    echo "• Válido hasta: $(date -d "$VALID_UNTIL" +"%d/%m/%Y")"
    echo ""
    if [ "$TIER" == "premium" ]; then
        echo "Beneficios activados:"
        echo "✓ Grupos ilimitados"
        echo "✓ Miembros ilimitados por grupo"
        echo "✓ Soporte prioritario"
    else
        echo "Beneficios activados:"
        echo "✓ OCR ilimitado"
        echo "✓ Grupos ilimitados"
        echo "✓ Miembros ilimitados"
        echo "✓ Badge VIP en perfil"
        echo "✓ Soporte prioritario"
    fi
    echo ""
    echo "¡Gracias por tu compra!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
else
    echo -e "${RED}❌ Error al activar la suscripción${NC}"
    echo "Verifica que:"
    echo "  1. El User ID sea correcto"
    echo "  2. Estés logueado en Firebase (firebase login)"
    exit 1
fi

# Limpiar archivo temporal
rm -f $TMP_FILE

echo ""
