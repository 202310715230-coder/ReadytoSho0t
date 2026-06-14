"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "./utils";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0",
        // Gaya Industrial: Menggunakan border dashed yang lebih tebal dan tegas
        orientation === "horizontal"
          ? "h-1 w-full border-b-[3px] border-dashed border-foreground/40"
          : "w-1 h-full border-r-[3px] border-dashed border-foreground/40",
        
        // Dekorasi tambahan: Ujung garis dibuat solid untuk kesan "anchored" (tertanam)
        "relative before:absolute after:absolute",
        orientation === "horizontal" 
          ? "before:left-0 before:top-[-1.5px] before:h-[3px] before:w-2 before:bg-foreground after:right-0 after:top-[-1.5px] after:h-[3px] after:w-2 after:bg-foreground"
          : "before:top-0 before:left-[-1.5px] before:w-[3px] before:h-2 before:bg-foreground after:bottom-0 after:left-[-1.5px] after:w-[3px] after:h-2 after:bg-foreground",
        
        className,
      )}
      {...props}
    />
  );
}

export { Separator };