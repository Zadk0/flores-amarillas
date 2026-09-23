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
    <!-- Barra superior -->
    <header class="top-bar">
      <div class="brand">
        <span class="brand-sparkle">✦</span>
        <h1 class="brand-title">Flores Amarillas</h1>
        <span class="brand-tag">Para Ti</span>
      </div>
      <div class="header-controls">
        <button id="btn-audio" class="btn-icon" title="Música romántica ambiental">
          <span class="icon" id="audio-icon">♪</span>
          <span class="btn-label" id="audio-label">Música</span>
        </button>
        <button id="btn-autorotate" class="btn-icon" title="Rotación automática">
          <span class="icon">⟳</span>
          <span class="btn-label">Giro</span>
        </button>
      </div>
    </header>

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
          <h2 class="letter-greeting">Mi amor</h2>
          <div class="gold-divider">
            <span class="divider-line"></span>
            <span class="divider-icon">✦ ❀ ✦</span>
            <span class="divider-line"></span>
          </div>
        </div>

        <!-- Mensaje de la carta -->
        <div class="letter-body">
          <p class="letter-paragraph">
            Estas flores amarillas son como tú: brillantes, radiantes y llenas de alegría.
          </p>
          <p class="letter-paragraph">
            Gracias por iluminar cada uno de mis días. Eres simplemente hermosa.
          </p>
          <p class="letter-signature">
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
    scene.fog = new THREE.FogExp2(0x0a0514, 0.012);

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 38);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x080410, 1);
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
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.85);
    scene.add(ambientLight);

    const centerLight = new THREE.PointLight(0xfcd34d, 2.2, 50, 1.2);
    centerLight.position.set(0, 5, 0);
    scene.add(centerLight);

    const rimLight = new THREE.DirectionalLight(0xfef3c7, 0.9);
    rimLight.position.set(20, 30, 20);
    scene.add(rimLight);

    const purpleAccent = new THREE.DirectionalLight(0x9333ea, 0.45);
    purpleAccent.position.set(-20, 15, -20);
    scene.add(purpleAccent);

    const deepVioletFill = new THREE.PointLight(0x6b21a8, 1.2, 40, 1.8);
    deepVioletFill.position.set(0, -12, 10);
    scene.add(deepVioletFill);
  }

  function createGalaxy() {
    const particleCount = 8000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const colorCenter = new THREE.Color(0xffffff);
    const colorCore = new THREE.Color(0xffea00);
    const colorMid = new THREE.Color(0xf59e0b);
    const colorVioletArm = new THREE.Color(0x9333ea);
    const colorDeepPurple = new THREE.Color(0x581c87);

    const arms = 3;
    const radius = 38;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), 2) * radius;
      const spinAngle = r * 0.45;
      const branchAngle = ((i % arms) * ((2 * Math.PI) / arms));

      const randomX = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.45) * r;
      const randomY = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.35) * (r * 0.35);
      const randomZ = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.45) * r;

      positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
      positions[i3 + 1] = randomY - 2;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

      const mixedColor = colorCore.clone();
      const t = r / radius;
      if (t < 0.2) {
        mixedColor.lerp(colorCenter, (0.2 - t) / 0.2);
      } else if (t < 0.6) {
        mixedColor.lerp(colorMid, (t - 0.2) / 0.4);
      } else if (t < 0.82) {
        mixedColor.lerp(colorVioletArm, (t - 0.6) / 0.22);
      } else {
        mixedColor.lerp(colorDeepPurple, (t - 0.82) / 0.18);
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
    scene.add(centralFlowerGroup);

    centralFlowerGroup.userData = { isCenter: true };
    interactiveObjects.push(centralFlowerGroup);

    flowersOrbitGroup = new THREE.Group();
    const flowerPositions = [
      { radius: 10.5, angle: 0.4, y: 1.5, scale: 0.88 },
      { radius: 13.8, angle: 1.6, y: -1.2, scale: 0.78 },
      { radius: 11.5, angle: 2.8, y: 2.4, scale: 0.92 },
      { radius: 14.8, angle: 3.9, y: 0.5, scale: 0.84 },
      { radius: 12.2, angle: 4.9, y: -2.1, scale: 0.76 },
      { radius: 15.5, angle: 5.8, y: 1.8, scale: 0.86 }
    ];

    flowerPositions.forEach((pos, idx) => {
      const flower = createYellowRose(pos.scale, false);
      flower.position.set(
        Math.cos(pos.angle) * pos.radius,
        pos.y,
        Math.sin(pos.angle) * pos.radius
      );
      flower.rotation.x = 0.28 + (idx * 0.05);
      flower.rotation.z = (idx % 2 === 0 ? 0.15 : -0.15);
      flower.userData = {
        baseRadius: pos.radius,
        baseAngle: pos.angle,
        speed: 0.15 + (idx * 0.03),
        floatOffset: idx * 1.2
      };
      flowersOrbitGroup.add(flower);
      interactiveObjects.push(flower);
    });

    scene.add(flowersOrbitGroup);
  }

  function createTextSprite(text, accent = '#FEF08A') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');

    const bgGrad = ctx.createLinearGradient(0, 0, 512, 160);
    bgGrad.addColorStop(0, 'rgba(20, 15, 5, 0.7)');
    bgGrad.addColorStop(0.5, 'rgba(45, 25, 5, 0.85)');
    bgGrad.addColorStop(1, 'rgba(20, 15, 5, 0.7)');

    ctx.fillStyle = bgGrad;
    ctx.roundRect(16, 20, 480, 120, 30);
    ctx.fill();

    ctx.strokeStyle = 'rgba(245, 158, 11, 0.75)';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#FDE68A';
    ctx.font = '22px serif';
    ctx.fillText('✦', 36, 88);
    ctx.fillText('✦', 458, 88);

    ctx.font = 'italic 52px "Playfair Display", Georgia, serif';
    ctx.fillStyle = accent;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(245, 158, 11, 0.9)';
    ctx.shadowBlur = 16;
    ctx.fillText(text, 256, 80);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const mat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(6.8, 2.1, 1);
    return sprite;
  }

  function createFloatingTexts() {
    floatingTextsGroup = new THREE.Group();

    const romanticPhrases = [
      { text: "Mi amor", dist: 8.5, angle: 0.6, y: 4.8 },
      { text: "Eres mi sol", dist: 12.0, angle: 1.8, y: -2.5 },
      { text: "Te amo", dist: 9.0, angle: 3.2, y: 3.8 },
      { text: "Eres preciosa", dist: 13.5, angle: 4.3, y: 1.5 },
      { text: "Mi rosa favorita", dist: 11.0, angle: 5.4, y: -3.2 },
      { text: "Luz de mis días", dist: 14.5, angle: 2.5, y: 5.2 }
    ];

    romanticPhrases.forEach((item, index) => {
      const sprite = createTextSprite(item.text);
      sprite.position.x = Math.cos(item.angle) * item.dist;
      sprite.position.z = Math.sin(item.angle) * item.dist;
      sprite.position.y = item.y;
      sprite.userData = {
        baseY: item.y,
        floatSpeed: 1.2 + (index * 0.2),
        dist: item.dist,
        angle: item.angle
      };
      floatingTextsGroup.add(sprite);
    });

    scene.add(floatingTextsGroup);
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
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.55,
      metalness: 0.02,
      emissive: 0x92400e,
      emissiveIntensity: 0.12,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });

    for (let i = 0; i < petalCount; i++) {
      const petal = new THREE.Mesh(petalGeo, petalMat);
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

  function openLetter() {
    isLetterOpen = true;
    letterModal.classList.add('active');

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
    btnOpenLetter.addEventListener('click', openLetter);
    btnCloseLetter.addEventListener('click', closeLetter);

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

        while (hitObject.parent && hitObject.parent !== scene) {
          if (hitObject === centralFlowerGroup || hitObject.userData?.baseRadius) {
            isFlowerHit = true;
            break;
          }
          hitObject = hitObject.parent;
        }

        if (isFlowerHit) openLetter();
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
      flowersOrbitGroup.children.forEach((flower) => {
        if (flower.userData) {
          const currentAngle = flower.userData.baseAngle + (elapsedTime * flower.userData.speed * 0.3);
          flower.position.x = Math.cos(currentAngle) * flower.userData.baseRadius;
          flower.position.z = Math.sin(currentAngle) * flower.userData.baseRadius;
          flower.position.y += Math.sin(elapsedTime * 2 + flower.userData.floatOffset) * 0.006;
          flower.rotation.y = -currentAngle + Math.PI / 2;
        }
      });
    }

    if (floatingTextsGroup) {
      floatingTextsGroup.children.forEach((sprite) => {
        if (sprite.userData) {
          sprite.position.y = sprite.userData.baseY + Math.sin(elapsedTime * sprite.userData.floatSpeed) * 0.35;
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
