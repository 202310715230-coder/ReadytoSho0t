"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import { cn } from "./utils";

function HoverCard({
  openDelay = 200, // Sedikit lebih cepat agar terasa responsif
  closeDelay = 150,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return (
    <HoverCardPrimitive.Root 
      data-slot="hover-card" 
      openDelay={openDelay}
      closeDelay={closeDelay}
      {...props} 
    />
  );
}

function HoverCardTrigger({
  className,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger 
      data-slot="hover-card-trigger" 
      className={cn(
        // Trigger: Menggunakan dekorasi garis bawah putus-putus (dashed) khas dokumen teknis
        "cursor-help underline decoration-secondary decoration-4 underline-offset-4 font-black uppercase tracking-tighter hover:text-secondary transition-colors",
        className
      )}
      {...props} 
    />
  );
}

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 12, // Menambah sedikit jarak agar bayangan tidak menempel ke pemicu
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          // Base: Solid card dengan border 3px
          "z-50 w-72 overflow-hidden border-3 border-foreground bg-card p-0 text-foreground outline-none",
          // Gaya Brutalist: Shadow kaku 8px
          "shadow-[8px_8px_0_0_rgba(0,0,0,1)]",
          // Animasi: Snap yang mantap
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-100",
          className,
        )}
        {...props}
      >
        {/* Top Header Strip: Memberi konteks "Technical Data" */}
        <div className="bg-foreground text-background text-[9px] font-mono font-black px-3 py-1 flex justify-between items-center">
          <span>DATA_INSPECT</span>
          <span className="opacity-50">V.04</span>
        </div>

        <div className="p-4 relative">
          {/* Dekorasi sudut industrial (L-brackets) */}
          <div className="absolute top-2 left-2 size-2 border-t-2 border-l-2 border-foreground/30" />
          <div className="absolute bottom-2 right-2 size-2 border-b-2 border-r-2 border-foreground/30" />
          
          {props.children}
        </div>
        
        {/* Footer dekoratif untuk kesan alat ukur */}
        <div className="h-1 w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,#000_4px,#000_8px)] opacity-20" />
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };