"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "./utils"; // Pastikan path utils.ts sesuai

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ className, ...props }, ref) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AccordionPrimitive.Root
      ref={ref}
      data-slot="accordion"
      // Gaya Brutalist tebal & bayangan solid kaku
      className={cn(
        "border-4 border-foreground shadow-[8px_8px_0_0_rgba(0,0,0,1)] bg-card overflow-hidden w-full",
        className
      )}
      {...props}
    />
  );
});
Accordion.displayName = "Accordion";

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    data-slot="accordion-item"
    // Batas antar menu menggunakan border hitam solid tebal
    className={cn("border-b-4 border-foreground last:border-b-0", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      data-slot="accordion-trigger"
      className={cn(
        "flex flex-1 items-center justify-between gap-4 px-5 py-5 text-left text-sm font-black uppercase tracking-tighter transition-all outline-none",
        // Hover, Focus, dan State Open bergaya retro/mustard
        "hover:bg-secondary hover:text-secondary-foreground",
        "focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
        "data-[state=open]:bg-foreground data-[state=open]:text-background",
        "disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-3">
        {/* Indikator kode terminal monospace */}
        <span className="text-[10px] opacity-50 font-mono tracking-normal">//</span>
        {children}
      </span>
      <ChevronDownIcon className="pointer-events-none size-5 shrink-0 transition-transform duration-300 stroke-[3px]" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    data-slot="accordion-content"
    className={cn(
      "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden transition-all",
      className
    )}
    {...props}
  >
    <div className="px-5 pt-4 pb-6 font-mono text-[12px] font-bold leading-relaxed tracking-tight bg-muted/30 text-foreground/80 border-t-2 border-foreground/10">
      <div className="flex gap-4">
        {/* Garis penanda vertikal warna mustard di kiri konten */}
        <div className="w-1 bg-secondary shrink-0" />
        <div className="w-full">{children}</div>
      </div>
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };