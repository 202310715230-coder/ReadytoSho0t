import { useEffect } from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  useForm,
  FieldError,
} from "react-hook-form";
import { motion } from "framer-motion";
import {
  Shield,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../../components/hooks/UseAuth";

interface LoginFormInputs {
  identity: string;
  password: string;
}

type LocationState = {
  from?: {
    pathname?: string;
  };
};

function getFieldErrorMessage(
  error: FieldError | undefined
): string | null {
  if (!error) return null;

  return typeof error.message === "string"
    ? error.message
    : "Terjadi kesalahan";
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const state =
    location.state as LocationState | null;

  const redirectPath =
    state?.from?.pathname || null;

  const {
    login,
    loading,
    error: apiError,
    setError,
    user,
    isInitialized,
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<LoginFormInputs>({
    defaultValues: {
      identity: "",
      password: "",
    },
  });

  useEffect(() => {
    setFocus("identity");
  }, [setFocus]);

  useEffect(() => {
    if (!isInitialized || !user) return;

    const role = user.role?.toLowerCase();

    if (redirectPath) {
      navigate(redirectPath, {
        replace: true,
      });

      return;
    }

    if (role === "admin") {
      navigate("/admin/dashboard", {
        replace: true,
      });
    } else {
      navigate("/", {
        replace: true,
      });
    }
  }, [
    isInitialized,
    user,
    navigate,
    redirectPath,
  ]);

  const onSubmit = async (
    data: LoginFormInputs
  ) => {
    if (loading) return;

    setError(null);

    const response = await login({
      identity: data.identity.trim(),
      password: data.password,
    });

    if (
      response.status === "success" &&
      response.user
    ) {
      toast.success(
        `Selamat datang, ${response.user.username}!`
      );

      const role =
        response.user.role?.toLowerCase();

      if (redirectPath) {
        navigate(redirectPath, {
          replace: true,
        });

        return;
      }

      if (role === "admin") {
        navigate("/admin/dashboard", {
          replace: true,
        });
      } else {
        navigate("/", {
          replace: true,
        });
      }
    } else {
      toast.error(
        response.message || "Login gagal"
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f3f0ea] p-4 font-mono select-none">
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
          AUTH_GATE
        </div>

        <div className="text-center mb-6 mt-2">
          <div className="inline-flex items-center gap-2 mb-1 bg-foreground text-white px-3 py-1 border-2 border-foreground uppercase font-black italic tracking-tighter text-3xl">
            READY TO
            <span className="text-[#80243C]">
              SHOT
            </span>
          </div>

          <p className="font-mono text-xs font-bold uppercase text-muted-foreground tracking-tight mt-2">
            CUSTOMER LOGIN
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
            LOGIN
          </p>

          Silakan masuk menggunakan username/email dan
          password akun Anda.
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label
              htmlFor="identity"
              className="text-xs font-black uppercase tracking-wider block"
            >
              Email / Username
            </label>

            <input
              id="identity"
              type="text"
              placeholder="user@example.com atau username"
              disabled={loading}
              aria-invalid={!!errors.identity}
              autoComplete="username"
              {...register("identity", {
                required:
                  "Email atau Username wajib diisi",
              })}
              className="w-full px-3 py-2 border-[2px] border-black bg-white placeholder:text-zinc-400 text-sm font-mono disabled:bg-zinc-100 disabled:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#E6A34A] focus:ring-offset-2"
            />

            {errors.identity && (
              <p className="text-[11px] text-red-600 font-bold uppercase">
                {getFieldErrorMessage(
                  errors.identity
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
              disabled={loading}
              aria-invalid={!!errors.password}
              autoComplete="current-password"
              {...register("password", {
                required:
                  "Password wajib diisi",
              })}
              className="w-full px-3 py-2 border-[2px] border-black bg-white placeholder:text-zinc-400 text-sm font-mono disabled:bg-zinc-100 disabled:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#E6A34A] focus:ring-offset-2"
            />

            {errors.password && (
              <p className="text-[11px] text-red-600 font-bold uppercase">
                {getFieldErrorMessage(
                  errors.password
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
                ENTERING...
              </>
            ) : (
              <>
                <Shield
                  className="size-4"
                  aria-hidden="true"
                />
                MASUK KE PANEL
              </>
            )}
          </button>
        </form>

        <p className="mt-6 font-mono text-[11px] font-bold text-center text-muted-foreground uppercase tracking-tight">
          Belum punya akun?{" "}
          <button
            type="button"
            onClick={() =>
              navigate("/registrasi")
            }
            className="text-foreground underline font-black hover:text-[#80243C] bg-transparent cursor-pointer transition-colors"
          >
            DAFTAR DI SINI
          </button>
        </p>

        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-foreground rotate-45 transform translate-x-1/2 translate-y-1/2" />
      </motion.div>
    </div>
  );
}