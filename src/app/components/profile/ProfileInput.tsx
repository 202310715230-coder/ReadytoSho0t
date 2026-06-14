import ProfileRow from "./ProfileRow";

interface ProfileInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function ProfileInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled = false,
}: ProfileInputProps) {
  return (
    <ProfileRow
      label={label}
      value={
        <input
          type={type}
          value={value}
          disabled={disabled}
          placeholder={placeholder || `Masukkan ${label.toLowerCase()}`}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-2xl border border-[#E8DCCB] bg-white px-4 py-3 text-sm font-semibold text-[#2D1E17] outline-none transition placeholder:text-[#B7A99A] focus:border-[#2D1E17] focus:ring-4 focus:ring-[#F5E7D3] disabled:cursor-not-allowed disabled:bg-[#F8F3EA] disabled:text-[#7B6A5B]"
        />
      }
    />
  );
}