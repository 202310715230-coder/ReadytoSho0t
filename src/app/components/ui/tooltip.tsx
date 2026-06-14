"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "./utils";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 8,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          // Gaya Neo-Brutalism: Kotak hitam pekat (Inverted dari card)
          "z-50 w-fit px-3 py-1.5 rounded-none",
          "bg-foreground text-background font-black uppercase text-[10px] tracking-[0.2em]",
          
          // Border 3px dan Shadow Mustard solid
          "border-[3px] border-foreground",
          "shadow-[5px_5px_0px_0px_rgba(233,180,76,1)]", // Shadow Mustard (Secondary)
          
          // Animasi "Mechanical Pop"
          "animate-in fade-in-0 zoom-in-95 duration-150 ease-out",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      >
        {children}
        {/* Arrow kaku dengan bayangan yang sinkron */}
        <TooltipPrimitive.Arrow 
          className="fill-foreground drop-shadow-[3px_3px_0px_rgba(233,180,76,1)]" 
          width={12} 
          height={6} 
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };