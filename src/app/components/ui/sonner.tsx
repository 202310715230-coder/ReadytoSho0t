"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

import { cn } from "./utils";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        unstyled: true, // Kontrol penuh untuk estetika Brutalist
        classNames: {
          // Toast: Border 3px kaku, Shadow 6px solid (Primary shadow color)
          toast: cn(
            "group flex w-full items-center gap-4 border-[3px] border-foreground bg-card p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
            "font-bold uppercase tracking-widest text-foreground outline-none select-none"
          ),
          // Typography: Black Italic untuk title (ala instruksi manual kamera)
          title: "text-[11px] font-black italic leading-none",
          description: "text-[10px] font-bold normal-case opacity-70 leading-tight mt-1",
          
          // Buttons: Efek ditekan fisik (shadow hilang saat hover)
          actionButton: cn(
            "bg-primary text-primary-foreground border-2 border-foreground px-3 py-1.5 text-[10px] font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
            "hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all uppercase"
          ),
          cancelButton: cn(
            "bg-muted text-foreground border-2 border-foreground px-3 py-1.5 text-[10px] font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
            "hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all uppercase"
          ),

          // Variasi Status (Warna latar belakang solid)
          success: "bg-secondary text-foreground", // Mustard untuk sukses (Ready)
          error: "bg-destructive text-destructive-foreground", // Merah untuk error (Critical)
          info: "bg-primary text-primary-foreground", // Maroon untuk info (System)
          warning: "bg-orange-500 text-white", // Orange untuk warning
        },
      }}
      {...props}
    />
  );
}

export { Toaster };