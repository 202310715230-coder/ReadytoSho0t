import { ReactNode } from "react";

interface ProfileRowProps {
  label: string;
  value: ReactNode;
}

export default function ProfileRow({
  label,
  value,
}: ProfileRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-2 sm:gap-4 items-start sm:items-center">
      <label className="text-sm font-bold text-[#7B6A5B] sm:pt-3">
        {label}
      </label>

      <div className="min-w-0 text-sm text-[#2D1E17]">
        {value}
      </div>
    </div>
  );
}