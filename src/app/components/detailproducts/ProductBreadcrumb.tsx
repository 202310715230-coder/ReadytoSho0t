import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  productName: string;
}

export function ProductBreadcrumb({ productName }: BreadcrumbProps) {
  return (
    <nav className="py-4 px-4 sm:px-8 border-b-[3px] border-foreground bg-muted/30">
      <div className="max-w-7xl mx-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest font-mono">
        <Link to="/" className="hover:text-secondary">ROOT</Link>
        <ChevronRight className="w-3 h-3 text-secondary" />
        <Link to="/catalog" className="hover:text-secondary">GEAR LIST</Link>
        <ChevronRight className="w-3 h-3 text-secondary" />
        <span className="text-secondary truncate">{productName?.replace(/ /g, '_')}</span>
      </div>
    </nav>
  );
}