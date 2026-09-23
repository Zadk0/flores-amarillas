import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LetterDetail } from './LetterModal';

interface ThreeCanvasProps {
  onOpenLetter: (detail?: LetterDetail) => void;
  autoRotate: boolean;
  onRaycastFlowerClick?: () => void;
  cameraPreset?: 'center' | 'overview' | 'top' | null;
  onPresetReset?: () => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  onOpenLetter,
  autoRotate,
  cameraPreset,
  onPresetReset
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // 1. ESCENA & NIEBLA CÓSMICA (Fondo con matiz violeta profundo místico)
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0514, 0.012);

    // 2. CÁMARA
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 16, 40);
    cameraRef.current = camera;

    // 3. RENDERIZADOR
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x080410, 1);
    container.appendChild(renderer.domElement);

    // 4. CONTROLES DE ÓRBITA
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 7;
    controls.maxDistance = 85;
    controls.maxPolarAngle = Math.PI / 2 + 0.12;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.6;
    controlsRef.current = controls;

    // 5. ILUMINACIÓN ROMÁNTICA: CÁLIDA, SUAVE Y EQUILIBRADA (SIN BRILLO EXCESIVO)
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.85);
    scene.add(ambientLight);

    // Luz cálida central moderada y natural para las rosas
    const centerPointLight = new THREE.PointLight(0xfcd34d, 2.2, 50, 1.2);
    centerPointLight.position.set(0, 5, 0);
    scene.add(centerPointLight);

    // Luz lateral suave
    const goldRimLight = new THREE.DirectionalLight(0xfef3c7, 0.9);
    goldRimLight.position.set(25, 30, 20);
    scene.add(goldRimLight);

    // Luz de contraste morado suave para dar profundidad
    const purpleAccentLight = new THREE.DirectionalLight(0x9333ea, 0.45);
    purpleAccentLight.position.set(-25, 15, -25);
    scene.add(purpleAccentLight);

    const deepVioletFill = new THREE.PointLight(0x6b21a8, 1.2, 40, 1.8);
    deepVioletFill.position.set(0, -12, 10);
    scene.add(deepVioletFill);

    // 6. GALAXIA ESPIRAL DORADA CON POLVO CÓSMICO MORADO/VIOLETA
    const particleCount = 8500;
    const galaxyGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Colores: El núcleo e interior son AMARILLO VIBRANTE Y ORO
    // Los bordes exteriores tienen un halo morado/púrpura elegante que hace resaltar el amarillo
    const colorCenter = new THREE.Color(0xffffff); // Blanco incandescente
    const colorCore = new THREE.Color(0xffea00);   // Amarillo intenso radiante
    const colorMid = new THREE.Color(0xf59e0b);    // Ámbar dorado
    const colorVioletArm = new THREE.Color(0x9333ea); // Violeta místico
    const colorDeepPurple = new THREE.Color(0x581c87); // Púrpura cósmico profundo

    const arms = 3;
    const maxRadius = 40;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), 2) * maxRadius;
      const spinAngle = r * 0.42;
      const branchAngle = ((i % arms) * ((2 * Math.PI) / arms));

      const randomX = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.45) * r;
      const randomY = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.35) * (r * 0.35);
      const randomZ = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.45) * r;

      positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
      positions[i3 + 1] = randomY - 2;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

      // Color: El 70% del volumen es intensamente AMARILLO/DORADO; las estrellas lejanas toman matices púrpura
      const mixedColor = colorCore.clone();
      const t = r / maxRadius;
      if (t < 0.2) {
        mixedColor.lerp(colorCenter, (0.2 - t) / 0.2); // Núcleo
      } else if (t < 0.6) {
        mixedColor.lerp(colorMid, (t - 0.2) / 0.4); // Amarillo / dorado cálido
      } else if (t < 0.82) {
        mixedColor.lerp(colorVioletArm, (t - 0.6) / 0.22);
      } else {
        mixedColor.lerp(colorDeepPurple, (t - 0.82) / 0.18);
      }

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    galaxyGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    galaxyGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Textura de partícula generada con Canvas suave
    const starCanvas = document.createElement('canvas');
    starCanvas.width = 64;
    starCanvas.height = 64;
    const sCtx = starCanvas.getContext('2d')!;
    const sGrad = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    sGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    sGrad.addColorStop(0.3, 'rgba(254, 240, 138, 0.65)');
    sGrad.addColorStop(0.7, 'rgba(245, 158, 11, 0.2)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 64, 64);
    const starTexture = new THREE.CanvasTexture(starCanvas);

    const galaxyMat = new THREE.PointsMaterial({
      size: 0.46,
      map: starTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
      sizeAttenuation: true
    });

    const galaxyPoints = new THREE.Points(galaxyGeo, galaxyMat);
    scene.add(galaxyPoints);

    // 7. MODELADO 3D PROCEDURAL DE ROSAS AMARILLAS ELEGANTES (NO BRILLAN EN EXCESO)
    // Pétalos modelados con superficies curvadas concéntricas envolventes (estilo rosa abierta)
    function createRosePetalGeometry(width: number, height: number, curl: number) {
      const segW = 12;
      const segH = 12;
      const geo = new THREE.PlaneGeometry(width, height, segW, segH);
      const pos = geo.attributes.position;

      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i) / (width * 0.5); // -1 a 1
        const v = (pos.getY(i) + height * 0.5) / height; // 0 (base) a 1 (punta)

        // Estrechar la base del pétalo, ensanchar el centro
        const taper = 0.25 + 0.75 * Math.sin(v * Math.PI * 0.85);
        pos.setX(i, pos.getX(i) * taper);

        // Curvatura esférica/cóncava envolvente
        const cup = (1 - u * u) * Math.sin(v * Math.PI) * (width * 0.32);
        // Curvatura del borde superior doblándose hacia afuera (efecto rosa natural)
        const roll = Math.pow(Math.max(0, v - 0.55) / 0.45, 2) * curl;

        pos.setZ(i, cup - roll);
      }

      geo.computeVertexNormals();
      return geo;
    }

    // Material aterciopelado para los pétalos de rosa (amarillo cálido, mate suave y sin brillos excesivos)
    const rosePetalOuterMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.62,
      metalness: 0.02,
      emissive: 0x854d0e,
      emissiveIntensity: 0.08,
      side: THREE.DoubleSide
    });

    const rosePetalInnerMat = new THREE.MeshStandardMaterial({
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

    function createYellowRose(scale = 1.0, isCentral = false) {
      const roseGroup = new THREE.Group();

      // Botón central apretado (espiral espiral de 3 pétalos internos)
      const corePetalGeo = createRosePetalGeometry(0.7 * scale, 1.1 * scale, 0.15 * scale);
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const mesh = new THREE.Mesh(corePetalGeo, roseCoreMat);
        mesh.position.set(
          Math.cos(angle) * 0.14 * scale,
          0.5 * scale,
          Math.sin(angle) * 0.14 * scale
        );
        mesh.rotation.y = -angle + Math.PI / 2 + 0.3;
        mesh.rotation.x = 0.28;
        mesh.rotation.z = 0.08;
        roseGroup.add(mesh);
      }

      // Capa media 1 (5 pétalos intermedios)
      const midPetalGeo1 = createRosePetalGeometry(1.2 * scale, 1.5 * scale, 0.35 * scale);
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 + 0.35;
        const mesh = new THREE.Mesh(midPetalGeo1, rosePetalInnerMat);
        mesh.position.set(
          Math.cos(angle) * 0.42 * scale,
          0.38 * scale,
          Math.sin(angle) * 0.42 * scale
        );
        mesh.rotation.y = -angle + Math.PI / 2;
        mesh.rotation.x = 0.48;
        roseGroup.add(mesh);
      }

      // Capa media 2 (6 pétalos más abiertos)
      const midPetalGeo2 = createRosePetalGeometry(1.6 * scale, 1.8 * scale, 0.55 * scale);
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + 0.6;
        const mesh = new THREE.Mesh(midPetalGeo2, rosePetalOuterMat);
        mesh.position.set(
          Math.cos(angle) * 0.85 * scale,
          0.22 * scale,
          Math.sin(angle) * 0.85 * scale
        );
        mesh.rotation.y = -angle + Math.PI / 2;
        mesh.rotation.x = 0.72;
        roseGroup.add(mesh);
      }

      // Capa exterior grande (7 pétalos amplios desplegados y ondulados)
      const outerPetalGeo = createRosePetalGeometry(2.1 * scale, 2.2 * scale, 0.85 * scale);
      for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI * 2 + 0.15;
        const mesh = new THREE.Mesh(outerPetalGeo, rosePetalOuterMat);
        mesh.position.set(
          Math.cos(angle) * 1.35 * scale,
          0.05 * scale,
          Math.sin(angle) * 1.35 * scale
        );
        mesh.rotation.y = -angle + Math.PI / 2;
        mesh.rotation.x = 0.95;
        roseGroup.add(mesh);
      }

      // Receptáculo verde y sépalos puntiagudos debajo de la rosa
      const calyxGeo = new THREE.ConeGeometry(0.75 * scale, 0.9 * scale, 16);
      const calyxMesh = new THREE.Mesh(calyxGeo, sepalMat);
      calyxMesh.rotation.x = Math.PI;
      calyxMesh.position.y = -0.45 * scale;
      roseGroup.add(calyxMesh);

      // 5 sépalos verdes curvados
      const sepalShape = new THREE.Shape();
      sepalShape.moveTo(0, 0);
      sepalShape.lineTo(0.22 * scale, -0.2 * scale);
      sepalShape.lineTo(0.08 * scale, -1.25 * scale);
      sepalShape.lineTo(0, -1.4 * scale);
      sepalShape.lineTo(-0.08 * scale, -1.25 * scale);
      sepalShape.lineTo(-0.22 * scale, -0.2 * scale);
      sepalShape.closePath();
      const sepalGeo = new THREE.ShapeGeometry(sepalShape);

      for (let s = 0; s < 5; s++) {
        const angle = (s / 5) * Math.PI * 2;
        const sepal = new THREE.Mesh(sepalGeo, sepalMat);
        sepal.position.set(
          Math.cos(angle) * 0.45 * scale,
          -0.15 * scale,
          Math.sin(angle) * 0.45 * scale
        );
        sepal.rotation.y = -angle + Math.PI / 2;
        sepal.rotation.x = 0.85;
        roseGroup.add(sepal);
      }

      // Tallo verde y suavemente curvado
      const stemCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.4 * scale, 0),
        new THREE.Vector3(0.12 * scale, -2.4 * scale, 0.15 * scale),
        new THREE.Vector3(-0.18 * scale, -5.2 * scale, -0.1 * scale),
        new THREE.Vector3(0.05 * scale, -7.5 * scale, 0.2 * scale)
      ]);
      const stemGeo = new THREE.TubeGeometry(stemCurve, 18, 0.14 * scale, 8, false);
      const stemMesh = new THREE.Mesh(stemGeo, sepalMat);
      roseGroup.add(stemMesh);

      // Pequeñas hojas en el tallo
      const leafShape = new THREE.Shape();
      leafShape.moveTo(0, 0);
      leafShape.quadraticCurveTo(0.45 * scale, 0.5 * scale, 0.1 * scale, 1.2 * scale);
      leafShape.quadraticCurveTo(-0.45 * scale, 0.5 * scale, 0, 0);
      const leafGeo = new THREE.ShapeGeometry(leafShape);

      const leaf1 = new THREE.Mesh(leafGeo, sepalMat);
      leaf1.position.set(0.12 * scale, -2.6 * scale, 0.15 * scale);
      leaf1.rotation.set(0.5, 0.8, -0.4);
      roseGroup.add(leaf1);

      const leaf2 = new THREE.Mesh(leafGeo, sepalMat);
      leaf2.position.set(-0.16 * scale, -4.6 * scale, -0.08 * scale);
      leaf2.rotation.set(-0.4, -1.2, 0.6);
      roseGroup.add(leaf2);

      // Si es la rosa central, halo muy tenue y elegante (sin deslumbrar)
      if (isCentral) {
        const auraCanvas = document.createElement('canvas');
        auraCanvas.width = 128;
        auraCanvas.height = 128;
        const aCtx = auraCanvas.getContext('2d')!;
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

    // Rosa Central Majestuosa (Diseño 3D elegante de Rosa Amarilla)
    const centralFlower = createYellowRose(1.5, true);
    centralFlower.position.set(0, 2.0, 0);
    centralFlower.rotation.x = 0.35; // Inclinación suave hacia la cámara para lucir sus pétalos
    centralFlower.userData = {
      letterDetail: {
        title: "Mi amor eterno",
        tagline: "Rosa Dorada Central",
        textParagraph1: "En el corazón de todo este universo cósmico, esta gran flor amarilla resplandece solo por ti.",
        textParagraph2: "Tu amor es mi centro, mi paz y la luz dorada que ilumina cada segundo de mi vida.",
        signature: "Siempre tuyo con todo mi corazón."
      }
    };
    scene.add(centralFlower);

    // 8. TEXTOS 3D FLOTANTES (Cartelas Románticas)
    function createTextSprite(text: string) {
      const canvas = document.createElement('canvas');
      canvas.width = 720;
      canvas.height = 190;
      const ctx = canvas.getContext('2d')!;

      // Fondo oscuro elegante con halo ámbar
      const bgGrad = ctx.createLinearGradient(0, 0, 720, 190);
      bgGrad.addColorStop(0, 'rgba(25, 18, 5, 0.82)');
      bgGrad.addColorStop(0.5, 'rgba(48, 28, 6, 0.94)');
      bgGrad.addColorStop(1, 'rgba(25, 18, 5, 0.82)');
      ctx.fillStyle = bgGrad;
      ctx.roundRect(16, 16, 688, 158, 36);
      ctx.fill();

      // Borde dorado suave
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.85)';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Destellos discretos
      ctx.fillStyle = '#FDE68A';
      ctx.font = '24px serif';
      ctx.fillText('✦', 36, 96);
      ctx.fillText('✦', 684, 96);

      // Texto dinámico con ajuste inteligente si es largo
      ctx.fillStyle = '#FEF08A';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(245, 158, 11, 0.7)';
      ctx.shadowBlur = 14;

      if (text.length > 28) {
        ctx.font = 'italic 34px "Playfair Display", Georgia, serif';
        // Dividir en 2 líneas si es necesario
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

    // ROSAS Y PALABRAS UNIDAS EN CONJUNTO
    // Cada elemento orbita en pareja y posee una frase y mensaje romántico único y especial
    const orbitingGroup = new THREE.Group();
    const celestialPairs = [
      {
        text: "Eres la mujer de mis sueños, siempre quiero estar a tu lado",
        r: 11.0,
        a: 0.4,
        y: 1.5,
        s: 0.88,
        letter: {
          title: "Mi Amor Eterno",
          tagline: "El Sueño Más Hermoso",
          textParagraph1: "Eres la mujer de mis sueños, siempre quiero estar a tu lado.",
          textParagraph2: "Desde que llegaste a mi vida no hay un solo instante en que no agradezca tenerte; eres mi felicidad entera.",
          signature: "Siempre a tu lado, por y para siempre."
        }
      },
      {
        text: "Me encantas de pies a cabeza amor de mi vida",
        r: 14.5,
        a: 1.45,
        y: -1.2,
        s: 0.82,
        letter: {
          title: "Amor de mi Vida",
          tagline: "Fascinación Total",
          textParagraph1: "Me encantas de pies a cabeza amor de mi vida.",
          textParagraph2: "Tu mirada, tu sonrisa, tu manera de ser y cada detalle tuyo me enamoran cada día más y más.",
          signature: "Completamente loco por ti."
        }
      },
      {
        text: "Me haces tan feliz corazon de melon",
        r: 12.2,
        a: 2.5,
        y: 2.2,
        s: 0.90,
        letter: {
          title: "Corazón de Melón",
          tagline: "Mi Alegría Inmensa",
          textParagraph1: "Me haces tan feliz corazón de melón.",
          textParagraph2: "A tu lado cada día se llena de risas, ternura y un color amarillo brillante lleno de amor.",
          signature: "Tu felicidad es la mía."
        }
      },
      {
        text: "Eres la mejor novia del mundo mundial",
        r: 15.6,
        a: 3.6,
        y: 0.5,
        s: 0.86,
        letter: {
          title: "Mi Princesa Hermosa",
          tagline: "La Mejor de Todas",
          textParagraph1: "Eres la mejor novia del mundo mundial.",
          textParagraph2: "No existe en ningún rincón del planeta alguien tan tierna, linda, comprensiva y perfecta como tú.",
          signature: "El novio más afortunado del universo."
        }
      },
      {
        text: "Estas muy chula amorcito chula",
        r: 13.0,
        a: 4.65,
        y: -2.0,
        s: 0.80,
        letter: {
          title: "Amorcito Chula",
          tagline: "Belleza Pura",
          textParagraph1: "Estás muy chula amorcito chula.",
          textParagraph2: "Eres la más preciosa de todas, una florecita resplandeciente que ilumina todo a su alrededor.",
          signature: "Para la más chula de mi corazón."
        }
      },
      {
        text: "Gracias por siempre estar conmigo siempre, TE AMOOOOO",
        r: 16.5,
        a: 5.6,
        y: 1.8,
        s: 0.88,
        letter: {
          title: "Mi Amor Incondicional",
          tagline: "Gratitud y Pasión",
          textParagraph1: "Gracias por siempre estar conmigo siempre, ¡TE AMOOOOO!",
          textParagraph2: "Gracias por tu apoyo, por tus abrazos cálidos y por hacerme sentir tan amado en cada segundo de la vida.",
          signature: "¡Te amooooo con todas mis fuerzas!"
        }
      }
    ];

    celestialPairs.forEach((cfg, idx) => {
      // Grupo contenedor para que la rosa y el texto viajen exactamente juntos
      const pairGroup = new THREE.Group();

      // Rosa amarilla 3D
      const rose = createYellowRose(cfg.s, false);
      rose.rotation.x = 0.28 + (idx * 0.05);
      rose.rotation.z = (idx % 2 === 0 ? 0.15 : -0.15);
      pairGroup.add(rose);

      // Cartela con la palabra romántica ubicada justo encima de la rosa
      const textSprite = createTextSprite(cfg.text);
      textSprite.position.set(0, 3.2 * cfg.s + 0.9, 0);
      pairGroup.add(textSprite);

      // Posición inicial en el espacio orbital
      pairGroup.position.set(
        Math.cos(cfg.a) * cfg.r,
        cfg.y,
        Math.sin(cfg.a) * cfg.r
      );

      pairGroup.userData = {
        baseRadius: cfg.r,
        baseAngle: cfg.a,
        baseY: cfg.y,
        speed: 0.12 + (idx * 0.02),
        floatOffset: idx * 1.3,
        letterDetail: cfg.letter
      };

      orbitingGroup.add(pairGroup);
    });
    scene.add(orbitingGroup);

    // 9. PÉTALOS FLOTANTES Y CAYENDO SUAVEMENTE (Mayoría amarillo radiante con toques violetas)
    const petalsGroup = new THREE.Group();
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.quadraticCurveTo(0.3, 0.4, 0.2, 0.9);
    petalShape.quadraticCurveTo(0, 1.1, -0.2, 0.9);
    petalShape.quadraticCurveTo(-0.3, 0.4, 0, 0);

    const petalGeo = new THREE.ShapeGeometry(petalShape);
    
    // Pétalo amarillo principal (85% de los pétalos)
    const petalMatYellow = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.55,
      metalness: 0.02,
      emissive: 0x92400e,
      emissiveIntensity: 0.12,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.92
    });

    // Pétalo lila/morado sutil de contraste (15% de los pétalos)
    const petalMatPurple = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      roughness: 0.58,
      metalness: 0.02,
      emissive: 0x581c87,
      emissiveIntensity: 0.12,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });

    for (let i = 0; i < 95; i++) {
      const isPurple = i % 7 === 0; // Solo 1 de cada 7 es morado (el amarillo resalta mucho más)
      const p = new THREE.Mesh(petalGeo, isPurple ? petalMatPurple : petalMatYellow);
      const rad = 3 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      p.position.set(
        Math.cos(theta) * rad,
        (Math.random() - 0.5) * 22,
        Math.sin(theta) * rad
      );
      p.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      const scl = 0.35 + Math.random() * 0.6;
      p.scale.set(scl, scl, scl);
      p.userData = {
        rotX: (Math.random() - 0.5) * 0.02,
        rotY: (Math.random() - 0.5) * 0.02,
        rotZ: (Math.random() - 0.5) * 0.02,
        fallSpeed: 0.016 + Math.random() * 0.025
      };
      petalsGroup.add(p);
    }
    scene.add(petalsGroup);

    // 10. RAYCASTING PARA ABRIR LA CARTA AL CLICKEAR FLORES
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: PointerEvent) => {
      // Ignorar si el usuario interactuó con botones del DOM
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('.no-raycast')) return;

      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        let isHit = false;
        let foundLetterDetail = undefined;

        while (obj && obj !== scene) {
          if (obj === centralFlower) {
            isHit = true;
            foundLetterDetail = centralFlower.userData?.letterDetail;
            break;
          }
          if (obj.parent === orbitingGroup) {
            isHit = true;
            foundLetterDetail = obj.userData?.letterDetail;
            break;
          }
          if (obj.parent && obj.parent.parent === orbitingGroup) {
            isHit = true;
            foundLetterDetail = obj.parent.userData?.letterDetail;
            break;
          }
          obj = obj.parent;
        }

        if (isHit) {
          onOpenLetter(foundLetterDetail);
        }
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);

    // 11. REDIMENSIONAMIENTO
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 12. BUCLE DE ANIMACIÓN
    let animationId: number;
    const clock = new THREE.Clock();

    const animateLoop = () => {
      animationId = requestAnimationFrame(animateLoop);
      const elapsed = clock.getElapsedTime();

      // Galaxia lenta
      galaxyPoints.rotation.y = elapsed * 0.045;

      // Flor central respirando
      centralFlower.position.y = 2.2 + Math.sin(elapsed * 1.5) * 0.38;
      centralFlower.rotation.y = Math.sin(elapsed * 0.5) * 0.22;

      // Rosas y palabras orbitando y flotando en conjunto armónico
      orbitingGroup.children.forEach((pair) => {
        if (pair.userData?.baseRadius) {
          const angle = pair.userData.baseAngle + (elapsed * pair.userData.speed * 0.32);
          pair.position.x = Math.cos(angle) * pair.userData.baseRadius;
          pair.position.z = Math.sin(angle) * pair.userData.baseRadius;
          // Ondulación sutil vertical compartida
          pair.position.y = pair.userData.baseY + Math.sin(elapsed * 1.4 + pair.userData.floatOffset) * 0.38;
          // Orientar suavemente el grupo hacia el observador de la órbita
          pair.rotation.y = -angle + Math.PI / 2;
        }
      });

      // Pétalos cayendo
      petalsGroup.children.forEach((petal) => {
        petal.position.y -= petal.userData.fallSpeed;
        petal.rotation.x += petal.userData.rotX;
        petal.rotation.y += petal.userData.rotY;
        petal.rotation.z += petal.userData.rotZ;
        if (petal.position.y < -12) petal.position.y = 12;
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animateLoop();

    // Limpieza
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onOpenLetter]);

  // Manejo de auto-rotación dinámico
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Manejo de preset de cámara
  useEffect(() => {
    if (!cameraPreset || !cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    if (cameraPreset === 'center') {
      camera.position.set(0, 6, 20);
      controls.target.set(0, 2.2, 0);
    } else if (cameraPreset === 'overview') {
      camera.position.set(0, 22, 45);
      controls.target.set(0, 0, 0);
    } else if (cameraPreset === 'top') {
      camera.position.set(0, 48, 5);
      controls.target.set(0, 0, 0);
    }
    controls.update();

    if (onPresetReset) onPresetReset();
  }, [cameraPreset, onPresetReset]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden bg-[#060402]"
    />
  );
};
