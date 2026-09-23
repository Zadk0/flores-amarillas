import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface ThreeCanvasProps {
  onOpenLetter: () => void;
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

    // 1. ESCENA & NIEBLA
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060402, 0.012);

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
    renderer.toneMappingExposure = 1.3;
    renderer.setClearColor(0x060402, 1);
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

    // 5. ILUMINACIÓN ROMÁNTICA
    const ambientLight = new THREE.AmbientLight(0xfff5db, 0.95);
    scene.add(ambientLight);

    const centerPointLight = new THREE.PointLight(0xfbbf24, 3.8, 50, 1.2);
    centerPointLight.position.set(0, 4, 0);
    scene.add(centerPointLight);

    const rimLight = new THREE.DirectionalLight(0xffedd5, 1.3);
    rimLight.position.set(25, 35, 20);
    scene.add(rimLight);

    const goldSoftLight = new THREE.DirectionalLight(0xd97706, 0.85);
    goldSoftLight.position.set(-25, -15, -20);
    scene.add(goldSoftLight);

    // 6. GALAXIA ESPIRAL DORADA (Polvo Estelar)
    const particleCount = 7500;
    const galaxyGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorInside = new THREE.Color(0xfffdf0);
    const colorMid = new THREE.Color(0xfbbf24);
    const colorArm = new THREE.Color(0xd97706);
    const colorOutside = new THREE.Color(0x92400e);

    const arms = 3;
    const maxRadius = 38;

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

      const mixedColor = colorInside.clone();
      const t = r / maxRadius;
      if (t < 0.28) {
        mixedColor.lerp(colorMid, t / 0.28);
      } else if (t < 0.68) {
        mixedColor.lerp(colorArm, (t - 0.28) / 0.4);
      } else {
        mixedColor.lerp(colorOutside, (t - 0.68) / 0.32);
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
    sGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    sGrad.addColorStop(0.25, 'rgba(254, 240, 138, 0.9)');
    sGrad.addColorStop(0.65, 'rgba(245, 158, 11, 0.3)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 64, 64);
    const starTexture = new THREE.CanvasTexture(starCanvas);

    const galaxyMat = new THREE.PointsMaterial({
      size: 0.52,
      map: starTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
      sizeAttenuation: true
    });

    const galaxyPoints = new THREE.Points(galaxyGeo, galaxyMat);
    scene.add(galaxyPoints);

    // 7. CONSTRUCTOR PROCEDURAL DE FLORES AMARILLAS 3D
    function createFlower(scale = 1.0, petalCount = 22, isCentral = false) {
      const flowerGroup = new THREE.Group();

      // Disco central con textura de semillas
      const discCanvas = document.createElement('canvas');
      discCanvas.width = 128;
      discCanvas.height = 128;
      const dCtx = discCanvas.getContext('2d')!;
      const dGrad = dCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      dGrad.addColorStop(0, '#3f1f06');
      dGrad.addColorStop(0.7, '#6b360a');
      dGrad.addColorStop(0.9, '#a16207');
      dGrad.addColorStop(1, '#eab308');
      dCtx.fillStyle = dGrad;
      dCtx.fillRect(0, 0, 128, 128);

      dCtx.fillStyle = 'rgba(254, 240, 138, 0.65)';
      for (let s = 0; s < 190; s++) {
        const phi = s * 137.5 * (Math.PI / 180);
        const radiusDist = Math.sqrt(s) * 4.3;
        const sx = 64 + Math.cos(phi) * radiusDist;
        const sy = 64 + Math.sin(phi) * radiusDist;
        dCtx.beginPath();
        dCtx.arc(sx, sy, 1.25, 0, Math.PI * 2);
        dCtx.fill();
      }
      const discTex = new THREE.CanvasTexture(discCanvas);

      const discGeo = new THREE.CylinderGeometry(1.2 * scale, 1.0 * scale, 0.4 * scale, 32);
      const discMat = new THREE.MeshStandardMaterial({
        map: discTex,
        roughness: 0.85,
        metalness: 0.08
      });
      const discMesh = new THREE.Mesh(discGeo, discMat);
      flowerGroup.add(discMesh);

      // Forma de pétalo curvo
      const shape = new THREE.Shape();
      const length = 2.4 * scale;
      const width = 0.72 * scale;
      shape.moveTo(0, 0);
      shape.quadraticCurveTo(width * 0.75, length * 0.4, width * 0.5, length * 0.85);
      shape.quadraticCurveTo(0, length * 1.05, -width * 0.5, length * 0.85);
      shape.quadraticCurveTo(-width * 0.75, length * 0.4, 0, 0);

      const extrudeSettings = {
        depth: 0.08 * scale,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.04 * scale,
        bevelThickness: 0.04 * scale
      };
      const petalGeoOuter = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      petalGeoOuter.center();

      const innerShape = new THREE.Shape();
      const iLen = 1.95 * scale;
      const iWid = 0.62 * scale;
      innerShape.moveTo(0, 0);
      innerShape.quadraticCurveTo(iWid * 0.75, iLen * 0.4, iWid * 0.5, iLen * 0.85);
      innerShape.quadraticCurveTo(0, iLen * 1.05, -iWid * 0.5, iLen * 0.85);
      innerShape.quadraticCurveTo(-iWid * 0.75, iLen * 0.4, 0, 0);
      const petalGeoInner = new THREE.ExtrudeGeometry(innerShape, extrudeSettings);
      petalGeoInner.center();

      const petalMatOuter = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.35,
        metalness: 0.05,
        emissive: 0xca8a04,
        emissiveIntensity: 0.28,
        side: THREE.DoubleSide
      });

      const petalMatInner = new THREE.MeshStandardMaterial({
        color: 0xfde047,
        roughness: 0.38,
        metalness: 0.05,
        emissive: 0xeab308,
        emissiveIntensity: 0.32,
        side: THREE.DoubleSide
      });

      // Fila exterior de pétalos
      for (let p = 0; p < petalCount; p++) {
        const angle = (p / petalCount) * Math.PI * 2;
        const petal = new THREE.Mesh(petalGeoOuter, petalMatOuter);
        petal.position.x = Math.cos(angle) * (1.1 * scale);
        petal.position.z = Math.sin(angle) * (1.1 * scale);
        petal.position.y = 0.06 * scale;
        petal.rotation.y = -angle + Math.PI / 2;
        petal.rotation.x = 0.16;
        flowerGroup.add(petal);
      }

      // Fila interior
      for (let p = 0; p < petalCount; p++) {
        const angle = ((p + 0.5) / petalCount) * Math.PI * 2;
        const petal = new THREE.Mesh(petalGeoInner, petalMatInner);
        petal.position.x = Math.cos(angle) * (0.86 * scale);
        petal.position.z = Math.sin(angle) * (0.86 * scale);
        petal.position.y = 0.16 * scale;
        petal.rotation.y = -angle + Math.PI / 2;
        petal.rotation.x = 0.28;
        flowerGroup.add(petal);
      }

      // Tallo suavemente curvado
      const stemCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.2 * scale, 0),
        new THREE.Vector3(0.18 * scale, -2.5 * scale, 0.2 * scale),
        new THREE.Vector3(-0.25 * scale, -5.5 * scale, 0),
        new THREE.Vector3(0, -8.0 * scale, 0.15 * scale)
      ]);
      const stemGeo = new THREE.TubeGeometry(stemCurve, 20, 0.15 * scale, 8, false);
      const stemMat = new THREE.MeshStandardMaterial({
        color: 0x4d7c0f,
        roughness: 0.65,
        metalness: 0.1
      });
      const stemMesh = new THREE.Mesh(stemGeo, stemMat);
      flowerGroup.add(stemMesh);

      // Resplandor áurico si es la flor central
      if (isCentral) {
        const auraCanvas = document.createElement('canvas');
        auraCanvas.width = 64;
        auraCanvas.height = 64;
        const aCtx = auraCanvas.getContext('2d')!;
        const aGrad = aCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
        aGrad.addColorStop(0, 'rgba(253, 224, 71, 0.95)');
        aGrad.addColorStop(0.45, 'rgba(245, 158, 11, 0.4)');
        aGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        aCtx.fillStyle = aGrad;
        aCtx.fillRect(0, 0, 64, 64);
        const auraTex = new THREE.CanvasTexture(auraCanvas);
        const auraMat = new THREE.SpriteMaterial({
          map: auraTex,
          blending: THREE.AdditiveBlending,
          transparent: true,
          opacity: 0.85
        });
        const auraSprite = new THREE.Sprite(auraMat);
        auraSprite.scale.set(13 * scale, 13 * scale, 1);
        flowerGroup.add(auraSprite);
      }

      return flowerGroup;
    }

    // Flor Central Majestuosa
    const centralFlower = createFlower(1.85, 26, true);
    centralFlower.position.set(0, 2.2, 0);
    centralFlower.rotation.x = 0.32;
    scene.add(centralFlower);

    // Flores satélite orbitando
    const orbitingGroup = new THREE.Group();
    const flowerConfigs = [
      { r: 10, a: 0.4, y: 1.6, s: 0.95 },
      { r: 13.5, a: 1.6, y: -1.2, s: 0.85 },
      { r: 11.2, a: 2.8, y: 2.5, s: 1.0 },
      { r: 14.5, a: 3.9, y: 0.4, s: 0.9 },
      { r: 12.0, a: 4.9, y: -2.2, s: 0.82 },
      { r: 15.2, a: 5.8, y: 1.9, s: 0.92 }
    ];

    flowerConfigs.forEach((cfg, idx) => {
      const fl = createFlower(cfg.s, 20, false);
      fl.position.set(
        Math.cos(cfg.a) * cfg.r,
        cfg.y,
        Math.sin(cfg.a) * cfg.r
      );
      fl.userData = {
        baseRadius: cfg.r,
        baseAngle: cfg.a,
        speed: 0.14 + (idx * 0.025),
        floatOffset: idx * 1.3
      };
      orbitingGroup.add(fl);
    });
    scene.add(orbitingGroup);

    // 8. TEXTOS 3D FLOTANTES (Cartelas Románticas)
    function createTextSprite(text: string) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 160;
      const ctx = canvas.getContext('2d')!;

      // Fondo oscuro elegante con halo ámbar
      const bgGrad = ctx.createLinearGradient(0, 0, 512, 160);
      bgGrad.addColorStop(0, 'rgba(25, 18, 5, 0.72)');
      bgGrad.addColorStop(0.5, 'rgba(48, 28, 6, 0.88)');
      bgGrad.addColorStop(1, 'rgba(25, 18, 5, 0.72)');
      ctx.fillStyle = bgGrad;
      ctx.roundRect(16, 20, 480, 120, 32);
      ctx.fill();

      // Borde dorado
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.75)';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Destellos
      ctx.fillStyle = '#FDE68A';
      ctx.font = '22px serif';
      ctx.fillText('✦', 36, 88);
      ctx.fillText('✦', 458, 88);

      // Texto
      ctx.font = 'italic 52px "Playfair Display", Georgia, serif';
      ctx.fillStyle = '#FEF08A';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(245, 158, 11, 0.9)';
      ctx.shadowBlur = 18;
      ctx.fillText(text, 256, 80);

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      const mat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false
      });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(7.0, 2.2, 1);
      return sprite;
    }

    const floatingTextsGroup = new THREE.Group();
    const romanticPhrases = [
      { text: "Mi amor", dist: 8.5, angle: 0.6, y: 5.0 },
      { text: "Eres mi sol", dist: 12.0, angle: 1.8, y: -2.6 },
      { text: "Te amo", dist: 9.0, angle: 3.2, y: 4.0 },
      { text: "Eres preciosa", dist: 13.8, angle: 4.3, y: 1.8 },
      { text: "Mi flor favorita", dist: 11.2, angle: 5.4, y: -3.4 },
      { text: "Luz de mis días", dist: 14.8, angle: 2.5, y: 5.5 }
    ];

    romanticPhrases.forEach((item, index) => {
      const sprite = createTextSprite(item.text);
      sprite.position.x = Math.cos(item.angle) * item.dist;
      sprite.position.z = Math.sin(item.angle) * item.dist;
      sprite.position.y = item.y;
      sprite.userData = {
        baseY: item.y,
        floatSpeed: 1.2 + (index * 0.22)
      };
      floatingTextsGroup.add(sprite);
    });
    scene.add(floatingTextsGroup);

    // 9. PÉTALOS FLOTANTES Y CAYENDO SUAVEMENTE
    const petalsGroup = new THREE.Group();
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.quadraticCurveTo(0.3, 0.4, 0.2, 0.9);
    petalShape.quadraticCurveTo(0, 1.1, -0.2, 0.9);
    petalShape.quadraticCurveTo(-0.3, 0.4, 0, 0);

    const petalGeo = new THREE.ShapeGeometry(petalShape);
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.4,
      emissive: 0xd97706,
      emissiveIntensity: 0.35,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.92
    });

    for (let i = 0; i < 90; i++) {
      const p = new THREE.Mesh(petalGeo, petalMat);
      const rad = 3 + Math.random() * 24;
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

        while (obj && obj !== scene) {
          if (obj === centralFlower || obj.parent === orbitingGroup || obj.parent === floatingTextsGroup) {
            isHit = true;
            break;
          }
          obj = obj.parent;
        }

        if (isHit) {
          onOpenLetter();
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

      // Flores orbitando
      orbitingGroup.children.forEach((fl) => {
        if (fl.userData?.baseRadius) {
          const angle = fl.userData.baseAngle + (elapsed * fl.userData.speed * 0.32);
          fl.position.x = Math.cos(angle) * fl.userData.baseRadius;
          fl.position.z = Math.sin(angle) * fl.userData.baseRadius;
          fl.position.y += Math.sin(elapsed * 2 + fl.userData.floatOffset) * 0.005;
          fl.rotation.y = -angle + Math.PI / 2;
        }
      });

      // Cartelas de texto flotantes
      floatingTextsGroup.children.forEach((sprite) => {
        if (sprite.userData?.baseY !== undefined) {
          sprite.position.y = sprite.userData.baseY + Math.sin(elapsed * sprite.userData.floatSpeed) * 0.35;
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
