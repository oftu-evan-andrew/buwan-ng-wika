import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export const LorePanel = ({ myth, open, onOpenChange }) => {
  if (!myth) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        data-testid="lore-panel-content"
        className="w-full sm:max-w-[460px] border-l border-white/10 bg-[#141210]/85 backdrop-blur-2xl text-white overflow-y-auto no-scrollbar p-0 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
        style={{ "--scene-accent": myth.accent }}
      >
        <div className="relative h-56 sm:h-64 overflow-hidden">
          <img src={myth.image} alt={myth.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-[#141210]/30 to-transparent" />
          <span className="absolute bottom-3 left-6 font-mono-accent text-[11px] tracking-[0.3em] text-[hsl(var(--scene-accent))] font-medium drop-shadow">
            NO. {myth.num} — {myth.origin.toUpperCase()}
          </span>
        </div>

        <div className="px-6 pb-12 pt-4">
          <SheetHeader className="text-left space-y-1 p-0">
            <SheetTitle className="font-display text-4xl font-medium text-white leading-[1.1] pb-1">
              {myth.name}
            </SheetTitle>
            <SheetDescription className="text-sm text-[hsl(var(--scene-accent))] tracking-wide">
              {myth.subtitle}
            </SheetDescription>
          </SheetHeader>

          <div className="my-5 h-[1px] w-full bg-gradient-to-r from-[hsl(var(--scene-accent))]/50 via-white/15 to-transparent" aria-hidden="true" />

          {/* Smooth cascading paragraphs */}
          <div className="space-y-4">
            {myth.lore.map((para, i) => (
              <p
                key={`${myth.id}-${i}`}
                style={{
                  animation: `sheet-item-enter 0.6s cubic-bezier(0.16, 1, 0.3, 1) backwards`,
                  animationDelay: `${(i + 1) * 120}ms`,
                }}
                dangerouslySetInnerHTML={{ __html: para }}
                className="text-sm sm:text-[15px] text-white/80 leading-relaxed font-light [&_em]:font-normal [&_em]:text-[hsl(var(--scene-accent))] [&_i]:font-normal [&_i]:text-[hsl(var(--scene-accent))]"
              />
            ))}
          </div>

          <div
            style={{
              animation: `sheet-item-enter 0.6s cubic-bezier(0.16, 1, 0.3, 1) backwards`,
              animationDelay: `480ms`,
            }}
            className="mt-8 flex items-center gap-3"
          >
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/35">
              Mga Alamat ng Pilipinas
            </span>
            <span className="h-px flex-1 bg-white/10" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
