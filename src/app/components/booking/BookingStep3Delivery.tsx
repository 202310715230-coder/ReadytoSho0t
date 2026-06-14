import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Truck,
  ChevronRight,
  Loader2,
  MapPin,
  Phone,
  Star,
  Home,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { DeliveryMethod } from "./BookingTypes";
import {
  calculateCourierFee,
  COURIER_FIRST_DISTANCE_KM,
  COURIER_FIRST_DISTANCE_FEE,
  COURIER_PRICE_PER_KM,
  COURIER_LONG_DISTANCE_START_KM,
  COURIER_LONG_DISTANCE_PRICE_PER_KM,
} from "./deliveryFee";

import { useAddresses, UserAddress } from "../hooks/UseAddresses";

interface Step3Props {
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (m: DeliveryMethod) => void;

  deliveryAddress: string;
  setDeliveryAddress: (a: string) => void;

  deliveryDistanceKm: number;
  setDeliveryDistanceKm: (distance: number) => void;

  courierFee: number;
  setCourierFee: (fee: number) => void;

  isValid: boolean;
  onBack: () => void;
  onNext: () => void;
}

type LatLng = [number, number];

const STUDIO_LOCATION: LatLng = [-6.2919132, 107.0253265];
const OSRM_TIMEOUT_MS = 10000;

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID").format(Number(price || 0));
}

function safeNumber(value: unknown): number {
  const parsed = Number(value);

  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
    return 0;
  }

  return parsed;
}

function hasValidCoordinate(address: UserAddress) {
  const lat = safeNumber(address.latitude);
  const lng = safeNumber(address.longitude);

  return lat !== 0 && lng !== 0;
}

function getFullAddress(address: UserAddress) {
  return [
    address.street_address,
    address.detail_address,
    address.province_city_district,
  ]
    .filter((item) => String(item || "").trim() !== "")
    .join(", ");
}

