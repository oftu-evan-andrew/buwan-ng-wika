import { MYTHS } from "@/data/myths";

export const CharacterRail = ({ activeIdx, onNavigate }) => {
  return (
    <nav
      data-testid="character-rail"
      aria-label="Mythological figures"
      className="character-rail hidden md:flex fixed left-4 lg:left-8 top-[84px] z-40 flex-col gap-0.5 max-h-[68vh] overflow-y-auto no-scrollbar pr-2"
    >
      {MYTHS.map((m, i) => {
        const active = i === activeIdx;
        return (
          <button
            key={m.id}
            data-testid={`character-rail-item-${m.id}`}
            onClick={() => onNavigate(i)}
            aria-current={active ? "true" : undefined}
            className={`group flex items-center gap-3 rounded-xl px-2 py-1.5 text-left transition-colors duration-300 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] ${
              active ? "bg-white/5" : ""
            }`}
          >
            <span
              className={`rail-thumb relative shrink-0 overflow-hidden rounded-lg transition-all duration-500 ${
                active
                  ? "h-11 w-11 ring-2 ring-[hsl(var(--scene-accent))]"
                  : "h-8 w-8 ring-1 ring-white/15 opacity-60 group-hover:opacity-90"
              }`}
            >
              <img
                src={m.image}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
                draggable="false"
              />
            </span>
            <span className="flex flex-col">
              <span
                className={`text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,1)] ${
                  active ? "text-[#fcd116]" : "text-white/80 group-hover:text-white"
                }`}
              >
                {m.name}
              </span>
              <span
                className="block h-0.5 mt-1 bg-[#fcd116] transition-all duration-500 shadow-[0_0_8px_rgba(252,209,22,0.8)]"
                style={{ width: active ? "2.5rem" : "0" }}
              />
            </span>
          </button>
        );
      })}
    </nav>
  );
};
