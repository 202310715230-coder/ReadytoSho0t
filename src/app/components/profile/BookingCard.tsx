import {
  CalendarDays,
  CreditCard,
  ExternalLink,
  ImageIcon,
  MapPin,
  ReceiptText,
  Truck,
} from "lucide-react";

export interface BookingCardData {
  id: number | string;

  image_path?: string | null;
  image_full_url?: string | null;

  product_name?: string | null;
  camera_name?: string | null;
  category?: string | null;

  start_date?: string | null;
  end_date?: string | null;
  duration?: number | string | null;

  unit_price?: number | string | null;
  normal_total_price?: number | string | null;
  discount_percent?: number | string | null;
  discount_amount?: number | string | null;
  subtotal?: number | string | null;

  total_price?: number | string | null;
  dp_amount?: number | string | null;
  settlement_amount?: number | string | null;

  delivery_method?: string | null;
  delivery_details?: string | null;
  delivery_distance_km?: number | string | null;
  courier_fee?: number | string | null;

  payment_proof?: string | null;
  payment_proof_url?: string | null;

  status?: string | null;
}

interface BookingCardProps {
  booking: BookingCardData;
  showPaymentButton?: boolean;
}

const BACKEND_BASE_URL = "http://localhost/db_readytoshot";
const PRODUCT_IMAGE_BASE = `${BACKEND_BASE_URL}/config/assets/products/`;
const ADMIN_WHATSAPP = "6281314342077";

function toNumber(value: number | string | null | undefined) {
  const parsed = Number(value || 0);

  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
    return 0;
  }

  return parsed;
}

function formatPrice(price: number | string | null | undefined) {
  return new Intl.NumberFormat("id-ID").format(toNumber(price));
}

function formatDate(date?: string | null) {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function buildBackendUrl(path?: string | null) {
  if (!path) return "";

  const cleanPath = String(path).trim();

  if (!cleanPath) return "";

  if (
    cleanPath.startsWith("http://") ||
    cleanPath.startsWith("https://")
  ) {
    return cleanPath;
  }

  return `${BACKEND_BASE_URL}/${cleanPath.replace(/^\/+/, "")}`;
}

function getProductImage(
  imagePath?: string | null,
  imageFullUrl?: string | null
) {
  if (imageFullUrl) {
    return imageFullUrl;
  }

  if (!imagePath) {
    return "https://placehold.co/400x300?text=No+Image";
  }

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://")
  ) {
    return imagePath;
  }

  return `${PRODUCT_IMAGE_BASE}${imagePath.replace(/^\/+/, "")}`;
}

function getStatusClass(status?: string | null) {
  const value = status?.toLowerCase().trim() || "";

  if (
    value === "menunggu pembayaran" ||
    value === "pending" ||
    value === "menunggu verifikasi"
  ) {
    return "bg-[#FFF7E0] text-[#9A6700] border-[#F3D27A]";
  }

  if (
    value === "confirmed" ||
    value === "dikonfirmasi" ||
    value === "sedang disewa" ||
    value === "picked_up"
  ) {
    return "bg-[#EAF2FF] text-[#175CD3] border-[#B2CCFF]";
  }

  if (value === "selesai" || value === "completed") {
    return "bg-[#ECFDF3] text-[#027A48] border-[#A6F4C5]";
  }

  if (value === "dibatalkan" || value === "cancelled") {
    return "bg-[#FEF3F2] text-[#B42318] border-[#FDA29B]";
  }

  return "bg-[#F2F4F7] text-[#344054] border-[#D0D5DD]";
}

function getStatusLabel(status?: string | null) {
  return status?.trim() || "-";
}

function getPaymentProofUrl(booking: BookingCardData) {
  if (booking.payment_proof_url) {
    return buildBackendUrl(booking.payment_proof_url);
  }

  if (booking.payment_proof) {
    return buildBackendUrl(booking.payment_proof);
  }

  return "";
}

