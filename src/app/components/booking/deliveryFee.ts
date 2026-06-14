export const COURIER_MIN_FEE = 15500;

// Simulasi GoSend Instant Jabodetabek
export const COURIER_FIRST_DISTANCE_KM = 5;
export const COURIER_FIRST_DISTANCE_FEE = 15500;
export const COURIER_PRICE_PER_KM = 2000;

// Untuk jarak jauh, tarif dibuat sedikit lebih tinggi
export const COURIER_LONG_DISTANCE_START_KM = 20;
export const COURIER_LONG_DISTANCE_PRICE_PER_KM = 2897;

export function calculateCourierFee(distanceKm: number) {
  if (!distanceKm || distanceKm <= 0) return 0;

  const distance = Math.ceil(Number(distanceKm));

  if (distance <= COURIER_FIRST_DISTANCE_KM) {
    return COURIER_FIRST_DISTANCE_FEE;
  }

  if (distance <= COURIER_LONG_DISTANCE_START_KM) {
    const extraDistance = distance - COURIER_FIRST_DISTANCE_KM;

    return COURIER_FIRST_DISTANCE_FEE + extraDistance * COURIER_PRICE_PER_KM;
  }

  const normalDistance =
    COURIER_LONG_DISTANCE_START_KM - COURIER_FIRST_DISTANCE_KM;

  const longDistance = distance - COURIER_LONG_DISTANCE_START_KM;

  const fee =
    COURIER_FIRST_DISTANCE_FEE +
    normalDistance * COURIER_PRICE_PER_KM +
    longDistance * COURIER_LONG_DISTANCE_PRICE_PER_KM;

  return Math.max(COURIER_MIN_FEE, Math.ceil(fee));
}