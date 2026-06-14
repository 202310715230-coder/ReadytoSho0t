"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "./utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      {/* Track: Parit mekanik dengan background solid & border tebal */}
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-card relative grow overflow-hidden border-[3px] border-foreground data-[orientation=horizontal]:h-6 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-6 shadow-inner",
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "bg-secondary/40 absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
          )}
        />
        
        {/* Dekorasi: Garis-garis skala di dalam track */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_19%,rgba(0,0,0,0.1)_20%)] pointer-events-none" />
      </SliderPrimitive.Track>

      {/* Thumb: Kotak solid Maroon (Primary) dengan shadow brutalist */}
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className={cn(
            "relative block size-8 shrink-0 border-[3px] border-foreground bg-primary transition-all outline-none disabled:pointer-events-none disabled:opacity-50",
            // Gaya Brutalist: Shadow kaku & efek tertekan saat aktif
            "shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-grab active:cursor-grabbing",
            // Tekstur Grip: 3 garis vertikal putih transparan
            "before:content-[''] before:absolute before:inset-y-2 before:left-1/2 before:-translate-x-1/2 before:w-[2px] before:bg-white/30 before:shadow-[4px_0_0_0_rgba(255,255,255,0.3),-4px_0_0_0_rgba(255,255,255,0.3)]"
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };