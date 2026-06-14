import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  CreditCard,
  Package,
  ArrowRight,
  UserCheck,
  BadgeCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    id: 1,
    icon: Search,
    title: "Pilih Kamera",
    description:
      "Buka katalog ReadyToShot, pilih kamera atau gear yang sesuai kebutuhan project Anda.",
  },
  {
    id: 2,
    icon: UserCheck,
    title: "Login & Lengkapi Profil",
    description:
      "Masuk ke akun, lengkapi data diri, nomor WhatsApp, dan upload foto KTP untuk verifikasi penyewa.",
  },
  {
    id: 3,
    icon: Calendar,
    title: "Atur Jadwal Rental",
    description:
      "Tentukan tanggal mulai, tanggal selesai, durasi rental, dan metode pengambilan atau pengiriman.",
  },
  {
    id: 4,
    icon: CreditCard,
    title: "Bayar DP",
    description:
      "Lakukan pembayaran DP sesuai invoice. Pesanan akan masuk ke status menunggu pembayaran.",
  },
  {
    id: 5,
    icon: Package,
    title: "Ambil / Terima Kamera",
    description:
      "Setelah dikonfirmasi admin, kamera bisa diambil di tempat atau dikirim sesuai metode yang dipilih.",
  },
  {
    id: 6,
    icon: BadgeCheck,
    title: "Pelunasan & Pengembalian",
    description:
      "Selesaikan pelunasan, gunakan kamera selama masa sewa, lalu kembalikan sesuai jadwal.",
  },
];

export function HowToRent() {
  return (
    <section
      id="cara-sewa"
      className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative bg-background overflow-hidden"
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)",
          backgroundSize: "10px 10px",
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-20 space-y-3 sm:space-y-4">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <p className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border-2 border-foreground shadow-[3px_3px_0_0_#000] text-[9px] sm:text-xs font-black uppercase tracking-widest">
              Rental Flow
            </p>

            <h2 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-black text-foreground uppercase tracking-tighter leading-none">
              Cara{" "}
              <span className="text-primary italic">
                Sewa
              </span>
            </h2>

            <div className="flex justify-center mt-3">
              <div className="h-3 w-28 sm:w-36 bg-secondary border-2 border-foreground" />
            </div>

            <p className="text-sm sm:text-lg text-muted-foreground mt-6 sm:mt-8 max-w-2xl mx-auto font-medium leading-relaxed">
              Mulai dari pilih kamera, lengkapi profil, bayar DP,
              sampai pelunasan dan pengembalian. Semua proses dibuat
              jelas agar rental lebih aman.
            </p>
          </motion.div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8 lg:gap-10 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.id}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                className="relative group"
              >
                <div className="h-full min-h-[260px] p-6 sm:p-7 border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(179,54,91,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(179,54,91,1)] group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-200">
                  {/* Step Number */}
                  <div className="absolute -top-5 -left-3 w-12 h-12 bg-secondary border-2 border-foreground flex items-center justify-center font-black text-foreground shadow-[4px_4px_0px_0px_rgba(61,35,35,1)] z-20">
                    {step.id}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-primary/10 border-2 border-dashed border-primary flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                    <Icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl sm:text-2xl font-black text-foreground uppercase italic tracking-tight">
                      {step.title}
                    </h3>

                    <p className="text-muted-foreground font-medium leading-relaxed text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info Box */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
          }}
          className="mt-14 sm:mt-16 border-4 border-foreground bg-white p-5 sm:p-6 shadow-[6px_6px_0_0_rgba(61,35,35,1)] max-w-4xl mx-auto"
        >
          <p className="text-sm sm:text-base font-bold text-center leading-relaxed">
            Catatan: Upload KTP diperlukan untuk keamanan rental.
            Status pesanan dan pelunasan dapat dicek melalui halaman{" "}
            <span className="font-black text-primary">
              Profile
            </span>
            .
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          className="text-center mt-12 sm:mt-16"
        >
          <Link
            to="/catalog"
            className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-foreground text-background font-black text-base sm:text-xl uppercase tracking-tighter hover:bg-secondary hover:text-secondary-foreground transition-all shadow-[8px_8px_0px_0px_rgba(179,54,91,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
          >
            Mulai Rental Sekarang
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}