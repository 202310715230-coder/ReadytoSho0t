import { useEffect, useState, useCallback } from "react";

// ================================
// TYPES
// ================================

export interface UserProfile {
  id: number;
  username: string;
  full_name?: string | null;
  email: string;
  whatsapp?: string | null;
  phone?: string | null;

  profile_photo?: string | null;
  profile_photo_url?: string | null;

  ktp_photo?: string | null;
  ktp_photo_url?: string | null;
  ktp_status?: string | null;

  gender?: "Laki-laki" | "Perempuan" | "Lainnya" | string | null;
  birth_date?: string | null;

  role: string;
  created_at?: string | null;
}

export interface UserBooking {
  id: number;
  user_id?: number;
  product_id: number;

  full_name?: string;
  email?: string;
  whatsapp?: string;

  renter_name?: string;
  renter_email?: string;
  renter_whatsapp?: string;

  product_name?: string;
  camera_name?: string;
  camera_brand?: string;
  product_brand?: string;
  brand?: string;
  category?: string;

  image_path?: string | null;
  image_full_url?: string | null;

  start_date: string;
  end_date: string;
  duration?: number;

  unit_price?: number;
  price_per_day?: number;

  normal_total_price?: number;
  discount_percent?: number;
  discount_amount?: number;
  subtotal?: number;

  total_price: number;
  dp_amount?: number;
  settlement_amount?: number;

  payment_proof?: string | null;
  payment_proof_url?: string | null;

  delivery_method?: string;
  delivery_details?: string;
  delivery_distance_km?: number;
  courier_fee?: number;

  status: string;
  created_at?: string;
}

interface ProfileApiResponse {
  status: "success" | "error";
  message?: string;
  user?: UserProfile;
  debug?: unknown;
}

interface RentalsApiResponse {
  status: "success" | "error";
  message?: string;
  total?: number;
  data?: UserBooking[];
  debug?: unknown;
}

interface UploadKtpResponse {
  status: "success" | "error";
  message?: string;
  ktp_photo?: string;
  ktp_photo_url?: string;
  debug?: unknown;
}

interface UploadProfilePhotoResponse {
  status: "success" | "error";
  message?: string;
  profile_photo?: string;
  profile_photo_url?: string;
  debug?: unknown;
}

interface UpdateProfilePayload {
  full_name?: string;
  email: string;
  whatsapp?: string;
  gender?: string;
  birth_date?: string;
}

// ================================
// CONFIG
// ================================

const API_BASE = "http://localhost/db_readytoshot";

// ================================
// HELPERS
// ================================

async function safeJson<T>(response: Response): Promise<T | null> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    console.error("Response PHP bukan JSON:", text);
    return null;
  }
}

function getBackendError(
  result: { message?: string; debug?: unknown } | null,
  fallback: string
) {
  if (!result) return fallback;

  if (result.debug) {
    if (typeof result.debug === "string") {
      return `${result.message || fallback}: ${result.debug}`;
    }

    return `${result.message || fallback}: ${JSON.stringify(result.debug)}`;
  }

  return result.message || fallback;
}

function toNumber(value: unknown): number {
  const parsed = Number(value || 0);

  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
    return 0;
  }

  return parsed;
}

function normalizeStatus(status?: string | null) {
  const cleanStatus = String(status || "").trim();

  return cleanStatus || "Menunggu Verifikasi";
}

function buildBackendUrl(path?: string | null) {
  if (!path) return null;

  const cleanPath = String(path).trim();

  if (!cleanPath) return null;

  if (
    cleanPath.startsWith("http://") ||
    cleanPath.startsWith("https://")
  ) {
    return cleanPath;
  }

  return `${API_BASE}/${cleanPath.replace(/^\/+/, "")}`;
}

