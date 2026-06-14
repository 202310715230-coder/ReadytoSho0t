import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, Activity } from "lucide-react";
import { toast } from "sonner";

import { BookingProgressBar } from "../../components/booking/BookingProgressBar";
import { BookingInvoiceSidebar } from "../../components/booking/BookingInvoiceSidebar";
import { BookingStep1Date } from "../../components/booking/BookingStep1Date";
import { BookingStep2Client } from "../../components/booking/BookingStep2Client";
import { BookingStep3Delivery } from "../../components/booking/BookingStep3Delivery";
import { BookingStep4Payment } from "../../components/booking/BookingStep4Payment";

import {
  PAYMENT_INFO,
  formatPrice,
  formatDisplayDate,
} from "../../components/booking/bookingConstants";

import {
  BookingStatePayload,
  DeliveryMethod,
  FormDataState,
  ProductData,
} from "../../components/booking/BookingTypes";

import { useBookingProduct } from "../../components/hooks/useBookingProduct";
import { useBookingCalc } from "../../components/hooks/useBookingCalc";
import { useAuth } from "../../components/hooks/UseAuth";
import { useProfile } from "../../components/hooks/UseProfile";

const BACKEND_BASE_URL = "http://localhost/db_readytoshot";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeWhatsapp(value: string) {
  let cleanValue = String(value || "").replace(/\D/g, "");

  if (cleanValue.startsWith("08")) {
    cleanValue = `62${cleanValue.slice(1)}`;
  }

  if (cleanValue.startsWith("8")) {
    cleanValue = `62${cleanValue}`;
  }

  return cleanValue.slice(0, 15);
}

function appendFormData(
  formData: FormData,
  key: string,
  value: string | number | null | undefined
) {
  formData.append(key, String(value ?? ""));
}

function toNumber(value: unknown): number {
  const parsed = Number(value);

  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
    return 0;
  }

  return parsed;
}

async function readJsonResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    console.error("Response bukan JSON:", text);
    throw new Error("Response server bukan JSON. Cek save_booking.php");
  }
}

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const incomingData = location.state as BookingStatePayload | null;

  const { user: authUser, isAuthenticated, isInitialized } = useAuth();
  const { user: profileUser, isLoading: isProfileLoading } = useProfile();
  const { product, isLoading } = useBookingProduct(id);

  const bookingProduct = product as ProductData | null;

  const [currentStep, setCurrentStep] = useState(1);

  const [startDate, setStartDate] = useState<string>(
    incomingData?.startDate || ""
  );

  const [endDate, setEndDate] = useState<string>(
    incomingData?.endDate || ""
  );

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDistanceKm, setDeliveryDistanceKm] = useState(0);
  const [courierFee, setCourierFee] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormDataState>({
    fullName: "",
    email: "",
    whatsapp: "",
  });

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      toast.error("AKSES DITOLAK: Silakan login terlebih dahulu.");
      navigate("/login", { replace: true });
      return;
    }

    if (!incomingData) {
      toast.warning("Silakan pilih tanggal rental terlebih dahulu.");
      navigate(`/product/${id}`, { replace: true });
    }
  }, [incomingData, id, navigate, isAuthenticated, isInitialized]);

  useEffect(() => {
    const sourceUser = profileUser || authUser;

    if (!sourceUser) return;

    const fullNameValue =
      "full_name" in sourceUser && sourceUser.full_name
        ? sourceUser.full_name
        : sourceUser.username;

    setFormData((prev) => ({
      fullName: prev.fullName || fullNameValue || "",
      email: prev.email || sourceUser.email || "",
      whatsapp:
        prev.whatsapp ||
        normalizeWhatsapp(sourceUser.whatsapp || sourceUser.phone || ""),
    }));
  }, [profileUser, authUser]);

  const unitPrice = toNumber(
    bookingProduct?.price_per_day ??
      bookingProduct?.price ??
      incomingData?.rentalPrice ??
      0
  );

  const {
    calculatedDuration,
    discountPercent,
    discountAmount,
    subtotal,
    courierFee: finalCourierFee,
    totalPrice,
    dpAmount,
    settlementAmount,
  } = useBookingCalc({
    unitPrice,
    startDate,
    endDate,
    deliveryMethod,
    courierFee,
    fallbackDuration: incomingData?.duration,
  });

  const normalTotalPrice = toNumber(unitPrice * calculatedDuration);

  const isStep1Valid =
    startDate !== "" &&
    endDate !== "" &&
    new Date(endDate) > new Date(startDate);

  const cleanFullName = formData.fullName.trim();
  const cleanEmail = formData.email.trim().toLowerCase();
  const cleanWhatsapp = normalizeWhatsapp(formData.whatsapp);

  const isStep2Valid =
    cleanFullName.length >= 3 &&
    isValidEmail(cleanEmail) &&
    cleanWhatsapp.startsWith("62") &&
    cleanWhatsapp.length >= 10 &&
    cleanWhatsapp.length <= 15;

  const isStep3Valid =
    deliveryMethod === "cod" ||
    (deliveryMethod === "courier" &&
      deliveryAddress.trim() !== "" &&
      deliveryDistanceKm > 0 &&
      courierFee > 0);

  const validateBeforeSubmit = (paymentImage: File) => {
    const activeUser = profileUser || authUser;

    if (!activeUser?.id) {
      toast.error("Session user tidak ditemukan. Silakan login ulang.");
      navigate("/login", { replace: true });
      return false;
    }

    if (!bookingProduct || !id) {
      toast.error("Produk tidak ditemukan.");
      return false;
    }

    if (unitPrice <= 0) {
      toast.error("Harga produk tidak valid.");
      return false;
    }

    if (!isStep1Valid) {
      toast.error("Tanggal rental belum valid.");
      setCurrentStep(1);
      return false;
    }

    if (!isStep2Valid) {
      toast.error("Data client belum valid.");
      setCurrentStep(2);
      return false;
    }

    if (!isStep3Valid) {
      toast.error("Metode pengiriman belum valid.");
      setCurrentStep(3);
      return false;
    }

    if (!paymentImage) {
      toast.error("Bukti pembayaran wajib diupload.");
      setCurrentStep(4);
      return false;
    }

    return true;
  };

  const handleOrderSubmission = async (paymentImage: File) => {
    if (isSubmitting) return;

    if (!validateBeforeSubmit(paymentImage)) return;

    const activeUser = profileUser || authUser;

    const deliveryDetails =
      deliveryMethod === "courier"
        ? deliveryAddress
        : "Studio (Ambil Sendiri)";

    setIsSubmitting(true);

    try {
      const payload = new FormData();

      appendFormData(payload, "user_id", activeUser?.id);
      appendFormData(payload, "product_id", id);

      appendFormData(payload, "full_name", cleanFullName);
      appendFormData(payload, "email", cleanEmail);
      appendFormData(payload, "whatsapp", cleanWhatsapp);

      appendFormData(payload, "start_date", startDate);
      appendFormData(payload, "end_date", endDate);
      appendFormData(payload, "duration", calculatedDuration);

      appendFormData(payload, "unit_price", unitPrice);
      appendFormData(payload, "normal_total_price", normalTotalPrice);
      appendFormData(payload, "discount_percent", discountPercent);
      appendFormData(payload, "discount_amount", discountAmount);
      appendFormData(payload, "subtotal", subtotal);

      appendFormData(payload, "delivery_method", deliveryMethod || "");
      appendFormData(payload, "delivery_details", deliveryDetails);

      appendFormData(
        payload,
        "delivery_distance_km",
        deliveryMethod === "courier" ? deliveryDistanceKm : 0
      );

      appendFormData(
        payload,
        "courier_fee",
        deliveryMethod === "courier" ? finalCourierFee : 0
      );

      appendFormData(payload, "total_price", totalPrice);
      appendFormData(payload, "dp_amount", dpAmount);
      appendFormData(payload, "settlement_amount", settlementAmount);

      payload.append("payment_proof", paymentImage);

      const response = await fetch(`${BACKEND_BASE_URL}/save_booking.php`, {
        method: "POST",
        credentials: "include",
        body: payload,
      });

      const result = await readJsonResponse(response);

      if (!response.ok || result?.status !== "success") {
        toast.error(result?.message || "Gagal menyimpan booking");

        if (result?.debug) {
          console.error("Save booking debug:", result.debug);
        }

        return;
      }

      toast.success("Booking berhasil dibuat!");

      const deliveryText =
        deliveryMethod === "courier"
          ? `GoSend / Gojek ke: ${deliveryAddress}\n• Jarak: ${deliveryDistanceKm} KM\n• Estimasi GoSend: IDR ${formatPrice(finalCourierFee)}`
          : "COD / Ambil sendiri di studio";

      const msg = encodeURIComponent(
        `Halo Admin ReadyToShot! 📸\n\n` +
          `Saya ingin konfirmasi booking:\n` +
          `• Produk: ${bookingProduct?.name || "-"}\n` +
          `• Nama: ${cleanFullName}\n` +
          `• WhatsApp: ${cleanWhatsapp}\n` +
          `• Tanggal: ${formatDisplayDate(startDate)} → ${formatDisplayDate(
            endDate
          )}\n` +
          `• Durasi: ${calculatedDuration} hari\n` +
          `• Pengiriman: ${deliveryText}\n` +
          `• Total: IDR ${formatPrice(totalPrice)}\n` +
          `• DP: IDR ${formatPrice(dpAmount)}`
      );

      window.open(
        `https://wa.me/${PAYMENT_INFO.whatsappNumber}?text=${msg}`,
        "_blank"
      );

      navigate("/profile", { replace: true });
    } catch (error) {
      console.error("Submit booking error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Gagal terhubung ke server.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isInitialized || isLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-foreground border-t-secondary animate-spin rounded-none" />

        <span className="mt-4 text-xs font-black tracking-widest text-secondary animate-pulse">
          LOADING BOOKING DATA...
        </span>
      </div>
    );
  }

  if (!bookingProduct) return null;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden pt-0 font-mono">
      <section className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8 border-b-[3px] border-foreground bg-muted/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Zap className="w-48 h-48" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 mb-2 font-black uppercase text-[9px] sm:text-[10px] tracking-widest border-2 border-foreground px-2 sm:px-3 py-1 sm:py-1.5 hover:bg-secondary transition-all rounded-none bg-background"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              BACK
            </button>

            <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] font-black tracking-[0.4em] uppercase">
              <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse text-secondary" />
              BOOKING SYSTEM
            </div>

            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none">
              ORDER{" "}
              <span className="text-secondary">
                {bookingProduct.name || "PRODUCT"}
              </span>
            </h1>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <BookingProgressBar currentStep={currentStep} />

          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <BookingStep1Date
                  startDate={startDate}
                  endDate={endDate}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  isValid={isStep1Valid}
                  onNext={() => setCurrentStep(2)}
                />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <BookingStep2Client
                  formData={formData}
                  setFormData={setFormData}
                  isValid={isStep2Valid}
                  onBack={() => setCurrentStep(1)}
                  onNext={() => setCurrentStep(3)}
                />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <BookingStep3Delivery
                  deliveryMethod={deliveryMethod}
                  setDeliveryMethod={setDeliveryMethod}
                  deliveryAddress={deliveryAddress}
                  setDeliveryAddress={setDeliveryAddress}
                  deliveryDistanceKm={deliveryDistanceKm}
                  setDeliveryDistanceKm={setDeliveryDistanceKm}
                  courierFee={courierFee}
                  setCourierFee={setCourierFee}
                  isValid={isStep3Valid}
                  onBack={() => setCurrentStep(2)}
                  onNext={() => setCurrentStep(4)}
                />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <BookingStep4Payment
                  dpAmount={dpAmount}
                  onBack={() => setCurrentStep(3)}
                  onSubmit={handleOrderSubmission}
                  renterWhatsapp={cleanWhatsapp}
                />

                {isSubmitting && (
                  <div className="mt-4 border-2 border-foreground bg-secondary/20 p-3 text-xs font-black uppercase">
                    Sedang menyimpan booking, mohon tunggu...
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <BookingInvoiceSidebar
          product={bookingProduct}
          calculatedDuration={calculatedDuration}
          discountPercent={discountPercent}
          discountAmount={discountAmount}
          deliveryMethod={deliveryMethod}
          courierFee={finalCourierFee}
          totalPrice={totalPrice}
          dpAmount={dpAmount}
          settlementAmount={settlementAmount}
        />
      </div>
    </div>
  );
}