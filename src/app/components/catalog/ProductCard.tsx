"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Zap, Camera } from "lucide-react";

interface Product {
  id: number | string;
  name: string;
  brand: string;
  category: string;
  price: number;
  image: string;
  status: string;
}

interface ProductCardProps {
  product: Product;
  index: number;
}

export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, index }, ref) => {
    const navigate = useNavigate();

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(price);
    };

    const isAvailable =
      product.status?.toLowerCase() === "available" ||
      product.status?.toLowerCase() === "ready" ||
      product.status?.toLowerCase() === "tersedia";

    const handleCardClick = () => {
      const userSessionStr = localStorage.getItem("user_session");

      if (!userSessionStr) {
        navigate("/login");
        return;
      }

      navigate(`/product/${product.id}`);
    };

    return (
      <motion.div
        ref={ref}
        layout
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.95,
        }}
        transition={{
          delay: index * 0.05,
        }}
        whileHover={{
          y: -6,
        }}
        onClick={handleCardClick}
        className="group relative flex flex-col bg-[#F8F1E7] border-[3px] border-[#2D1E17] shadow-[6px_6px_0_0_#2D1E17] hover:shadow-[3px_3px_0_0_#2D1E17] hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer select-none overflow-hidden"
      >
        {/* TOP STRIP */}
        <div className="h-3 bg-primary border-b-[3px] border-[#2D1E17]" />

        {/* STATUS BADGE */}
        <div className="absolute top-6 left-4 z-10">
          <span
            className={`px-3 py-1 border-2 border-[#2D1E17] shadow-[2px_2px_0_0_#2D1E17] font-black text-[10px] uppercase tracking-tighter ${
              isAvailable
                ? "bg-secondary text-[#2D1E17]"
                : "bg-red-500 text-white"
            }`}
          >
            {isAvailable ? "READY TO SHOT" : "RENTED OUT"}
          </span>
        </div>

        {/* IMAGE FRAME */}
        <div className="p-4 pb-0">
          <div className="relative aspect-square overflow-hidden border-[3px] border-[#2D1E17] bg-white shadow-[4px_4px_0_0_rgba(45,30,23,0.35)]">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover grayscale-[25%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Camera className="w-12 h-12 text-foreground/30" />
              </div>
            )}

            {/* INNER CORNER LABEL */}
            <div className="absolute bottom-3 right-3 px-2 py-1 bg-white border-2 border-[#2D1E17] text-[9px] font-black uppercase shadow-[2px_2px_0_0_#2D1E17]">
              #{product.id}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-3 sm:p-5 lg:p-6 flex-grow flex flex-col">
          <div className="mb-4 sm:mb-5">
            <div className="flex items-center gap-2 mb-2 min-w-0">
              <Zap className="size-3 text-secondary fill-secondary flex-shrink-0" />

              <span className="font-mono text-[9px] sm:text-[10px] font-black uppercase text-muted-foreground tracking-widest truncate">
                {product.brand || "BRAND"} // {product.category || "GEAR"}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl lg:text-2xl font-black uppercase italic leading-none tracking-tighter group-hover:text-primary transition-colors line-clamp-2">
              {product.name || "UNKNOWN GEAR"}
            </h3>
          </div>

          <div className="mt-auto pt-4 sm:pt-5 border-t-2 border-dashed border-[#2D1E17]/25 flex items-end justify-between gap-3 sm:gap-4">
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-[8px] sm:text-[9px] font-bold text-muted-foreground uppercase">
                Rate Daily
              </span>

              <span className="text-base sm:text-lg lg:text-xl font-black text-[#2D1E17] italic truncate">
                {formatPrice(Number(product.price || 0))}
              </span>
            </div>

            <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-white border-2 border-[#2D1E17] shadow-[2px_2px_0_0_#2D1E17] font-black text-[9px] sm:text-[10px] uppercase flex-shrink-0">
              Detail
            </div>
          </div>
        </div>

        {/* DECORATIVE CORNER */}
        <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-primary border-2 border-[#2D1E17] rotate-45" />
      </motion.div>
    );
  }
);

ProductCard.displayName = "ProductCard";