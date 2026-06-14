"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils"; // Pastikan path utils.ts Anda sudah tepat

const alertVariants = cva(
  // Base: Border tebal 3px, Shadow solid tajam (8px), posisi layout kaku khas brutalism
  "relative w-full rounded-none border-[3px] px-5 py-4 text-sm grid has-[>svg]:grid-cols-[24px_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-4 gap-y-1 items-start [&>svg]:size-6 [&>svg]:translate-y-0.5 shadow-[8px_8px_0_0_rgba(0,0,0,1)] transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none",
  {
    variants: {
      variant: {
        // Kuning Mustard dengan border hitam solid
        default: "bg-secondary text-secondary-foreground border-foreground [&>svg]:text-foreground",
        // Merah Destructive dengan teks putih bersih
        destructive:
          "bg-destructive text-destructive-foreground border-foreground [&>svg]:text-white *:data-[slot=alert-description]:text-white/90",
        // Outline untuk kesan log sistem monokrom yang bersih
        outline: "bg-background text-foreground border-foreground [&>svg]:text-secondary shadow-[6px_6px_0_0_#000]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="alert"
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="alert-title"
    className={cn(
      "col-start-2 line-clamp-1 min-h-4 font-black uppercase tracking-tighter italic text-lg leading-none flex items-center gap-2",
      className,
    )}
    {...props}
  >
    {/* Visual prefix opsional untuk memperkuat kesan sistem log */}
    <span className="not-italic text-[10px] opacity-40 font-mono hidden sm:inline"></span>
    {children}
  </div>
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="alert-description"
    className={cn(
      "col-start-2 grid justify-items-start gap-1 text-[11px] font-bold font-mono tracking-tight leading-normal border-t-2 border-dashed border-foreground/10 pt-2 mt-1",
      className,
    )}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };