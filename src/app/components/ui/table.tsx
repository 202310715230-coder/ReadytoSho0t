"use client";

import * as React from "react";
import { cn } from "./utils";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      // Container: Border 3px, Shadow 8px Hitam Solid
      className="relative w-full overflow-x-auto border-[3px] border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm border-collapse", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      // Header: Mustard (Secondary) yang mencolok untuk judul kolom
      className={cn("bg-secondary border-b-[3px] border-foreground", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      // Efek Zebra: Memberikan tekstur pada baris genap agar mudah dibaca
      className={cn("[&_tr:last-child]:border-0 bg-background [&_tr:nth-child(even)]:bg-muted/30", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-primary text-primary-foreground border-t-[3px] border-foreground font-black uppercase tracking-widest",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b-[2px] border-foreground/20 hover:bg-secondary/10 transition-colors data-[state=selected]:bg-secondary/30",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-12 px-4 text-left align-middle font-black uppercase tracking-[0.2em] text-foreground border-r-[2px] border-foreground/20 last:border-r-0",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-4 align-middle font-bold border-r-[2px] border-foreground/20 last:border-r-0 tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 p-4 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/50 italic border-t-2 border-dashed border-foreground/10", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};