function normalizeBooking(item: UserBooking): UserBooking {
  const totalPrice = toNumber(item.total_price);

  const dpAmount =
    toNumber(item.dp_amount) > 0
      ? toNumber(item.dp_amount)
      : Math.round(totalPrice * 0.3);

  const settlementAmount =
    toNumber(item.settlement_amount) > 0
      ? toNumber(item.settlement_amount)
      : totalPrice - dpAmount;

  const paymentProof = item.payment_proof || null;

  const paymentProofUrl =
    item.payment_proof_url || buildBackendUrl(paymentProof);

  return {
    ...item,

    id: toNumber(item.id),
    user_id: toNumber(item.user_id),
    product_id: toNumber(item.product_id),

    duration: toNumber(item.duration),

    unit_price: toNumber(item.unit_price),
    price_per_day: toNumber(item.price_per_day),

    normal_total_price: toNumber(item.normal_total_price),
    discount_percent: toNumber(item.discount_percent),
    discount_amount: toNumber(item.discount_amount),
    subtotal: toNumber(item.subtotal),

    total_price: totalPrice,
    dp_amount: dpAmount,
    settlement_amount: settlementAmount,

    delivery_distance_km: toNumber(item.delivery_distance_km),
    courier_fee: toNumber(item.courier_fee),

    full_name: item.full_name || item.renter_name || "",
    email: item.email || item.renter_email || "",
    whatsapp: item.whatsapp || item.renter_whatsapp || "",

    renter_name: item.renter_name || item.full_name || "",
    renter_email: item.renter_email || item.email || "",
    renter_whatsapp: item.renter_whatsapp || item.whatsapp || "",

    product_name: item.product_name || item.camera_name || "",
    camera_name: item.camera_name || item.product_name || "",

    product_brand: item.product_brand || item.camera_brand || item.brand || "",
    camera_brand: item.camera_brand || item.product_brand || item.brand || "",

    category: item.category || "",

    image_path: item.image_path || null,
    image_full_url: item.image_full_url || null,

    payment_proof: paymentProof,
    payment_proof_url: paymentProofUrl,

    delivery_method: item.delivery_method || "",
    delivery_details: item.delivery_details || "",

    start_date: item.start_date || "",
    end_date: item.end_date || "",

    status: normalizeStatus(item.status),
    created_at: item.created_at || "",
  };
}

function normalizeProfile(profile: UserProfile): UserProfile {
  return {
    ...profile,
    id: toNumber(profile.id),
    username: profile.username || "",
    full_name: profile.full_name || profile.username || "",
    email: profile.email || "",
    whatsapp: profile.whatsapp || profile.phone || "",
    phone: profile.phone || profile.whatsapp || "",
    profile_photo: profile.profile_photo || null,
    profile_photo_url:
      profile.profile_photo_url || buildBackendUrl(profile.profile_photo),
    ktp_photo: profile.ktp_photo || null,
    ktp_photo_url: profile.ktp_photo_url || buildBackendUrl(profile.ktp_photo),
    ktp_status: profile.ktp_status || null,
    gender: profile.gender || "Laki-laki",
    birth_date: profile.birth_date || "",
    role: profile.role || "customer",
    created_at: profile.created_at || null,
  };
}

// ================================
// HOOK
// ================================

