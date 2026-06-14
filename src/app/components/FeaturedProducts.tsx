"use client";

import { useFeaturedProducts } from './hooks/UseFeaturedProducts';
import { AnimatePresence } from 'framer-motion';
import { ProductCard } from './catalog/ProductCard'; // Impor ProductCard yang sudah forwardRef

export function FeaturedProducts() {
  const { products, loading, error } = useFeaturedProducts();

  // Loading State dengan animasi Neubrutalism pulse
  if (loading) {
    return (
      <div className="text-center py-24 font-black text-2xl animate-pulse uppercase italic tracking-tighter">
        Menyiapkan Kamera Terbaik...
      </div>
    );
  }

  // Error State 
  if (error) {
    return (
      <div className="text-center py-24 px-4">
        <p className="text-red-500 font-black text-xl border-[4px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] inline-block p-4 bg-red-100 uppercase tracking-tight">
          ERROR: {error}
        </p>
      </div>
    );
  }

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12 sm:mb-16 text-left border-l-[8px] border-foreground pl-4 sm:pl-6">
          <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tighter">
            Kamera <span className="text-white not-italic bg-foreground px-3 border-2 border-foreground">Best Seller</span>
          </h2>
        </div>

        {/* Grid System - Ditambahkan justify-center agar posisi card center otomatis */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 justify-center">
          <AnimatePresence>
            {products.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={{
                  id: product.id,
                  name: product.name,
                  brand: product.brand,
                  category: product.category,
                  price: product.price,
                  image: product.image,
                  status: product.status
                }} 
                index={index} 
              />
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}