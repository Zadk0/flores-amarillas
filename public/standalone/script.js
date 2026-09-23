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
  const letterGreetingDisplay = document.getElementById('letter-greeting-display');
  const letterDateDisplay = document.getElementById('letter-date-display');
  const letterParagraph1 = document.getElementById('letter-paragraph-1');
  const letterParagraph2 = document.getElementById('letter-paragraph-2');
  const letterSignatureDisplay = document.getElementById('letter-signature-display');

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
    scene.fog = new THREE.FogExp2(0x120a00, 0.012);

    // Cámara responsiva para cualquier relación de aspecto o dispositivo móvil
    const aspect = window.innerWidth / window.innerHeight;
    const initialFov = aspect < 1 ? Math.min(74, 55 + (1 - aspect) * 26) : 55;
    camera = new THREE.PerspectiveCamera(
      initialFov,
      aspect,
      0.1,
      1000
    );
    const initialCamZ = aspect < 0.7 ? 48 : (aspect < 1 ? 44 : 38);
    const initialCamY = aspect < 1 ? 18 : 15;
    camera.position.set(0, initialCamY, initialCamZ);

    // Renderizador
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setClearColor(0x0a0500, 1);
    renderer.domElement.style.touchAction = 'none';
    container.style.touchAction = 'none';
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
  // LUCES DE LA ESCENA (AMARILLO RADIANTE CON TOQUES MORADOS)
  // ==========================================
  function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xfef08a, 0.88);
    scene.add(ambientLight);

    // Luz cálida central para las rosas amarillas
    const centerLight = new THREE.PointLight(0xffea00, 3.2, 60, 1.1);
    centerLight.position.set(0, 6, 0);
    scene.add(centerLight);

    // Luz lateral solar dorada
    const goldMain = new THREE.DirectionalLight(0xfde047, 1.7);
    goldMain.position.set(20, 28, 20);
    scene.add(goldMain);

    // Luz cálida secundaria
    const goldRim = new THREE.DirectionalLight(0xf59e0b, 1.1);
    goldRim.position.set(-20, 15, -20);
    scene.add(goldRim);

    // Toque de acento morado/violeta
    const purpleAccent = new THREE.DirectionalLight(0xa855f7, 0.75);
    purpleAccent.position.set(-20, 25, 20);
    scene.add(purpleAccent);

    const warmVioletUnderLight = new THREE.PointLight(0xc084fc, 1.4, 50, 1.6);
    warmVioletUnderLight.position.set(0, -10, 10);
    scene.add(warmVioletUnderLight);
  }

  // ==========================================
  // GALAXIA CÓSMICA RADIANTE AMARILLA CON TOQUES MORADOS
  // ==========================================
  function createGalaxy() {
    const particleCount = 10000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const colorCenter = new THREE.Color(0xffffff);     // Blanco resplandor núcleo
    const colorBrightYellow = new THREE.Color(0xfff033); // Amarillo vivo radiante
    const colorPureGold = new THREE.Color(0xfacc15);     // Oro floral
    const colorAmber = new THREE.Color(0xf59e0b);        // Ámbar cálido
    const colorVioletAccent = new THREE.Color(0xa855f7); // Toque morado/violeta
    const colorDeepPurple = new THREE.Color(0x6b21a8);   // Morado profundo

    const arms = 3;
    const radius = 42;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), 1.7) * radius;
      const spinAngle = r * 0.44;
      const branchAngle = ((i % arms) * ((2 * Math.PI) / arms));

      // Dispersión suave tridimensional
      const randomX = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.48) * r;
      const randomY = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.40) * (r * 0.38);
      const randomZ = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.48) * r;

      positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
      positions[i3 + 1] = randomY - 2;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

      // Color amarillo cósmico predominante con toques morados
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

    // 2. Rosas y palabras en conjunto orbital unificado con frases únicas
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

  // ==========================================
  // TEXTOS FLOTANTES 3D (CARTELAS ROMÁNTICAS)
  // ==========================================
  function createTextSprite(text, accent = '#FEF08A') {
    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 190;
    const ctx = canvas.getContext('2d');

    // Fondo suave con resplandor ámbar cálido
    const bgGrad = ctx.createLinearGradient(0, 0, 720, 190);
    bgGrad.addColorStop(0, 'rgba(25, 18, 5, 0.85)');
    bgGrad.addColorStop(0.5, 'rgba(48, 28, 6, 0.94)');
    bgGrad.addColorStop(1, 'rgba(25, 18, 5, 0.85)');

    ctx.fillStyle = bgGrad;
    ctx.roundRect(16, 16, 688, 158, 36);
    ctx.fill();

    // Borde fino dorado suave
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.85)';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Pequeños destellos decorativos
    ctx.fillStyle = '#FDE68A';
    ctx.font = '24px serif';
    ctx.fillText('✦', 36, 96);
    ctx.fillText('✦', 684, 96);

    // Tipografía caligráfica / serifa con soporte multilínea
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
      const isPurple = i % 5 === 0; // 20% toques morados
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
  function openLetter(detail) {
    isLetterOpen = true;
    letterModal.classList.add('active');

    // Actualizar contenido con la frase específica elegida por el usuario
    const msg = (detail && detail.message) 
      ? detail.message 
      : "Eres la mujer de mis sueños, siempre quiero estar a tu lado";
    const title = (detail && detail.title) ? detail.title : "Para ti mi amor";
    const tag = (detail && detail.tagline) ? detail.tagline : "FLORES AMARILLAS";

    if (letterGreetingDisplay) letterGreetingDisplay.textContent = title;
    if (letterDateDisplay) letterDateDisplay.textContent = tag;
    if (letterParagraph1) letterParagraph1.textContent = `"${msg}"`;
    if (letterParagraph2) letterParagraph2.textContent = "";
    if (letterSignatureDisplay) letterSignatureDisplay.textContent = "";

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
    btnOpenLetter.addEventListener('click', () => openLetter());
    btnCloseLetter.addEventListener('click', closeLetter);

    // Cerrar recuadro morado de bienvenida
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

    // Cerrar al hacer clic en el fondo oscuro
    letterModal.addEventListener('click', (e) => {
      if (e.target === letterModal) closeLetter();
    });

    // Tecla Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isLetterOpen) closeLetter();
    });

    // Botones de control
    if (btnAudio) btnAudio.addEventListener('click', toggleAudio);
    if (btnAutoRotate) {
      btnAutoRotate.addEventListener('click', () => {
        controls.autoRotate = !controls.autoRotate;
        btnAutoRotate.style.background = controls.autoRotate ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.06)';
      });
    }

    // Clic / Tap inteligente en el canvas (Distingue giros de toques en móviles)
    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerStartTime = 0;

    window.addEventListener('pointerdown', (e) => {
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      pointerStartTime = performance.now();
    });

    window.addEventListener('pointerup', (e) => {
      // Ignorar si se interactuó con botones o modales del DOM
      if (e.target.closest('.hud-overlay') || e.target.closest('#letter-modal') || e.target.closest('button')) return;

      const dx = e.clientX - pointerStartX;
      const dy = e.clientY - pointerStartY;
      const moveDist = Math.hypot(dx, dy);
      const elapsed = performance.now() - pointerStartTime;

      if (moveDist > 12 || elapsed > 550) return;

      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        // Verificar si se tocó alguna flor o el centro y extraer su frase
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

        if (isFlowerHit) {
          openLetter(foundDetail);
        }
      }
    });

    // Redimensionamiento de ventana dinámico
    window.addEventListener('resize', onWindowResize);
  }

  function onWindowResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const currentAspect = w / h;
    camera.aspect = currentAspect;
    camera.fov = currentAspect < 1 ? Math.min(74, 55 + (1 - currentAspect) * 26) : 55;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

    // 3. Órbita en conjunto de las rosas amarillas con sus palabras románticas
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
