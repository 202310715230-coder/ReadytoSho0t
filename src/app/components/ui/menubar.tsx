"use client";

import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

import { cn } from "./utils";

function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        // Base: Border tebal 3px, shadow 4px kaku
        "flex h-12 items-center gap-1 border-[3px] border-foreground bg-card p-1 shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
        className,
      )}
      {...props}
    />
  );
}

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />;
}

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        // Trigger: Font Black, Uppercase, efek "Tekan" saat aktif
        "flex cursor-default items-center px-4 py-1 text-[11px] font-black uppercase tracking-[0.1em] outline-none select-none transition-all",
        "focus:bg-secondary focus:text-foreground data-[state=open]:bg-secondary data-[state=open]:shadow-[inner_2px_2px_0_0_rgba(0,0,0,1)]",
        "hover:bg-secondary/50 hover:translate-y-[-1px]",
        className,
      )}
      {...props}
    />
  );
}

function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 10,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          // Content: Border 3px, Shadow 8px untuk kedalaman maksimal
          "z-50 min-w-[14rem] overflow-hidden border-[3px] border-foreground bg-background p-1.5 text-foreground shadow-[8px_8px_0_0_rgba(0,0,0,1)]",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-100 data-[state=open]:slide-in-from-top-2",
          className,
        )}
        {...props}
      >
        {/* Dekorasi Pojok Metadata */}
        <div className="absolute top-1 right-1 size-1 bg-foreground/20" />
        {props.children}
      </MenubarPrimitive.Content>
    </MenubarPortal>
  );
}

function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "relative flex cursor-default items-center gap-2 px-3 py-2 text-xs font-black uppercase tracking-tighter outline-none select-none transition-none",
        "focus:bg-secondary focus:text-foreground focus:translate-x-1",
        "data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive data-[variant=destructive]:focus:text-white",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[inset]:pl-8",
        className,
      )}
      {...props}
    />
  );
}

function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 py-2 pr-2 pl-9 text-xs font-black uppercase outline-none select-none focus:bg-secondary",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2.5 flex size-4 items-center justify-center border-2 border-foreground bg-background shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon className="size-3 stroke-[4px]" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
}

function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 py-2 pr-2 pl-9 text-xs font-black uppercase outline-none select-none focus:bg-secondary",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2.5 flex size-4 items-center justify-center border-2 border-foreground rounded-full bg-background shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn("-mx-1.5 my-1.5 h-[2px] bg-foreground/10 border-b-2 border-dashed border-foreground/20", className)}
      {...props}
    />
  );
}

function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        "ml-auto text-[9px] font-mono font-black border border-foreground/30 px-1 bg-muted/50",
        className,
      )}
      {...props}
    />
  );
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default items-center px-3 py-2 text-xs font-black uppercase outline-none select-none focus:bg-secondary data-[state=open]:bg-secondary",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4 stroke-[4px]" />
    </MenubarPrimitive.SubTrigger>
  );
}

function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      className={cn(
        "z-50 min-w-[10rem] overflow-hidden border-[3px] border-foreground bg-background p-1.5 text-foreground shadow-[6px_6px_0_0_rgba(0,0,0,1)]",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-100",
        className,
      )}
      {...props}
    />
  );
}

const MenubarGroup = MenubarPrimitive.Group;
const MenubarPortal = MenubarPrimitive.Portal;
const MenubarRadioGroup = MenubarPrimitive.RadioGroup;
const MenubarLabel = MenubarPrimitive.Label;
const MenubarSub = MenubarPrimitive.Sub;

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};