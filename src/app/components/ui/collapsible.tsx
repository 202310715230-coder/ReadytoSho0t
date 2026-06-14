"use client";

import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";

import { cn } from "./utils"; // Pastikan path utils.ts Anda sudah tepat

const Collapsible = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Root
    ref={ref}
    data-slot="collapsible"
    className={cn(
      "group/collapsible w-full border-4 border-foreground bg-card shadow-[6px_6px_0_0_rgba(0,0,0,1)] overflow-hidden transition-all rounded-none",
      className
    )}
    {...props}
  />
));
Collapsible.displayName = "Collapsible";

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleTrigger>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleTrigger>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleTrigger
    ref={ref}
    data-slot="collapsible-trigger"
    className={cn(
      // Trigger: Font mono kaku penunjuk panel kontrol industrial
      "flex w-full items-center justify-between p-4 text-[10px] font-black uppercase tracking-[0.2em] font-mono outline-none transition-all duration-75 hover:bg-secondary select-none",
      "data-[state=open]:bg-secondary",
      "group/trigger disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none",
      "focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-inset",
      className
    )}
    {...props}
  >
    {children}
    {/* Icon dengan rotasi tegas 180 derajat saat panel terbuka */}
    <ChevronDown className="size-4 stroke-[4px] transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
  </CollapsiblePrimitive.CollapsibleTrigger>
));
CollapsibleTrigger.displayName = "CollapsibleTrigger";

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleContent
    ref={ref}
    data-slot="collapsible-content"
    className={cn(
      // Content: Pola grid bintik halus (radial-gradient) agar terlihat seperti interior sasis perangkat hardware
      "overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down rounded-none",
      "bg-background/50 bg-[radial-gradient(rgba(0,0,0,0.15)_1px,transparent_1px)] [background-size:12px_12px]",
      className
    )}
    {...props}
  >
    {/* 💡 PERBAIKAN: Pembatas dipusatkan di sini menggunakan garis putus-putus industrial pejal tanpa bentrok border induk */}
    <div className="p-4 border-t-4 border-dashed border-foreground/30 text-xs font-bold leading-relaxed text-foreground font-mono">
      {children}
    </div>
  </CollapsiblePrimitive.CollapsibleContent>
));
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };