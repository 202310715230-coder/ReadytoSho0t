import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface StatItem {
  id: number;
  number: string | number;
  label: string;
  rotate: string;
}

export function StatsSection() {
  const [stats, setStats] = useState<StatItem[]>([
    { id: 1, number: 0, label: 'Koleksi Kamera', rotate: '-2deg' },
    { id: 2, number: 0, label: 'Rental Sukses', rotate: '1deg' },
    { id: 3, number: '24 Jam', label: 'Support Teknis', rotate: '-1deg' },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost/db_readytoshot/get_stats_customer.php');
        const data = await response.json();

        // Ditambahkan pengecekan opsional (data?.counts) untuk mencegah runtime error
        if (data.status === 'success' && data.counts) {
          setStats([
            { 
              id: 1, 
              number: Number(data.counts.total_cameras) || 0, 
              label: 'Koleksi Kamera', 
              rotate: '-2deg' 
            },
            { 
              id: 2, 
              number: Number(data.counts.total_rentals) || 0, 
              label: 'Rental Sukses', 
              rotate: '1deg' 
            },
            { 
              id: 3, 
              number: '24/7', 
              label: 'Support Teknis', 
              rotate: '-1deg' 
            },
          ]);
        }
      } catch (error) {
        console.error("Gagal mengambil statistik:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden border-y-4 border-foreground">
      {/* Dekorasi Garis Retro di Background */}
      <div className="absolute inset-0 flex flex-col justify-around opacity-[0.05] pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-[1px] w-full bg-foreground" />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                delay: index * 0.15 
              }}
              style={{ rotate: stat.rotate }}
              className="relative group"
            >
              {/* Card Box Brutalist */}
              <div className="p-10 bg-card border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(179,54,91,1)] group-hover:shadow-none group-hover:translate-x-2 group-hover:translate-y-2 transition-all duration-300">
                
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70 block">
                    {isLoading ? "Fetching..." : "Verified Data"}
                  </span>
                  
                  <div className="flex items-baseline gap-1">
                    <AnimatePresence mode="wait">
                      <motion.h3
                        key={stat.number}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-black text-foreground italic tracking-tighter leading-none"
                      >
                        {stat.number}
                      </motion.h3>
                    </AnimatePresence>
                    
                    {/* Menggunakan visual plus (+) jika data angka di atas 0 */}
                    {!isLoading && typeof stat.number === 'number' && stat.number > 0 && (
                      <span className="text-4xl font-black text-primary">+</span>
                    )}
                  </div>
                  
                  <p className="text-lg md:text-xl font-bold text-foreground/80 uppercase tracking-tight">
                    {stat.label}
                  </p>
                </div>

                {/* Dekorasi Sudut */}
                <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-foreground flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary animate-pulse" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}