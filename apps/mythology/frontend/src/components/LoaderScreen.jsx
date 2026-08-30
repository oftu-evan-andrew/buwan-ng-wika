import { useEffect, useRef } from "react";
import gsap from "gsap";

export const LoaderScreen = ({ progress, done, onFinished }) => {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!done) return;
    const tl = gsap.timeline({ onComplete: onFinished });
    tl.to(rootRef.current, { autoAlpha: 0, duration: 1.1, ease: "power2.inOut", delay: 0.35 });
    return () => tl.kill();
  }, [done, onFinished]);

  return (
    <div
      ref={rootRef}
      data-testid="loader-screen"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0e0c0a] text-center px-6 select-none"
      style={{
        background: "radial-gradient(ellipse at center, #1b1713 0%, #0b0a09 75%, #050504 100%)",
      }}
    >
      {/* subtle mystical aura glow */}
      <div className="absolute w-72 h-72 rounded-full bg-[hsl(38_78%_55%)]/10 blur-3xl pointer-events-none animate-pulse" />

      <span className="relative z-10 font-mono-accent text-[10px] tracking-[0.55em] text-[hsl(38_78%_55%)]/80 mb-4 font-medium uppercase">
        Mga Alamat ng Pilipinas
      </span>
      <h1 className="relative z-10 font-display text-5xl sm:text-7xl tracking-[0.12em] text-white font-medium drop-shadow-md">
        MYTHOS
      </h1>
      <p className="relative z-10 mt-4 text-xs sm:text-sm text-white/55 tracking-wider font-light italic max-w-xs">
        Entering the enchanted forest…
      </p>

      {/* ethereal glowing pulse ring instead of a progress bar */}
      <div className="relative z-10 mt-8 flex items-center justify-center">
        <div className="h-7 w-7 rounded-full border border-[hsl(38_78%_55%)]/40 border-t-transparent animate-spin duration-1000" />
      </div>
    </div>
  );
};
