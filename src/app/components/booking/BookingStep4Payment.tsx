"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import {
  QrCode,
  Copy,
  Check,
  CheckCircle,
  ArrowLeft,
  AlertTriangle,
  RefreshCw,
  Upload,
  ImageIcon,
  X,
  Loader2,
} from "lucide-react";

import { PAYMENT_INFO } from "./bookingConstants";

interface Step4Props {
  dpAmount: number;
  onBack: () => void;
  onSubmit: (imageFile: File) => Promise<void> | void;
  renterWhatsapp: string;
}

interface PendingInvoiceData {
  id: number | string;
  total_price: number | string;
  dp_amount?: number | string;
  settlement_amount?: number | string;
  camera_brand?: string;
  camera_name?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
}

interface PendingInvoiceResponse {
  status?: string;
  message?: string;
  data?: PendingInvoiceData;
}

const BACKEND_BASE_URL = "http://localhost/db_readytoshot";
const CHECK_TIMEOUT_MS = 10000;

const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

function formatPrice(price: number | string | null | undefined) {
  const parsed = Number(price || 0);

  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
    return "0";
  }

  return new Intl.NumberFormat("id-ID").format(parsed);
}

function isValidImageFile(file: File) {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  return allowedTypes.includes(file.type);
}

async function fetchWithTimeout(url: string, timeoutMs = CHECK_TIMEOUT_MS) {
  const controller = new AbortController();

  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    return response;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export function BookingStep4Payment({
  dpAmount,
  onBack,
  onSubmit,
  renterWhatsapp,
}: Step4Props) {
  const [copied, setCopied] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [pendingData, setPendingData] = useState<PendingInvoiceData | null>(
    null
  );

  const [checking, setChecking] = useState(true);
  const [checkError, setCheckError] = useState<string | null>(null);

  const [paymentImage, setPaymentImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const revokePreviewUrl = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  }, []);

  const checkPendingInvoice = useCallback(async () => {
    const cleanWhatsapp = renterWhatsapp.trim();

    if (!cleanWhatsapp) {
      setChecking(false);
      setIsLocked(false);
      setPendingData(null);
      setCheckError(null);
      return;
    }

    setChecking(true);
    setCheckError(null);

    try {
      const url = `${BACKEND_BASE_URL}/get_or_create_qris.php?whatsapp=${encodeURIComponent(
        cleanWhatsapp
      )}`;

      const response = await fetchWithTimeout(url);

      let result: PendingInvoiceResponse | null = null;

      try {
        result = (await response.json()) as PendingInvoiceResponse;
      } catch {
        result = null;
      }

      if (response.status === 401) {
        setIsLocked(false);
        setPendingData(null);
        setCheckError("Session login tidak terbaca. Silakan login ulang.");
        return;
      }

      if (!response.ok) {
        throw new Error(result?.message || `HTTP error ${response.status}`);
      }

      if (!result || typeof result !== "object") {
        throw new Error("Format response backend tidak valid.");
      }

      if (result.status === "pending_exists" && result.data) {
        setIsLocked(true);
        setPendingData(result.data);
        return;
      }

      setIsLocked(false);
      setPendingData(null);
    } catch (error) {
      console.error("Gagal memeriksa status invoice pending:", error);

      setIsLocked(false);
      setPendingData(null);
      setCheckError(
        error instanceof Error
          ? error.message
          : "Gagal memeriksa invoice pending. Cek koneksi backend atau coba refresh."
      );
    } finally {
      setChecking(false);
    }
  }, [renterWhatsapp]);

  useEffect(() => {
    void checkPendingInvoice();
  }, [checkPendingInvoice]);

  useEffect(() => {
    return () => {
      revokePreviewUrl();
    };
  }, [revokePreviewUrl]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Gagal copy rekening:", error);
      alert("Gagal menyalin nomor rekening.");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!isValidImageFile(file)) {
      alert("Format file harus JPG, JPEG, PNG, atau WEBP.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      alert(`Ukuran gambar terlalu besar. Maksimal ${MAX_IMAGE_SIZE_MB}MB.`);
      e.target.value = "";
      return;
    }

    revokePreviewUrl();

    const previewUrl = URL.createObjectURL(file);

    previewUrlRef.current = previewUrl;
    setPaymentImage(file);
    setImagePreview(previewUrl);
  };

  const handleRemoveImage = () => {
    setPaymentImage(null);
    setImagePreview(null);
    revokePreviewUrl();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConfirmSubmit = async () => {
    if (!paymentImage) {
      alert("Silakan unggah foto bukti transfer terlebih dahulu.");
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit(paymentImage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className="p-12 border-[3px] border-foreground bg-muted/20 text-center font-mono font-black text-foreground">
        <div className="flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          <p>VERIFYING_BILLING_INTEGRITY...</p>
        </div>
      </div>
    );
  }

  if (isLocked && pendingData) {
    return (
      <div className="p-6 border-[3px] border-black bg-amber-50 rounded-none space-y-6 text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-mono">
        <div className="flex items-center gap-3 bg-red-600 text-white p-3 border-2 border-black uppercase font-black italic shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <AlertTriangle className="w-6 h-6 animate-bounce" />
          Akses Transaksi Terkunci!
        </div>

        <p className="text-xs font-bold uppercase leading-relaxed text-gray-700">
          Nomor WhatsApp{" "}
          <span className="underline font-black text-black">
            {renterWhatsapp}
          </span>{" "}
          memiliki transaksi aktif berstatus{" "}
          <span className="bg-amber-300 px-1 border border-black font-black text-black">
            {pendingData.status || "Menunggu Verifikasi"}
          </span>
          . Selesaikan transaksi sebelumnya sebelum menyewa kembali.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col items-center justify-center p-2 border-r-0 md:border-r-2 border-dashed border-gray-300">
            <span className="text-[9px] font-black uppercase text-gray-400 mb-2 tracking-widest">
              PINDAI QRIS MERCHANT STUDIO
            </span>

            <img
              src={PAYMENT_INFO.qrisImageUrl}
              alt="QRIS ReadyToShot"
              className="w-40 h-auto object-contain border border-gray-200"
            />

            <span className="text-xs font-black text-red-700 mt-2 bg-red-50 border border-red-200 px-2 py-0.5">
              TOTAL: IDR {formatPrice(pendingData.total_price)}
            </span>

            {pendingData.dp_amount && (
              <span className="text-xs font-black text-blue-700 mt-2 bg-blue-50 border border-blue-200 px-2 py-0.5">
                DP: IDR {formatPrice(pendingData.dp_amount)}
              </span>
            )}
          </div>

          <div className="text-xs space-y-2 flex flex-col justify-center text-gray-900">
            <p>
              <strong>ID ORDER:</strong> #{pendingData.id}
            </p>

            <p>
              <strong>ALAT:</strong> {pendingData.camera_brand || "-"}{" "}
              {pendingData.camera_name || ""}
            </p>

            <p>
              <strong>PERIODE:</strong> {pendingData.start_date || "-"} s/d{" "}
              {pendingData.end_date || "-"}
            </p>

            <p>
              <strong>STATUS:</strong>{" "}
              <span className="text-amber-600 font-black uppercase bg-amber-100 px-1 border border-amber-300">
                {pendingData.status || "pending"}
              </span>
            </p>
          </div>
        </div>

        {checkError && (
          <div className="border-2 border-red-500 bg-red-100 p-3 text-xs font-black uppercase text-red-700">
            {checkError}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => void checkPendingInvoice()}
            className="flex-1 py-3 bg-black text-white font-black uppercase tracking-wider text-xs border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            REFRESH STATUS
          </button>

          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-white border-2 border-black font-black uppercase tracking-wider text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 cursor-pointer text-center"
          >
            KEMBALI
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border-[3px] border-foreground bg-muted/20 rounded-none space-y-6 text-foreground">
      <h2 className="text-2xl font-black uppercase italic flex items-center gap-3 tracking-tighter">
        <QrCode className="w-6 h-6 text-secondary" />
        PAYMENT QRIS
      </h2>

      {checkError && (
        <div className="border-2 border-red-500 bg-red-100 p-3 text-xs font-black uppercase text-red-700">
          {checkError}
        </div>
      )}

      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground border-l-4 border-secondary pl-4 space-y-1">
        <p>1. Scan QR di bawah atau transfer manual ke rekening</p>
        <p>
          2. Bayar DP minimal{" "}
          <span className="text-secondary font-black">
            IDR {formatPrice(dpAmount)}
          </span>{" "}
          (30% dari total)
        </p>
        <p>
          3. Upload foto bukti transfer / struk pembayaran pada kolom di bawah
        </p>
        <p>4. Klik tombol konfirmasi untuk memproses pesanan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-[3px] border-foreground p-4 flex flex-col items-center justify-center gap-2 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="font-mono text-[9px] font-black uppercase tracking-widest text-white bg-black px-2 py-0.5">
            OFFICIAL_QRIS_MERCHANT
          </span>

          <img
            src={PAYMENT_INFO.qrisImageUrl}
            alt="QRIS Mahardika ReadyToShot"
            className="w-44 h-auto object-contain border border-gray-300"
          />

          <span className="font-mono text-[9px] text-gray-900 text-center font-black uppercase tracking-tight">
            NMID: ID1026506972771
          </span>
        </div>

        <div className="space-y-3">
          <div className="border-[3px] border-foreground p-4 space-y-2 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div>
              <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
                Bank / E-Wallet
              </p>

              <p className="font-black uppercase italic text-sm text-black">
                {PAYMENT_INFO.bankName}
              </p>
            </div>

            <div>
              <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
                No. Rekening
              </p>

              <div className="flex items-center gap-2 mt-0.5">
                <p className="font-black text-xl tracking-widest text-secondary font-mono">
                  {PAYMENT_INFO.accountNumber}
                </p>

                <button
                  type="button"
                  onClick={() => void handleCopy(PAYMENT_INFO.accountNumber)}
                  className="border-2 border-foreground p-1.5 hover:bg-secondary bg-white text-black transition-all rounded-none cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="border-[3px] border-secondary p-4 bg-secondary/5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
              Jumlah DP Yang Dibayar
            </p>

            <p className="font-black text-2xl italic text-secondary tracking-tighter font-mono">
              IDR {formatPrice(dpAmount)}
            </p>
          </div>
        </div>
      </div>

      <div className="border-[3px] border-foreground p-5 bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono">
        <p className="text-[10px] font-black uppercase tracking-widest text-foreground mb-3 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-secondary" />
          UPLOAD BUKTI PEMBAYARAN <span className="text-red-500">*</span>
        </p>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
        />

        {!imagePreview ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-foreground/30 hover:border-secondary p-6 flex flex-col items-center justify-center gap-2 text-foreground/50 hover:text-secondary bg-muted/10 transition-colors cursor-pointer group"
          >
            <Upload className="w-8 h-8 group-hover:scale-110 transition-transform" />

            <span className="text-xs font-black uppercase">
              PILIH FOTO / AMBIL GAMBAR STRUK
            </span>

            <span className="text-[9px] text-foreground/30">
              JPG, JPEG, PNG, WEBP (MAKS. {MAX_IMAGE_SIZE_MB}MB)
            </span>
          </button>
        ) : (
          <div className="relative border-2 border-foreground p-2 bg-muted/20 flex flex-col items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 bg-red-600 text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 cursor-pointer hover:bg-red-700"
              title="Hapus Gambar"
            >
              <X className="w-4 h-4" />
            </button>

            <img
              src={imagePreview}
              alt="Preview Bukti Pembayaran"
              className="max-h-48 w-auto object-contain border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white"
            />

            <span className="text-[10px] font-black uppercase text-green-600 tracking-tight bg-green-50 border border-green-200 px-2 py-0.5 text-center break-all">
              {paymentImage?.name}{" "}
              {paymentImage
                ? `(${(paymentImage.size / 1024 / 1024).toFixed(2)} MB)`
                : ""}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t-2 border-foreground/10">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-4 border-[3px] border-foreground font-black uppercase italic hover:bg-muted bg-white transition-all rounded-none text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 text-black cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK
        </button>

        <button
          type="button"
          onClick={handleConfirmSubmit}
          disabled={!paymentImage || isSubmitting}
          className={`flex-1 py-5 font-black uppercase italic text-xl border-[3px] border-foreground transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 rounded-none flex items-center justify-center gap-3 ${
            paymentImage && !isSubmitting
              ? "bg-[#80243C] text-white hover:bg-[#962d49] cursor-pointer"
              : "bg-muted text-foreground/30 cursor-not-allowed shadow-none translate-x-0 translate-y-0 border-foreground/20"
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              MENGIRIM...
            </>
          ) : (
            <>
              <CheckCircle className="w-6 h-6" />
              SUBMIT & KONFIRMASI
            </>
          )}
        </button>
      </div>
    </div>
  );
}