"use client";

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F2E7D5] flex items-center justify-center p-6 font-mono selection:bg-[#E6A34A]">
      <div className="max-w-2xl w-full">
        {/* Kontainer Utama dengan Animasi */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="border-[4px] border-[#2D1E17] bg-white p-8 md:p-12 shadow-[16px_16px_0_0_#2D1E17] relative overflow-hidden"
        >
          {/* Elemen Dekoratif Samping */}
          <div className="absolute top-0 right-0 bg-[#E6A34A] border-b-4 border-l-4 border-[#2D1E17] px-4 py-1 font-black text-xs z-20">
            ERROR_404
          </div>

          <div className="space-y-8 relative z-10">
            {/* Ikon dan Judul */}
            <div className="space-y-4">
              <div className="bg-red-500 inline-block p-4 border-4 border-[#2D1E17] shadow-[4px_4px_0_0_#2D1E17]">
                <AlertTriangle className="text-white size-12" />
              </div>
              <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none text-[#2D1E17]">
                LOST_IN <br />
                <span className="text-[#E6A34A]">SPACE?</span>
              </h1>
            </div>

            {/* Pesan Error */}
            <div className="space-y-4">
              <p className="text-xl font-bold leading-relaxed text-[#2D1E17]/80">
                // SEGMENT_NOT_FOUND: Koordinat yang Anda cari tidak terdaftar dalam database GEAR_INDEX kami.
              </p>
              <div className="bg-[#2D1E17]/5 p-4 border-l-8 border-[#2D1E17] font-bold text-sm italic">
                "Mungkin kabelnya putus, atau mungkin halaman ini sudah pensiun."
              </div>
            </div>

            {/* Tombol Navigasi */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 bg-[#2D1E17] text-white px-6 py-4 font-black uppercase text-sm hover:bg-[#E6A34A] hover:text-[#2D1E17] transition-all border-2 border-[#2D1E17] shadow-[6px_6px_0_0_#E6A34A] active:shadow-none active:translate-x-1 active:translate-y-1"
              >
                <Home size={18} /> Back_to_Root
              </Link>
              
              <Link 
                to="/catalog" 
                className="flex items-center gap-2 bg-white text-[#2D1E17] px-6 py-4 font-black uppercase text-sm border-4 border-[#2D1E17] shadow-[6px_6px_0_0_#2D1E17] hover:bg-[#F2E7D5] transition-all active:shadow-none active:translate-x-1 active:translate-y-1"
              >
                <Search size={18} /> Search_Gear
              </Link>
            </div>
          </div>

          {/* Background Text Dekoratif */}
          <div className="absolute -bottom-10 -right-10 opacity-[0.03] pointer-events-none select-none">
            <h2 className="text-[200px] font-black italic">404</h2>
          </div>
        </motion.div>

        {/* Footer Kecil (Di luar motion div) */}
        <p className="mt-8 text-center font-black text-[10px] uppercase tracking-[0.2em] opacity-40">
          ReadyTShoot // System_Diagnostic: Failed
        </p>
      </div>
    </div>
  );
}