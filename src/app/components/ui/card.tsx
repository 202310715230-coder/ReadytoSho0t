"use client";

import * as React from "react";
import { cn } from "./utils"; // Pastikan path utils.ts Anda sudah tepat

const Card = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card"
    className={cn(
      // Base: Kotak kaku, border tebal 3px untuk kesan lebih industrial
      "bg-card text-card-foreground flex flex-col rounded-none border-[3px] border-foreground relative",
      // Shadow & Interaction: Hard shadow yang "snap" menempel rata saat di-hover
      "shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[8px] hover:translate-y-[8px] transition-all duration-150",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    idRef?: string; // 💡 Perbaikan: ID Referensi dilewatkan via props opsional untuk menghindari Hydration Error
  }
>(({ className, children, idRef, ...props }, ref) => {
  // Gunakan React.useId untuk menghasilkan ID unik yang aman bagi Server dan Klien jika idRef kosong
  const defaultId = React.useId().replace(/:/g, "").substring(0, 5).toUpperCase();
  const finalId = idRef || `REF-${defaultId}`;

  return (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(
        "relative grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 px-6 pt-6 border-b-2 border-dashed border-foreground/10 pb-5",
        className,
      )}
      {...props}
    >
      {/* Dekorasi Pojok: Kesan plat besi log sistem identifikasi teknis */}
      <div className="absolute top-0 right-0 bg-foreground text-background text-[8px] font-mono px-1.5 py-0.5 uppercase font-black select-none">
        {finalId}
      </div>
      {children}
    </div>
  );
});
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<"h4">
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    data-slot="card-title"
    // Typography: Black, Italic, Tight. Memberikan kesan agresif.
    className={cn("text-2xl font-black uppercase tracking-tighter leading-none italic text-foreground", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<"p">
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="card-description"
    // Gaya teks monospaced untuk kesan data teknis
    className={cn("text-muted-foreground text-[10px] font-bold font-mono uppercase tracking-widest mt-1", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardAction = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-action"
    className={cn(
      "absolute right-6 bottom-5 self-start justify-self-end",
      className,
    )}
    {...props}
  />
));
CardAction.displayName = "CardAction";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-content"
    // Pola titik-titik (dots grid) halus di background content untuk tekstur cetak koran/industrial kuno
    className={cn(
      "px-6 pt-5 pb-6 bg-[radial-gradient(rgba(0,0,0,0.15)_1px,transparent_1px)] [background-size:12px_12px] [background-position:center]",
      className
    )}
    {...props}
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-footer"
    // Footer dengan warna kontras (Mustard tipis)
    className={cn("flex items-center px-6 py-4 border-t-2 border-foreground bg-secondary/10 mt-auto", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};