"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "./utils";

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 12, // Memberikan ruang ekstra untuk bayangan kaku
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          // Base: Border lebih tebal (3px) agar seimbang dengan shadow besar
          "z-50 w-72 bg-card text-foreground outline-none border-[3px] border-foreground p-0 overflow-hidden",
          // Gaya Brutalist: Shadow 8px kaku
          "shadow-[8px_8px_0_0_rgba(0,0,0,1)]",
          // Animasi: Snap yang mantap (zoom-in-100)
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-100",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        {...props}
      >
        {/* Top Header: Memberikan nuansa panel instrumen */}
        <div className="bg-foreground text-background text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 flex justify-between items-center">
          <span>Module_Active</span>
          <div className="size-1.5 bg-secondary animate-pulse" />
        </div>

        <div className="p-4 relative">
          {/* Dekorasi Sudut (Bracket) khas UI militer/kamera */}
          <div className="absolute top-0 left-0 size-3 border-t-2 border-l-2 border-foreground/10" />
          <div className="absolute bottom-0 right-0 size-3 border-b-2 border-r-2 border-foreground/10" />
          
          {props.children}
        </div>

        {/* Footer dekoratif: Garis peringatan (Zebra strip) transparan */}
        <div className="h-1 w-full bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(0,0,0,0.1)_5px,rgba(0,0,0,0.1)_10px)]" />
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };