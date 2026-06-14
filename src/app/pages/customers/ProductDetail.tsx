import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Camera } from "lucide-react";

import { Footer } from "../../components/Footer";
import { useProductDetail } from "../../components/hooks/UseProductDetail";
import { useAuth } from "../../components/hooks/UseAuth";

import { ProductBreadcrumb } from "../../components/detailproducts/ProductBreadcrumb";
import { ProductSpecs } from "../../components/detailproducts/ProductSpecs";
import { ProductRentalForm } from "../../components/detailproducts/ProductRentalForm";
import { ProductLoadingOrError } from "../../components/detailproducts/ProductLoadingOrError";
import { ProductDescription } from "../../components/detailproducts/ProductDescription";

export interface ProductSpecifications {
  sensor?: string;
  video?: string;
  output?: string;
  resolution?: string;
  iso?: string;
  lens?: string;
  battery?: string;
  [key: string]: string | undefined;
}

export interface ProductDetailData {
  id: number | string;
  name: string;
  brand?: string;
  category?: string;
  description?: string | null;
  price_per_day: number | string;
  price?: number | string;
  image_path?: string;
  image?: string;
  image_full_url?: string;
  status: string;
  specs?: ProductSpecifications;
  message?: string;
}

interface ProductHeroProps {
  name: string;
  pricePerDay: number;
  isAvailable: boolean;
  formatPrice: (price: number) => string;
}