export function useProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<UserBooking[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const [isUploadingProfilePhoto, setIsUploadingProfilePhoto] =
    useState<boolean>(false);

  const [isUploadingKtp, setIsUploadingKtp] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const syncLocalUser = useCallback((profile: UserProfile) => {
    localStorage.setItem("user_session", JSON.stringify(profile));
    localStorage.setItem("user_id", String(profile.id));
  }, []);

  const clearLocalUser = useCallback(() => {
    localStorage.removeItem("user_session");
    localStorage.removeItem("user_id");
  }, []);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const profileResponse = await fetch(`${API_BASE}/get_profile.php`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      const profileData = await safeJson<ProfileApiResponse>(profileResponse);

      if (profileResponse.status === 401) {
        setUser(null);
        setBookings([]);
        clearLocalUser();
        setError(profileData?.message || "Anda belum login");
        return;
      }

      if (
        !profileResponse.ok ||
        !profileData ||
        profileData.status !== "success" ||
        !profileData.user
      ) {
        setUser(null);
        setBookings([]);
        clearLocalUser();
        setError(getBackendError(profileData, "Gagal mengambil data profile"));
        return;
      }

      const normalizedUser = normalizeProfile(profileData.user);

      setUser(normalizedUser);
      syncLocalUser(normalizedUser);

      const rentalsResponse = await fetch(`${API_BASE}/get_my_rentals.php`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      const rentalsData = await safeJson<RentalsApiResponse>(rentalsResponse);

      if (rentalsResponse.status === 401) {
        setBookings([]);
        setError(rentalsData?.message || "Session rental tidak terbaca");
        return;
      }

      if (
        rentalsResponse.ok &&
        rentalsData?.status === "success" &&
        Array.isArray(rentalsData.data)
      ) {
        const normalizedBookings = rentalsData.data.map(normalizeBooking);

        console.log("RENTALS RAW FROM API:", rentalsData.data);
        console.log("RENTALS NORMALIZED:", normalizedBookings);

        setBookings(normalizedBookings);
      } else {
        console.warn("Gagal mengambil rentals:", rentalsData);
        setBookings([]);
      }
    } catch (err) {
      console.error("Gagal mengambil data profile:", err);

      setUser(null);
      setBookings([]);

      setError(
        err instanceof Error
          ? err.message
          : "Gagal terhubung ke server"
      );
    } finally {
      setIsLoading(false);
    }
  }, [clearLocalUser, syncLocalUser]);

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      setIsUpdating(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/update_profile.php`, {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            full_name: payload.full_name || "",
            email: payload.email || "",
            whatsapp: payload.whatsapp || "",
            gender: payload.gender || "",
            birth_date: payload.birth_date || "",
          }),
        });

        const data = await safeJson<ProfileApiResponse>(response);

        if (response.status === 401) {
          clearLocalUser();

          const message = data?.message || "Anda belum login";

          setError(message);

          return {
            status: "error" as const,
            message,
          };
        }

        if (
          !response.ok ||
          !data ||
          data.status !== "success" ||
          !data.user
        ) {
          const message = getBackendError(data, "Gagal memperbarui profile");

          setError(message);

          return {
            status: "error" as const,
            message,
          };
        }

        const normalizedUser = normalizeProfile(data.user);

        setUser(normalizedUser);
        syncLocalUser(normalizedUser);

        return {
          status: "success" as const,
          message: data.message || "Profile berhasil diperbarui",
          user: normalizedUser,
        };
      } catch (err) {
        console.error("Update profile error:", err);

        const message =
          err instanceof Error
            ? err.message
            : "Gagal terhubung ke server";

        setError(message);

        return {
          status: "error" as const,
          message,
        };
      } finally {
        setIsUpdating(false);
      }
    },
    [clearLocalUser, syncLocalUser]
  );

  const uploadProfilePhoto = useCallback(
    async (file: File) => {
      setIsUploadingProfilePhoto(true);
      setError(null);

      if (!file) {
        setIsUploadingProfilePhoto(false);

        return {
          status: "error" as const,
          message: "File foto profile belum dipilih",
        };
      }

      try {
        const formData = new FormData();
        formData.append("profile_photo", file);

        const response = await fetch(`${API_BASE}/upload_profile_photo.php`, {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          body: formData,
        });

        const data = await safeJson<UploadProfilePhotoResponse>(response);

        if (!response.ok || !data || data.status !== "success") {
          const message = getBackendError(data, "Gagal upload foto profile");

          setError(message);

          return {
            status: "error" as const,
            message,
          };
        }

        let updatedUser: UserProfile | null = null;

        setUser((prev) => {
          if (!prev) return prev;

          updatedUser = {
            ...prev,
            profile_photo: data.profile_photo || null,
            profile_photo_url: data.profile_photo_url || null,
          };

          return updatedUser;
        });

        if (updatedUser) {
          syncLocalUser(updatedUser);
        }

        return {
          status: "success" as const,
          message: data.message || "Foto profile berhasil diupload",
          profile_photo: data.profile_photo,
          profile_photo_url: data.profile_photo_url,
        };
      } catch (err) {
        console.error("Upload foto profile error:", err);

        const message =
          err instanceof Error ? err.message : "Gagal terhubung ke server";

        setError(message);

        return {
          status: "error" as const,
          message,
        };
      } finally {
        setIsUploadingProfilePhoto(false);
      }
    },
    [syncLocalUser]
  );

  const uploadKtp = useCallback(
    async (file: File) => {
      setIsUploadingKtp(true);
      setError(null);

      if (!file) {
        setIsUploadingKtp(false);

        return {
          status: "error" as const,
          message: "File KTP belum dipilih",
        };
      }

      try {
        const formData = new FormData();
        formData.append("ktp_photo", file);

        const response = await fetch(`${API_BASE}/upload_ktp.php`, {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          body: formData,
        });

        const data = await safeJson<UploadKtpResponse>(response);

        if (!response.ok || !data || data.status !== "success") {
          const message = getBackendError(data, "Gagal upload KTP");

          setError(message);

          return {
            status: "error" as const,
            message,
          };
        }

        let updatedUser: UserProfile | null = null;

        setUser((prev) => {
          if (!prev) return prev;

          updatedUser = {
            ...prev,
            ktp_photo: data.ktp_photo || null,
            ktp_photo_url: data.ktp_photo_url || null,
          };

          return updatedUser;
        });

        if (updatedUser) {
          syncLocalUser(updatedUser);
        }

        return {
          status: "success" as const,
          message: data.message || "Foto KTP berhasil diupload",
          ktp_photo: data.ktp_photo,
          ktp_photo_url: data.ktp_photo_url,
        };
      } catch (err) {
        console.error("Upload KTP error:", err);

        const message =
          err instanceof Error ? err.message : "Gagal terhubung ke server";

        setError(message);

        return {
          status: "error" as const,
          message,
        };
      } finally {
        setIsUploadingKtp(false);
      }
    },
    [syncLocalUser]
  );

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  return {
    user,
    bookings,

    isLoading,
    isUpdating,
    isUploadingProfilePhoto,
    isUploadingKtp,
    error,

    refetchProfile: fetchProfile,
    updateProfile,
    uploadProfilePhoto,
    uploadKtp,

    setError,
  };
}