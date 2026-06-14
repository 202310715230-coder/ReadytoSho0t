"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";

import { cn } from "./utils"; // Pastikan path utils.ts Anda sudah tepat
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog"; // Diambil dari file dialog kustom Anda

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    data-slot="command"
    className={cn(
      "bg-card text-foreground flex h-full w-full flex-col overflow-hidden border-4 border-foreground rounded-none",
      className
    )}
    {...props}
  />
));
Command.displayName = "Command";

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      {/* 💡 PERBAIKAN: DialogContent eksternal diberi border-4 kaku agar menyatu dengan Command internal */}
      <DialogContent className="overflow-hidden p-0 shadow-[12px_12px_0_0_rgba(0,0,0,1)] border-4 border-foreground rounded-none">
        <Command className="border-0">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div
    data-slot="command-input-wrapper"
    className="flex h-14 items-center gap-3 border-b-4 border-foreground px-4 bg-secondary/10 select-none"
  >
    <SearchIcon className="size-5 shrink-0 opacity-100 stroke-[4px] text-foreground" />
    <CommandPrimitive.Input
      ref={ref}
      data-slot="command-input"
      className={cn(
        "placeholder:text-foreground/30 placeholder:italic flex h-full w-full bg-transparent py-4 text-sm font-black uppercase tracking-[0.1em] outline-none disabled:cursor-not-allowed disabled:opacity-50 text-foreground",
        className
      )}
      {...props}
    />
    {/* Label teknis di pojok input */}
    <div className="hidden sm:block text-[8px] font-mono bg-foreground text-background px-1.5 py-0.5 font-black select-none">
      SYS_SRCH
    </div>
  </div>
));
CommandInput.displayName = "CommandInput";

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    data-slot="command-list"
    // 💡 PERBAIKAN: Mengisolasi opacity warna gradien titik menggunakan fungsi RGBA langsung
    className={cn(
      "max-h-[300px] scroll-py-2 overflow-x-hidden overflow-y-auto p-2 bg-[radial-gradient(rgba(0,0,0,0.12)_1px,transparent_1px)] [background-size:14px_14px] font-mono",
      className
    )}
    {...props}
  />
));
CommandList.displayName = "CommandList";

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    data-slot="command-empty"
    className={cn(
      "py-14 text-center text-xs font-black uppercase italic tracking-widest text-destructive bg-destructive/5 border-2 border-dashed border-destructive/30 m-2 select-none rounded-none",
      className
    )}
    {...props}
  />
));
CommandEmpty.displayName = "CommandEmpty";

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    data-slot="command-group"
    className={cn(
      "text-foreground overflow-hidden [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-3 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-black [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-foreground/50 select-none",
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = "CommandGroup";

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    data-slot="command-separator"
    className={cn("-mx-2 h-[2px] bg-foreground my-2", className)}
    {...props}
  />
));
CommandSeparator.displayName = "CommandSeparator";

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    data-slot="command-item"
    className={cn(
      // Item: Huruf tebal kaku, diberi margin kanan 'mr-1' untuk mengamankan ruang gerak shadow seleksi
      "relative flex cursor-default items-center gap-3 px-3 py-3 mr-1 text-[11px] font-black uppercase tracking-tight outline-none select-none transition-all border-2 border-transparent rounded-none",
      // Selected: Efek Mustard Solid dengan Double Shadow tanpa merusak lebar scroll viewport
      "data-[selected=true]:bg-secondary data-[selected=true]:text-foreground data-[selected=true]:translate-x-1 data-[selected=true]:border-foreground data-[selected=true]:shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
      "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-30",
      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg]:stroke-[4px]",
      className
    )}
    {...props}
  />
));
CommandItem.displayName = "CommandItem";

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto text-[10px] font-mono font-black uppercase tracking-tighter border-2 border-foreground px-1.5 py-0.5 bg-background shadow-[2px_2px_0_0_rgba(0,0,0,1)] rounded-none",
        className
      )}
      {...props}
    />
  );
}
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};