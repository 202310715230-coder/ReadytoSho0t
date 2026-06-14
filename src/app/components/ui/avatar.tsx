"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "./utils"; // Pastikan path utils.ts Anda sudah tepat

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  // 💡 PERBAIKAN: Root Radix dijadikan pembungkus terluar agar Context mengalir lancar.
  // Dekorasi absolut dipindahkan ke dalam agar tetap presisi.
  <AvatarPrimitive.Root
    ref={ref}
    data-slot="avatar"
    className={cn(
      "relative flex size-12 shrink-0 rounded-none border-2 border-foreground bg-background",
      "shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all group select-none",
      className
    )}
    {...props}
  >
    {children}
    
    {/* Status Indicator (Online/Active) */}
    <div className="absolute -top-1.5 -right-1.5 size-3 bg-secondary border-2 border-foreground z-20 shadow-[2px_2px_0_0_rgba(0,0,0,1)] animate-pulse rounded-none" />
    
    {/* Dekorasi Pojok Ekstra (Pojok kiri bawah) */}
    <div className="absolute -bottom-1.5 -left-1.5 size-2 border-b-2 border-l-2 border-foreground z-20 pointer-events-none" />
  </AvatarPrimitive.Root>
));
Avatar.displayName = "Avatar.Root";

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  // 💡 PERBAIKAN: div pembungkus dihapus agar deteksi onLoadingStatusChange Radix tidak putus.
  // Efek scanline dipindahkan menjadi elemen saudara (sibling) yang menimpa gambar secara absolut.
  <>
    <AvatarPrimitive.Image
      ref={ref}
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full object-cover grayscale contrast-125 brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500 rounded-none",
        className
      )}
      {...props}
    />
    {/* Efek Garis Scanlines ID Card Digital */}
    <div className="pointer-events-none absolute inset-0 z-10 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
  </>
));
AvatarImage.displayName = "Avatar.Image";

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    data-slot="avatar-fallback"
    className={cn(
      "bg-secondary text-secondary-foreground flex size-full items-center justify-center rounded-none font-black text-xs uppercase font-mono tracking-tighter",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = "Avatar.Fallback";

export { Avatar, AvatarImage, AvatarFallback };