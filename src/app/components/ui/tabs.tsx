"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "./utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-0", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-12 w-fit items-center justify-start gap-1 bg-transparent p-0",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Base: Border 3px kaku, font black khas mesin cetak
        "relative inline-flex items-center justify-center gap-2 px-6 py-2 text-xs font-black uppercase tracking-widest transition-all outline-none",
        "border-[3px] border-foreground border-b-0 bg-muted/40 text-foreground/40",
        "hover:bg-secondary/30 hover:text-foreground",
        
        // Active State: Warna solid, naik sedikit ke atas, menyatu dengan konten
        "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:z-10",
        "data-[state=active]:-translate-y-[2px]", 
        
        // Disabled & Icon
        "disabled:pointer-events-none disabled:opacity-50",
        "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:stroke-[3px]",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  children, // PERBAIKAN: children harus didefinisikan di sini
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        // Panel: Border tebal 3px dengan Hard Shadow Hitam Solid
        "relative flex-1 bg-background border-[3px] border-foreground p-8 shadow-[10px_10px_0_0_rgba(0,0,0,1)] outline-none",
        "data-[state=active]:animate-in data-[state=active]:fade-in-20 data-[state=active]:zoom-in-95 duration-200",
        className
      )}
      {...props}
    >
      {/* Dekorasi Pojok Industrial */}
      <div className="absolute top-2 right-2 size-4 border-t-2 border-r-2 border-foreground/10" />
      
      {/* Menampilkan isi konten tab */}
      {children}
    </TabsPrimitive.Content>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };