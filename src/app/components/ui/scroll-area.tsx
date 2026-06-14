"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "./utils";

function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="size-full rounded-none outline-none"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner className="bg-foreground" />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none transition-all select-none p-0.5",
        // Track: Background kaku dengan border tebal (parit besi)
        "bg-card border-foreground transition-colors",
        orientation === "vertical" &&
          "h-full w-4 border-l-[3px]",
        orientation === "horizontal" &&
          "h-4 flex-col border-t-[3px]",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        // Thumb: Solid Maroon (Primary) dengan tekstur garis-garis (Grip)
        className={cn(
          "relative flex-1 bg-primary border-[2px] border-foreground shadow-[2px_2px_0_0_rgba(0,0,0,1)]",
          "hover:bg-secondary transition-colors cursor-grab active:cursor-grabbing",
          // Tekstur Grip: Garis-garis horizontal putih tipis khas tombol industri
          "before:content-[''] before:absolute before:inset-x-1 before:top-1/2 before:-translate-y-1/2 before:h-4 before:bg-[repeating-linear-gradient(to_bottom,transparent,transparent_2px,rgba(255,255,255,0.2)_2px,rgba(255,255,255,0.2)_4px)]"
        )}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };