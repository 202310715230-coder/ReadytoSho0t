"use client";

import { motion } from 'framer-motion';
import { Shield, CheckCircle, Lock, UserCheck, Clock, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom'; // Gunakan react-router-dom

const features = [
  { id: 1, icon: Shield, title: 'Verifikasi Identitas', description: 'Semua pelanggan melalui proses verifikasi ketat untuk keamanan bersama.' },
  { id: 2, icon: Lock, title: 'Transaksi Aman', description: 'Pembayaran terlindungi dengan sistem enkripsi dan jaminan uang kembali.' },
  { id: 3, icon: UserCheck, title: 'Gear Terawat', description: 'Semua gear melewati kalibrasi dan test sensor sebelum Anda memegangnya.' },
  { id: 4, icon: CheckCircle, title: 'Garansi Unit', description: 'Jaminan peralatan berfungsi 100% atau ganti unit instan di lokasi.' },
  { id: 5, icon: Clock, title: 'Proses Ekspres', description: 'Approval kilat dalam 1 jam. Waktu Anda terlalu berharga untuk menunggu.' },
  { id: 6, icon: Award, title: 'Mitra Terpercaya', description: 'Dipercaya oleh ribuan fotografer profesional di seluruh Indonesia.' },
];

export function TrustSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative bg-background overflow-hidden border-t-4 border-foreground">
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="max-w-7xl mx-auto relative">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring" }}
            className="space-y-4 sm:space-y-6"
          >
            <h2 className="text-3xl sm:text-5xl lg:text-8xl font-black text-foreground uppercase tracking-tighter italic leading-none">
              Kenapa <br className="sm:hidden" />
              <span className="text-primary not-italic underline decoration-secondary decoration-[8px] sm:decoration-[12px] underline-offset-[8px] sm:underline-offset-[12px]">Harus Kami?</span>
            </h2>
            <p className="text-xs sm:text-lg text-foreground/70 mt-6 sm:mt-12 max-w-2xl mx-auto font-black uppercase tracking-widest bg-secondary/30 py-2 inline-block px-3 sm:px-4 border-2 border-foreground/10">
              Standard kualitas tinggi untuk hasil karya maksimal.
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group cursor-default"
            >
              <div className="h-full p-8 bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all relative overflow-hidden">
                
                {/* Decorative Number */}
                <span className="absolute -bottom-6 -right-2 text-9xl font-black text-foreground/5 pointer-events-none italic group-hover:text-primary/10 transition-colors">
                  {feature.id}
                </span>

                {/* Icon Box with Floating Animation */}
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                  className="w-16 h-16 bg-primary border-4 border-foreground flex items-center justify-center mb-8 rotate-[-3deg] group-hover:rotate-6 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Content */}
                <div className="relative z-10 space-y-4">
                  <h3 className="text-2xl font-black text-foreground uppercase italic tracking-tight group-hover:text-primary transition-colors">
                    {feature.id}. {feature.title}
                  </h3>
                  <p className="text-foreground/70 font-bold leading-relaxed text-sm md:text-base">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Banner - Gaya Tiket Konser Retro */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-28 relative group"
        >
          {/* Hard Shadow Background */}
          <div className="absolute inset-0 bg-foreground translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-all" />
          
          <div className="relative bg-secondary border-4 border-foreground p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 overflow-hidden">
            
            {/* Cut-out circles (Ticket effect) */}
            <div className="hidden lg:block absolute -left-8 top-1/2 -translate-y-1/2 w-16 h-16 bg-background border-4 border-foreground rounded-full" />
            <div className="hidden lg:block absolute -right-8 top-1/2 -translate-y-1/2 w-16 h-16 bg-background border-4 border-foreground rounded-full" />
            
            {/* Dotted Line Divider (Ticket effect) */}
            <div className="hidden lg:block absolute left-[70%] top-0 bottom-0 border-l-4 border-dotted border-foreground/30" />

            <div className="text-center lg:text-left relative z-10 max-w-xl">
              <h3 className="text-4xl md:text-6xl font-black text-foreground uppercase italic leading-[0.9] mb-6">
                Siap Eksekusi <br /> <span className="text-primary">Ide Anda?</span>
              </h3>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                 <span className="px-3 py-1 bg-foreground text-white text-xs font-black uppercase tracking-widest">Limited Slots</span>
                 <span className="px-3 py-1 bg-white border-2 border-foreground text-foreground text-xs font-black uppercase tracking-widest">2000+ Creators Joined</span>
              </div>
            </div>

            <Link
              to="/catalog"
              className="group relative flex items-center gap-4 px-12 py-6 bg-primary text-white font-black text-2xl uppercase tracking-tighter border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Jelajahi Katalog
                <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform" />
              </span>
              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 italic" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}