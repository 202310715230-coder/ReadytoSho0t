"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { SquareIcon } from "lucide-react";

import { cn } from "./utils";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-4", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        // Base: Kotak kaku, border tebal, tanpa rounded (Brutalist)
        "aspect-square size-5 shrink-0 border-2 border-foreground bg-card outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50",
        // Shadow solid yang membuat radio button terlihat seperti tombol fisik
        "shadow-[2px_2px_0_0_rgba(0,0,0,1)] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        // State saat terpilih: Background berubah jadi Mustard
        "data-[state=checked]:bg-secondary data-[state=checked]:shadow-none data-[state=checked]:translate-x-[1px] data-[state=checked]:translate-y-[1px]",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center"
      >
        {/* Indikator: Kotak hitam solid kecil di tengah */}
        <div className="size-2.5 bg-foreground" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };