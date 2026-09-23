/**
 * Flores Amarillas - Universo Romántico 3D
 * Three.js + OrbitControls + Web Audio API
 */

(function() {
  'use strict';

  // 1. VARIABLES PRINCIPALES
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

  // Inicialización
  initThree();
  createGalaxy();
  createFlowers();
  createFloatingTexts();
  createFloatingPetals();
  setupLighting();
  setupEvents();
  animate();

  // ==========================================
  // CONFIGURACIÓN DE THREE.JS
  // ==========================================
  function initThree() {
    // Escena
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0514, 0.012);

    // Cámara
    camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 15, 38);

    // Renderizador
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x080410, 1);
    container.appendChild(renderer.domElement);

    // Controles de órbita
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 8;
    controls.maxDistance = 80;
    controls.maxPolarAngle = Math.PI / 2 + 0.15; // No bajar demasiado bajo tierra
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;

    // Raycaster para interactividad
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
  }

  // ==========================================
  // LUCES DE LA ESCENA (CÁLIDA, SUAVE Y EQUILIBRADA)
  // ==========================================
  function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.85);
    scene.add(ambientLight);

    // Luz cálida central moderada y natural
    const centerLight = new THREE.PointLight(0xfcd34d, 2.2, 50, 1.2);
    centerLight.position.set(0, 5, 0);
    scene.add(centerLight);

    // Luz secundaria dorada suave
    const rimLight = new THREE.DirectionalLight(0xfef3c7, 0.9);
    rimLight.position.set(20, 30, 20);
    scene.add(rimLight);

    // Acento violeta cósmico suave
    const purpleAccent = new THREE.DirectionalLight(0x9333ea, 0.45);
    purpleAccent.position.set(-20, 15, -20);
    scene.add(purpleAccent);

    const deepVioletFill = new THREE.PointLight(0x6b21a8, 1.2, 40, 1.8);
    deepVioletFill.position.set(0, -12, 10);
    scene.add(deepVioletFill);
  }

  // ==========================================
  // GALAXIA ESPIRAL DORADA CON POLVO MORADO
  // ==========================================
  function createGalaxy() {
    const particleCount = 8000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const colorCenter = new THREE.Color(0xffffff); // Blanco cálido central
    const colorCore = new THREE.Color(0xffea00);   // Amarillo vivo
    const colorMid = new THREE.Color(0xf59e0b);    // Ámbar dorado
    const colorVioletArm = new THREE.Color(0x9333ea); // Violeta místico
    const colorDeepPurple = new THREE.Color(0x581c87); // Púrpura exterior

    const arms = 3;
    const radius = 38;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), 2) * radius;
      const spinAngle = r * 0.45;
      const branchAngle = ((i % arms) * ((2 * Math.PI) / arms));

      // Dispersión suave tridimensional
      const randomX = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.45) * r;
      const randomY = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.35) * (r * 0.35);
      const randomZ = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.45) * r;

      positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
      positions[i3 + 1] = randomY - 2;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

      // Gradiente: El amarillo es dominante en todo el interior
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

    // Textura circular suave generada con canvas para no depender de archivos externos
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

  // ==========================================
  // MODELADO 3D PROCEDURAL DE ROSAS AMARILLAS ELEGANTES
  // ==========================================
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
    // 1. Rosa Central Majestuosa
    centralFlowerGroup = createYellowRose(1.5, true);
    centralFlowerGroup.position.set(0, 2, 0);
    centralFlowerGroup.rotation.x = 0.35;
    scene.add(centralFlowerGroup);

    centralFlowerGroup.userData = { isCenter: true };
    interactiveObjects.push(centralFlowerGroup);

    // 2. Rosas Amarillas Orbitando alrededor
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

  // ==========================================
  // TEXTOS FLOTANTES 3D (CARTELAS ROMÁNTICAS)
  // ==========================================
  function createTextSprite(text, accent = '#FEF08A') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');

    // Fondo suave con resplandor dorado
    const bgGrad = ctx.createLinearGradient(0, 0, 512, 160);
    bgGrad.addColorStop(0, 'rgba(20, 15, 5, 0.7)');
    bgGrad.addColorStop(0.5, 'rgba(45, 25, 5, 0.85)');
    bgGrad.addColorStop(1, 'rgba(20, 15, 5, 0.7)');

    ctx.fillStyle = bgGrad;
    ctx.roundRect(16, 20, 480, 120, 30);
    ctx.fill();

    // Borde fino dorado suave
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Pequeños destellos decorativos
    ctx.fillStyle = '#FDE68A';
    ctx.font = '22px serif';
    ctx.fillText('✦', 36, 88);
    ctx.fillText('✦', 458, 88);

    // Tipografía caligráfica / serifa
    ctx.font = 'italic 52px "Playfair Display", Georgia, serif';
    ctx.fillStyle = accent;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
    ctx.shadowBlur = 12;
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

  // ==========================================
  // PÉTALOS FLOTANTES EN EL UNIVERSO
  // ==========================================
  function createFloatingPetals() {
    petalsGroup = new THREE.Group();
    const petalCount = 80;

    // Forma básica de pétalo
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

  // ==========================================
  // MÚSICA AMBIENTAL ROMÁNTICA CON WEB AUDIO API
  // ==========================================
  function playRomanticChime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtx) {
        audioCtx = new AudioContext();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      // Notas de la escala pentatónica mayor en Hertzios (C4, D4, E4, G4, A4, C5, E5)
      const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 659.25];
      const chords = [
        [notes[0], notes[2], notes[4]], // C
        [notes[3], notes[1], notes[4]], // G
        [notes[4], notes[0], notes[2]], // Am
        [notes[0], notes[3], notes[5]]  // F
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
      console.warn("Audio Context no soportado o bloqueado por el navegador", e);
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

  // ==========================================
  // EVENTOS E INTERACCIÓN
  // ==========================================
  function openLetter() {
    isLetterOpen = true;
    letterModal.classList.add('active');

    // Confetti dorado si está disponible la librería
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FBBF24', '#F59E0B', '#FFFBEB', '#D97706']
      });
    }

    // Si el audio aún no estaba sonando, iniciar suavemente
    if (!isAudioPlaying) {
      toggleAudio();
    }
  }

  function closeLetter() {
    isLetterOpen = false;
    letterModal.classList.remove('active');
  }

  function setupEvents() {
    // Botón principal "Para Ti"
    btnOpenLetter.addEventListener('click', openLetter);
    btnCloseLetter.addEventListener('click', closeLetter);

    // Cerrar al hacer clic en el fondo oscuro
    letterModal.addEventListener('click', (e) => {
      if (e.target === letterModal) closeLetter();
    });

    // Tecla Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isLetterOpen) closeLetter();
    });

    // Botones de control
    btnAudio.addEventListener('click', toggleAudio);
    btnAutoRotate.addEventListener('click', () => {
      controls.autoRotate = !controls.autoRotate;
      btnAutoRotate.style.background = controls.autoRotate ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.06)';
    });

    // Clic en el canvas (Raycasting en flores 3D)
    window.addEventListener('pointerdown', (e) => {
      // Ignorar si se hizo clic en elementos DOM
      if (e.target.closest('.hud-overlay') || e.target.closest('#letter-modal')) return;

      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        // Verificar si se tocó alguna flor o el centro
        let hitObject = intersects[0].object;
        let isFlowerHit = false;

        while (hitObject.parent && hitObject.parent !== scene) {
          if (hitObject === centralFlowerGroup || hitObject.userData?.baseRadius) {
            isFlowerHit = true;
            break;
          }
          hitObject = hitObject.parent;
        }

        if (isFlowerHit) {
          openLetter();
        }
      }
    });

    // Redimensionamiento de ventana
    window.addEventListener('resize', onWindowResize);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // ==========================================
  // BUCLE DE ANIMACIÓN
  // ==========================================
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // 1. Rotación lenta de la espiral galáctica
    if (galaxyPoints) {
      galaxyPoints.rotation.y = elapsedTime * 0.05;
    }

    // 2. Respiración y oscilación suave de la flor central
    if (centralFlowerGroup) {
      centralFlowerGroup.position.y = 2 + Math.sin(elapsedTime * 1.5) * 0.4;
      centralFlowerGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.2;
    }

    // 3. Órbita de las flores secundarias
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

    // 4. Cartelas de texto flotantes (orientadas siempre a la cámara)
    if (floatingTextsGroup) {
      floatingTextsGroup.children.forEach((sprite) => {
        if (sprite.userData) {
          sprite.position.y = sprite.userData.baseY + Math.sin(elapsedTime * sprite.userData.floatSpeed) * 0.35;
        }
      });
    }

    // 5. Pétalos flotantes cayendo suavemente
    if (petalsGroup) {
      petalsGroup.children.forEach((petal) => {
        petal.position.y -= petal.userData.fallSpeed;
        petal.rotation.x += petal.userData.rotSpeedX;
        petal.rotation.y += petal.userData.rotSpeedY;
        petal.rotation.z += petal.userData.rotSpeedZ;

        // Reposicionar al llegar abajo
        if (petal.position.y < -12) {
          petal.position.y = 12;
        }
      });
    }

    // Actualizar controles de cámara
    controls.update();

    // Renderizar fotograma
    renderer.render(scene, camera);
  }

})();
