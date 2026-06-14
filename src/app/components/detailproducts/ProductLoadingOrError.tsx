import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';

interface SpecialStateProps {
  type: 'loading' | 'not_found';
}

export function ProductLoadingOrError({ type }: SpecialStateProps) {
  if (type === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="size-12 border-4 border-foreground border-t-secondary animate-spin mx-auto rounded-none" />
          <p className="font-mono text-xs font-black text-foreground">FETCHING_GEAR_DATA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 select-none">
        <Info className="size-16 text-secondary mx-auto animate-pulse" />
        <h1 className="text-4xl font-black text-foreground font-mono">GEAR_NOT_FOUND</h1>
        <Link to="/catalog" className="inline-block px-6 py-3 bg-secondary text-background font-black uppercase border-[3px] border-foreground shadow-[4px_4px_0_0_#000] rounded-none transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
          Back to Catalog
        </Link>
      </div>
    </div>
  );
}