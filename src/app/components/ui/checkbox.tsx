"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "./utils"; // Pastikan path utils.ts Anda sudah tepat

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      data-slot="checkbox"
      className={cn(
        // Base: Kotak kaku bersudut tajam, wajib memiliki kelas 'relative' untuk dekorasi internal
        "peer size-5 shrink-0 rounded-none border-2 border-foreground bg-background outline-none transition-all duration-75 relative group",
        // Gaya Brutalist: Hard shadow khas komponen kaku ReadyToShot
        "shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:bg-secondary/20 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
        // Active / Click State
        "active:shadow-none active:translate-x-[3px] active:translate-y-[3px]",
        // State Checked: Mengisi warna Mustard Yellow solid kaku
        "data-[state=checked]:bg-secondary data-[state=checked]:text-foreground data-[state=checked]:shadow-none data-[state=checked]:translate-x-[3px] data-[state=checked]:translate-y-[3px]",
        // Focus State (Aksesibilitas Keyboard)
        "focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2",
        // Disabled & Invalid State
        "disabled:cursor-not-allowed disabled:opacity-30 disabled:grayscale disabled:pointer-events-none",
        "aria-invalid:border-destructive aria-invalid:text-destructive data-[aria-invalid=true]:shadow-destructive",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current w-full h-full"
      >
        {/* Ikon Check: Sangat tebal (stroke-4) untuk kesan coretan manual kaku */}
        <CheckIcon className="size-3.5 stroke-[4px]" />
      </CheckboxPrimitive.Indicator>

      {/* 💡 Visual Tip: Garis bidik kecil di pojok kiri atas (aktif saat hover dan kondisi belum dicentang) */}
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 data-[state=checked]:hidden pointer-events-none transition-opacity">
        <span className="absolute top-0.5 left-0.5 size-1 border-t border-l border-foreground" />
      </span>
    </CheckboxPrimitive.Root>
  );
});

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };