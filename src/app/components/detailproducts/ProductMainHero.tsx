interface ProductMainHeroProps {
  name: string;
  pricePerDay: number;
  isAvailable: boolean;
  onBookingSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function ProductMainHero({
  name,
  pricePerDay,
  isAvailable,
  onBookingSubmit,
}: ProductMainHeroProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID").format(Number(price || 0));

  return (
    <div className="relative border-[4px] border-[#2D1E17] bg-[#F8F1E7] shadow-[10px_10px_0_0_#2D1E17] overflow-hidden select-none">
      {/* TOP STRIP */}
      <div className="h-4 bg-primary border-b-[4px] border-[#2D1E17]" />

      {/* DECORATION */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary/30 border-[4px] border-[#2D1E17] rotate-45 pointer-events-none" />

      <div className="relative z-10 p-5 sm:p-7 lg:p-8 space-y-8">
        {/* STATUS */}
        <div className="flex items-center gap-3">
          <span
            className={`px-4 py-2 font-black text-[10px] italic border-2 rounded-none font-mono shadow-[3px_3px_0_0_#2D1E17] ${
              isAvailable
                ? "bg-secondary text-[#2D1E17] border-[#2D1E17]"
                : "bg-red-500 text-white border-[#2D1E17]"
            }`}
          >
            {isAvailable ? "STATUS: READY" : "STATUS: RENTED_OUT"}
          </span>
        </div>

        {/* TITLE */}
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary font-mono">
            SELECTED GEAR
          </p>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase italic tracking-tighter leading-none text-[#2D1E17] break-words">
            {name}
          </h1>
        </div>

        {/* PRICE BOX */}
        <div className="border-[3px] border-[#2D1E17] bg-white p-4 sm:p-5 shadow-[5px_5px_0_0_#2D1E17]">
          <p className="text-secondary text-[10px] font-black uppercase font-mono tracking-widest mb-2">
            DAILY RATE
          </p>

          <div className="text-2xl sm:text-3xl font-black font-mono text-[#2D1E17]">
            IDR {formatPrice(pricePerDay)}
          </div>
        </div>

        {/* BUTTON */}
        <button
          type="button"
          onClick={onBookingSubmit}
          disabled={!isAvailable}
          className={`w-full block py-5 sm:py-6 font-black text-xl sm:text-3xl border-[3px] border-[#2D1E17] transition-all text-center uppercase tracking-tight rounded-none ${
            isAvailable
              ? "bg-[#2D1E17] text-white hover:bg-secondary hover:text-[#2D1E17] shadow-[7px_7px_0_0_#000] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] cursor-pointer"
              : "bg-muted text-muted-foreground border-foreground/30 shadow-none cursor-not-allowed opacity-50"
          }`}
        >
          {isAvailable ? "BOOKING SEKARANG" : "UNIT UNAVAILABLE"}
        </button>
      </div>

      {/* BOTTOM CORNER */}
      <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-primary border-[3px] border-[#2D1E17] rotate-45" />
    </div>
  );
}