"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "./utils"; // Pastikan path utils.ts Anda sudah tepat
import { buttonVariants } from "./button"; // Diambil dari file button.tsx Anda

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-4 border-4 border-foreground bg-card shadow-[8px_8px_0_0_rgba(0,0,0,1)] select-none", 
        className
      )}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full mb-4 border-b-2 border-dashed border-foreground/10 pb-4",
        caption_label: "text-sm font-black uppercase tracking-[0.2em] italic text-foreground",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-8 bg-background p-0 opacity-100 border-2 border-foreground rounded-none shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:bg-secondary hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex w-full justify-between", // Tetap dipertahankan untuk fleksibilitas flexbox kalender Anda
        head_cell: "text-foreground font-black uppercase text-[10px] w-9 pb-4 text-center tracking-widest opacity-50 font-mono",
        row: "flex w-full mt-1 justify-between",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 transition-all w-9",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:bg-secondary/40 [&:has(>.day-range-start)]:bg-secondary/40 [&:has([aria-selected].day-range-middle)]:bg-secondary/20"
            : ""
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-9 p-0 font-mono text-[11px] font-bold rounded-none border-2 border-transparent hover:border-foreground hover:bg-secondary transition-none aria-selected:opacity-100"
        ),
        // Day Selected / Range Start & End: Menonjol dengan border tebal dan hard shadow kaku warna mustard (#ffcc00)
        day_range_start: "day-range-start aria-selected:bg-foreground aria-selected:text-background aria-selected:border-foreground aria-selected:shadow-[2px_2px_0_0_#ffcc00]",
        day_range_end: "day-range-end aria-selected:bg-foreground aria-selected:text-background aria-selected:border-foreground aria-selected:shadow-[-2px_2px_0_0_#ffcc00]",
        day_selected: "bg-foreground text-background hover:bg-foreground hover:text-background focus:bg-foreground focus:text-background font-black border-2 border-foreground",
        day_today: "bg-secondary/20 text-foreground border-2 border-dashed border-foreground font-black",
        day_outside: "day-outside text-muted-foreground/20 opacity-30 pointer-events-none",
        day_disabled: "text-muted-foreground opacity-20 line-through",
        day_range_middle: "aria-selected:bg-secondary/30 aria-selected:text-foreground aria-selected:font-black",
        day_hidden: "invisible",
        ...classNames,
      }}
      // 💡 PERBAIKAN: Penyelarasan ganda untuk mendukung objek pemicu ikon versi lama maupun versi terbaru
      components={{
        IconLeft: ({ className, ...props }: { className?: string }) => (
          <ChevronLeft className={cn("size-4 stroke-[4px]", className)} {...props} />
        ),
        IconRight: ({ className, ...props }: { className?: string }) => (
          <ChevronRight className={cn("size-4 stroke-[4px]", className)} {...props} />
        )
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };