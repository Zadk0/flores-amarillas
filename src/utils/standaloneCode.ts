export const STANDALONE_INDEX_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flores Amarillas - Para Mi Amor</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Dancing+Script:wght@500;700&family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
  <!-- Three.js y OrbitControls vía CDN -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
  <!-- Canvas Confetti para celebración dorada -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
</head>
<body>
  <!-- Contenedor del lienzo 3D -->
  <div id="canvas-container"></div>

  <!-- Interfaz de usuario flotante (HUD) -->
  <div class="hud-overlay">
    <!-- Recuadro sobrepuesto morado claro de bienvenida -->
    <div id="welcome-note" class="welcome-note">
      <div class="welcome-note-card">
        <button id="btn-close-welcome" class="welcome-close-btn" aria-label="Cerrar">&times;</button>
        <div class="welcome-header">
          <span class="welcome-icon">♥</span>
          <span class="welcome-tagline">UN MENSAJE PARA TI</span>
        </div>
        <p class="welcome-main-text">
          PERDON POR LA TARDANZA MI AMOR, PERO MÁS VALE TARDE QUE NUNCA
        </p>
        <p class="welcome-sub-text">
          TE AMO MUCHISIMO CHAPARRITA HERMOSA 💛
        </p>
      </div>
    </div>

    <!-- Indicador de navegación sutil -->
    <div class="navigation-hint">
      <span>Arrastra para girar · Rueda para zoom · Toca las flores</span>
    </div>

    <!-- Botón Destacado: PARA TI -->
    <div class="action-container">
      <button id="btn-open-letter" class="btn-para-ti pulse-effect">
        <span class="btn-flower">❦</span>
        <span class="btn-text">Para Ti</span>
        <span class="btn-shine"></span>
      </button>
    </div>

    <!-- Botón flotante discreto de música -->
    <button id="btn-audio" class="floating-audio-btn" title="Música romántica ambiental">
      <span id="audio-icon">♪</span>
    </button>
  </div>

  <!-- Modal / Carta Emergente Romántica -->
  <div id="letter-modal" class="modal-backdrop">
    <div class="letter-wrapper">
      <div class="letter-card parchment-effect">
        <!-- Decoración esquinas doradas -->
        <div class="corner-ornament top-left">❦</div>
        <div class="corner-ornament top-right">❦</div>
        <div class="corner-ornament bottom-left">❦</div>
        <div class="corner-ornament bottom-right">❦</div>

        <!-- Sello de cera / rosa -->
        <div class="wax-seal">
          <span class="seal-flower">❦</span>
        </div>

        <div class="letter-header">
          <span class="letter-date" id="letter-date-display">Septiembre de Flores Amarillas</span>
          <h2 class="letter-greeting" id="letter-greeting-display">Mi amor</h2>
          <div class="gold-divider">
            <span class="divider-line"></span>
            <span class="divider-icon">✦ ❀ ✦</span>
            <span class="divider-line"></span>
          </div>
        </div>

        <!-- Mensaje de la carta -->
        <div class="letter-body">
          <p class="letter-paragraph" id="letter-paragraph-1">
            Estas flores amarillas son como tú: brillantes, radiantes y llenas de alegría.
          </p>
          <p class="letter-paragraph" id="letter-paragraph-2">
            Gracias por iluminar cada uno de mis días. Eres simplemente hermosa.
          </p>
          <p class="letter-signature" id="letter-signature-display">
            Te amo mucho.
          </p>
        </div>

        <!-- Botones de acción en la carta -->
        <div class="letter-footer">
          <button id="btn-close-letter" class="btn-close">
            <span>Cerrar Carta</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Script principal del universo 3D -->
  <script src="script.js"></script>
</body>
</html>`;

export const STANDALONE_STYLE_CSS = `/* ============================================================
   FLORES AMARILLAS - ESTILOS ROMÁNTICOS
   ============================================================ */

