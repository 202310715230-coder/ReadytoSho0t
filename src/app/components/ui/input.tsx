import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base: Tinggi ditingkatkan ke h-12, border solid 3px, font black kaku
        "flex h-12 w-full min-w-0 border-[3px] border-foreground bg-card px-4 py-2 text-sm font-black uppercase tracking-tight transition-all outline-none",
        
        // Gaya Brutalist: Hard Shadow 4px yang sangat kontras
        "shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
        
        // Placeholder: Dibuat lebih tipis tapi tetap dengan font mono/italic
        "placeholder:text-foreground/30 placeholder:italic placeholder:font-medium placeholder:lowercase",
        
        // File Input: Didesain seperti tombol kaku di dalam input
        "file:inline-flex file:h-full file:border-0 file:border-r-3 file:border-foreground file:bg-foreground file:mr-4 file:px-4 file:text-[10px] file:font-black file:uppercase file:text-background file:transition-colors",
        "hover:file:bg-secondary hover:file:text-foreground file:cursor-pointer",
        
        // States: Focus memberikan efek "Locked In"
        "focus-visible:bg-background focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px]",
        "focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2",
        
        // Invalid & Disabled: Gaya "System Failure"
        "aria-invalid:border-destructive aria-invalid:text-destructive aria-invalid:shadow-destructive/20",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:grayscale disabled:shadow-none",
        
        className,
      )}
      {...props}
    />
  );
}

export { Input };