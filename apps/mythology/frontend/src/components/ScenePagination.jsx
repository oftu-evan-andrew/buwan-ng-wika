import { ChevronLeft, ChevronRight } from "lucide-react";
import { MYTHS } from "@/data/myths";

export const ScenePagination = ({ activeIdx, onPrev, onNext, barRef }) => {
  const total = MYTHS.length;
  const current = Math.min(Math.max(activeIdx + 1, 1), total);
  const nextNum = Math.min(current + 1, total);
  const prevDisabled = activeIdx <= -1;
  const nextDisabled = activeIdx >= total - 1;

  return (
    <div className="hidden sm:block fixed bottom-4 md:bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-[94vw]">
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 rounded-full border border-white/15 bg-black/55 backdrop-blur-md px-2 sm:px-3 py-1.5 shadow-lg">
        <button
          data-testid="scene-pagination-prev"
          onClick={onPrev}
          disabled={prevDisabled}
          aria-label="Previous myth"
          className="h-7 w-7 sm:h-8 sm:w-8 grid place-items-center rounded-full text-white/75 hover:text-white hover:bg-white/10 active:scale-90 transition-all disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
        >
          <ChevronLeft size={15} strokeWidth={1.75} />
        </button>

        <div data-testid="scene-pagination-numbers" className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3">
          <span className="font-mono-accent text-[9px] sm:text-[10px] text-white tracking-widest" data-testid="scene-pagination-current">
            {String(current).padStart(2, "0")}
          </span>
          <span
            className="relative h-[2px] w-[60px] sm:w-[90px] md:w-[130px] rounded-full bg-white/15 overflow-hidden"
            data-testid="scene-pagination-progress"
          >
            <span
              ref={barRef}
              className="absolute inset-y-0 left-0 rounded-full bg-[hsl(var(--scene-accent))] transition-all duration-150"
              style={{ width: "0%" }}
            />
          </span>
          <span className="font-mono-accent text-[9px] sm:text-[10px] text-white/45 tracking-widest">
            {String(nextNum).padStart(2, "0")}
          </span>
        </div>

        <button
          data-testid="scene-pagination-next"
          onClick={onNext}
          disabled={nextDisabled}
          aria-label="Next myth"
          className="h-7 w-7 sm:h-8 sm:w-8 grid place-items-center rounded-full text-white/75 hover:text-white hover:bg-white/10 active:scale-90 transition-all disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
        >
          <ChevronRight size={15} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
};