export default function BookingCard({
  booking,
  showPaymentButton = false,
}: BookingCardProps) {
  const imageUrl = getProductImage(
    booking.image_path,
    booking.image_full_url
  );

  const productName =
    booking.product_name ||
    booking.camera_name ||
    "UNKNOWN_PRODUCT";

  const totalPrice = toNumber(booking.total_price);

  const dpAmount =
    toNumber(booking.dp_amount) > 0
      ? toNumber(booking.dp_amount)
      : Math.round(totalPrice * 0.3);

  const settlementAmount =
    toNumber(booking.settlement_amount) > 0
      ? toNumber(booking.settlement_amount)
      : totalPrice - dpAmount;

  const courierFee = toNumber(booking.courier_fee);
  const deliveryDistanceKm = toNumber(booking.delivery_distance_km);
  const deliveryMethod = booking.delivery_method || "-";
  const deliveryDetails = booking.delivery_details || "-";
  const paymentProofUrl = getPaymentProofUrl(booking);

  const handleConfirmPayment = () => {
    const message = encodeURIComponent(
      `Halo Admin ReadyToShot, saya ingin konfirmasi pelunasan untuk pesanan REF_${booking.id}.\n\n` +
        `Produk: ${productName}\n` +
        `Total: IDR ${formatPrice(totalPrice)}\n` +
        `DP: IDR ${formatPrice(dpAmount)}\n` +
        `Sisa Pelunasan: IDR ${formatPrice(settlementAmount)}`
    );

    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${message}`, "_blank");
  };

  return (
    <article className="overflow-hidden rounded-[28px] border border-[#E8DCCB] bg-white shadow-sm">
      <div className="flex flex-col lg:flex-row">
        <div className="relative h-56 w-full overflow-hidden bg-[#F8F3EA] lg:h-auto lg:w-64">
          <img
            src={imageUrl}
            alt={productName}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/400x300?text=No+Image";
            }}
          />

          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black uppercase text-[#2D1E17] shadow-sm">
            {booking.category || "GEAR"}
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B07A3A]">
                  REF_{booking.id}
                </p>

                <h3 className="mt-2 text-2xl font-black uppercase leading-tight text-[#2D1E17] sm:text-3xl">
                  {productName}
                </h3>
              </div>

              <span
                className={`w-fit rounded-full border px-3 py-1 text-[11px] font-black uppercase ${getStatusClass(
                  booking.status
                )}`}
              >
                {getStatusLabel(booking.status)}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-[#E8DCCB] bg-[#F8F3EA] p-4">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase text-[#7B6A5B]">
                  <CalendarDays className="h-4 w-4" />
                  Mulai
                </div>
                <p className="mt-2 text-sm font-black text-[#2D1E17]">
                  {formatDate(booking.start_date)}
                </p>
              </div>

              <div className="rounded-2xl border border-[#E8DCCB] bg-[#F8F3EA] p-4">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase text-[#7B6A5B]">
                  <CalendarDays className="h-4 w-4" />
                  Selesai
                </div>
                <p className="mt-2 text-sm font-black text-[#2D1E17]">
                  {formatDate(booking.end_date)}
                </p>
              </div>

              <div className="rounded-2xl border border-[#E8DCCB] bg-[#F8F3EA] p-4">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase text-[#7B6A5B]">
                  <Truck className="h-4 w-4" />
                  Delivery
                </div>
                <p className="mt-2 text-sm font-black uppercase text-[#2D1E17]">
                  {deliveryMethod === "courier"
                    ? "GoSend / Gojek"
                    : deliveryMethod}
                </p>
              </div>

              <div className="rounded-2xl border border-[#E8DCCB] bg-[#F8F3EA] p-4">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase text-[#7B6A5B]">
                  <ReceiptText className="h-4 w-4" />
                  Durasi
                </div>
                <p className="mt-2 text-sm font-black text-[#2D1E17]">
                  {booking.duration || 0} Hari
                </p>
              </div>
            </div>

            {deliveryMethod === "courier" && (
              <div className="mt-4 rounded-2xl border border-[#E8DCCB] bg-white p-4">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#8A5A2B]" />

                  <div className="min-w-0">
                    <p className="text-[11px] font-black uppercase text-[#7B6A5B]">
                      Alamat Pengiriman
                    </p>

                    <p className="mt-1 text-sm font-semibold leading-relaxed text-[#2D1E17]">
                      {deliveryDetails}
                    </p>

                    <p className="mt-2 text-xs font-bold text-[#7B6A5B]">
                      Jarak: {deliveryDistanceKm} KM · Estimasi GoSend: IDR{" "}
                      {formatPrice(courierFee)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#E8DCCB] bg-white p-4">
                <p className="text-[11px] font-black uppercase text-[#7B6A5B]">
                  Total
                </p>
                <p className="mt-1 text-lg font-black text-[#2D1E17]">
                  IDR {formatPrice(totalPrice)}
                </p>
              </div>

              <div className="rounded-2xl border border-[#E8DCCB] bg-[#F8F3EA] p-4">
                <p className="text-[11px] font-black uppercase text-[#7B6A5B]">
                  DP
                </p>
                <p className="mt-1 text-lg font-black text-[#175CD3]">
                  IDR {formatPrice(dpAmount)}
                </p>
              </div>

              <div className="rounded-2xl border border-[#E8DCCB] bg-[#FFF7E0] p-4">
                <p className="text-[11px] font-black uppercase text-[#7B6A5B]">
                  Sisa Pelunasan
                </p>
                <p className="mt-1 text-lg font-black text-[#9A6700]">
                  IDR {formatPrice(settlementAmount)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-[#EFE3D3] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {paymentProofUrl ? (
                <a
                  href={paymentProofUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#C7E6D0] bg-[#ECFDF3] px-4 py-2 text-xs font-black uppercase text-[#027A48] transition hover:bg-[#DFF8E8]"
                >
                  <ImageIcon className="h-4 w-4" />
                  Lihat Bukti DP
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (
                <span className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E8DCCB] bg-[#F8F3EA] px-4 py-2 text-xs font-black uppercase text-[#7B6A5B]">
                  <ImageIcon className="h-4 w-4" />
                  Bukti DP belum tersedia
                </span>
              )}
            </div>

            {showPaymentButton && (
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2D1E17] px-5 py-3 text-xs font-black uppercase text-white transition hover:bg-[#463025]"
              >
                <CreditCard className="h-4 w-4" />
                Konfirmasi Pelunasan
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}