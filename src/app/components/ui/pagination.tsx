import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "./utils";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center py-6", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      // Menggunakan border-4 dan shadow yang lebih tebal agar terlihat seperti "block" industrial
      className={cn(
        "flex flex-row items-center gap-0 border-[3px] border-foreground bg-foreground shadow-[6px_6px_0_0_rgba(0,0,0,1)]", 
        className
      )}
      {...props}
    />
  );
}

function PaginationItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li 
      data-slot="pagination-item" 
      // Garis pemisah antar frame film
      className={cn("border-r-[3px] border-foreground last:border-r-0", className)} 
      {...props} 
    />
  );
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<"a">, "className" | "children"> & 
  React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        // Ukuran h-12 agar lebih nyaman dioperasikan (touch-friendly)
        "flex h-12 min-w-12 items-center justify-center bg-card px-3 text-xs font-black uppercase tracking-widest transition-all outline-none cursor-pointer",
        "hover:bg-secondary hover:text-foreground",
        // State Aktif: Mustard (Secondary) dengan border internal tipis
        isActive && "bg-secondary text-foreground ring-inset ring-2 ring-foreground/20",
        "focus-visible:bg-secondary focus-visible:ring-2 focus-visible:ring-foreground",
        className,
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={cn("px-4 gap-2", className)}
      {...props}
    >
      <ChevronLeftIcon className="size-4 stroke-[4px]" />
      <span className="hidden md:block">PREV_FRM</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      className={cn("px-4 gap-2", className)}
      {...props}
    >
      <span className="hidden md:block">NEXT_FRM</span>
      <ChevronRightIcon className="size-4 stroke-[4px]" />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      // Efek glassmorphism pada ellipsis agar tetap terlihat seperti "ruang kosong" di strip film
      className={cn("flex size-12 items-center justify-center bg-card/80 text-foreground/40", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-5" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};