:root {
  --gold-primary: #F59E0B;
  --gold-bright: #FBBF24;
  --gold-light: #FEF3C7;
  --gold-dark: #B45309;
  --parchment-bg: #FFFDF9;
  --parchment-border: #D4AF37;
  --text-dark: #292524;
  --text-gold: #92400E;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}

body {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #050505;
  color: #FEF3C7;
  font-family: 'Plus Jakarta Sans', sans-serif;
  user-select: none;
}

/* Recuadro morado claro de bienvenida sobrepuesto */
.welcome-note {
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  width: 90%;
  max-width: 440px;
  pointer-events: auto;
  animation: fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translate(-50%, -15px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }
}

.welcome-note-card {
  position: relative;
  background: rgba(243, 232, 255, 0.92);
  backdrop-filter: blur(14px);
  border: 1px solid #d8b4fe;
  border-radius: 18px;
  padding: 18px 22px;
  box-shadow: 0 16px 36px rgba(46, 16, 101, 0.35), 0 0 20px rgba(192, 132, 252, 0.2);
  color: #3b0764;
  text-align: center;
}

.welcome-close-btn {
  position: absolute;
  top: 10px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 1.4rem;
  line-height: 1;
  color: #7e22ce;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.welcome-close-btn:hover {
  background: rgba(168, 85, 247, 0.2);
  color: #581c87;
}

.welcome-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 8px;
}

.welcome-icon {
  color: #a855f7;
  font-size: 1rem;
}

.welcome-tagline {
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  font-weight: 700;
  color: #6b21a8;
  text-transform: uppercase;
}

.welcome-main-text {
  font-family: 'Playfair Display', serif;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.35;
  color: #2e1065;
  margin-bottom: 6px;
}

.welcome-sub-text {
  font-family: 'Playfair Display', serif;
  font-size: 0.88rem;
  font-weight: 700;
  color: #7e22ce;
  letter-spacing: 0.02em;
}

#canvas-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

#canvas-container canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
  outline: none;
}

.hud-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: auto;
  backdrop-filter: blur(12px);
  background: rgba(10, 10, 10, 0.45);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 9999px;
  padding: 10px 24px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-sparkle {
  color: #FBBF24;
  font-size: 1.1rem;
  animation: spinSlow 12s linear infinite;
}

.brand-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  background: linear-gradient(135deg, #FFFBEB, #FBBF24, #F59E0B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-tag {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #FCD34D;
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 2px 10px;
  border-radius: 9999px;
}

.header-controls {
  display: flex;
  gap: 10px;
}

.btn-icon {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(245, 158, 11, 0.25);
  color: #FEF3C7;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.25s ease;
}

.btn-icon:hover {
  background: rgba(245, 158, 11, 0.2);
  border-color: rgba(245, 158, 11, 0.5);
  transform: translateY(-1px);
}

.navigation-hint {
  text-align: center;
  font-size: 0.85rem;
  color: rgba(254, 243, 199, 0.6);
  letter-spacing: 0.05em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
  pointer-events: none;
}

.action-container {
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
  padding-bottom: 20px;
}

.btn-para-ti {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%);
  color: #FFFBEB;
  border: 2px solid #FDE68A;
  padding: 16px 42px;
  font-size: 1.15rem;
  font-weight: 600;
  font-family: 'Playfair Display', serif;
  letter-spacing: 0.08em;
  border-radius: 9999px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 0 25px rgba(245, 158, 11, 0.6), 0 10px 30px rgba(0, 0, 0, 0.5);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-para-ti:hover {
  transform: scale(1.06) translateY(-2px);
  box-shadow: 0 0 35px rgba(245, 158, 11, 0.85), 0 15px 35px rgba(0, 0, 0, 0.6);
  border-color: #FFFFFF;
}

.btn-flower {
  font-size: 1.4rem;
  display: inline-block;
  animation: pulseRotate 4s ease-in-out infinite;
}

.pulse-effect {
  animation: buttonPulse 3s infinite;
}

/* Botón flotante de música en la esquina */
.floating-audio-btn {
  position: absolute;
  bottom: 24px;
  right: 24px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(20, 15, 10, 0.65);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fbbf24;
  font-size: 1.15rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.3s ease;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
}

.floating-audio-btn:hover {
  background: rgba(245, 158, 11, 0.3);
  border-color: rgba(251, 191, 36, 0.5);
  transform: scale(1.08);
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
}

.modal-backdrop.active {
  opacity: 1;
  pointer-events: auto;
}

