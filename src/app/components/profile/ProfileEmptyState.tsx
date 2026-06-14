interface ProfileEmptyStateProps {
  title: string;
  description?: string;
  buttonText?: string;
  onClick?: () => void;
}

export default function ProfileEmptyState({
  title,
  description,
  buttonText,
  onClick,
}: ProfileEmptyStateProps) {
  return (
    <div className="py-20 text-center border-4 border-dashed border-[#2D1E17]/20 bg-white">
      <p className="font-black text-2xl opacity-30 uppercase">
        {title}
      </p>

      {description && (
        <p className="mt-3 text-sm opacity-60">
          {description}
        </p>
      )}

      {buttonText && onClick && (
        <button
          type="button"
          onClick={onClick}
          className="mt-6 px-6 py-3 bg-[#E6A34A] border-4 border-[#2D1E17] font-black uppercase shadow-[4px_4px_0_#2D1E17] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}