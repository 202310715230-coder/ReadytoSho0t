import { useCallback, useEffect, useState } from "react";

const API_BASE = "http://localhost/db_readytoshot";

export interface RentalItem {
  id: number;
  user_id?: number;
  product_id: number;

  full_name?: string;
  email?: string | null;
  whatsapp?: string;

  renter_name?: string;
  renter_email?: string | null;
  renter_whatsapp?: string;

  start_date: string;
  end_date: string;
  duration: number;

  unit_price?: number;
  normal_total_price?: number;
  discount_percent?: number;
  discount_amount?: number;
  subtotal?: number;

  total_price: number;
  dp_amount?: number;
  settlement_amount?: number;

  delivery_method: "cod" | "courier" | string;
  delivery_details: string;
  delivery_distance_km?: number;
  courier_fee?: number;

  payment_proof?: string | null;
  payment_proof_url?: string | null;

  status: string;
  created_at: string;

  camera_name?: string;
  camera_brand?: string;

  product_name?: string;
  product_brand?: string;
  product_category?: string;

  image_path?: string | null;
  image_full_url?: string | null;
}

export type AdminTabType =
  | "Semua"
  | "Menunggu Pembayaran"
  | "Sedang Disewa"
  | "Selesai"
  | "Dibatalkan";

interface AdminRentalStats {
  menungguPembayaran: number;
  rentalAktif: number;
  rentalSelesai: number;
  totalPendapatan: number;
  totalDpMasuk: number;
}

interface AdminRentalResponse {
  status: "success" | "error";
  message?: string;
  total?: number;
  data?: RentalItem[];
  stats?: {
    menunggu_pembayaran?: number | string;
    menungguPembayaran?: number | string;

    rental_aktif?: number | string;
    rentalAktif?: number | string;

    rental_selesai?: number | string;
    rentalSelesai?: number | string;

    total_pendapatan?: number | string;
    totalPendapatan?: number | string;

    total_dp_masuk?: number | string;
    totalDpMasuk?: number | string;
  };
  debug?: unknown;
}

interface UpdateRentalStatusResponse {
  status: "success" | "error";
  message?: string;
  data?: {
    rental_id?: number | string;
    product_id?: number | string;
    old_status?: string;
    new_status?: string;
  };
  debug?: unknown;
}

function toNumber(value: unknown): number {
  const parsed = Number(value || 0);

  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
    return 0;
  }

  return parsed;
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

function normalizePaymentProofUrl(item: RentalItem) {
  if (item.payment_proof_url) {
    return buildBackendUrl(item.payment_proof_url);
  }

  if (item.payment_proof) {
    return buildBackendUrl(item.payment_proof);
  }

  return null;
}

function normalizeRental(item: RentalItem): RentalItem {
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
  const paymentProofUrl = normalizePaymentProofUrl(item);

  return {
    ...item,

    id: toNumber(item.id),
    user_id: toNumber(item.user_id),
    product_id: toNumber(item.product_id),

    duration: toNumber(item.duration),

    unit_price: toNumber(item.unit_price),
    normal_total_price: toNumber(item.normal_total_price),
    discount_percent: toNumber(item.discount_percent),
    discount_amount: toNumber(item.discount_amount),
    subtotal: toNumber(item.subtotal),

    total_price: totalPrice,
    dp_amount: dpAmount,
    settlement_amount: settlementAmount,

    delivery_distance_km: toNumber(item.delivery_distance_km),
    courier_fee: toNumber(item.courier_fee),

    full_name: item.full_name || item.renter_name || "UNKNOWN_RENTER",
    email: item.email || item.renter_email || "",
    whatsapp: item.whatsapp || item.renter_whatsapp || "",

    renter_name: item.renter_name || item.full_name || "UNKNOWN_RENTER",
    renter_email: item.renter_email || item.email || "",
    renter_whatsapp: item.renter_whatsapp || item.whatsapp || "",

    product_name:
      item.product_name || item.camera_name || `Gear ID: ${item.product_id}`,
    camera_name:
      item.camera_name || item.product_name || `Gear ID: ${item.product_id}`,

    product_brand: item.product_brand || item.camera_brand || "",
    camera_brand: item.camera_brand || item.product_brand || "",

    product_category: item.product_category || "",

    status: item.status || "-",
    start_date: item.start_date || "",
    end_date: item.end_date || "",
    created_at: item.created_at || "",

    delivery_method: item.delivery_method || "",
    delivery_details: item.delivery_details || "",

    payment_proof: paymentProof,
    payment_proof_url: paymentProofUrl,

    image_path: item.image_path || null,
    image_full_url: item.image_full_url || null,
  };
}

function getStatValue(
  stats: AdminRentalResponse["stats"],
  snakeKey: keyof NonNullable<AdminRentalResponse["stats"]>,
  camelKey: keyof NonNullable<AdminRentalResponse["stats"]>
) {
  return toNumber(stats?.[snakeKey] ?? stats?.[camelKey] ?? 0);
}

export function useAdminRental() {
  const [activeTab, setActiveTab] = useState<AdminTabType>("Semua");
  const [rentals, setRentals] = useState<RentalItem[]>([]);

  const [stats, setStats] = useState<AdminRentalStats>({
    menungguPembayaran: 0,
    rentalAktif: 0,
    rentalSelesai: 0,
    totalPendapatan: 0,
    totalDpMasuk: 0,
  });

  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const targetUrl = `${API_BASE}/get_admin_rentals.php?status=${encodeURIComponent(
        activeTab
      )}`;

      const response = await fetch(targetUrl, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      const text = await response.text();

      let result: AdminRentalResponse;

      try {
        result = JSON.parse(text);
      } catch {
        console.error("Response bukan JSON:", text);
        throw new Error(
          "Response server bukan JSON. Cek get_admin_rentals.php"
        );
      }

      if (response.status === 401) {
        throw new Error("Anda belum login. Silakan login ulang.");
      }

      if (response.status === 403) {
        throw new Error(
          result.message ||
            "Akses admin ditolak. Pastikan akun login memiliki role admin."
        );
      }

      if (!response.ok || result.status !== "success") {
        console.error("Debug backend:", result.debug);

        throw new Error(
          result.message || `NETWORK_ERROR: Status ${response.status}`
        );
      }

      const rentalData = Array.isArray(result.data)
        ? result.data.map(normalizeRental)
        : [];

      console.log("ADMIN RENTALS RAW:", result.data);
      console.log("ADMIN RENTALS NORMALIZED:", rentalData);

      setRentals(rentalData);

      setStats({
        menungguPembayaran: getStatValue(
          result.stats,
          "menunggu_pembayaran",
          "menungguPembayaran"
        ),
        rentalAktif: getStatValue(
          result.stats,
          "rental_aktif",
          "rentalAktif"
        ),
        rentalSelesai: getStatValue(
          result.stats,
          "rental_selesai",
          "rentalSelesai"
        ),
        totalPendapatan: getStatValue(
          result.stats,
          "total_pendapatan",
          "totalPendapatan"
        ),
        totalDpMasuk: getStatValue(
          result.stats,
          "total_dp_masuk",
          "totalDpMasuk"
        ),
      });
    } catch (err) {
      console.error("Gagal menarik data admin:", err);

      setRentals([]);

      setStats({
        menungguPembayaran: 0,
        rentalAktif: 0,
        rentalSelesai: 0,
        totalPendapatan: 0,
        totalDpMasuk: 0,
      });

      setError(
        err instanceof Error ? err.message : "Gagal menarik data admin"
      );
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  const updateRentalStatus = useCallback(
    async (rentalId: number | string, status: string) => {
      setUpdatingStatus(true);

      try {
        const response = await fetch(
          `${API_BASE}/update_rental_status.php`,
          {
            method: "POST",
            credentials: "include",
            cache: "no-store",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              rental_id: rentalId,
              status,
            }),
          }
        );

        const text = await response.text();

        let result: UpdateRentalStatusResponse;

        try {
          result = JSON.parse(text);
        } catch {
          console.error("Response update status bukan JSON:", text);

          return {
            status: "error" as const,
            message:
              "Response server bukan JSON. Cek update_rental_status.php",
          };
        }

        if (!response.ok || result.status !== "success") {
          console.error("Debug update status:", result.debug);

          return {
            status: "error" as const,
            message: result.message || "Gagal update status rental",
          };
        }

        await fetchAdminData();

        return {
          status: "success" as const,
          message:
            result.message || "Status rental berhasil diperbarui",
          data: result.data,
        };
      } catch (err) {
        console.error("Update rental status error:", err);

        return {
          status: "error" as const,
          message:
            err instanceof Error
              ? err.message
              : "Gagal terhubung ke server",
        };
      } finally {
        setUpdatingStatus(false);
      }
    },
    [fetchAdminData]
  );

  useEffect(() => {
    void fetchAdminData();
  }, [fetchAdminData]);

  return {
    activeTab,
    setActiveTab,

    rentals,
    stats,

    loading,
    updatingStatus,
    error,

    refreshData: fetchAdminData,
    updateRentalStatus,
  };
}