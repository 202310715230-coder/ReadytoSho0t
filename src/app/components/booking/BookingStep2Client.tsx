import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { User, ChevronRight, AlertCircle } from "lucide-react";
import { FormDataState } from "./BookingTypes";

interface Step2Props {
  formData: FormDataState;
  setFormData: Dispatch<SetStateAction<FormDataState>>;
  isValid: boolean;
  onBack: () => void;
  onNext: () => void;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeWhatsapp(value: string) {
  let cleanValue = value.replace(/\D/g, "");

  if (cleanValue.startsWith("08")) {
    cleanValue = `62${cleanValue.slice(1)}`;
  }

  if (cleanValue.startsWith("8")) {
    cleanValue = `62${cleanValue}`;
  }

  return cleanValue.slice(0, 15);
}

function validateFullName(fullName: string) {
  const cleanName = fullName.trim();
  if (!cleanName) return "Nama lengkap wajib diisi.";
  if (cleanName.length < 3) return "Nama lengkap minimal 3 karakter.";
  return "";
}

function validateEmail(email: string) {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) return "Email wajib diisi.";
  if (!isValidEmail(cleanEmail)) return "Format email tidak valid.";
  return "";
}

function validateWhatsapp(whatsapp: string) {
  const cleanWhatsapp = whatsapp.trim();
  if (!cleanWhatsapp) return "Nomor WhatsApp wajib diisi.";
  if (!cleanWhatsapp.startsWith("62")) return "Nomor WhatsApp harus diawali 62. Contoh: 6281234567890.";
  if (cleanWhatsapp.length < 10) return "Nomor WhatsApp terlalu pendek.";
  if (cleanWhatsapp.length > 15) return "Nomor WhatsApp terlalu panjang.";
  return "";
}

export function BookingStep2Client({
  formData,
  setFormData,
  isValid,
  onBack,
  onNext,
}: Step2Props) {
  const fullNameError = validateFullName(formData.fullName);
  const emailError = validateEmail(formData.email);
  const whatsappError = validateWhatsapp(formData.whatsapp);

  const localValid = !fullNameError && !emailError && !whatsappError && isValid;

  const handleFullNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, fullName: e.target.value }));
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      email: e.target.value.trim().toLowerCase(),
    }));
  };

  const handleWhatsappChange = (e: ChangeEvent<HTMLInputElement>) => {
    const cleanValue = normalizeWhatsapp(e.target.value);
    setFormData((prev) => ({ ...prev, whatsapp: cleanValue }));
  };

  const handleNext = () => {
    const cleanFullName = formData.fullName.trim();
    const cleanEmail = formData.email.trim().toLowerCase();
    const cleanWhatsapp = normalizeWhatsapp(formData.whatsapp);

    const nameError = validateFullName(cleanFullName);
    const mailError = validateEmail(cleanEmail);
    const phoneError = validateWhatsapp(cleanWhatsapp);

    setFormData((prev) => ({
      ...prev,
      fullName: cleanFullName,
      email: cleanEmail,
      whatsapp: cleanWhatsapp,
    }));

    if (nameError || mailError || phoneError || !isValid) {
      alert(nameError || mailError || phoneError || "Data client belum lengkap.");
      return;
    }

    onNext();
  };

  return (
    <div className="p-4 sm:p-6 border-[3px] border-foreground bg-muted/20 rounded-none">
      <h2 className="text-lg sm:text-2xl font-black uppercase italic mb-4 sm:mb-6 flex items-center gap-3 tracking-tighter">
        <User className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
        DATA CLIENT
      </h2>

      <div className="space-y-5 font-mono text-foreground">
        <div>
          <input
            type="text"
            placeholder="FULL_NAME_AS_KTP"
            value={formData.fullName}
            onChange={handleFullNameChange}
            autoComplete="name"
            className={`w-full p-2 sm:p-3 bg-transparent border-b-2 outline-none font-black uppercase text-sm sm:text-base placeholder:text-foreground/20 rounded-none ${
              fullNameError
                ? "border-red-500 focus:border-red-500"
                : "border-foreground/20 focus:border-secondary"
            }`}
          />
          {fullNameError && (
            <p className="mt-2 flex items-center gap-1 text-[11px] font-bold text-red-600 uppercase">
              <AlertCircle className="w-3.5 h-3.5" />
              {fullNameError}
            </p>
          )}
        </div>

        <div>
          <input
            type="email"
            placeholder="EMAIL ADDRESS"
            value={formData.email}
            onChange={handleEmailChange}
            autoComplete="email"
            className={`w-full p-2 sm:p-3 bg-transparent border-b-2 outline-none font-black uppercase text-sm sm:text-base placeholder:text-foreground/20 rounded-none ${
              emailError
                ? "border-red-500 focus:border-red-500"
                : "border-foreground/20 focus:border-secondary"
            }`}
          />
          {emailError && (
            <p className="mt-2 flex items-center gap-1 text-[11px] font-bold text-red-600 uppercase">
              <AlertCircle className="w-3.5 h-3.5" />
              {emailError}
            </p>
          )}
        </div>

        <div>
          <input
            type="text"
            inputMode="numeric"
            placeholder="WHATSAPP_NUMBER, CONTOH: 6281234567890"
            value={formData.whatsapp}
            onChange={handleWhatsappChange}
            autoComplete="tel"
            maxLength={15}
            className={`w-full p-2 sm:p-3 bg-transparent border-b-2 outline-none font-black uppercase text-sm sm:text-base placeholder:text-foreground/20 rounded-none ${
              whatsappError
                ? "border-red-500 focus:border-red-500"
                : "border-foreground/20 focus:border-secondary"
            }`}
          />
          {whatsappError && (
            <p className="mt-2 flex items-center gap-1 text-[11px] font-bold text-red-600 uppercase">
              <AlertCircle className="w-3.5 h-3.5" />
              {whatsappError}
            </p>
          )}
          {!whatsappError && formData.whatsapp && (
            <p className="mt-2 text-[11px] font-bold text-foreground/50 uppercase">
              Format benar. Contoh format WhatsApp: 6281234567890
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
        <button
          type="button"
          onClick={onBack}
          className="px-4 sm:px-6 py-3 sm:py-4 border-[3px] border-foreground bg-white font-black uppercase italic hover:bg-muted shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all rounded-none text-xs sm:text-sm cursor-pointer"
        >
          BACK
        </button>

        <button
          type="button"
          disabled={!localValid}
          onClick={handleNext}
          className={`flex-1 py-3 sm:py-4 font-black uppercase italic text-base sm:text-xl border-[3px] border-foreground shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all rounded-none ${
            localValid
              ? "bg-secondary text-foreground cursor-pointer"
              : "bg-muted text-foreground/30 cursor-not-allowed"
          }`}
        >
          NEXT STEP
          <ChevronRight className="inline ml-1 w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
}