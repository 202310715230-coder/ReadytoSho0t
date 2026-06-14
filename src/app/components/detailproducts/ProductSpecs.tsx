import { Cpu, Zap } from 'lucide-react';

interface ProductSpecifications {
  sensor?: string;
  video?: string;
  [key: string]: string | undefined;
}

interface ProductSpecsProps {
  specs: ProductSpecifications | string | null | undefined;
}

export function ProductSpecs({ specs }: ProductSpecsProps) {
  const getSpecValue = (key: 'sensor' | 'video', defaultValue: string): string => {
    if (!specs) return defaultValue;
    if (typeof specs === 'string') {
      try {
        const parsed = JSON.parse(specs);
        return parsed[key] || defaultValue;
      } catch {
        return defaultValue;
      }
    }
    return (specs as Record<string, string>)[key] || defaultValue;
  };

  return (
    <div className="grid grid-cols-2 gap-6 font-mono">
      <div className="p-6 border-[3px] border-foreground bg-secondary/5 rounded-none">
        <p className="text-secondary text-[10px] font-black uppercase mb-3 flex items-center gap-2">
          <Cpu className="size-3" /> SENSOR
        </p>
        <p className="text-lg font-black italic uppercase text-foreground">
          {getSpecValue('sensor', 'Full Frame CMOS')}
        </p>
      </div>
      <div className="p-6 border-[3px] border-foreground bg-secondary/5 rounded-none">
        <p className="text-secondary text-[10px] font-black uppercase mb-3 flex items-center gap-2">
          <Zap className="size-3" /> OUTPUT
        </p>
        <p className="text-lg font-black italic uppercase text-foreground">
          {getSpecValue('video', '4K UHD 60p')}
        </p>
      </div>
    </div>
  );
}