.letter-wrapper {
  max-width: 580px;
  width: 100%;
  transform: translateY(30px) scale(0.95);
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-backdrop.active .letter-wrapper {
  transform: translateY(0) scale(1);
}

.letter-card {
  position: relative;
  background: radial-gradient(circle at 50% 50%, #FFFFFF 0%, #FFFDF7 55%, #FBF4DE 100%);
  color: var(--text-dark);
  border: 3px double var(--parchment-border);
  border-radius: 12px;
  padding: 48px 42px 36px 42px;
  box-shadow: 0 25px 60px -10px rgba(0, 0, 0, 0.8),
              0 0 40px rgba(212, 175, 55, 0.3),
              inset 0 0 60px rgba(245, 230, 185, 0.5);
  overflow: hidden;
}

.corner-ornament {
  position: absolute;
  color: var(--parchment-border);
  font-size: 1.4rem;
  line-height: 1;
  opacity: 0.85;
}

.corner-ornament.top-left { top: 14px; left: 16px; }
.corner-ornament.top-right { top: 14px; right: 16px; transform: scaleX(-1); }
.corner-ornament.bottom-left { bottom: 14px; left: 16px; transform: scaleY(-1); }
.corner-ornament.bottom-right { bottom: 14px; right: 16px; transform: scale(-1); }

.wax-seal {
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  background: radial-gradient(circle, #F59E0B 0%, #B45309 85%);
  border: 2px solid #FDE68A;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 6px 16px rgba(180, 83, 9, 0.5);
}

.seal-flower {
  font-size: 1.4rem;
}

.letter-header {
  text-align: center;
  margin-bottom: 24px;
}

.letter-date {
  display: block;
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #B45309;
  font-family: 'Plus Jakarta Sans', sans-serif;
  margin-bottom: 8px;
}

.letter-greeting {
  font-family: 'Playfair Display', serif;
  font-size: 2.3rem;
  font-weight: 700;
  color: #78350F;
  margin: 0;
  letter-spacing: 0.02em;
}

.gold-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 14px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #D4AF37, transparent);
}

.divider-icon {
  color: #D4AF37;
  font-size: 0.8rem;
  letter-spacing: 0.2em;
}

.letter-body {
  margin: 28px 0;
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.4rem;
  line-height: 1.8;
  color: #451A03;
  text-align: center;
}

.letter-paragraph {
  margin-bottom: 18px;
}

.letter-signature {
  font-family: 'Dancing Script', cursive;
  font-size: 2.4rem;
  font-weight: 700;
  color: #92400E;
  margin-top: 24px;
  display: block;
  text-shadow: 0 1px 2px rgba(245, 158, 11, 0.2);
}

.letter-footer {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.btn-close {
  background: #78350F;
  color: #FEF3C7;
  border: 1px solid #D4AF37;
  padding: 10px 32px;
  border-radius: 9999px;
  font-size: 0.95rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 500;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-close:hover {
  background: #92400E;
  border-color: #FBBF24;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(120, 53, 15, 0.3);
}

@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulseRotate {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.15) rotate(10deg); }
}

@keyframes buttonPulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.5), 0 8px 25px rgba(0, 0, 0, 0.4);
  }
  50% {
    box-shadow: 0 0 35px rgba(245, 158, 11, 0.8), 0 12px 30px rgba(0, 0, 0, 0.6);
  }
}

@media (max-width: 640px) {
  .top-bar {
    padding: 8px 16px;
  }
  .brand-title {
    font-size: 1rem;
  }
  .letter-card {
    padding: 38px 24px 28px 24px;
  }
  .letter-greeting {
    font-size: 1.8rem;
  }
  .letter-body {
    font-size: 1.2rem;
    line-height: 1.6;
  }
  .letter-signature {
    font-size: 2rem;
  }
}`;

export const STANDALONE_SCRIPT_JS = `/**
 * Flores Amarillas - Universo Romántico 3D
 * Three.js + OrbitControls + Web Audio API
 */

