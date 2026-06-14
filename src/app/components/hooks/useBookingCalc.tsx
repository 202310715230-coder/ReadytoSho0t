import { DeliveryMethod } from "../booking/BookingTypes";

interface CalcProps {
  unitPrice: number | string;
  startDate: string;
  endDate: string;
  deliveryMethod: DeliveryMethod;

  /**
   * Ongkir asli dari BookingStep3Delivery.
   * Untuk COD nilainya tetap 0.
   * Untuk courier nilainya dikirim dari hasil perhitungan OSRM.
   */
  courierFee?: number;

  fallbackDuration?: number;
}

function safeNumber(value: number | string | undefined | null): number {
  const parsed = Number(value);

  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
    return 0;
  }

  return parsed;
}

function parseDateOnly(dateString: string): Date | null {
  if (!dateString) return null;

  const [year, month, day] = dateString.split("-").map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
}

export function useBookingCalc({
  unitPrice,
  startDate,
  endDate,
  deliveryMethod,
  courierFee = 0,
  fallbackDuration = 1,
}: CalcProps) {
  const cleanUnitPrice = safeNumber(unitPrice);
  const cleanCourierFee = safeNumber(courierFee);

  const calculatedDuration = (() => {
    const start = parseDateOnly(startDate);
    const end = parseDateOnly(endDate);

    if (!start || !end) {
      return fallbackDuration > 0 ? fallbackDuration : 1;
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    /**
     * Aturan bisnis:
     * - Kalau tanggal selesai lebih besar dari tanggal mulai, pakai selisih hari.
     * - Kalau sama atau invalid, minimal tetap 1 hari.
     */
    return diffDays > 0 ? diffDays : 1;
  })();

  const discountPercent = calculatedDuration >= 5 ? 0.08 : 0;

  const normalTotalPrice = cleanUnitPrice * calculatedDuration;
  const discountAmount = normalTotalPrice * discountPercent;
  const subtotal = normalTotalPrice - discountAmount;

  /**
   * Bagian penting:
   * Ongkir tidak lagi hardcoded 25.000.
   * Sekarang ongkir mengikuti hasil perhitungan BookingStep3Delivery.
   */
  const finalCourierFee =
    deliveryMethod === "courier" ? cleanCourierFee : 0;

  const totalPrice = subtotal + finalCourierFee;

  const dpAmount = Math.round(totalPrice * 0.3);
  const settlementAmount = totalPrice - dpAmount;

  return {
    calculatedDuration,
    discountPercent,
    discountAmount,
    subtotal,
    courierFee: finalCourierFee,
    totalPrice,
    dpAmount,
    settlementAmount,
  };
}