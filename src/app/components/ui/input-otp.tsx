"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";

import { cn } from "./utils";

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-3 has-disabled:opacity-50",
        containerClassName,
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-3", className)} // Gap diperlebar agar shadow tidak bertumpuk
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        // Base: Kotak kaku, border sangat tebal 3px
        "relative flex h-14 w-12 items-center justify-center border-[3px] border-foreground bg-card text-xl font-black transition-all outline-none select-none",
        // Gaya Brutalist: Shadow 4px kaku
        "shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
        // Active State: Warna Mustard, Shadow hilang, seolah tombol tertekan ke dalam
        "data-[active=true]:bg-secondary data-[active=true]:translate-x-[2px] data-[active=true]:translate-y-[2px] data-[active=true]:shadow-none data-[active=true]:ring-2 data-[active=true]:ring-foreground data-[active=true]:ring-offset-2",
        // Character styling
        "group-data-[invalid=true]:border-destructive group-data-[invalid=true]:text-destructive",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {/* Caret: Batang hitam tebal khas terminal */}
          <div className="animate-caret-blink bg-foreground h-7 w-[4px] duration-700" />
        </div>
      )}
      
      {/* Dekorasi Pojok: Kesan sensor optik kecil */}
      <div className="absolute top-1 right-1 size-1 bg-foreground/10" />
    </div>
  );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div 
      data-slot="input-otp-separator" 
      role="separator" 
      className="flex items-center justify-center px-1"
      {...props}
    >
      {/* Minus diubah menjadi stroke-4 agar sangat bold */}
      <MinusIcon className="size-6 stroke-[4px] text-foreground" />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };