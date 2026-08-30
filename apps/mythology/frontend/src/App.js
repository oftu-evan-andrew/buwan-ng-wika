import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import "@/App.css";
import { MYTHS, HERO_ACCENT, HERO_IMAGE } from "@/data/myths";
import { ForestCanvas } from "@/components/ForestCanvas";
import { TopBar } from "@/components/TopBar";
import { CharacterRail } from "@/components/CharacterRail";
import { LorePanel } from "@/components/LorePanel";
import { SceneIndexSheet } from "@/components/SceneIndexSheet";
import { LoaderScreen } from "@/components/LoaderScreen";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
ScrollTrigger.config({ ignoreMobileResize: true });

const TOTAL_UNITS = 1 + MYTHS.length + 0.8; // hero + scenes + outro
const UNIT_VH = 120;

function App() {
  const [ready, setReady] = useState(true);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [loreMyth, setLoreMyth] = useState(null);
  const [loreOpen, setLoreOpen] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);

  const rootRef = useRef(null);
  const spaceRef = useRef(null);
  const heroBgRef = useRef(null);
  const heroContentRef = useRef(null);
  const outroRef = useRef(null);
  const charRefs = useRef([]);
  const titleRefs = useRef([]);
  const titleInnerRefs = useRef([]);
  const barRef = useRef(null);
  const progressRef = useRef(0);
  const durRef = useRef(TOTAL_UNITS);
  const stRef = useRef(null);
  const activeIdxRef = useRef(-1);

  // ---------- asset preloading in background ----------
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
    const urls = [HERO_IMAGE, ...MYTHS.map((m) => m.image)];
    urls.forEach((u) => {
      const img = new Image();
      img.src = u;
    });
  }, []);

  // hero entrance cinematic text animation
  useEffect(() => {
    if (!heroContentRef.current) return;
    const badge = heroContentRef.current.querySelector("[data-hero-badge]");
    const title = heroContentRef.current.querySelector("[data-hero-title]");
    const desc = heroContentRef.current.querySelector("[data-hero-desc]");
    const scrollCue = heroContentRef.current.querySelector("[data-hero-cue]");

    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo(
      badge,
      { autoAlpha: 0, y: -15, letterSpacing: "0.2em" },
      { autoAlpha: 1, y: 0, letterSpacing: "0.5em", duration: 1.2, ease: "power2.out" },
      0,
    )
      .fromTo(
        title,
        { autoAlpha: 0, scale: 0.92, filter: "blur(12px)", y: 25 },
        { autoAlpha: 1, scale: 1, filter: "blur(0px)", y: 0, duration: 1.5, ease: "power3.out" },
        0.25,
      )
      .fromTo(
        desc,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 1.1, ease: "power2.out" },
        0.65,
      )
      .fromTo(
        scrollCue,
        { autoAlpha: 0, y: 15 },
        { autoAlpha: 1, y: 0, duration: 1.0, ease: "power2.out" },
        0.9,
      );

    return () => tl.kill();
  }, []);

  // ---------- master scroll timeline ----------
  useLayoutEffect(() => {
    const isMobile = window.innerWidth < 768;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const useBlur = !isMobile && !reduced;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: false });

      // hero: forest zooms as if walking in, then dissolves
      tl.fromTo(heroBgRef.current, { scale: 1.06 }, { scale: 1.24, duration: 0.75, ease: "none" }, 0);
      tl.to(heroContentRef.current, { autoAlpha: 0, y: -70, duration: 0.4, ease: "power1.in" }, 0.35);
      tl.to(heroBgRef.current, { autoAlpha: 0, duration: 0.35, ease: "power1.inOut" }, 0.7);

      MYTHS.forEach((m, i) => {
        const p = 1 + i;
        const char = charRefs.current[i];
        const title = titleRefs.current[i];
        const tInner = titleInnerRefs.current[i];
        if (!char || !title) return;

        // Clean entrance: previous scene is already gone, now fade/scale in current character cleanly
        tl.fromTo(
          char,
          {
            autoAlpha: 0,
            scale: 0.94,
            z: -100,
            transformPerspective: 1000,
            transformOrigin: "center center",
          },
          {
            autoAlpha: 1,
            scale: 1,
            z: 0,
            duration: 0.35,
            ease: "power2.out",
          },
          p - 0.1,
        );

        // subtle push-in while holding focus
        tl.to(char, { scale: 1.04, z: 30, duration: 0.5, ease: "none" }, p + 0.25);

        // cinematic title reveal
        tl.fromTo(
          title,
          { autoAlpha: 0, y: 25 },
          { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" },
          p - 0.02,
        );
        if (tInner) {
          tl.fromTo(tInner, { yPercent: 112 }, { yPercent: 0, duration: 0.4, ease: "power3.out" }, p - 0.02);
        }
        const meta = title.querySelectorAll("[data-reveal]");
        if (meta.length) {
          tl.fromTo(
            meta,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.06, ease: "power2.out" },
            p + 0.05,
          );
        }
        tl.to(title, { autoAlpha: 0, y: -35, duration: 0.22, ease: "power2.in" }, p + 0.7);

        // Clean fade out BEFORE the next scene starts (prevents double exposure / bleed-through)
        if (i < MYTHS.length - 1) {
          tl.to(
            char,
            {
              autoAlpha: 0,
              scale: 1.15,
              z: 120,
              duration: 0.25,
              ease: "power2.in",
            },
            p + 0.7,
          );
        } else {
          tl.to(char, { autoAlpha: 0.15, scale: 1.1, z: 50, duration: 0.4, ease: "power1.inOut" }, p + 0.75);
        }
      });

      // outro
      tl.fromTo(
        outroRef.current,
        { autoAlpha: 0, y: 60 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
        MYTHS.length + 1.05,
      );
      // pad timeline so total duration matches unit math
      tl.to({ v: 0 }, { v: 1, duration: 0.001 }, TOTAL_UNITS - 0.001);

      durRef.current = tl.duration();

      const snapPoints = [
        0,
        ...MYTHS.map((_, i) => (1 + i + 0.5) / durRef.current),
        1,
      ];

      const isTouch = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

      const st = ScrollTrigger.create({
        trigger: spaceRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: isTouch ? 0.35 : 0.8,
        animation: tl,
        snap: reduced
          ? false
          : {
              snapTo: snapPoints,
              duration: isTouch ? { min: 0.2, max: 0.45 } : { min: 0.3, max: 0.7 },
              delay: isTouch ? 0.08 : 0.2,
              ease: "power2.out",
              inertia: true,
              directional: true,
            },
        onUpdate: (self) => {
          progressRef.current = self.progress;
          const tlPos = self.progress * durRef.current;
          const idx = Math.max(-1, Math.min(MYTHS.length - 1, Math.round(tlPos - 1.5)));
          if (activeIdxRef.current !== idx) {
            activeIdxRef.current = idx;
            setActiveIdx(idx);
          }
          if (barRef.current) {
            const sceneProgress = Math.min(Math.max((tlPos - 1) / MYTHS.length, 0), 1);
            barRef.current.style.width = `${(sceneProgress * 100).toFixed(2)}%`;
          }
        },
      });
      stRef.current = st;
    }, rootRef);

    return () => {
      ctx.revert();
      stRef.current = null;
    };
  }, []);

  // accent CSS variable follows active scene
  useEffect(() => {
    const accent = activeIdx >= 0 ? MYTHS[activeIdx].accent : HERO_ACCENT;
    document.documentElement.style.setProperty("--scene-accent", accent);
  }, [activeIdx]);

  // ---------- navigation ----------
  const goToScene = useCallback((i) => {
    const st = stRef.current;
    if (!st) return;
    const unitPos = i < 0 ? 0 : 1 + i + 0.5;
    const progress = Math.min(unitPos / durRef.current, 1);
    const y = st.start + (st.end - st.start) * progress;
    gsap.to(window, { scrollTo: { y, autoKill: true }, duration: 1.5, ease: "power2.inOut" });
  }, []);

  const goPrev = useCallback(() => {
    const cur = activeIdxRef.current;
    goToScene(cur <= 0 ? -1 : cur - 1);
  }, [goToScene]);

  const goNext = useCallback(() => {
    const cur = activeIdxRef.current;
    goToScene(Math.min(cur + 1, MYTHS.length - 1));
  }, [goToScene]);

  useEffect(() => {
    const onKey = (e) => {
      // don't hijack keys while typing or while a sheet/dialog is open
      const tag = e.target && e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (document.querySelector('[role="dialog"][data-state="open"]')) return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  const openLore = useCallback((m) => {
    setLoreMyth(m);
    setLoreOpen(true);
  }, []);

  return (
    <div ref={rootRef} className="mythos-root">
      {/* ---------- fixed cinematic stage ---------- */}
      <div className="mythos-stage-fixed bg-[#0b0a09]" data-testid="mythos-stage">
        {/* ambient accent wash */}
        <div className="scene-ambient absolute inset-0 z-[5]" aria-hidden="true" />

        {/* hero background image */}
        <div
          ref={heroBgRef}
          className="absolute -top-20 -bottom-20 left-0 right-0 z-10 will-change-transform"
          data-testid="hero-image"
        >
          <img
            src={HERO_IMAGE}
            alt=""
            className="crisp-img h-full w-full object-cover object-center scale-105"
            draggable="false"
            loading="eager"
            fetchpriority="high"
          />
          <div className="char-fade absolute inset-0" />
        </div>

        {/* character scene images */}
        {MYTHS.map((m, i) => {
          let objectClass = "object-center";
          let scaleClass = "scale-105";

          if (m.id === "bakunawa") {
            // Prominent full dragon head, jaws, horns, and body centered heroically
            objectClass = "object-[64%_18%] sm:object-[center_top]";
            scaleClass = "scale-105";
          } else if (m.id === "daragang-magayon") {
            // Full maiden body prominently framed in center
            objectClass = "object-[74%_center] sm:object-center";
          }

          return (
            <div
              key={m.id}
              ref={(el) => (charRefs.current[i] = el)}
              className="absolute -top-20 -bottom-20 left-0 right-0 z-10 opacity-0 invisible will-change-transform"
              data-testid={`scene-layer-${m.id}`}
            >
              <img
                src={m.image}
                alt={m.name}
                className={`crisp-img h-full w-full object-cover ${scaleClass} ${objectClass}`}
                draggable="false"
                loading="eager"
              />
              <div className="char-fade absolute inset-0" />
            </div>
          );
        })}

        {/* Three.js fog + fireflies above the artwork */}
        <ForestCanvas progressRef={progressRef} durRef={durRef} />

        {/* vignette + grain */}
        <div className="vignette absolute inset-0 z-[25] pointer-events-none" aria-hidden="true" />
        <div className="noise absolute inset-0 z-[26] pointer-events-none" aria-hidden="true" />

        {/* hero content */}
        <div
          ref={heroContentRef}
          className="absolute inset-0 z-[30] flex flex-col items-center justify-center text-center px-4 sm:px-6 pointer-events-none"
        >
          <span
            data-hero-badge
            className="font-mono-accent text-[10px] sm:text-[12px] font-semibold tracking-[0.35em] text-[#fcd116] mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]"
          >
            MGA NILALANG NG DILIM AT LIWANAG
          </span>
          <h1
            data-testid="hero-title"
            data-hero-title
            className="font-display text-7xl sm:text-8xl lg:text-9xl font-semibold tracking-[0.08em] leading-[0.95] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,1)]"
          >
            LIKHA
          </h1>
          <p
            data-hero-desc
            className="mt-4 sm:mt-5 max-w-[380px] sm:max-w-xl text-sm sm:text-lg text-white font-normal leading-relaxed tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,1)] [text-shadow:_0_2px_14px_rgb(0_0_0_/_95%),_0_1px_4px_rgb(0_0_0)]"
          >
            Mag-scroll upang maglakbay sa sinaunang kagubatan—kung saan ang mga kwento ng ating kapuluan ay patuloy na humihinga.
          </p>
          <div
            data-hero-cue
            className="absolute bottom-12 sm:bottom-16 md:bottom-20 flex flex-col items-center gap-2 sm:gap-3"
          >
            <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.35em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">I-scroll</span>
            <span className="scroll-cue" />
          </div>
        </div>

        {/* scene title blocks */}
        {MYTHS.map((m, i) => (
          <div
            key={m.id}
            ref={(el) => (titleRefs.current[i] = el)}
            className="title-block absolute left-4 sm:left-6 md:left-10 lg:left-12 bottom-12 sm:bottom-24 md:bottom-20 lg:bottom-16 z-[30] max-w-[calc(100vw-2rem)] sm:max-w-[480px] md:max-w-[540px] lg:max-w-[620px] opacity-0 invisible pointer-events-none pb-2"
            style={{ "--scene-accent": m.accent }}
          >
            <div data-reveal className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-3">
              <span className="font-mono-accent text-[9px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] text-[hsl(var(--scene-accent))]">
                NO. {m.num}
              </span>
              <span className="h-px w-6 sm:w-8 bg-[hsl(var(--scene-accent))]/60" />
              <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.22em] text-white/55 truncate">
                {m.subtitle}
              </span>
            </div>
            <h2
              data-testid={`scene-title-${m.id}`}
              className="font-display text-[10vw] sm:text-6xl md:text-7xl lg:text-8xl font-medium leading-[1.08] sm:leading-[1.05] tracking-[-0.01em] text-white pb-2 sm:pb-3"
            >
              <span ref={(el) => (titleInnerRefs.current[i] = el)} className="block will-change-transform">
                {m.name}
              </span>
            </h2>
            <p data-reveal className="mt-2 sm:mt-3 md:mt-4 max-w-[44ch] text-xs sm:text-sm md:text-base text-white/75 leading-relaxed drop-shadow-sm">
              {m.excerpt}
            </p>
            <div data-reveal className="mt-4 sm:mt-6">
              <button
                data-testid={`read-stories-cta-${m.id}`}
                onClick={() => openLore(m)}
                className="pointer-events-auto inline-flex items-center gap-2.5 sm:gap-3 rounded-full bg-black/60 hover:bg-[#0038a8]/20 active:bg-[#0038a8]/40 border border-[#3b82f6]/60 hover:border-[#60a5fa] px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white shadow-[0_4px_20px_rgba(0,0,0,0.8),0_0_12px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.9),0_0_20px_rgba(96,165,250,0.5)] hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 select-none"
              >
                <span className="grid h-5 w-5 sm:h-6 sm:w-6 place-items-center rounded-full bg-[#2563eb]/30 border border-[#3b82f6]/50 text-white font-medium text-xs sm:text-sm leading-none">
                  +
                </span>
                <span className="tracking-wide text-white">
                  Basahin ang Kwento
                </span>
              </button>
            </div>
          </div>
        ))}

        {/* outro */}
        <div
          ref={outroRef}
          className="outro-container absolute inset-0 z-[30] flex flex-col items-center justify-center text-center px-6 opacity-0 invisible pointer-events-none pb-12"
          data-testid="outro-section"
        >
          <span className="font-mono-accent text-[10px] tracking-[0.5em] text-white/50 mb-5">
            ANG KAGUBATAN AY NAKAKAALALA
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-medium text-white leading-tight max-w-3xl">
            Ang kagubatan ay nakakaalala.
          </h2>
          <p className="mt-5 max-w-lg text-sm sm:text-base text-white/60 leading-relaxed">
            Ang mga kwentong ito ay nagtagal sa libo-libong bagyo—isinaysay mula sa bibig patungo sa pandinig, mula kay lolo hanggang kay apo. Patuloy nating ikwento.
          </p>
          <button
            data-testid="outro-replay-button"
            onClick={() => goToScene(-1)}
            className="pointer-events-auto mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm text-white/85 transition-colors hover:bg-white/10 hover:border-[hsl(var(--scene-accent))]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
          >
            Bumalik sa simula
          </button>
          <span className="absolute bottom-8 sm:bottom-6 text-[10px] tracking-[0.25em] uppercase text-white/30">
            Likha — Mitolohiyang Pilipino
          </span>
        </div>

        {/* fixed UI chrome */}
        <TopBar onOpenIndex={() => setIndexOpen(true)} />
        <CharacterRail activeIdx={activeIdx} onNavigate={goToScene} />
      </div>

      {/* ---------- scroll runway ---------- */}
      <div
        ref={spaceRef}
        className="pointer-events-none"
        style={{ height: `${TOTAL_UNITS * UNIT_VH}vh` }}
        data-testid="scroll-space"
      />

      <LorePanel myth={loreMyth} open={loreOpen} onOpenChange={setLoreOpen} />
      <SceneIndexSheet
        open={indexOpen}
        onOpenChange={setIndexOpen}
        activeIdx={activeIdx}
        onNavigate={goToScene}
      />
    </div>
  );
}

export default App;
