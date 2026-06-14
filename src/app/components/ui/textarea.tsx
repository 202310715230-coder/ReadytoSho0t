import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base Styling: Sasis kaku, border 3px, bg-card beige
        "flex min-h-32 w-full rounded-none border-[3px] border-foreground bg-card px-4 py-3 text-base text-foreground outline-none transition-all",
        
        // Placeholder: Gaya label spek teknis
        "placeholder:text-foreground/40 placeholder:font-black placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest",
        
        // Shadow Dalam (Inner Shadow) untuk kesan panel yang menjorok ke dalam
        "shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.1)]", 
        
        // Focus State: Menggunakan warna Maroon (Primary) dan shadow luar yang tegas
        "focus-visible:border-primary focus-visible:ring-0 focus-visible:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
        "focus-visible:-translate-x-1 focus-visible:-translate-y-1",
        
        // Disabled & Invalid
        "disabled:cursor-not-allowed disabled:bg-muted/50 aria-invalid:border-destructive aria-invalid:focus-visible:shadow-[6px_6px_0px_0px_rgba(127,29,29,1)]",
        
        // Typography & Misc
        "resize-none md:text-sm font-bold leading-relaxed tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };