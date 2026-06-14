"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const toggleVariants = cva(
  // Base styles: Border 3px, font black, efek tekan mekanis
  "inline-flex items-center justify-center gap-2 rounded-none text-[11px] font-black uppercase tracking-widest disabled:pointer-events-none disabled:opacity-50 outline-none whitespace-nowrap border-[3px] border-foreground transition-all",
  {
    variants: {
      variant: {
        // Gaya Default: Beige ke Mustard (Ready State)
        default: [
          "bg-background text-foreground shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
          "hover:bg-secondary/20 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_rgba(0,0,0,1)]",
          "data-[state=on]:bg-secondary data-[state=on]:text-foreground data-[state=on]:translate-x-[2px] data-[state=on]:translate-y-[2px] data-[state=on]:shadow-none",
        ],
        // Gaya Outline: Transparan ke Maroon (Record/Active State)
        outline: [
          "bg-transparent border-[3px] border-foreground shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
          "hover:bg-primary/10 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_rgba(0,0,0,1)]",
          "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:translate-x-[2px] data-[state=on]:translate-y-[2px] data-[state=on]:shadow-none",
        ],
      },
      size: {
        default: "h-11 px-4 min-w-11",
        sm: "h-9 px-2.5 min-w-9 text-[10px]",
        lg: "h-14 px-6 min-w-14 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };