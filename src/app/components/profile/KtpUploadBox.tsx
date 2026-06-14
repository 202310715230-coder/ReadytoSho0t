import { useEffect, useRef, useState } from "react";
import {
  Upload,
  Loader2,
  IdCard,
  CheckCircle,
  ImagePlus,
} from "lucide-react";

interface KtpUploadBoxProps {
  ktpPhotoUrl?: string | null;
  isUploading?: boolean;
  onUpload: (file: File) => Promise<void> | void;
}

export default function KtpUploadBox({
  ktpPhotoUrl,
  isUploading = false,
  onUpload,
}: KtpUploadBoxProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [preview, setPreview] = useState<string | null>(
    ktpPhotoUrl || null
  );

  useEffect(() => {
    setPreview(ktpPhotoUrl || null);
  }, [ktpPhotoUrl]);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Format KTP harus JPG, JPEG, PNG, atau WEBP");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file maksimal 2MB");
      e.target.value = "";
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      await onUpload(file);
    } catch (error) {
      console.error("Upload KTP gagal:", error);
      setPreview(ktpPhotoUrl || null);
    } finally {
      e.target.value = "";
      URL.revokeObjectURL(localPreview);
    }
  };

  return (
    <div className="rounded-[24px] border border-[#E8DCCB] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-[#F5E7D3] flex items-center justify-center">
              <IdCard className="w-4 h-4 text-[#8A5A2B]" />
            </div>

            <div>
              <h3 className="font-black text-sm text-[#2D1E17]">
                Foto KTP
              </h3>

              <p className="text-xs text-[#7B6A5B] mt-0.5">
                Upload identitas untuk verifikasi akun.
              </p>
            </div>
          </div>
        </div>

        {ktpPhotoUrl && (
          <div className="flex items-center gap-1 rounded-full bg-[#ECFDF3] px-3 py-1 text-[11px] font-bold text-[#027A48]">
            <CheckCircle className="w-3.5 h-3.5" />
            Terupload
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-dashed border-[#D8C8B5] bg-[#F8F3EA] min-h-[190px] flex items-center justify-center overflow-hidden">
        {preview ? (
          <img
            src={preview}
            alt="Preview KTP"
            className="w-full h-[190px] object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/500x300?text=KTP";
            }}
          />
        ) : (
          <div className="text-center px-5 py-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-[#E8DCCB] flex items-center justify-center mb-3">
              <ImagePlus className="w-7 h-7 text-[#8A5A2B]" />
            </div>

            <p className="font-black text-sm text-[#2D1E17]">
              Belum ada foto KTP
            </p>

            <p className="text-xs text-[#7B6A5B] mt-1 leading-relaxed">
              Pilih gambar KTP dengan kualitas jelas.
            </p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        className="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl bg-[#2D1E17] px-5 py-3 text-sm font-black text-white hover:bg-[#463025] transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isUploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Upload className="w-4 h-4" />
        )}

        {isUploading ? "Mengupload..." : "Pilih Foto KTP"}
      </button>

      <p className="mt-3 text-[11px] text-[#7B6A5B] leading-relaxed text-center">
        Format: JPG, JPEG, PNG, WEBP. Maksimal ukuran file 2MB.
      </p>
    </div>
  );
}