(function() {
  'use strict';

  let scene, camera, renderer, controls;
  let galaxyPoints, centralFlowerGroup, flowersOrbitGroup, floatingTextsGroup, petalsGroup;
  let raycaster, mouse;
  const interactiveObjects = [];
  let isLetterOpen = false;
  let audioCtx = null;
  let isAudioPlaying = false;
  let audioInterval = null;

  const container = document.getElementById('canvas-container');
  const letterModal = document.getElementById('letter-modal');
  const btnOpenLetter = document.getElementById('btn-open-letter');
  const btnCloseLetter = document.getElementById('btn-close-letter');
  const btnAudio = document.getElementById('btn-audio');
  const audioIcon = document.getElementById('audio-icon');
  const audioLabel = document.getElementById('audio-label');
  const btnAutoRotate = document.getElementById('btn-autorotate');
  const letterGreetingDisplay = document.getElementById('letter-greeting-display');
  const letterDateDisplay = document.getElementById('letter-date-display');
  const letterParagraph1 = document.getElementById('letter-paragraph-1');
  const letterParagraph2 = document.getElementById('letter-paragraph-2');
  const letterSignatureDisplay = document.getElementById('letter-signature-display');

  initThree();
  createGalaxy();
  createFlowers();
  createFloatingTexts();
  createFloatingPetals();
  setupLighting();
  setupEvents();
  animate();

  function initThree() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x120a00, 0.012);

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 38);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setClearColor(0x0a0500, 1);
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 8;
    controls.maxDistance = 80;
    controls.maxPolarAngle = Math.PI / 2 + 0.15;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
  }

  function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xfef08a, 0.88);
    scene.add(ambientLight);

    const centerLight = new THREE.PointLight(0xffea00, 3.2, 60, 1.1);
    centerLight.position.set(0, 6, 0);
    scene.add(centerLight);

    const goldMain = new THREE.DirectionalLight(0xfde047, 1.7);
    goldMain.position.set(20, 28, 20);
    scene.add(goldMain);

    const goldRim = new THREE.DirectionalLight(0xf59e0b, 1.1);
    goldRim.position.set(-20, 15, -20);
    scene.add(goldRim);

    const purpleAccent = new THREE.DirectionalLight(0xa855f7, 0.75);
    purpleAccent.position.set(-20, 25, 20);
    scene.add(purpleAccent);

    const warmVioletUnderLight = new THREE.PointLight(0xc084fc, 1.4, 50, 1.6);
    warmVioletUnderLight.position.set(0, -10, 10);
    scene.add(warmVioletUnderLight);
  }

  function createGalaxy() {
    const particleCount = 10000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const colorCenter = new THREE.Color(0xffffff);
    const colorBrightYellow = new THREE.Color(0xfff033);
    const colorPureGold = new THREE.Color(0xfacc15);
    const colorAmber = new THREE.Color(0xf59e0b);
    const colorVioletAccent = new THREE.Color(0xa855f7);
    const colorDeepPurple = new THREE.Color(0x6b21a8);

    const arms = 3;
    const radius = 42;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), 1.7) * radius;
      const spinAngle = r * 0.44;
      const branchAngle = ((i % arms) * ((2 * Math.PI) / arms));

      const randomX = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.48) * r;
      const randomY = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.40) * (r * 0.38);
      const randomZ = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.48) * r;

      positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
      positions[i3 + 1] = randomY - 2;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

      const mixedColor = colorBrightYellow.clone();
      const t = r / radius;
      if (t < 0.12) {
        mixedColor.copy(colorCenter).lerp(colorBrightYellow, t / 0.12);
      } else if (t < 0.55) {
        mixedColor.copy(colorBrightYellow).lerp(colorPureGold, (t - 0.12) / 0.43);
      } else if (t < 0.80) {
        mixedColor.copy(colorPureGold).lerp(colorAmber, (t - 0.55) / 0.25);
      } else {
        mixedColor.copy(colorAmber).lerp(colorVioletAccent, (t - 0.80) / 0.20);
      }

      if (i % 8 === 0 && t > 0.35) {
        mixedColor.lerp(colorVioletAccent, 0.65);
      }

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
      scales[i] = Math.random() * 0.8 + 0.3;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(255,230,120,0.85)');
    grad.addColorStop(0.7, 'rgba(245,158,11,0.25)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const particleTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.5,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
      sizeAttenuation: true
    });

    galaxyPoints = new THREE.Points(geometry, material);
    scene.add(galaxyPoints);
  }

  function createRosePetalGeometry(width, height, curl) {
    const geo = new THREE.PlaneGeometry(width, height, 10, 10);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i) / (width * 0.5);
      const v = (pos.getY(i) + height * 0.5) / height;
      const taper = 0.25 + 0.75 * Math.sin(v * Math.PI * 0.85);
      pos.setX(i, pos.getX(i) * taper);
      const cup = (1 - u * u) * Math.sin(v * Math.PI) * (width * 0.32);
      const roll = Math.pow(Math.max(0, v - 0.55) / 0.45, 2) * curl;
      pos.setZ(i, cup - roll);
    }
    geo.computeVertexNormals();
    return geo;
  }

  function createYellowRose(scale = 1.0, isCentral = false) {
    const roseGroup = new THREE.Group();

    const roseOuterMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.62,
      metalness: 0.02,
      emissive: 0x854d0e,
      emissiveIntensity: 0.08,
      side: THREE.DoubleSide
    });
    const roseInnerMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      roughness: 0.58,
      metalness: 0.02,
      emissive: 0xa16207,
      emissiveIntensity: 0.1,
      side: THREE.DoubleSide
    });
    const roseCoreMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.55,
      metalness: 0.02,
      emissive: 0xca8a04,
      emissiveIntensity: 0.12,
      side: THREE.DoubleSide
    });
    const sepalMat = new THREE.MeshStandardMaterial({
      color: 0x3f6212,
      roughness: 0.75,
      metalness: 0.05
    });

    const coreGeo = createRosePetalGeometry(0.7 * scale, 1.1 * scale, 0.15 * scale);
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const mesh = new THREE.Mesh(coreGeo, roseCoreMat);
      mesh.position.set(Math.cos(angle) * 0.14 * scale, 0.5 * scale, Math.sin(angle) * 0.14 * scale);
      mesh.rotation.y = -angle + Math.PI / 2 + 0.3;
      mesh.rotation.x = 0.28;
      roseGroup.add(mesh);
    }

    const midGeo1 = createRosePetalGeometry(1.2 * scale, 1.5 * scale, 0.35 * scale);
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 + 0.35;
      const mesh = new THREE.Mesh(midGeo1, roseInnerMat);
      mesh.position.set(Math.cos(angle) * 0.42 * scale, 0.38 * scale, Math.sin(angle) * 0.42 * scale);
      mesh.rotation.y = -angle + Math.PI / 2;
      mesh.rotation.x = 0.48;
      roseGroup.add(mesh);
    }

    const midGeo2 = createRosePetalGeometry(1.6 * scale, 1.8 * scale, 0.55 * scale);
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + 0.6;
      const mesh = new THREE.Mesh(midGeo2, roseOuterMat);
      mesh.position.set(Math.cos(angle) * 0.85 * scale, 0.22 * scale, Math.sin(angle) * 0.85 * scale);
      mesh.rotation.y = -angle + Math.PI / 2;
      mesh.rotation.x = 0.72;
      roseGroup.add(mesh);
    }

    const outerGeo = createRosePetalGeometry(2.1 * scale, 2.2 * scale, 0.85 * scale);
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2 + 0.15;
      const mesh = new THREE.Mesh(outerGeo, roseOuterMat);
      mesh.position.set(Math.cos(angle) * 1.35 * scale, 0.05 * scale, Math.sin(angle) * 1.35 * scale);
      mesh.rotation.y = -angle + Math.PI / 2;
      mesh.rotation.x = 0.95;
      roseGroup.add(mesh);
    }

    const calyxGeo = new THREE.ConeGeometry(0.75 * scale, 0.9 * scale, 16);
    const calyxMesh = new THREE.Mesh(calyxGeo, sepalMat);
    calyxMesh.rotation.x = Math.PI;
    calyxMesh.position.y = -0.45 * scale;
    roseGroup.add(calyxMesh);

    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.4 * scale, 0),
      new THREE.Vector3(0.12 * scale, -2.4 * scale, 0.15 * scale),
      new THREE.Vector3(-0.18 * scale, -5.2 * scale, -0.1 * scale),
      new THREE.Vector3(0.05 * scale, -7.5 * scale, 0.2 * scale)
    ]);
    const stemGeo = new THREE.TubeGeometry(stemCurve, 16, 0.14 * scale, 8, false);
    const stemMesh = new THREE.Mesh(stemGeo, sepalMat);
    roseGroup.add(stemMesh);

    if (isCentral) {
      const auraCanvas = document.createElement('canvas');
      auraCanvas.width = 128;
      auraCanvas.height = 128;
      const aCtx = auraCanvas.getContext('2d');
      const aGrad = aCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      aGrad.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
      aGrad.addColorStop(0.4, 'rgba(245, 158, 11, 0.18)');
      aGrad.addColorStop(0.75, 'rgba(147, 51, 234, 0.08)');
      aGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      aCtx.fillStyle = aGrad;
      aCtx.fillRect(0, 0, 128, 128);
      const auraTex = new THREE.CanvasTexture(auraCanvas);
      const auraMat = new THREE.SpriteMaterial({
        map: auraTex,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.45
      });
      const auraSprite = new THREE.Sprite(auraMat);
      auraSprite.scale.set(11 * scale, 11 * scale, 1);
      auraSprite.position.set(0, 0.5 * scale, 0);
      roseGroup.add(auraSprite);
    }

    return roseGroup;
  }

  function createFlowers() {
    centralFlowerGroup = createYellowRose(1.5, true);
    centralFlowerGroup.position.set(0, 2, 0);
    centralFlowerGroup.rotation.x = 0.35;
    centralFlowerGroup.userData = {
      isCenter: true,
      letterDetail: {
        title: "Para ti mi amor",
        tagline: "ROSA AMARILLA",
        message: "Eres la mujer de mis sueños, siempre quiero estar a tu lado"
      }
    };
    scene.add(centralFlowerGroup);
    interactiveObjects.push(centralFlowerGroup);

    // Rosas y palabras en conjunto orbital unificado con frases únicas
    flowersOrbitGroup = new THREE.Group();
    const flowerPairs = [
      {
        text: "ME ENCANTAS BB",
        radius: 11.0,
        angle: 0.4,
        y: 1.5,
        scale: 0.88,
        letter: {
          title: "Para ti mi amor",
          tagline: "ME ENCANTAS BB",
          message: "Eres la mujer de mis sueños, siempre quiero estar a tu lado"
        }
      },
      {
        text: "TE ADORO",
        radius: 14.5,
        angle: 1.45,
        y: -1.2,
        scale: 0.82,
        letter: {
          title: "Para ti mi amor",
          tagline: "TE ADORO",
          message: "Me encantas de pies a cabeza amor de mi vida"
        }
      },
      {
        text: "ME FASCINAS",
        radius: 12.2,
        angle: 2.5,
        y: 2.2,
        scale: 0.90,
        letter: {
          title: "Para ti mi amor",
          tagline: "ME FASCINAS",
          message: "Me haces tan feliz corazon de melon"
        }
      },
      {
        text: "TE AMO",
        radius: 15.6,
        angle: 3.6,
        y: 0.5,
        scale: 0.86,
        letter: {
          title: "Para ti mi amor",
          tagline: "TE AMO",
          message: "Eres la mejor novia del mundo mundial"
        }
      },
      {
        text: "ERES HERMOSA",
        radius: 13.0,
        angle: 4.65,
        y: -2.0,
        scale: 0.80,
        letter: {
          title: "Para ti mi amor",
          tagline: "ERES HERMOSA",
          message: "Estas muy chula amorcito chula"
        }
      },
      {
        text: "ESTAS MUY DELII",
        radius: 16.5,
        angle: 5.6,
        y: 1.8,
        scale: 0.88,
        letter: {
          title: "Para ti mi amor",
          tagline: "ESTAS MUY DELII",
          message: "Gracias por siempre estar conmigo siempre, TE AMOOOOO"
        }
      }
    ];

    flowerPairs.forEach((pos, idx) => {
      const pairGroup = new THREE.Group();

      const flower = createYellowRose(pos.scale, false);
      flower.rotation.x = 0.28 + (idx * 0.05);
      flower.rotation.z = (idx % 2 === 0 ? 0.15 : -0.15);
      pairGroup.add(flower);

      const textSprite = createTextSprite(pos.text);
      textSprite.position.set(0, 3.2 * pos.scale + 0.9, 0);
      pairGroup.add(textSprite);

      pairGroup.position.set(
        Math.cos(pos.angle) * pos.radius,
        pos.y,
        Math.sin(pos.angle) * pos.radius
      );

      pairGroup.userData = {
        baseRadius: pos.radius,
        baseAngle: pos.angle,
        baseY: pos.y,
        speed: 0.12 + (idx * 0.02),
        floatOffset: idx * 1.3,
        letterDetail: pos.letter
      };

      flowersOrbitGroup.add(pairGroup);
      interactiveObjects.push(pairGroup);
    });

    scene.add(flowersOrbitGroup);
  }

  function createTextSprite(text, accent = '#FEF08A') {
    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 190;
    const ctx = canvas.getContext('2d');

    const bgGrad = ctx.createLinearGradient(0, 0, 720, 190);
    bgGrad.addColorStop(0, 'rgba(25, 18, 5, 0.85)');
    bgGrad.addColorStop(0.5, 'rgba(48, 28, 6, 0.94)');
    bgGrad.addColorStop(1, 'rgba(25, 18, 5, 0.85)');

    ctx.fillStyle = bgGrad;
    ctx.roundRect(16, 16, 688, 158, 36);
    ctx.fill();

    ctx.strokeStyle = 'rgba(245, 158, 11, 0.85)';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.fillStyle = '#FDE68A';
    ctx.font = '24px serif';
    ctx.fillText('✦', 36, 96);
    ctx.fillText('✦', 684, 96);

    ctx.fillStyle = accent;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
    ctx.shadowBlur = 14;

    if (text.length > 28) {
      ctx.font = 'italic 34px "Playfair Display", Georgia, serif';
      const words = text.split(' ');
      const mid = Math.ceil(words.length / 2);
      const line1 = words.slice(0, mid).join(' ');
      const line2 = words.slice(mid).join(' ');
      ctx.fillText(line1, 360, 68);
      ctx.fillText(line2, 360, 118);
    } else {
      ctx.font = 'italic 44px "Playfair Display", Georgia, serif';
      ctx.fillText(text, 360, 95);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const mat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(8.5, 2.3, 1);
    return sprite;
  }

  function createFloatingTexts() {
    // Los textos ahora viajan integrados en conjunto con las rosas en flowersOrbitGroup
  }

  function createFloatingPetals() {
    petalsGroup = new THREE.Group();
    const petalCount = 80;

    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.quadraticCurveTo(0.3, 0.4, 0.2, 0.9);
    petalShape.quadraticCurveTo(0, 1.1, -0.2, 0.9);
    petalShape.quadraticCurveTo(-0.3, 0.4, 0, 0);

    const petalGeo = new THREE.ShapeGeometry(petalShape);
    const petalMatYellow = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.52,
      metalness: 0.02,
      emissive: 0x92400e,
      emissiveIntensity: 0.14,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.92
    });

    const petalMatPurple = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      roughness: 0.52,
      metalness: 0.03,
      emissive: 0x6b21a8,
      emissiveIntensity: 0.22,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.88
    });

    for (let i = 0; i < petalCount; i++) {
      const isPurple = i % 5 === 0;
      const petal = new THREE.Mesh(petalGeo, isPurple ? petalMatPurple : petalMatYellow);
      const rad = 3 + Math.random() * 22;
      const theta = Math.random() * Math.PI * 2;
      petal.position.set(
        Math.cos(theta) * rad,
        (Math.random() - 0.5) * 20,
        Math.sin(theta) * rad
      );
      petal.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      const scale = 0.4 + Math.random() * 0.6;
      petal.scale.set(scale, scale, scale);

      petal.userData = {
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        rotSpeedZ: (Math.random() - 0.5) * 0.02,
        fallSpeed: 0.015 + Math.random() * 0.025,
        driftSpeed: 0.005 + Math.random() * 0.01
      };

      petalsGroup.add(petal);
    }

    scene.add(petalsGroup);
  }

  function playRomanticChime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtx) audioCtx = new AudioContext();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 659.25];
      const chords = [
        [notes[0], notes[2], notes[4]],
        [notes[3], notes[1], notes[4]],
        [notes[4], notes[0], notes[2]],
        [notes[0], notes[3], notes[5]]
      ];

      let chordIdx = 0;
      function playStep() {
        if (!isAudioPlaying) return;
        const currentChord = chords[chordIdx % chords.length];
        chordIdx++;

        currentChord.forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const filter = audioCtx.createBiquadFilter();

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, audioCtx.currentTime);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.25);

          const startTime = audioCtx.currentTime + i * 0.25;
          const duration = 2.4;

          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.08, startTime + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start(startTime);
          osc.stop(startTime + duration);
        });
      }

      playStep();
      audioInterval = setInterval(playStep, 2600);
    } catch (e) {
      console.warn("Audio Context issue:", e);
    }
  }

  function toggleAudio() {
    if (isAudioPlaying) {
      isAudioPlaying = false;
      if (audioInterval) clearInterval(audioInterval);
      audioIcon.textContent = '♪';
      audioLabel.textContent = 'Música';
    } else {
      isAudioPlaying = true;
      audioIcon.textContent = '⏸';
      audioLabel.textContent = 'Pausar';
      playRomanticChime();
    }
  }

  function openLetter(detail) {
    isLetterOpen = true;
    letterModal.classList.add('active');

    const msg = (detail && detail.message) 
      ? detail.message 
      : "Eres la mujer de mis sueños, siempre quiero estar a tu lado";
    const title = (detail && detail.title) ? detail.title : "Para ti mi amor";
    const tag = (detail && detail.tagline) ? detail.tagline : "FLORES AMARILLAS";

    if (letterGreetingDisplay) letterGreetingDisplay.textContent = title;
    if (letterDateDisplay) letterDateDisplay.textContent = tag;
    if (letterParagraph1) letterParagraph1.textContent = '"' + msg + '"';
    if (letterParagraph2) letterParagraph2.textContent = "";
    if (letterSignatureDisplay) letterSignatureDisplay.textContent = "";

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FBBF24', '#F59E0B', '#FFFBEB', '#D97706']
      });
    }

    if (!isAudioPlaying) toggleAudio();
  }

  function closeLetter() {
    isLetterOpen = false;
    letterModal.classList.remove('active');
  }

  function setupEvents() {
    btnOpenLetter.addEventListener('click', () => openLetter());
    btnCloseLetter.addEventListener('click', closeLetter);

    const btnCloseWelcome = document.getElementById('btn-close-welcome');
    const welcomeNote = document.getElementById('welcome-note');
    if (btnCloseWelcome && welcomeNote) {
      btnCloseWelcome.addEventListener('click', () => {
        welcomeNote.style.transition = 'all 0.3s ease';
        welcomeNote.style.opacity = '0';
        welcomeNote.style.transform = 'translate(-50%, -10px) scale(0.95)';
        setTimeout(() => {
          welcomeNote.style.display = 'none';
        }, 300);
      });
    }

    letterModal.addEventListener('click', (e) => {
      if (e.target === letterModal) closeLetter();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isLetterOpen) closeLetter();
    });

    btnAudio.addEventListener('click', toggleAudio);
    btnAutoRotate.addEventListener('click', () => {
      controls.autoRotate = !controls.autoRotate;
      btnAutoRotate.style.background = controls.autoRotate ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.06)';
    });

    window.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.hud-overlay') || e.target.closest('#letter-modal')) return;

      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        let hitObject = intersects[0].object;
        let isFlowerHit = false;
        let foundDetail = null;

        while (hitObject.parent && hitObject.parent !== scene) {
          if (hitObject === centralFlowerGroup) {
            isFlowerHit = true;
            foundDetail = centralFlowerGroup.userData?.letterDetail;
            break;
          }
          if (hitObject.userData?.letterDetail) {
            isFlowerHit = true;
            foundDetail = hitObject.userData.letterDetail;
            break;
          }
          hitObject = hitObject.parent;
        }

        if (isFlowerHit) openLetter(foundDetail);
      }
    });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    if (galaxyPoints) {
      galaxyPoints.rotation.y = elapsedTime * 0.05;
    }

    if (centralFlowerGroup) {
      centralFlowerGroup.position.y = 2 + Math.sin(elapsedTime * 1.5) * 0.4;
      centralFlowerGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.2;
    }

    if (flowersOrbitGroup) {
      flowersOrbitGroup.children.forEach((pair) => {
        if (pair.userData) {
          const currentAngle = pair.userData.baseAngle + (elapsedTime * pair.userData.speed * 0.32);
          pair.position.x = Math.cos(currentAngle) * pair.userData.baseRadius;
          pair.position.z = Math.sin(currentAngle) * pair.userData.baseRadius;
          pair.position.y = pair.userData.baseY + Math.sin(elapsedTime * 1.4 + pair.userData.floatOffset) * 0.38;
          pair.rotation.y = -currentAngle + Math.PI / 2;
        }
      });
    }

    if (petalsGroup) {
      petalsGroup.children.forEach((petal) => {
        petal.position.y -= petal.userData.fallSpeed;
        petal.rotation.x += petal.userData.rotSpeedX;
        petal.rotation.y += petal.userData.rotSpeedY;
        petal.rotation.z += petal.userData.rotSpeedZ;
        if (petal.position.y < -12) petal.position.y = 12;
      });
    }

    controls.update();
    renderer.render(scene, camera);
  }
})();`;
