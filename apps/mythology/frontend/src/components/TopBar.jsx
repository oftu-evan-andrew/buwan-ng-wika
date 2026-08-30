import { Search } from "lucide-react";

export const TopBar = ({ onOpenIndex }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6 lg:px-10 bg-gradient-to-b from-black/60 to-transparent">
      <button
        data-testid="topbar-logo"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex items-baseline gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] rounded-md"
        aria-label="Likha — bumalik sa simula"
      >
        <span className="font-display text-xl sm:text-2xl tracking-[0.08em] text-white leading-none font-medium">
          LIKHA
        </span>
        <span className="hidden sm:block text-[10px] uppercase tracking-[0.28em] text-white/50 group-hover:text-white/75 transition-colors">
          Mitolohiyang Pilipino
        </span>
      </button>

      <div className="flex items-center gap-1">
        <button
          data-testid="topbar-search-button"
          onClick={onOpenIndex}
          style={{ WebkitTapHighlightColor: "transparent", outline: "none" }}
          className="p-2 text-white/70 hover:text-white active:scale-125 hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 select-none"
          aria-label="Search the myths"
        >
          <Search size={19} strokeWidth={1.75} className="transition-transform duration-200 pointer-events-none" />
        </button>
      </div>
    </header>
  );
};
