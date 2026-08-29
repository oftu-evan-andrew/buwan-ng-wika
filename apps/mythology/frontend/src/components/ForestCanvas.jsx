import { useEffect, useRef } from "react";
import * as THREE from "three";
import { MYTHS, HERO_ACCENT } from "@/data/myths";

const hslToColor = (str) => {
  const parts = str.split(" ");
  const h = parseFloat(parts[0]) / 360;
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;
  return new THREE.Color().setHSL(h, s, l);
};

export const ForestCanvas = ({ progressRef, durRef }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const isMobile = window.innerWidth < 768;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 2.0 : 2.0));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 300);
    camera.position.set(0, 1, 20);

    const disposables = [];

    const makeRadialTexture = (size, stops) => {
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const g = c.getContext("2d");
      const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      stops.forEach(([o, col]) => grad.addColorStop(o, col));
      g.fillStyle = grad;
      g.fillRect(0, 0, size, size);
      const tex = new THREE.CanvasTexture(c);
      tex.flipY = false;
      tex.premultiplyAlpha = false;
      tex.needsUpdate = true;
      disposables.push(tex);
      return tex;
    };

    const glowTex = makeRadialTexture(64, [
      [0, "rgba(255,255,255,1)"],
      [0.25, "rgba(255,255,255,0.6)"],
      [1, "rgba(255,255,255,0)"],
    ]);
    const fogTex = makeRadialTexture(128, [
      [0, "rgba(212,226,216,0.6)"],
      [0.5, "rgba(200,214,206,0.22)"],
      [1, "rgba(200,214,206,0)"],
    ]);

    const DEPTH = 120;

    const makeFireflies = (count, size, opacity) => {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      const seeds = new Float32Array(count * 2);
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 55;
        pos[i * 3 + 1] = Math.random() * 22 - 8;
        pos[i * 3 + 2] = 20 - Math.random() * DEPTH;
        seeds[i * 2] = Math.random() * Math.PI * 2;
        seeds[i * 2 + 1] = 0.3 + Math.random() * 0.9;
      }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        size,
        map: glowTex,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: new THREE.Color("#ffdf9e"),
        sizeAttenuation: true,
      });
      const pts = new THREE.Points(geo, mat);
      scene.add(pts);
      disposables.push(geo, mat);
      return { geo, mat, seeds, count, baseOpacity: opacity };
    };

    let countScale = 1;
    if (reduced) {
      countScale = 0.15;
    } else if (isMobile) {
      countScale = 0.4;
    }

    const ff1 = makeFireflies(Math.round(700 * countScale), 0.55, 0.85);
    const ff2 = makeFireflies(Math.round(420 * countScale), 1.15, 0.32);

    const fogMats = [0.05, 0.085, 0.125].map((o) => {
      const m = new THREE.SpriteMaterial({
        map: fogTex,
        transparent: true,
        opacity: o,
        depthWrite: false,
        color: new THREE.Color("#33413a"),
      });
      disposables.push(m);
      return m;
    });
    const fogSprites = [];
    let fogCount = 20;
    if (reduced) {
      fogCount = 6;
    } else if (isMobile) {
      fogCount = 10;
    }

    for (let i = 0; i < fogCount; i++) {
      const s = new THREE.Sprite(fogMats[i % 3]);
      const sc = 26 + Math.random() * 42;
      s.scale.set(sc, sc * 0.62, 1);
      s.position.set((Math.random() - 0.5) * 60, -4 + Math.random() * 16, 20 - Math.random() * DEPTH);
      s.userData.drift = (Math.random() - 0.5) * 0.02;
      scene.add(s);
      fogSprites.push(s);
    }

    const moonMat = new THREE.SpriteMaterial({
      map: glowTex,
      transparent: true,
      opacity: 0.13,
      depthWrite: false,
      color: new THREE.Color("#bfd6e8"),
    });
    disposables.push(moonMat);
    const moon = new THREE.Sprite(moonMat);
    moon.scale.set(55, 55, 1);
    scene.add(moon);

    const heroCol = hslToColor(HERO_ACCENT);
    const cols = MYTHS.map((m) => hslToColor(m.accent));
    const warm = new THREE.Color("#ffe4b0");
    const fogBase = new THREE.Color("#2e3c36");
    const tmp = new THREE.Color();

    const mouse = { x: 0, y: 0 };
    const onMouse = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    const useMouse = !isMobile && !reduced;
    if (useMouse) window.addEventListener("mousemove", onMouse);

    const TRAVEL = isMobile ? 70 : 95;
    let raf = 0;
    let hidden = false;
    const startTime = performance.now();

    const animate = (currentTime) => {
      raf = requestAnimationFrame(animate);
      if (hidden) return;
      const t = (currentTime - startTime) * 0.001 || 0;
      const p = progressRef.current || 0;
      const dur = (durRef && durRef.current) || 10.8;

      const targetZ = 20 - p * TRAVEL;
      camera.position.z += (targetZ - camera.position.z) * 0.1;
      camera.position.x += (mouse.x * 1.3 - camera.position.x) * 0.04;
      camera.position.y += (1 + mouse.y * 0.7 - camera.position.y) * 0.04;

      // continuous accent color lerp across scenes
      const tlPos = p * dur;
      let col;
      if (tlPos <= 1) {
        col = tmp.copy(heroCol).lerp(cols[0], Math.min(Math.max(tlPos, 0), 1));
      } else {
        const sf = Math.min(Math.max(tlPos - 1.5, 0), MYTHS.length - 1);
        const i0 = Math.floor(sf);
        const f = sf - i0;
        col = tmp.copy(cols[i0]).lerp(cols[Math.min(i0 + 1, cols.length - 1)], f);
      }
      ff1.mat.color.copy(warm).lerp(col, 0.55);
      ff2.mat.color.copy(warm).lerp(col, 0.75);
      fogMats.forEach((m) => m.color.copy(fogBase).lerp(col, 0.22));

      [ff1, ff2].forEach((sys, si) => {
        sys.mat.opacity = sys.baseOpacity * (0.72 + 0.28 * Math.sin(t * (1.2 + si * 0.7)));
        const arr = sys.geo.attributes.position.array;
        for (let i = 0; i < sys.count; i++) {
          const ph = sys.seeds[i * 2];
          const sp = sys.seeds[i * 2 + 1];
          arr[i * 3 + 1] += Math.sin(t * sp + ph) * 0.006;
          arr[i * 3] += Math.cos(t * sp * 0.7 + ph) * 0.004;
          const z = arr[i * 3 + 2];
          if (z > camera.position.z + 6) arr[i * 3 + 2] = z - DEPTH;
          else if (z < camera.position.z - (DEPTH - 6)) arr[i * 3 + 2] = z + DEPTH;
        }
        sys.geo.attributes.position.needsUpdate = true;
      });

      fogSprites.forEach((s) => {
        s.position.x += s.userData.drift;
        if (s.position.x > 40) s.position.x = -40;
        if (s.position.x < -40) s.position.x = 40;
        if (s.position.z > camera.position.z + 8) s.position.z -= DEPTH;
        else if (s.position.z < camera.position.z - (DEPTH - 8)) s.position.z += DEPTH;
      });

      moon.position.set(camera.position.x + 8, camera.position.y + 10, camera.position.z - 75);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    const onVis = () => {
      hidden = document.hidden;
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      if (useMouse) window.removeEventListener("mousemove", onMouse);
      disposables.forEach((d) => d.dispose && d.dispose());
      renderer.dispose();
    };
  }, [progressRef, durRef]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[15] pointer-events-none"
      data-testid="forest-canvas"
      aria-hidden="true"
    />
  );
};
