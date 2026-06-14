import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FieldError } from "react-hook-form";
import { motion } from "framer-motion";
import { Shield, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../../components/hooks/UseAuth";

interface RegisterFormInputs {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function getFieldErrorMessage(
  error: FieldError | undefined
): string | null {
  if (!error) return null;

  return typeof error.message === "string"
    ? error.message
    : "Terjadi kesalahan";
}

export default function Registrasi() {
  const navigate = useNavigate();

  const {
    register: registerUser,
    loading,
    error: apiError,
    setError,
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setFocus,
  } = useForm<RegisterFormInputs>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  useEffect(() => {
    setFocus("username");
  }, [setFocus]);

  const onSubmit = async (
    data: RegisterFormInputs
  ) => {
    setError(null);

    const response = await registerUser({
      username: data.username,
      email: data.email,
      password: data.password,
    });

    if (response.status === "success") {
      toast.success(
        "Registrasi berhasil! Silakan login."
      );

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1000);
    } else {
      toast.error(
        response.message || "Registrasi gagal"
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f3f0ea] p-4 font-mono">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.4,
        }}
        className="w-full max-w-[420px] bg-white border-[4px] border-foreground p-8 sm:p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative"
      >
        <div className="absolute -top-4 -left-4 bg-[#80243C] text-white border-2 border-foreground px-3 py-1 font-mono text-[10px] font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          REG_GATE
        </div>

        <div className="text-center mb-6 mt-2">
          <div className="inline-flex items-center gap-2 mb-1 bg-foreground text-white px-3 py-1 border-2 border-foreground uppercase font-black italic tracking-tighter text-3xl">
            READY TO
            <span className="text-[#80243C]">
              SHOT
            </span>
          </div>

          <p className="font-mono text-xs font-bold uppercase text-muted-foreground tracking-tight mt-2">
            CUSTOMER REGISTRATION
          </p>
        </div>

        {apiError && (
          <div
            role="alert"
            className="p-4 bg-red-100 border-[3px] border-red-600 text-red-700 text-xs font-black rounded-none flex gap-2 mb-6"
          >
            <AlertCircle
              className="w-4 h-4 flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />

            <span>{apiError}</span>
          </div>
        )}

        <div className="p-4 border-[3px] border-foreground bg-amber-50 font-mono text-[11px] leading-relaxed text-foreground mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-black text-[#80243C] flex items-center gap-1.5 mb-1 uppercase">
            <Shield
              className="size-3.5"
              aria-hidden="true"
            />
            DAFTAR SEKARANG
          </p>

          Buat akun baru dengan username, email,
          dan password yang aman.
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="text-xs font-black uppercase tracking-wider block"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              placeholder="username123"
              autoComplete="username"
              disabled={loading}
              aria-invalid={!!errors.username}
              aria-describedby={
                errors.username
                  ? "username-error"
                  : undefined
              }
              {...register("username", {
                required: "Username wajib diisi",
                minLength: {
                  value: 3,
                  message:
                    "Username minimal 3 karakter",
                },
                maxLength: {
                  value: 20,
                  message:
                    "Username maksimal 20 karakter",
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message:
                    "Username hanya boleh huruf, angka, dan underscore",
                },
              })}
              className="w-full px-3 py-2 border-[2px] border-black bg-white placeholder:text-zinc-400 text-sm font-mono disabled:bg-zinc-100 disabled:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#E6A34A] focus:ring-offset-2"
            />

            {errors.username && (
              <p
                id="username-error"
                className="text-[11px] text-red-600 font-bold uppercase"
              >
                {getFieldErrorMessage(
                  errors.username
                )}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-black uppercase tracking-wider block"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              autoComplete="email"
              disabled={loading}
              aria-invalid={!!errors.email}
              aria-describedby={
                errors.email
                  ? "email-error"
                  : undefined
              }
              {...register("email", {
                required: "Email wajib diisi",
                pattern: {
                  value:
                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message:
                    "Format email tidak valid",
                },
              })}
              className="w-full px-3 py-2 border-[2px] border-black bg-white placeholder:text-zinc-400 text-sm font-mono disabled:bg-zinc-100 disabled:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#E6A34A] focus:ring-offset-2"
            />

            {errors.email && (
              <p
                id="email-error"
                className="text-[11px] text-red-600 font-bold uppercase"
              >
                {getFieldErrorMessage(
                  errors.email
                )}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-xs font-black uppercase tracking-wider block"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={loading}
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password
                  ? "password-error"
                  : undefined
              }
              {...register("password", {
                required: "Password wajib diisi",
                minLength: {
                  value: 6,
                  message:
                    "Password minimal 6 karakter",
                },
                maxLength: {
                  value: 72,
                  message:
                    "Password maksimal 72 karakter",
                },
              })}
              className="w-full px-3 py-2 border-[2px] border-black bg-white placeholder:text-zinc-400 text-sm font-mono disabled:bg-zinc-100 disabled:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#E6A34A] focus:ring-offset-2"
            />

            {errors.password && (
              <p
                id="password-error"
                className="text-[11px] text-red-600 font-bold uppercase"
              >
                {getFieldErrorMessage(
                  errors.password
                )}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="text-xs font-black uppercase tracking-wider block"
            >
              Konfirmasi Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={loading}
              aria-invalid={
                !!errors.confirmPassword
              }
              aria-describedby={
                errors.confirmPassword
                  ? "confirmPassword-error"
                  : undefined
              }
              {...register("confirmPassword", {
                required:
                  "Konfirmasi password wajib diisi",
                validate: (value) =>
                  value === password ||
                  "Password tidak cocok",
              })}
              className="w-full px-3 py-2 border-[2px] border-black bg-white placeholder:text-zinc-400 text-sm font-mono disabled:bg-zinc-100 disabled:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#E6A34A] focus:ring-offset-2"
            />

            {errors.confirmPassword && (
              <p
                id="confirmPassword-error"
                className="text-[11px] text-red-600 font-bold uppercase"
              >
                {getFieldErrorMessage(
                  errors.confirmPassword
                )}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 p-4 border-[4px] border-foreground font-black uppercase italic text-sm transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-[#E6A34A] text-[#2D1E17] hover:bg-[#D4912A] disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-[2px] disabled:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
          >
            {loading ? (
              <>
                <Loader2
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
                PROCESSING...
              </>
            ) : (
              <>
                <Shield
                  className="size-4"
                  aria-hidden="true"
                />
                DAFTAR AKUN
              </>
            )}
          </button>
        </form>

        <p className="mt-6 font-mono text-[11px] font-bold text-center text-muted-foreground uppercase tracking-tight">
          Sudah punya akun?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-foreground underline font-black hover:text-[#80243C] bg-transparent cursor-pointer transition-colors"
          >
            LOGIN DI SINI
          </button>
        </p>

        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-foreground rotate-45 transform translate-x-1/2 translate-y-1/2" />
      </motion.div>
    </div>
  );
}