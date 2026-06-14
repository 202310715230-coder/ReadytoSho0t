"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "./utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // Base: Kotak kaku masif dengan border 3px
        "peer inline-flex h-8 w-14 shrink-0 cursor-pointer items-center border-[3px] border-foreground bg-card transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50",
        
        // State Colors: Mustard (Secondary) saat aktif, memberikan kontras tinggi
        "data-[state=checked]:bg-secondary data-[state=unchecked]:bg-card",
        
        // Gaya Brutalist: Shadow hitam solid 4px
        "shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_0_rgba(0,0,0,1)]",
        "active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
        
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // Thumb: Kotak hitam solid yang menempel rapat ke border
          "pointer-events-none block size-6 bg-foreground transition-transform duration-200 ease-in-out",
          "data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-[2px]",
          
          // Tekstur Grip: Garis vertikal putih transparan (Grip tekstur fisik)
          "relative before:absolute before:inset-1 before:bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(255,255,255,0.2)_2px,rgba(255,255,255,0.2)_4px)]"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };