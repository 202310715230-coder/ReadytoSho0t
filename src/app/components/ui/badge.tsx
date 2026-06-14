"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils"; // Pastikan path utils.ts Anda sudah tepat

const badgeVariants = cva(
  // Base: Sudut tajam, border 2px, font mono kaku khas brutalism
  "inline-flex items-center justify-center rounded-none border-2 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.15em] font-mono w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none transition-all border-foreground shadow-[2px_2px_0_0_rgba(0,0,0,1)] select-none",
  {
    variants: {
      variant: {
        // Primary: Hitam solid (Industrial look)
        default: "bg-foreground text-background",
        // Secondary: Mustard (Khas ReadyToShot)
        secondary: "bg-secondary text-secondary-foreground",
        // Destructive: Merah Peringatan
        destructive: "bg-destructive text-white",
        // Outline: Background transparan, hanya bingkai kaku
        outline: "text-foreground bg-background hover:bg-secondary transition-colors",
        // Ghost: Label teknis sekunder yang tidak terlalu mencolok
        ghost: "bg-muted text-muted-foreground border-muted-foreground/20 shadow-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Badge = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span"> &
    VariantProps<typeof badgeVariants> & {
      asChild?: boolean;
      showDot?: boolean;
    }
>(({ className, variant, asChild = false, showDot = false, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      ref={ref}
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {/* 💡 Bungkus struktur internal agar aman saat asChild dipicu */}
      <>
        {showDot && (
          <span className="size-1.5 bg-current animate-pulse shrink-0 rounded-none" />
        )}
        {children}
      </>
    </Comp>
  );
});

Badge.displayName = "Badge";

export { Badge, badgeVariants };