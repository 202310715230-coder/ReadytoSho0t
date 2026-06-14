import { FileText } from "lucide-react";

interface ProductDescriptionProps {
  description?: string | null;
}

export function ProductDescription({
  description,
}: ProductDescriptionProps) {
  const cleanDescription = description?.trim();

  return (
    <div className="border-[4px] border-foreground bg-card p-5 sm:p-6 shadow-[8px_8px_0_0_#000] rounded-none">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-4 h-4 text-secondary" />

        <p className="text-secondary text-[10px] font-black uppercase font-mono tracking-widest">
          PRODUCT DESCRIPTION
        </p>
      </div>

      <h2 className="text-xl sm:text-2xl font-black uppercase italic tracking-tight mb-3">
        Deskripsi Produk
      </h2>

      <p className="text-sm sm:text-base font-bold leading-relaxed text-muted-foreground whitespace-pre-line">
        {cleanDescription || "Belum ada deskripsi untuk produk ini."}
      </p>
    </div>
  );
}