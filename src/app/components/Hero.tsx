import { motion } from 'framer-motion'; // Perbaikan import
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom'; // Perbaikan import
// Ganti path ini sesuai dengan nama file background di folder assets kamu
import heroBackground from '@/assets/d1ea788ef5be68405df32d46cf8cad6009f1a194.png'; 

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-start overflow-hidden pt-20 bg-background">
      
      {/* Background Image with Retro Warm Wash */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center grayscale-[10%] sepia-[5%]"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        
        {/* Overlay: Transisi halus ke warna Beige */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        
        {/* Subtle Light Leak */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-secondary/10 to-transparent mix-blend-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }} // Lebih baik menggunakan whileInView
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6 sm:space-y-8 text-left"
        >

          {/* Headline Retro Style */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-foreground leading-[0.85] tracking-tighter uppercase">
              Sewa Kamera
              <br />
              <span className="relative inline-block mt-2">
                <span className="relative z-10 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent italic">
                  Digital
                </span>
                {/* Aksen coretan Mustard Yellow */}
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="absolute bottom-2 sm:bottom-4 left-0 h-3 sm:h-6 bg-secondary/40 -z-10 -rotate-1" 
                />
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl font-medium leading-relaxed border-l-4 border-secondary pl-4 sm:pl-6">
              Abadikan Momen dengan Kualitas Sempurna. <br />
              Partner terpercaya untuk kebutuhan estetika retro Anda.
            </p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-4"
          >
            <Link
              to="/catalog"
              className="group w-full sm:w-auto px-10 py-4 rounded-none bg-secondary text-secondary-foreground text-xl font-black shadow-[6px_6px_0px_0px_rgba(61,35,35,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 flex items-center justify-center gap-2 border-2 border-foreground"
            >
              LIHAT KATALOG
              <ArrowRight className="w-6 h-6 group-hover:rotate-[-45deg] transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Retro Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-10 hidden md:block"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary [writing-mode:vertical-lr]">Scroll</span>
          <div className="w-[2px] h-12 bg-gradient-to-b from-primary to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}