function ProductHeroInfo({
  name,
  pricePerDay,
  isAvailable,
  formatPrice,
}: ProductHeroProps) {
  return (
    <div className="relative overflow-hidden border-[4px] border-[#2D1E17] bg-[#F8F1E7] shadow-[8px_8px_0_0_#2D1E17]">
      <div className="h-3 bg-primary border-b-[4px] border-[#2D1E17]" />

      <div className="absolute -right-8 -top-8 w-28 h-28 bg-secondary/30 border-[4px] border-[#2D1E17] rotate-45 pointer-events-none" />

      <div className="relative z-10 p-5 sm:p-7 space-y-6 select-none">
        <div className="flex items-center gap-3">
          <span
            className={`px-4 py-1.5 font-black text-[10px] italic border-2 rounded-none font-mono shadow-[3px_3px_0_0_#2D1E17] ${
              isAvailable
                ? "bg-secondary text-[#2D1E17] border-[#2D1E17]"
                : "bg-red-500 text-white border-[#2D1E17]"
            }`}
          >
            {isAvailable ? "STATUS: READY" : "STATUS: RENTED_OUT"}
          </span>
        </div>

        <div>
          <p className="text-primary text-[10px] font-black uppercase font-mono tracking-[0.35em] mb-3">
            SELECTED GEAR
          </p>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase italic tracking-tighter leading-none text-[#2D1E17] break-words">
            {name}
          </h1>
        </div>

        <div className="border-[3px] border-[#2D1E17] bg-white p-4 shadow-[4px_4px_0_0_#2D1E17]">
          <p className="text-secondary text-[10px] font-black uppercase font-mono tracking-widest mb-2">
            DAILY RATE
          </p>

          <div className="text-2xl sm:text-3xl font-black font-mono text-[#2D1E17]">
            IDR {formatPrice(pricePerDay)}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductImageFrame({
  image,
  name,
  brand,
  category,
}: {
  image: string;
  name: string;
  brand?: string;
  category?: string;
}) {
  return (
    <div className="relative overflow-hidden border-[4px] border-[#2D1E17] bg-[#F8F1E7] shadow-[8px_8px_0_0_#2D1E17]">
      <div className="h-3 bg-secondary border-b-[4px] border-[#2D1E17]" />

      <div className="p-3 sm:p-4">
        <div className="relative overflow-hidden border-[3px] border-[#2D1E17] bg-white shadow-[4px_4px_0_0_rgba(45,30,23,0.35)]">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full aspect-video object-cover"
            />
          ) : (
            <div className="w-full aspect-video flex flex-col items-center justify-center bg-muted text-sm font-black uppercase text-foreground/40">
              <Camera className="w-10 h-10 mb-2" />
              No Image
            </div>
          )}

          <div className="absolute left-3 top-3 px-3 py-1 bg-white border-2 border-[#2D1E17] shadow-[2px_2px_0_0_#2D1E17] font-black text-[10px] uppercase">
            {brand || "READYTOSHOT"}
          </div>

          <div className="absolute right-3 bottom-3 px-3 py-1 bg-primary text-white border-2 border-[#2D1E17] shadow-[2px_2px_0_0_#2D1E17] font-black text-[10px] uppercase">
            {category || "GEAR"}
          </div>
        </div>
      </div>

      <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-primary border-[3px] border-[#2D1E17] rotate-45" />
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error(
        "SISTEM_AUTH: Autentikasi diperlukan sebelum melakukan reservasi."
      );

      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const { product, isLoading } = useProductDetail(id) as {
    product: ProductDetailData | null;
    isLoading: boolean;
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [id]);

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date();

    tomorrow.setDate(today.getDate() + 1);

    const formatDate = (d: Date) => d.toISOString().split("T")[0];

    setStartDate(formatDate(today));
    setEndDate(formatDate(tomorrow));
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const diffDays = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );

      setDuration(diffDays > 0 ? diffDays : 1);
    }
  }, [startDate, endDate]);

  if (isLoading) {
    return <ProductLoadingOrError type="loading" />;
  }

  if (
    !product ||
    product.message === "Not Found" ||
    (!product.id && !product.name)
  ) {
    return <ProductLoadingOrError type="not_found" />;
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID").format(price);

  const unitPrice = Number(product.price_per_day || product.price || 0);

  const discountPercent = duration >= 5 ? 0.08 : 0;

  const normalTotalPrice = unitPrice * duration;

  const discountAmount = normalTotalPrice * discountPercent;

  const totalPrice = normalTotalPrice - discountAmount;

  const dpAmount = totalPrice * 0.3;

  const settlementAmount = totalPrice - dpAmount;

  const getDueDateHMinus1 = (dateStr: string) => {
    if (!dateStr) return "-";

    const dateObj = new Date(dateStr);

    dateObj.setDate(dateObj.getDate() - 1);

    return dateObj.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const dueDateText = getDueDateHMinus1(startDate);

  const imageBaseUrl =
    "http://localhost/db_readytoshot/config/assets/products/";

  const mainImage =
    product.image_full_url ||
    product.image ||
    (product.image_path ? `${imageBaseUrl}${product.image_path}` : "");

  const productStatus = String(product.status || "").toLowerCase();

  const isAvailable =
    productStatus === "available" ||
    productStatus === "ready" ||
    productStatus === "tersedia";

  const handleInitiateBooking = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Silakan login terlebih dahulu.");
      navigate("/login");
      return;
    }

    if (!product.id) {
      toast.error("ERROR: ID spesifikasi unit tidak valid.");
      return;
    }

    if (!isAvailable) {
      toast.warning(
        "SISTEM_LOCK: Unit kamera sedang aktif disewa klien lain."
      );
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      toast.warning(
        "INVALID_DATE: Batas akhir sewa tidak boleh mendahului tanggal mulai."
      );
      return;
    }

    navigate(`/booking/${product.id}`, {
      state: {
        duration,
        startDate,
        endDate,
        totalPrice,
        discountAmount,
        dpAmount,
        settlementAmount,
        dueDateText,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-4 selection:bg-secondary selection:text-background font-mono">
      <ProductBreadcrumb productName={product.name} />

      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-start">
          {/* LEFT */}
          <div className="space-y-8">
            <ProductImageFrame
              image={mainImage}
              name={product.name}
              brand={product.brand}
              category={product.category}
            />

            <ProductDescription description={product.description} />

            <ProductSpecs specs={product.specs} />

            <ProductHeroInfo
              name={product.name}
              pricePerDay={unitPrice}
              isAvailable={isAvailable}
              formatPrice={formatPrice}
            />
          </div>

          {/* RIGHT */}
          <div className="lg:sticky lg:top-8 space-y-8">
            <ProductRentalForm
              startDate={startDate}
              endDate={endDate}
              duration={duration}
              isAvailable={isAvailable}
              discountPercent={discountPercent}
              normalTotalPrice={normalTotalPrice}
              totalPrice={totalPrice}
              dpAmount={dpAmount}
              settlementAmount={settlementAmount}
              dueDateText={dueDateText}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />

            <div className="border-[4px] border-[#2D1E17] bg-[#F8F1E7] p-5 shadow-[7px_7px_0_0_#2D1E17] space-y-4">
              <p className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">
                READY TO SHOT SYSTEM v1.0
              </p>

              <button
                type="button"
                onClick={handleInitiateBooking}
                disabled={!isAvailable}
                className={`w-full block py-5 sm:py-6 font-black text-2xl sm:text-3xl border-[3px] border-[#2D1E17] transition-all text-center uppercase tracking-tight rounded-none ${
                  isAvailable
                    ? "bg-[#2D1E17] text-white hover:bg-secondary hover:text-[#2D1E17] shadow-[7px_7px_0_0_#000] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] cursor-pointer"
                    : "bg-muted text-muted-foreground border-foreground/30 shadow-none cursor-not-allowed opacity-50"
                }`}
              >
                {isAvailable ? "BOOKING SEKARANG" : "UNIT UNAVAILABLE"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}