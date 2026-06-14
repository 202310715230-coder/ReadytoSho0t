export interface BookingStatePayload {
  duration: number;
  startDate: string;
  endDate: string;

  // Harga rental sebelum ongkir
  rentalPrice?: number;

  // Diskon
  discountAmount: number;

  // Ongkir kurir
  courierFee: number;

  // Total akhir = rentalPrice - discountAmount + courierFee
  totalPrice: number;

  // DP dan pelunasan dihitung dari totalPrice
  dpAmount: number;
  settlementAmount: number;

  dueDateText: string;
}

export type DeliveryMethod = "cod" | "courier" | null;

export interface ProductData {
  id: number | string;
  name?: string;
  brand?: string;
  category?: string;
  image?: string;
  image_path?: string;
  image_full_url?: string;
  price?: number | string;
  price_per_day?: number | string;
  status?: string;
}

export interface FormDataState {
  fullName: string;
  email: string;
  whatsapp: string;
}

// =========================================
// DATA DELIVERY
// =========================================

export interface DeliveryData {
  method: DeliveryMethod;

  // Untuk COD bisa kosong atau "Ambil langsung di studio"
  address: string;

  // Hasil hitung OSRM
  distanceKm: number;

  // Hasil calculateCourierFee(distanceKm)
  courierFee: number;
}

// =========================================
// PAYLOAD FINAL BOOKING
// =========================================

export interface BookingCompletePayload {
  productId: string | number;

  clientData: FormDataState;

  rentData: BookingStatePayload;

  delivery: DeliveryData;

  // Untuk upload bukti pembayaran DP / QRIS
  paymentProof: File | null;
}