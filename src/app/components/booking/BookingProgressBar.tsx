import { STEPS } from './bookingConstants';

interface ProgressBarProps {
  currentStep: number;
}

export function BookingProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="flex items-center justify-between gap-1 sm:gap-2 w-full select-none">
      {STEPS.map(({ num, label }) => (
        <div key={num} className="flex-1 flex items-center gap-1 sm:gap-2 last:flex-none">
          {/* Bagian Lingkaran Kotak & Label */}
          <div className="flex flex-col items-center gap-1 sm:gap-1.5 min-w-[40px] sm:min-w-[44px]">
            {/* Kotak Angka Langkah */}
            <div 
              className={`w-8 h-8 sm:w-10 sm:h-10 border-[3px] border-foreground flex items-center justify-center font-black text-xs sm:text-sm italic rounded-none transition-all ${
                currentStep >= num 
                  ? 'bg-secondary text-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' 
                  : 'bg-white text-foreground/20 border-foreground/20 shadow-none'
              }`}
            >
              0{num}
            </div>
            
            {/* Label Langkah */}
            <span 
              className={`font-mono text-[7px] sm:text-[9px] font-black tracking-widest uppercase hidden sm:block text-center whitespace-nowrap transition-colors ${
                currentStep >= num ? 'text-secondary' : 'text-foreground/30'
              }`}
            >
              {label}
            </span>
          </div>

          {/* Garis Penghubung Antar Langkah (Akan Terisi jika Langkah Terlewati) */}
          {num < 4 && (
            <div className="h-[3px] flex-1 bg-foreground/10 relative border border-foreground/5 self-center -mt-3 sm:-mt-4 lg:-mt-5">
              <div 
                className={`absolute inset-y-0 left-0 bg-secondary transition-all duration-500 ease-in-out ${
                  currentStep > num ? 'w-full' : 'w-0'
                }`} 
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}