"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "./utils";

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  // Logika sederhana untuk mengubah warna saat progress hampir penuh (overload/warning)
  const isHigh = (value || 0) >= 80;

  return (
    <div className="relative w-full">
      {/* Label Metadata di atas bar */}
      <div className="flex justify-between items-end mb-1 px-0.5">
        <span className="text-[9px] font-black uppercase tracking-widest text-foreground/50">
          Process_Load
        </span>
        <span className="text-[10px] font-mono font-black italic text-foreground">
          {Math.round(value || 0)}%
        </span>
      </div>

      <ProgressPrimitive.Root
        data-slot="progress"
        className={cn(
          // Base: Border 3px kaku, tanpa rounded
          "relative h-7 w-full overflow-hidden border-[3px] border-foreground bg-card shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
          className,
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className={cn(
            "h-full w-full flex-1 transition-all duration-500 ease-in-out relative",
            // Warna dinamis: Mustard (Normal) -> Maroon (Warning)
            isHigh ? "bg-primary" : "bg-secondary",
            // Efek visual: Garis-garis diagonal industrial (Zebra Stripes)
            "before:absolute before:inset-0 before:bg-[linear-gradient(45deg,rgba(0,0,0,0.15)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.15)_50%,rgba(0,0,0,0.15)_75%,transparent_75%,transparent)] before:bg-[length:12px_12px]"
          )}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
        
        {/* Overlay Skala: Skala ukur kaku (Ruler) */}
        <div className="absolute inset-0 pointer-events-none flex justify-between">
          {[...Array(11)].map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-full w-[2px] bg-foreground/20",
                // Garis tengah dan ujung dibuat lebih panjang/tebal
                (i === 0 || i === 5 || i === 10) && "bg-foreground/40 w-[3px]"
              )} 
            />
          ))}
        </div>
      </ProgressPrimitive.Root>
    </div>
  );
}

export { Progress };