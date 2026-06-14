"use client";

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Server,
  Camera,
  ClipboardList,
  RefreshCw,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface DashboardStats {
  adminName: string;
  totalUsers: number;
  totalCameras: number;
  totalRentals: number;
}

interface AdminStatsResponse {
  status: "success" | "error";
  message?: string;
  data?: {
    total_users?: number | string;
    total_products?: number | string;
    total_cameras?: number | string;
    total_orders?: number | string;
    total_rentals?: number | string;
    total_bookings?: number | string;
  };
  stats?: {
    total_users?: number | string;
    total_products?: number | string;
    total_cameras?: number | string;
    total_orders?: number | string;
    total_rentals?: number | string;
    total_bookings?: number | string;
  };
  counts?: {
    total_users?: number | string;
    total_products?: number | string;
    total_cameras?: number | string;
    total_orders?: number | string;
    total_rentals?: number | string;
    total_bookings?: number | string;
  };
}

interface LocalUserSession {
  id?: number | string;
  username?: string;
  name?: string;
  role?: string;
}

const API_BASE = "http://localhost/db_readytoshot";

function safeParseUserSession(): LocalUserSession | null {
  const userSessionStr = localStorage.getItem("user_session");

  if (!userSessionStr) {
    return null;
  }

  try {
    return JSON.parse(userSessionStr);
  } catch {
    localStorage.removeItem("user_session");
    localStorage.removeItem("user_id");
    return null;
  }
}

function toNumber(value: number | string | undefined) {
  const parsed = Number(value || 0);

  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
    return 0;
  }

  return parsed;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchAllDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userSession = safeParseUserSession();

      if (!userSession || !userSession.id) {
        navigate("/login", { replace: true });
        return;
      }

      if (String(userSession.role || "").toLowerCase() !== "admin") {
        navigate("/", { replace: true });
        return;
      }

      const statsRes = await fetch(`${API_BASE}/get_stats_admin.php`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      const text = await statsRes.text();

      let statsResult: AdminStatsResponse;

      try {
        statsResult = JSON.parse(text);
      } catch {
        console.error("Response bukan JSON:", text);
        throw new Error("Response server bukan JSON. Cek get_stats_admin.php");
      }

      if (statsRes.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      if (statsRes.status === 403) {
        navigate("/", { replace: true });
        return;
      }

      if (!statsRes.ok || statsResult.status !== "success") {
        throw new Error(
          statsResult.message || "Gagal mengambil statistik admin"
        );
      }

      const source =
        statsResult.data || statsResult.stats || statsResult.counts || {};

      setStats({
        adminName: userSession.username || userSession.name || "Admin",
        totalUsers: toNumber(source.total_users),
        totalCameras: toNumber(
          source.total_cameras || source.total_products
        ),
        totalRentals: toNumber(
          source.total_bookings ||
            source.total_orders ||
            source.total_rentals
        ),
      });
    } catch (err) {
      console.error("AdminDashboard error:", err);

      const userSession = safeParseUserSession();

      setStats({
        adminName: userSession?.username || userSession?.name || "Admin",
        totalUsers: 0,
        totalCameras: 0,
        totalRentals: 0,
      });

      setError(
        err instanceof Error
          ? err.message
          : "Gagal sinkronisasi data dashboard"
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAllDashboardData();
  }, [fetchAllDashboardData]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 text-center font-mono text-xs font-black uppercase animate-pulse sm:text-sm">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div>Memuat Dashboard...</div>
        <div className="text-xs text-foreground/60">
          Sinkronisasi data admin...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-8 animate-fadeIn text-foreground">
      <header className="border-4 border-foreground bg-white p-4 shadow-[4px_4px_0_0_rgba(61,35,35,1)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-black uppercase tracking-tight sm:text-3xl">
              Dashboard Admin
            </h1>

            <p className="mt-1 break-words text-xs font-bold uppercase text-foreground/70 sm:text-sm">
              Selamat datang kembali,{" "}
              <span className="text-primary underline decoration-2">
                {stats?.adminName || "Admin"}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={fetchAllDashboardData}
            className="flex w-full items-center justify-center gap-2 border-4 border-foreground bg-white px-5 py-3 text-xs font-black uppercase shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none sm:w-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </header>

      {error && (
        <div className="flex items-start gap-3 border-4 border-red-600 bg-red-100 p-4 shadow-[4px_4px_0_0_rgba(61,35,35,1)]">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />
          <span className="break-words font-mono text-xs font-black uppercase text-red-800">
            {error}
          </span>
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        <DashboardCard
          title="Total Pengguna"
          value={`${stats?.totalUsers ?? 0}`}
          icon={<Users className="h-6 w-6" />}
          colorClass="bg-secondary"
        />

        <DashboardCard
          title="Koleksi Kamera"
          value={`${stats?.totalCameras ?? 0} Unit`}
          icon={<Camera className="h-6 w-6" />}
          colorClass="bg-blue-300"
        />

        <DashboardCard
          title="Total Transaksi Sewa"
          value={`${stats?.totalRentals ?? 0} Log`}
          icon={<ClipboardList className="h-6 w-6" />}
          colorClass="bg-amber-300"
          className="sm:col-span-2 lg:col-span-1"
        />
      </section>

      {!error && (
        <div className="flex items-start gap-3 border-4 border-foreground bg-green-100 p-4 shadow-[4px_4px_0_0_rgba(61,35,35,1)]">
          <Server className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
          <span className="break-words font-mono text-xs font-black uppercase text-green-800">
            Sistem admin aktif dan data berhasil disinkronkan dari backend.
          </span>
        </div>
      )}
    </div>
  );
}

function DashboardCard({
  title,
  value,
  icon,
  colorClass,
  className = "",
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 border-4 border-foreground bg-white p-4 shadow-[4px_4px_0_0_rgba(61,35,35,1)] sm:p-6 ${className}`}
    >
      <div className="min-w-0 space-y-2">
        <h3 className="break-words text-xs font-black uppercase text-foreground/60">
          {title}
        </h3>

        <p className="break-words font-mono text-3xl font-black sm:text-4xl">
          {value}
        </p>
      </div>

      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center border-2 border-foreground shadow-[2px_2px_0_0_#000] ${colorClass}`}
      >
        {icon}
      </div>
    </div>
  );
}