import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { MYTHS } from "@/data/myths";

export const SceneIndexSheet = ({ open, onOpenChange, activeIdx, onNavigate }) => {
  const [query, setQuery] = useState("");
  const filtered = MYTHS.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.subtitle.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        data-testid="scene-index-sheet"
        className="w-full sm:max-w-[420px] border-l border-white/10 bg-[#141210]/85 backdrop-blur-2xl text-white overflow-y-auto no-scrollbar shadow-[0_0_50px_rgba(0,0,0,0.8)]"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(var(--scene-accent))]/10 rounded-full blur-3xl pointer-events-none" />

        <SheetHeader className="text-left space-y-1 relative z-10">
          <SheetTitle className="font-display text-3xl font-medium text-white tracking-wide">
            Likha
          </SheetTitle>
          <SheetDescription className="text-sm text-white/55">
            Pumili ng nilalang upang maglakbay sa kanyang pook sa kagubatan.
          </SheetDescription>
        </SheetHeader>

        <div className="relative mt-5 z-10">
          <input
            data-testid="myth-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Maghanap sa Likha..."
            className="w-full rounded-xl border border-white/20 bg-white/[0.08] px-4 py-2.5 text-sm text-white placeholder:text-white/50 transition-all focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] focus:bg-white/[0.12] focus:outline-none"
          />
        </div>

        <div className="mt-5 flex flex-col gap-2 pb-8 relative z-10">
          {filtered.map((m, index) => {
            const i = MYTHS.indexOf(m);
            const active = i === activeIdx;
            return (
              <button
                key={m.id}
                data-testid={`scene-index-item-${m.id}`}
                onClick={() => {
                  onNavigate(i);
                  onOpenChange(false);
                }}
                style={{ animationDelay: `${Math.min(index * 45, 400)}ms` }}
                className={`animate-sheet-item group flex items-center gap-3.5 rounded-xl p-2.5 text-left transition-all duration-200 border ${
                  active
                    ? "bg-white/10 border-[#3b82f6]/70 shadow-lg ring-1 ring-[#3b82f6]/50"
                    : "border-transparent hover:bg-white/[0.06] hover:border-white/15"
                }`}
              >
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/20 shadow-sm">
                  <img src={m.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </span>
                <span className="flex flex-col min-w-0">
                  <span className="flex items-baseline gap-2">
                    <span className="font-mono-accent text-[11px] font-bold tracking-wider text-[#fcd116]">
                      {m.num}
                    </span>
                    <span className="font-display text-lg text-white leading-tight truncate font-medium group-hover:text-white">
                      {m.name}
                    </span>
                  </span>
                  <span className="text-[11px] text-white/60 truncate mt-0.5 font-light">{m.subtitle}</span>
                </span>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="px-3 py-6 text-sm text-white/50 text-center" data-testid="myth-search-empty">
              Walang nahanap na alamat—nananatiling lihim ang kagubatan.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
