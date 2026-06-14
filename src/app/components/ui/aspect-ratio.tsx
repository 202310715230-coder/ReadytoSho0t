"use client";

import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { cn } from "./utils"; // Pastikan path utils.ts Anda sudah tepat

const AspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  // 💡 PERBAIKAN: Struktur dibalik. Radix Root menjadi container paling luar, 
  // lalu efek visual dimasukkan ke dalam div internal agar tidak merusak kalkulasi rasio gambar.
  <AspectRatioPrimitive.Root
    ref={ref}
    data-slot="aspect-ratio"
    className={cn(
      "relative w-full border-4 border-foreground bg-muted shadow-[6px_6px_0_0_rgba(0,0,0,1)] overflow-hidden group rounded-none",
      className
    )}
    {...props}
  >
    {/* Konten Gambar / Video Utama */}
    <div className="absolute inset-0 z-0">{children}</div>

    {/* Overlay Viewfinder: Estetika Kamera Digital / Drone Log */}
    <div className="pointer-events-none absolute inset-0 z-10 p-3 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
      {/* Sudut-sudut bidik (L-Shape Corners) */}
      <div className="absolute top-3 left-3 size-4 border-t-4 border-l-4 border-foreground" />
      <div className="absolute top-3 right-3 size-4 border-t-4 border-r-4 border-foreground" />
      <div className="absolute bottom-3 left-3 size-4 border-b-4 border-l-4 border-foreground" />
      <div className="absolute bottom-3 right-3 size-4 border-b-4 border-r-4 border-foreground" />

      {/* Indikator Tengah (Crosshair) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <div className="w-4 h-[2px] bg-foreground absolute" />
        <div className="h-4 w-[2px] bg-foreground absolute" />
      </div>

      {/* Label Teknis di pojok bawah */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-foreground text-background text-[8px] font-mono px-1 font-black uppercase tracking-tighter">
        REC_MODE: RAW
      </div>
    </div>

    {/* Efek Garis Scanline (Scanline Overlay) */}
    <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%]" />
  </AspectRatioPrimitive.Root>
));

AspectRatio.displayName = "AspectRatio";

export { AspectRatio };