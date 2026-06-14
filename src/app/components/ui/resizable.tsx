"use client";

import * as React from "react";
import { GripVerticalIcon } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "./utils";

function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
  return (
    <ResizablePrimitive.PanelGroup
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

function ResizablePanel({
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean;
}) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(
        // Base: Pemisah solid dengan transisi warna
        "relative flex items-center justify-center bg-foreground/20 transition-colors outline-none",
        "data-[panel-group-direction=horizontal]:w-[3px] data-[panel-group-direction=vertical]:h-[3px]",
        // Hover & Drag State: Menjadi Mustard (Secondary) yang mencolok
        "hover:bg-secondary data-[active]:bg-secondary",
        "focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className={cn(
          // Handle: Kotak kaku dengan border tebal 3px
          "z-10 flex items-center justify-center border-[3px] border-foreground bg-card transition-all",
          "shadow-[3px_3px_0_0_rgba(0,0,0,1)]",
          // Hover effect: Shadow membesar, seolah handle terangkat
          "hover:shadow-[5px_5px_0_0_rgba(0,0,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px]",
          // Active/Dragging: Shadow hilang (efek tertekan)
          "group-active:shadow-none group-active:translate-x-[2px] group-active:translate-y-[2px]",
          
          // Penyesuaian dimensi
          "h-9 w-5 data-[panel-group-direction=vertical]:h-5 data-[panel-group-direction=vertical]:w-9",
        )}>
          {/* Icon Grip dengan stroke tebal */}
          <GripVerticalIcon className={cn(
            "size-3 stroke-[4px] text-foreground",
            "data-[panel-group-direction=vertical]:rotate-90"
          )} />
          
          {/* Dekorasi: Garis strip di pojok handle */}
          <div className="absolute top-1 left-1 size-1 bg-foreground/10" />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };