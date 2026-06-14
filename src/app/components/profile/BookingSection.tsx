import { motion } from "framer-motion";
import { Loader2, PackageCheck } from "lucide-react";

import BookingCard, { BookingCardData } from "./BookingCard";
import ProfileEmptyState from "./ProfileEmptyState";

interface BookingSectionProps {
  title: string;
  loading: boolean;
  data?: BookingCardData[];
  empty: string;
  showPaymentButton?: boolean;
}

function getSectionDescription(title: string) {
  const normalizedTitle = title.toLowerCase();

  if (normalizedTitle.includes("pelunasan")) {
    return "Pantau tagihan, DP, sisa pelunasan, dan status verifikasi rental kamu.";
  }

  if (
    normalizedTitle.includes("aktif") ||
    normalizedTitle.includes("dirental")
  ) {
    return "Pantau kamera yang sudah dikonfirmasi atau sedang kamu rental.";
  }

  if (normalizedTitle.includes("history")) {
    return "Lihat riwayat rental kamera yang sudah selesai atau dibatalkan.";
  }

  return "Pantau data rental kamera kamu di halaman ini.";
}

export default function BookingSection({
  title,
  loading,
  data = [],
  empty,
  showPaymentButton = false,
}: BookingSectionProps) {
  const totalData = data.length;
  const description = getSectionDescription(title);

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -12,
      }}
      transition={{
        duration: 0.2,
      }}
      className="w-full min-w-0 space-y-6"
    >
      <div className="rounded-[24px] border border-[#E8DCCB] bg-[#F8F3EA] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B07A3A]">
              ReadyToShot Studio
            </p>

            <h1 className="mt-2 break-words text-2xl font-black text-[#2D1E17] sm:text-3xl">
              {title}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#7B6A5B]">
              {description}
            </p>
          </div>

          <div className="w-full rounded-2xl border border-[#E8DCCB] bg-white px-4 py-3 shadow-sm sm:w-fit">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#F5E7D3]">
                <PackageCheck className="h-4 w-4 text-[#8A5A2B]" />
              </div>

              <div className="min-w-0">
                <p className="text-lg font-black leading-none text-[#2D1E17]">
                  {totalData}
                </p>

                <p className="text-[11px] font-bold uppercase text-[#7B6A5B]">
                  Data Rental
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[24px] border border-[#E8DCCB] bg-white p-10 text-center shadow-sm sm:p-14">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5E7D3]">
            <Loader2 className="h-7 w-7 animate-spin text-[#8A5A2B]" />
          </div>

          <h2 className="text-lg font-black text-[#2D1E17]">
            Memuat Data Rental
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-[#7B6A5B]">
            Mohon tunggu sebentar, data sedang diambil dari server.
          </p>
        </div>
      ) : totalData > 0 ? (
        <div className="grid grid-cols-1 gap-5">
          {data.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              showPaymentButton={showPaymentButton}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] border border-[#E8DCCB] bg-white p-6 shadow-sm">
          <ProfileEmptyState title={empty} />
        </div>
      )}
    </motion.section>
  );
}