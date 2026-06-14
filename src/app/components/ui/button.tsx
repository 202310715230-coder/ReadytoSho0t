"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils"; // Pastikan path utils.ts Anda sudah tepat

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-xs font-black uppercase tracking-[0.2em] transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none active:translate-x-[4px] active:translate-y-[4px] active:shadow-none border-2 border-foreground select-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        // Default: Hitam solid (Industrial Dark)
        default:
          "bg-foreground text-background shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-foreground/90",
        // Destructive: Merah High-Alert
        destructive:
          "bg-destructive text-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-destructive/90",
        // Outline: Bersih tapi tetap kaku
        outline:
          "bg-background text-foreground shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-secondary hover:text-secondary-foreground",
        // Secondary: Mustard Yellow (Warna Utama ReadyToShot)
        secondary:
          "bg-secondary text-secondary-foreground shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-secondary/80",
        // Industrial: Varian dengan tekstur garis peringatan (Stripes) kuning-hitam
        industrial:
          "bg-secondary text-secondary-foreground shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.1)_25%,rgba(0,0,0,0.1)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.1)_75%,rgba(0,0,0,0.1))] bg-[length:20px_20px] hover:bg-secondary/90",
        // Ghost: Border dashed yang berubah menjadi solid shadow saat hover
        ghost:
          "border-dashed border-foreground/30 shadow-none hover:border-solid hover:border-foreground hover:bg-accent hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
        // Link: Minimalis teknis khas dokumen cetak cetak lama
        link: "border-none text-foreground underline underline-offset-8 decoration-2 shadow-none active:translate-x-0 active:translate-y-0 hover:text-secondary",
      },
      size: {
        default: "h-12 px-8 py-2", // Box tebal solid tinggi
        sm: "h-9 px-4 text-[10px]",
        lg: "h-14 px-10 text-sm tracking-[0.25em]",
        icon: "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };