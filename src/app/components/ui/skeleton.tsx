"use client";

import * as React from "react";
import { cn } from "./utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        // Base: Kotak kaku, background agak gelap untuk kontras scanline
        "relative overflow-hidden rounded-none bg-muted/30 border border-foreground/10",
        
        // Animasi "Laser Scanner" (Shimmer yang lebih tegas)
        "after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_2s_infinite] after:bg-gradient-to-r after:from-transparent after:via-secondary/20 after:to-transparent",
        
        // Efek Scanlines CRT: Garis horizontal tipis untuk tekstur retro
        "before:absolute before:inset-0 before:bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] before:bg-[length:100%_4px] before:pointer-events-none before:z-10",
        
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };

/** * Tambahkan ini di tailwind.config.js untuk animasi yang lebih smooth:
 * * theme: {
 * extend: {
 * keyframes: {
 * shimmer: {
 * '0%': { transform: 'translateX(-100%)' },
 * '100%': { transform: 'translateX(100%)' },
 * },
 * },
 * },
 * }
 */