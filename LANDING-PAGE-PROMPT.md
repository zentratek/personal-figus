# Prompt para Claude.ai Artifacts - Landing Page de Figus

Copia y pega este prompt en Claude.ai (claude.ai) para generar la landing page:

---

Necesito que crees una landing page moderna y atractiva para **Figus**, una Progressive Web App que ayuda a grupos de adolescentes a gestionar y completar su álbum de figuritas Panini del Mundial 2026.

## Contexto del Producto

**Figus** es una app mobile-first que resuelve los problemas de los coleccionistas de figuritas:
- No saben quién tiene las figuritas que necesitan
- Es riesgoso llevar el álbum físico al colegio
- Difícil coordinar intercambios "ganar-ganar"
- Falta de visibilidad del progreso de completado

## Características Principales

1. **Álbum Digital Interactivo**
   - Grid con 3 estados: tengo / falta / repetida
   - Agrupación visual por equipos del Mundial 2026
   - Contador de progreso en tiempo real

2. **Grupos Cerrados de Amigos**
   - Crear grupo con código único (formato: XX-YYYY)
   - Máximo 10 miembros por grupo
   - Ver progreso de cada amigo

3. **Matchmaker Automático**
   - Algoritmo que encuentra intercambios posibles
   - Muestra: "Vos das [X, Y] y recibís [A, B]"
   - Ordenado por relevancia

4. **Propuestas de Intercambio**
   - Enviar/aceptar/rechazar propuestas
   - Historial de intercambios
   - Notificaciones in-app

5. **Escaneo OCR de Sobres** 🧪
   - Usa la cámara para detectar números automáticamente
   - Modo "Abrir Sobre" - escanea 5 figuritas de una vez

6. **Login Simple con Google**
   - Un solo click para empezar
   - Sincronización automática en la nube

## Estilo Visual (MUY IMPORTANTE)

La landing debe seguir esta estética **dark mode cyberpunk/gaming brutalism**:

### Colores
- **Background:** `#08080F` (casi negro)
- **Primary:** `#FF2D8E` (rosa/magenta neón)
- **Lime:** `#C6FF3E` (verde lima neón - para CTAs)
- **Cyan:** `#00E5FF` (cyan neón)
- **Text:** `#E8E8F0` (blanco off-white)
- **Muted:** `#696974` (gris)

### Tipografía
- **Títulos principales:** Bungee (bold, uppercase, neón)
- **Subtítulos y body:** Space Grotesk (clean, modern)
- **Código/detalles técnicos:** JetBrains Mono (monospace)

### Efectos Visuales
- **Sombras duras:** `box-shadow: 4px 4px 0 #000` (NO sombras difusas)
- **Bordes:** 2px solid, colores neón
- **Bordes redondeados:** 12-16px
- **Gradientes:** Usar con moderación, solo para fondos de secciones
- **Iconos:** Estilo outline/line, colores neón

### Layout
- **Mobile-first:** Diseño vertical, pensado para smartphone
- **Espaciado generoso:** Respira, evitar amontonar elementos
- **Grid asimétrico:** No todo perfectamente centrado, más dinámico
- **Elementos flotantes:** Cards con sombra dura, ligeramente rotados (2-3deg)

## Estructura de la Landing

### 1. Hero Section
- Logo "FIGUS" en grande (tipografía Bungee, color lime `#C6FF3E`)
- Subtítulo: "Tu álbum digital de figuritas Panini del Mundial 2026"
- CTA principal: "Empezar Ahora" (botón lime con sombra dura)
- CTA secundario: "Ver Demo" (botón outline)
- Mockup de la app en smartphone (puede ser un placeholder con esquema de colores)

### 2. Problem/Solution Section
Título: "// EL PROBLEMA CON LOS ÁLBUMES TRADICIONALES"
- Grid de 3 columnas (responsive a 1 columna en mobile)
- Cada problema con icono + texto + solución de Figus
- Usar iconos outline en color cyan

### 3. Features Showcase
Título: "// CARACTERÍSTICAS"
- Carousel/grid de features principales
- Cada feature con:
  - Icono grande en color primario
  - Título en Space Grotesk bold
  - Descripción corta
  - Micro-animación al hacer hover (si es posible)

### 4. How It Works
Título: "// CÓMO FUNCIONA"
- Timeline/stepper visual con 4 pasos:
  1. Inicia sesión con Google
  2. Registra tus figuritas (manual o con OCR)
  3. Crea o únete a un grupo
  4. Intercambia con tus amigos
- Usar números grandes en tipografía Bungee

### 5. CTA Final
- Mensaje motivacional: "Completá tu álbum antes del Mundial 2026"
- Botón grande "Empezar Gratis" (lime)
- Subtexto: "No requiere tarjeta de crédito. 100% gratis."

### 6. Footer
- Links: Privacidad | Términos | Contacto
- Nota: "Proyecto educativo. No afiliado con Panini."
- Copyright con año dinámico

## Requisitos Técnicos

- **Responsive:** Mobile-first, desktop adaptable
- **Accesibilidad:** Contraste WCAG AA, semántica HTML
- **Performance:** CSS puro si es posible, evitar JS pesado
- **Viewport:** Optimal para 375px (iPhone SE) y 1920px (desktop)

## Assets de Ejemplo (Usar Placeholders)

- Logo FIFA 2026: Placeholder rectangular vertical
- Screenshots de app: Placeholders de smartphones con los colores de la paleta
- Iconos: Usar emojis o SVG simples (📱💱🎯📊🔍)

## Call-to-Action

El botón principal debe decir "Empezar Ahora" y tener:
- Background: `#C6FF3E` (lime)
- Color de texto: `#0A0A14` (casi negro)
- Border: `2px solid #000`
- Shadow: `4px 4px 0 #000`
- Hover: traducir 2px arriba-izquierda y reducir sombra a `2px 2px 0 #000`

---

**IMPORTANTE:** No uses frameworks CSS externos (Bootstrap, etc). Crea estilos custom que sigan exactamente esta paleta de colores y estética cyberpunk/brutalism. Prioriza impacto visual y velocidad de carga.

**OUTPUT ESPERADO:** Código HTML/CSS completo y funcional que pueda copiarse directamente a un archivo `.html` y funcionar standalone.
