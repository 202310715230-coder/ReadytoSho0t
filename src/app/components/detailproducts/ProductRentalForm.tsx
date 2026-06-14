import { useEffect, useState } from 'react';

interface ProductRentalFormProps {
  startDate: string;
  endDate: string;
  duration: number;
  isAvailable: boolean;
  discountPercent: number;
  normalTotalPrice: number;
  totalPrice: number;
  dpAmount: number;
  settlementAmount: number;
  dueDateText: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

export function ProductRentalForm({
  startDate,
  endDate,
  duration,
  isAvailable,
  discountPercent,
  normalTotalPrice,
  totalPrice,
  dpAmount,
  settlementAmount,
  dueDateText,
  onStartDateChange,
  onEndDateChange,
}: ProductRentalFormProps) {
  const [minDateString, setMinDateString] = useState('');
  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID').format(price);

  useEffect(() => {
    setMinDateString(new Date().toISOString().split('T')[0]);
  }, []);

  return (
    <div className="p-8 border-[4px] border-foreground bg-card shadow-[10px_10px_0_0_#000] relative overflow-hidden rounded-none font-mono">
      <div className="space-y-6">
        <p className="text-[10px] font-black uppercase text-foreground/40">SELECT RENTAL PERIOD:</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-foreground">START DATE (PICKUP)</label>
            <input 
              type="date" 
              value={startDate}
              min={minDateString}
              disabled={!isAvailable}
              onChange={(e) => onStartDateChange(e.target.value)}
              onClick={(e) => !e.currentTarget.disabled && e.currentTarget.showPicker()}
              className="p-3 bg-background text-sm font-bold border-[3px] border-foreground outline-none uppercase shadow-[4px_4px_0_0_#000] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all disabled:opacity-40 disabled:cursor-not-allowed rounded-none w-full text-left cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-foreground">END DATE (RETURN)</label>
            <input 
              type="date" 
              value={endDate}
              min={startDate || minDateString}
              disabled={!isAvailable}
              onChange={(e) => onEndDateChange(e.target.value)}
              onClick={(e) => !e.currentTarget.disabled && e.currentTarget.showPicker()}
              className="p-3 bg-background text-sm font-bold border-[3px] border-foreground outline-none uppercase shadow-[4px_4px_0_0_#000] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all disabled:opacity-40 disabled:cursor-not-allowed rounded-none w-full text-left cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-6 border-t-[3px] border-foreground/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] text-foreground/40 block font-black">TOTAL DURATION:</span>
              <span className="text-xl font-black text-foreground uppercase">{duration} HARI</span>
              {discountPercent > 0 && (
                <span className="inline-block ml-3 px-2 py-0.5 bg-red-500 text-white text-[9px] font-black uppercase tracking-tight">
                  PROMO_DISC: 8% OFF
                </span>
              )}
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-foreground/40 block font-black">TOTAL ESTIMATION:</span>
              {discountPercent > 0 && (
                <span className="text-sm line-through text-foreground/40 mr-2">
                  IDR {formatPrice(normalTotalPrice)}
                </span>
              )}
              <span className="text-2xl font-black text-foreground italic">IDR {formatPrice(totalPrice)}</span>
            </div>
          </div>

          <div className="p-4 border-[3px] border-dashed border-foreground bg-secondary/5 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-none">
            <div>
              <span className="text-[10px] text-secondary block font-black">DEPOSIT (30%)</span>
              <span className="text-2xl font-black text-secondary">IDR {formatPrice(dpAmount)}</span>
              <p className="text-[9px] font-bold text-foreground/60 mt-1">*Amankan slot reservasi unit</p>
            </div>
            <div className="sm:border-l-[3px] sm:border-dashed sm:border-foreground/30 sm:pl-4">
              <span className="text-[10px] text-foreground/60 block font-black">PELUNASAN SISA</span>
              <span className="text-2xl font-black text-foreground/80">IDR {formatPrice(settlementAmount)}</span>
              <p className="text-[9px] font-black text-red-500 mt-1 uppercase tracking-tighter">
                ⚠️ DEADLINE: {dueDateText} (H-1)
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}