"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "./utils";

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        // Backdrop lebih gelap dengan noise tipis (via opacity) untuk kesan industrial
        "fixed inset-0 z-50 bg-foreground/60 backdrop-blur-[4px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          // Base: Solid background, tidak ada rounded, durasi animasi lebih "berat"
          "fixed z-50 flex flex-col bg-card p-0 transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out outline-none",
          
          // Penyesuaian Border & Shadow berdasarkan sisi
          side === "right" &&
            "inset-y-0 right-0 h-full w-3/4 border-l-[6px] border-foreground data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm shadow-[-12px_0_0_0_rgba(0,0,0,0.3)]",
          side === "left" &&
            "inset-y-0 left-0 h-full w-3/4 border-r-[6px] border-foreground data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm shadow-[12px_0_0_0_rgba(0,0,0,0.3)]",
          side === "top" &&
            "inset-x-0 top-0 h-auto border-b-[6px] border-foreground data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top shadow-[0_12px_0_0_rgba(0,0,0,0.3)]",
          side === "bottom" &&
            "inset-x-0 bottom-0 h-auto border-t-[6px] border-foreground data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom shadow-[0_-12px_0_0_rgba(0,0,0,0.3)]",
          className,
        )}
        {...props}
      >
        <div className="relative flex flex-col h-full overflow-y-auto">
          {children}
        </div>

        {/* Tombol Close: Maroon (Primary) dengan stroke icon tebal */}
        <SheetPrimitive.Close className="absolute top-4 right-4 z-10 size-10 flex items-center justify-center border-[3px] border-foreground bg-primary text-primary-foreground shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none focus:outline-none">
          <XIcon className="size-6 stroke-[3px]" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>

        {/* Dekorasi Pojok: Garis diagonal industrial */}
        <div className="absolute bottom-2 right-2 size-8 bg-[repeating-linear-gradient(-45deg,transparent,transparent_2px,rgba(0,0,0,0.05)_2px,rgba(0,0,0,0.05)_4px)] pointer-events-none" />
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      // Header: Mustard (Secondary) dengan padding masif
      className={cn("flex flex-col gap-2 bg-secondary border-b-[3px] border-foreground p-8 pt-10", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      // Footer: Area Muted dengan border top tebal
      className={cn("mt-auto flex flex-col gap-4 border-t-[3px] border-foreground p-8 bg-muted/40", className)}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-black uppercase tracking-tighter text-3xl leading-none", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-foreground/80 text-[10px] font-black uppercase italic tracking-[0.2em] opacity-70", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};