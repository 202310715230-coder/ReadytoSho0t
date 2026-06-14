"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Calendar,
  Search,
  RefreshCw,
  ShieldCheck,
  IdCard,
  Phone,
  UserRound,
} from "lucide-react";

interface PHPUser {
  id: number;
  username: string;
  full_name?: string | null;
  email: string;
  whatsapp?: string | null;
  profile_photo?: string | null;
  profile_photo_url?: string | null;
  ktp_photo?: string | null;
  ktp_photo_url?: string | null;
  ktp_status?: "not_uploaded" | "pending" | "verified" | "rejected" | string | null;
  gender?: string | null;
  birth_date?: string | null;
  role?: string | null;
  role_name?: string | null;
  created_at?: string | null;
}

interface UsersResponse {
  status: "success" | "error";
  message?: string;
  total?: number;
  data?: PHPUser[];
  debug?: unknown;
}

const API_BASE = "http://localhost/db_readytoshot";

function formatDate(date?: string | null) {
  if (!date) return "-";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getRoleLabel(user: PHPUser) {
  return user.role_name || user.role || "customer";
}

function getKtpStatusLabel(status?: string | null) {
  const value = status || "not_uploaded";

  if (value === "verified") return "Terverifikasi";
  if (value === "pending") return "Menunggu";
  if (value === "rejected") return "Ditolak";

  return "Belum Upload";
}

function getKtpStatusClass(status?: string | null) {
  const value = status || "not_uploaded";

  if (value === "verified") return "bg-green-400";
  if (value === "pending") return "bg-amber-300";
  if (value === "rejected") return "bg-red-400 text-white";

  return "bg-gray-200";
}

export default function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<PHPUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/get_all_users.php`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      const text = await response.text();

      let result: UsersResponse;

      try {
        result = JSON.parse(text);
      } catch {
        console.error("Response bukan JSON:", text);
        throw new Error("Response server bukan JSON. Cek file get_all_users.php");
      }

      if (response.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      if (response.status === 403) {
        throw new Error(
          result.message ||
            "Akses admin ditolak. Pastikan akun login memiliki role admin."
        );
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Gagal memuat data pelanggan");
      }

      setUsers(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error("Gagal memuat data pelanggan:", err);

      setUsers([]);
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memuat data pelanggan"
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return users;

    return users.filter((user) => {
      const username = user.username || "";
      const fullName = user.full_name || "";
      const email = user.email || "";
      const whatsapp = user.whatsapp || "";
      const role = getRoleLabel(user);

      return (
        username.toLowerCase().includes(query) ||
        fullName.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query) ||
        whatsapp.toLowerCase().includes(query) ||
        role.toLowerCase().includes(query)
      );
    });
  }, [users, searchQuery]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-4 text-center font-mono text-xs font-black uppercase sm:text-sm animate-pulse">
        Memuat Data Pelanggan...
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-8 animate-fadeIn text-foreground">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
            Data Pelanggan
          </h1>

          <p className="mt-1 text-xs font-bold text-foreground/60 uppercase sm:text-sm">
            Daftar akun kustomer terdaftar di MySQL users table
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          className="flex w-full items-center justify-center gap-2 border-4 border-foreground bg-white px-5 py-3 text-xs font-black uppercase shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none sm:w-auto"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="border-4 border-red-600 bg-red-100 p-4 text-xs font-black uppercase text-red-700 shadow-[4px_4px_0_0_#000] sm:text-sm">
          {error}
        </div>
      )}

      <div className="relative flex w-full max-w-full sm:max-w-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-foreground/50" />
        </div>

        <input
          type="text"
          placeholder="Cari nama, email, whatsapp, role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border-4 border-foreground bg-white py-3 pl-10 pr-4 font-mono text-xs font-bold shadow-[3px_3px_0_0_rgba(0,0,0,1)] focus:outline-none sm:text-sm"
        />
      </div>

      {/* Mobile card view */}
      <div className="grid gap-4 md:hidden">
        {filteredUsers.length === 0 ? (
          <div className="border-4 border-foreground bg-white p-6 text-center text-xs font-black uppercase italic text-foreground/50 shadow-[4px_4px_0_0_#000]">
            Tidak ada data pelanggan yang cocok.
          </div>
        ) : (
          filteredUsers.map((user) => {
            const roleLabel = getRoleLabel(user);
            const ktpStatus = user.ktp_status || "not_uploaded";

            return (
              <article
                key={user.id}
                className="border-4 border-foreground bg-white p-4 shadow-[4px_4px_0_0_rgba(61,35,35,1)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-black text-foreground/50">
                      #{user.id}
                    </p>
                    <h2 className="break-words text-lg font-black uppercase leading-tight">
                      {user.username || "-"}
                    </h2>
                    {user.full_name && (
                      <p className="mt-1 break-words text-xs font-black uppercase text-foreground/50">
                        {user.full_name}
                      </p>
                    )}
                  </div>

                  <UserRound className="h-7 w-7 shrink-0 text-primary" />
                </div>

                <div className="mt-4 space-y-2 font-mono text-xs font-bold">
                  <div className="flex min-w-0 items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0 text-primary" />
                    <span className="min-w-0 break-all">{user.email || "-"}</span>
                  </div>

                  <div className="flex min-w-0 items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0 text-green-600" />
                    <span className="min-w-0 break-all">{user.whatsapp || "-"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0 text-foreground/60" />
                    <span>{formatDate(user.created_at)}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span
                    className={`inline-flex items-center gap-1 border-2 border-foreground px-2 py-1 text-[10px] font-black uppercase shadow-[1px_1px_0_0_#000] ${getKtpStatusClass(
                      ktpStatus
                    )}`}
                  >
                    <IdCard className="h-3.5 w-3.5" />
                    {getKtpStatusLabel(ktpStatus)}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 border-2 border-foreground px-2 py-1 text-[10px] font-black uppercase shadow-[1px_1px_0_0_#000] ${
                      roleLabel.toLowerCase() === "admin"
                        ? "bg-red-400 text-white"
                        : "bg-green-400"
                    }`}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {roleLabel}
                  </span>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Desktop table view */}
      <div className="hidden border-4 border-foreground bg-white shadow-[6px_6px_0_0_rgba(61,35,35,1)] md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-b-4 border-foreground bg-secondary/20 text-xs font-black uppercase">
                <th className="w-24 border-r-2 border-foreground p-4">ID User</th>
                <th className="border-r-2 border-foreground p-4">Username</th>
                <th className="border-r-2 border-foreground p-4">Email Terdaftar</th>
                <th className="border-r-2 border-foreground p-4">WhatsApp</th>
                <th className="border-r-2 border-foreground p-4 text-center">Status KTP</th>
                <th className="border-r-2 border-foreground p-4 text-center">Tanggal Registrasi</th>
                <th className="p-4 text-center">Hak Akses</th>
              </tr>
            </thead>

            <tbody className="font-mono text-sm font-bold">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center font-black uppercase italic text-foreground/50">
                    Tidak ada data pelanggan yang cocok.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleLabel = getRoleLabel(user);
                  const ktpStatus = user.ktp_status || "not_uploaded";

                  return (
                    <tr key={user.id} className="border-b-2 border-foreground last:border-0 hover:bg-secondary/5">
                      <td className="border-r-2 border-foreground p-4 text-foreground/60">#{user.id}</td>
                      <td className="border-r-2 border-foreground p-4">
                        <span className="block text-base font-black uppercase">{user.username || "-"}</span>
                        {user.full_name && <span className="text-xs uppercase text-foreground/50">{user.full_name}</span>}
                      </td>
                      <td className="border-r-2 border-foreground p-4 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 shrink-0 text-primary" />
                          <span className="break-all">{user.email || "-"}</span>
                        </div>
                      </td>
                      <td className="border-r-2 border-foreground p-4 text-xs">{user.whatsapp || "-"}</td>
                      <td className="border-r-2 border-foreground p-4 text-center">
                        <span className={`inline-flex items-center gap-1 border-2 border-foreground px-3 py-1 text-xs font-black uppercase shadow-[1px_1px_0_0_#000] ${getKtpStatusClass(ktpStatus)}`}>
                          <IdCard className="h-3.5 w-3.5" />
                          {getKtpStatusLabel(ktpStatus)}
                        </span>
                      </td>
                      <td className="border-r-2 border-foreground p-4 text-center text-xs">
                        <div className="flex items-center justify-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-foreground/60" />
                          <span>{formatDate(user.created_at)}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1 border-2 border-foreground px-3 py-1 text-xs font-black uppercase shadow-[1px_1px_0_0_#000] ${roleLabel.toLowerCase() === "admin" ? "bg-red-400 text-white" : "bg-green-400"}`}>
                          <ShieldCheck className="h-3.5 w-3.5" />
                          {roleLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
