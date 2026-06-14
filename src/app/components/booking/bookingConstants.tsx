// Mengimpor gambar langsung sebagai modul
import qrisReadyToShot from "./qris-mahardika.jpeg";

// ==========================================
// 1. KONSTANTA PEMBAYARAN
// ==========================================

export const PAYMENT_INFO = {
  qrisImageUrl: qrisReadyToShot,
  bankName: "GOPAY",
  accountNumber: "081314342077",
  accountName: "ReadyToShot Studio",
  whatsappNumber: "6281314342077",
};

// ==========================================
// 2. STEP BOOKING
// ==========================================

export const STEPS = [
  { num: 1, label: "TANGGAL" },
  { num: 2, label: "DATA DIRI" },
  { num: 3, label: "PENGIRIMAN" },
  { num: 4, label: "BAYAR" },
];

// ==========================================
// 3. FORMAT UTILITIES
// ==========================================

export const formatPrice = (price: number | string | null | undefined): string => {
  const value = Number(price || 0);

  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return "0";
  }

  return new Intl.NumberFormat("id-ID").format(value);
};

export const formatDateToString = (date: Date | null): string => {
  if (!date) return "";

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().split("T")[0];
};

export const formatDisplayDate = (dateStr?: string | null): string => {
  if (!dateStr) return "-";

  const [year, month, day] = dateStr.split("-").map(Number);

  if (!year || !month || !day) {
    return "-";
  }

  const localDate = new Date(year, month - 1, day);

  return localDate.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};