async function fetchWithTimeout(url: string, timeoutMs = OSRM_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    return response;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export function BookingStep3Delivery({
  deliveryMethod,
  setDeliveryMethod,
  deliveryAddress,
  setDeliveryAddress,
  deliveryDistanceKm,
  setDeliveryDistanceKm,
  courierFee,
  setCourierFee,
  isValid,
  onBack,
  onNext,
}: Step3Props) {
  const { addresses, isLoadingAddresses, errorAddress } = useAddresses();

  const [selectedAddress, setSelectedAddress] =
    useState<UserAddress | null>(null);

  const [isCalculating, setIsCalculating] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const requestIdRef = useRef(0);

  const mainAddress = useMemo(() => {
    return addresses.find((address) => Boolean(address.is_main)) || null;
  }, [addresses]);

  const resetCourierData = useCallback(() => {
    requestIdRef.current += 1;

    setSelectedAddress(null);
    setDeliveryAddress("");
    setDeliveryDistanceKm(0);
    setCourierFee(0);
    setMapError(null);
    setIsCalculating(false);
  }, [setDeliveryAddress, setDeliveryDistanceKm, setCourierFee]);

  const calculateRouteFromAddress = useCallback(
    async (address: UserAddress) => {
      const currentRequestId = requestIdRef.current + 1;
      requestIdRef.current = currentRequestId;

      const lat = safeNumber(address.latitude);
      const lng = safeNumber(address.longitude);

      if (!lat || !lng) {
        setDeliveryDistanceKm(0);
        setCourierFee(0);
        setMapError(
          "Alamat ini belum memiliki titik lokasi map. Silakan edit alamat di halaman Profile."
        );
        return;
      }

      setIsCalculating(true);
      setMapError(null);

      try {
        const [studioLat, studioLng] = STUDIO_LOCATION;

        const osrmUrl =
          `https://router.project-osrm.org/route/v1/driving/` +
          `${studioLng},${studioLat};${lng},${lat}` +
          `?overview=false`;

        const response = await fetchWithTimeout(osrmUrl);

        if (!response.ok) {
          throw new Error(`OSRM error: ${response.status}`);
        }

        const data = await response.json();
        const route = data?.routes?.[0];

        if (!route || typeof route.distance !== "number") {
          throw new Error("Rute tidak ditemukan");
        }

        if (requestIdRef.current !== currentRequestId) return;

        const distanceKm = route.distance / 1000;
        const roundedDistance = Math.ceil(distanceKm * 10) / 10;
        const fee = calculateCourierFee(roundedDistance);

        setDeliveryDistanceKm(roundedDistance);
        setCourierFee(fee);
        setMapError(null);
      } catch (error) {
        if (requestIdRef.current !== currentRequestId) return;

        console.error("OSRM route error:", error);

        setDeliveryDistanceKm(0);
        setCourierFee(0);
        setMapError(
          "Gagal menghitung estimasi GoSend. Pastikan alamat masih dalam area yang bisa dijangkau."
        );
      } finally {
        if (requestIdRef.current === currentRequestId) {
          setIsCalculating(false);
        }
      }
    },
    [setCourierFee, setDeliveryDistanceKm]
  );

  const handleChooseAddress = useCallback(
    async (address: UserAddress) => {
      const fullAddress = getFullAddress(address);

      setSelectedAddress(address);
      setDeliveryAddress(fullAddress);
      setDeliveryDistanceKm(0);
      setCourierFee(0);
      setMapError(null);

      if (!fullAddress.trim()) {
        setMapError(
          "Alamat ini belum lengkap. Silakan edit alamat di halaman Profile."
        );
        return;
      }

      await calculateRouteFromAddress(address);
    },
    [
      calculateRouteFromAddress,
      setCourierFee,
      setDeliveryAddress,
      setDeliveryDistanceKm,
    ]
  );

  useEffect(() => {
    if (deliveryMethod !== "courier") return;
    if (isLoadingAddresses) return;
    if (addresses.length === 0) return;
    if (selectedAddress) return;

    const defaultAddress = mainAddress || addresses[0];

    void handleChooseAddress(defaultAddress);
  }, [
    deliveryMethod,
    isLoadingAddresses,
    addresses,
    mainAddress,
    selectedAddress,
    handleChooseAddress,
  ]);

  const handleSelectCod = () => {
    setDeliveryMethod("cod");
    resetCourierData();
  };

  const handleSelectCourier = () => {
    setDeliveryMethod("courier");
  };

  const handleGoToProfileAddress = () => {
    window.location.href = "/profile";
  };

  const finalValid =
    deliveryMethod === "cod" ||
    (deliveryMethod === "courier" &&
      selectedAddress !== null &&
      deliveryAddress.trim() !== "" &&
      deliveryDistanceKm > 0 &&
      courierFee > 0 &&
      !mapError);

  return (
    <div className="p-6 border-[3px] border-foreground bg-muted/20 rounded-none">
      <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3 tracking-tighter">
        <Truck className="w-6 h-6 text-secondary" />
        DELIVERY METHOD
      </h2>

      <div className="grid grid-cols-1 gap-4 mb-6">
        {/* COD */}
        <button
          type="button"
          onClick={handleSelectCod}
          className={`w-full text-left p-5 border-[3px] transition-all rounded-none ${
            deliveryMethod === "cod"
              ? "border-secondary bg-secondary/10 shadow-[5px_5px_0_0_#000]"
              : "border-foreground bg-white shadow-[5px_5px_0_0_#000]"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-6 h-6 border-2 border-foreground flex items-center justify-center ${
                deliveryMethod === "cod" ? "bg-secondary" : "bg-white"
              }`}
            >
              {deliveryMethod === "cod" && (
                <div className="w-3 h-3 bg-foreground" />
              )}
            </div>

            <div>
              <h3 className="font-black uppercase italic text-lg">
                COD — Ambil Langsung
              </h3>

              <p className="text-xs font-mono uppercase text-foreground/60 mt-2">
                Ambil sendiri di studio kami. Gratis ongkir.
              </p>
            </div>
          </div>
        </button>

        {/* GOSEND */}
        <button
          type="button"
          onClick={handleSelectCourier}
          className={`w-full text-left p-5 border-[3px] transition-all rounded-none ${
            deliveryMethod === "courier"
              ? "border-secondary bg-secondary/10 shadow-[5px_5px_0_0_#000]"
              : "border-foreground bg-white shadow-[5px_5px_0_0_#000]"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className={`w-6 h-6 border-2 border-foreground flex items-center justify-center ${
                  deliveryMethod === "courier" ? "bg-secondary" : "bg-white"
                }`}
              >
                {deliveryMethod === "courier" && (
                  <div className="w-3 h-3 bg-foreground" />
                )}
              </div>

              <div>
                <h3 className="font-black uppercase italic text-lg">
                  GoSend / Gojek — Diantar ke Lokasi
                </h3>

                <p className="text-xs font-mono uppercase text-foreground/60 mt-2">
                  Pengiriman menggunakan layanan GoSend/Gojek. Ongkir adalah
                  estimasi berdasarkan jarak alamat.
                </p>
              </div>
            </div>

            {deliveryMethod === "courier" && courierFee > 0 && (
              <div className="w-fit px-3 py-2 bg-secondary border-2 border-foreground font-black text-xs shadow-[2px_2px_0_0_#000]">
                +IDR {formatPrice(courierFee)}
              </div>
            )}
          </div>
        </button>

        {/* FORM GOSEND */}
        <AnimatePresence>
          {deliveryMethod === "courier" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 border-[3px] border-secondary bg-white p-5 shadow-[5px_5px_0_0_#000]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-xs font-black uppercase mb-2">
                      <MapPin className="w-4 h-4 text-secondary" />
                      Pilih Alamat Pengiriman
                    </label>

                    <p className="text-[10px] font-mono uppercase text-foreground/50">
                      Alamat diambil dari halaman Profile &gt; Alamat Saya.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoToProfileAddress}
                    className="w-fit px-5 py-3 border-2 border-foreground bg-secondary font-black uppercase text-xs shadow-[3px_3px_0_0_#000]"
                  >
                    Kelola Alamat
                  </button>
                </div>

                {errorAddress && (
                  <div className="border-2 border-red-500 bg-red-100 p-3 text-xs font-black uppercase text-red-700">
                    {errorAddress}
                  </div>
                )}

                {isLoadingAddresses ? (
                  <div className="flex items-center justify-center gap-2 py-10 border-2 border-dashed border-foreground/30 bg-muted/40">
                    <Loader2 className="w-5 h-5 animate-spin" />

                    <span className="text-xs font-black uppercase">
                      Memuat alamat...
                    </span>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="border-2 border-dashed border-foreground/30 bg-muted/40 p-8 text-center">
                    <Home className="w-10 h-10 mx-auto mb-3 opacity-40" />

                    <p className="font-black uppercase text-sm">
                      Belum ada alamat tersimpan
                    </p>

                    <p className="text-xs font-mono text-foreground/60 mt-2 uppercase">
                      Tambahkan alamat terlebih dahulu di halaman Profile.
                    </p>

                    <button
                      type="button"
                      onClick={handleGoToProfileAddress}
                      className="mt-5 px-5 py-3 bg-secondary border-2 border-foreground font-black uppercase text-xs shadow-[3px_3px_0_0_#000]"
                    >
                      Tambah Alamat
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => {
                      const active = selectedAddress?.id === address.id;
                      const coordinateReady = hasValidCoordinate(address);

                      return (
                        <button
                          key={address.id}
                          type="button"
                          onClick={() => void handleChooseAddress(address)}
                          className={`w-full text-left border-2 p-4 transition-all ${
                            active
                              ? "border-foreground bg-secondary/10 shadow-[4px_4px_0_0_#000]"
                              : "border-foreground/25 bg-white hover:border-foreground"
                          }`}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-black uppercase text-foreground">
                                  {address.receiver_name || "Nama belum diisi"}
                                </h4>

                                <span className="inline-flex items-center gap-1 text-xs font-bold text-foreground/70">
                                  <Phone className="w-3.5 h-3.5" />
                                  {address.phone || "-"}
                                </span>

                                {address.is_main && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-black uppercase border border-foreground bg-secondary">
                                    <Star className="w-3 h-3 fill-current" />
                                    Utama
                                  </span>
                                )}

                                <span className="px-2 py-1 text-[10px] font-black uppercase border border-secondary text-secondary">
                                  {address.label || "Alamat"}
                                </span>
                              </div>

                              <p className="mt-2 text-sm font-medium text-foreground/75 leading-relaxed">
                                {address.street_address || "Alamat belum diisi"}
                                {address.detail_address
                                  ? `, ${address.detail_address}`
                                  : ""}
                              </p>

                              <p className="mt-1 text-xs font-black uppercase text-foreground/60">
                                {address.province_city_district ||
                                  "Area belum diisi"}
                              </p>

                              {coordinateReady ? (
                                <p className="mt-2 text-[10px] font-black uppercase text-foreground/45">
                                  Koordinat: {address.latitude},{" "}
                                  {address.longitude}
                                </p>
                              ) : (
                                <p className="mt-2 inline-flex items-center gap-1 text-[10px] font-black uppercase text-red-600">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  Titik map belum tersedia
                                </p>
                              )}
                            </div>

                            <div className="flex-shrink-0">
                              {active ? (
                                <span className="inline-flex px-3 py-2 text-xs font-black uppercase bg-foreground text-white">
                                  Dipilih
                                </span>
                              ) : (
                                <span className="inline-flex px-3 py-2 text-xs font-black uppercase border border-foreground/30">
                                  Pilih
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {mapError && (
                  <div className="border-2 border-red-500 bg-red-100 p-3 text-xs font-black uppercase text-red-700">
                    {mapError}
                  </div>
                )}

                <div className="bg-muted p-4 border-l-4 border-secondary font-mono text-xs font-black uppercase space-y-2">
                  <div className="flex justify-between gap-4">
                    <span>Alamat</span>
                    <span className="text-right normal-case">
                      {deliveryAddress || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span>Jarak OSRM</span>
                    <span>
                      {deliveryDistanceKm > 0
                        ? `${deliveryDistanceKm} KM`
                        : "-"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span>Estimasi GoSend {COURIER_FIRST_DISTANCE_KM} KM Pertama</span>
                    <span>
                      IDR {formatPrice(COURIER_FIRST_DISTANCE_FEE)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span>
                      Estimasi {COURIER_FIRST_DISTANCE_KM + 1}-
                      {COURIER_LONG_DISTANCE_START_KM} KM
                    </span>
                    <span>IDR {formatPrice(COURIER_PRICE_PER_KM)} / KM</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span>Estimasi &gt; {COURIER_LONG_DISTANCE_START_KM} KM</span>
                    <span>
                      IDR {formatPrice(COURIER_LONG_DISTANCE_PRICE_PER_KM)} / KM
                    </span>
                  </div>

                  <div className="text-[10px] font-bold text-foreground/50 normal-case leading-relaxed">
                    Estimasi ini bukan tarif realtime resmi dari aplikasi Gojek.
                    Tarif asli dapat berubah mengikuti lokasi, waktu, promo,
                    dan kondisi layanan GoSend.
                  </div>

                  <div className="flex justify-between gap-4 border-t border-dashed border-foreground/30 pt-2 text-secondary">
                    <span>Total Estimasi GoSend</span>
                    <span>
                      {isCalculating
                        ? "Menghitung..."
                        : `IDR ${formatPrice(courierFee)}`}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* NAVIGASI */}
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-4 border-[3px] border-foreground bg-white font-black uppercase italic hover:bg-muted shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all rounded-none text-sm cursor-pointer"
        >
          BACK
        </button>

        <button
          type="button"
          disabled={!finalValid || isCalculating || !isValid}
          onClick={onNext}
          className={`flex-1 py-4 font-black uppercase italic text-xl border-[3px] border-foreground shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all rounded-none ${
            finalValid && !isCalculating && isValid
              ? "bg-secondary text-foreground cursor-pointer"
              : "bg-muted text-foreground/30 cursor-not-allowed"
          }`}
        >
          {isCalculating ? (
            <>
              MENGHITUNG
              <Loader2 className="inline ml-2 w-5 h-5 animate-spin" />
            </>
          ) : (
            <>
              NEXT STEP
              <ChevronRight className="inline ml-1 w-6 h-6" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}