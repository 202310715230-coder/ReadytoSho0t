"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "./utils";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <div className="flex items-center gap-1.5">
      {/* Indikator Status: Titik kecil yang memberikan kesan panel elektronik */}
      <div className="size-1.5 bg-secondary border border-foreground/20" />
      
      <LabelPrimitive.Root
        data-slot="label"
        className={cn(
          // Tipografi: Black, Uppercase, Italic, Tracking-tight
          "text-[10px] font-black uppercase tracking-widest leading-none select-none italic",
          // Warna: Kontras tinggi
          "text-foreground",
          // Interaksi peer: Berubah warna saat input terkait (peer) difokuskan
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-40",
          "peer-focus:text-secondary transition-colors duration-200",
          className,
        )}
        {...props}
      />
      
      {/* Dekorasi: Garis horizontal tipis untuk mengisi ruang (estetika blueprint) */}
      <div className="h-[1px] flex-1 bg-foreground/5" />
    </div>
  );
}

export { Label };