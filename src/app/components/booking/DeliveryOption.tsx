import { Check } from "lucide-react";

interface DeliveryOptionProps {
  isSelected: boolean;
  onClick: () => void;
  title: string;
  description: string;
  badgeText?: string;
  disabled?: boolean;
}

export function DeliveryOption({
  isSelected,
  onClick,
  title,
  description,
  badgeText,
  disabled = false,
}: DeliveryOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isSelected}
      className={`w-full rounded-none border-[3px] p-4 text-left text-foreground transition-all ${
        disabled
          ? "cursor-not-allowed border-foreground/30 bg-muted opacity-60"
          : isSelected
          ? "cursor-pointer border-secondary bg-secondary/10 shadow-[2px_2px_0_0_#000] translate-x-0.5 translate-y-0.5"
          : "cursor-pointer border-foreground bg-white shadow-[4px_4px_0_0_#000] hover:border-secondary active:translate-x-1 active:translate-y-1 active:shadow-none"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        {/* CHECKBOX */}
        <div
          className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-none border-2 transition-all ${
            isSelected
              ? "border-secondary bg-secondary"
              : "border-foreground/40 bg-transparent"
          }`}
        >
          {isSelected && (
            <Check className="h-4 w-4 text-foreground stroke-[3px]" />
          )}
        </div>

        {/* CONTENT */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <p className="break-words text-base font-black uppercase italic tracking-tight leading-tight">
              {title}
            </p>

            {badgeText && (
              <span className="w-fit flex-shrink-0 rounded-none border border-foreground bg-secondary px-2 py-1 font-mono text-[10px] font-black text-foreground shadow-[1px_1px_0_0_#000]">
                {badgeText}
              </span>
            )}
          </div>

          <p className="mt-2 break-words font-mono text-[10px] uppercase leading-relaxed tracking-wider text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}