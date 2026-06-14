"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Info, Loader2, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useProfile } from "../../components/hooks/UseProfile";
import { useAuth } from "../../components/hooks/UseAuth";

import ProfileSidebar, {
  ProfileTab,
} from "../../components/navigation/ProfileSidebar";

import EditProfileTab from "../../components/profile/EditProfileTab";
import BookingSection from "../../components/profile/BookingSection";
import ProfileAddressTab from "../../components/profile/ProfileAddressTab";
import { BookingCardData } from "../../components/profile/BookingCard";

interface ProfileFormState {
  full_name: string;
  username: string;
  email: string;
  whatsapp: string;
  profile_photo: string;
  gender: string;
  birth_date: string;
}

const BACKEND_BASE_URL = "http://localhost/db_readytoshot";

const ACTIVE_STATUSES = [
  "confirmed",
  "picked_up",
  "dikonfirmasi",
  "sedang disewa",
];

const PELUNASAN_STATUSES = [
  "pending",
  "menunggu pembayaran",
  "menunggu verifikasi",
];

const HISTORY_STATUSES = [
  "completed",
  "cancelled",
  "selesai",
  "dibatalkan",
];

function normalizeStatus(status?: string | null) {
  return String(status || "").toLowerCase().trim();
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

  return `${BACKEND_BASE_URL}/${cleanPath.replace(/^\/+/, "")}`;
}

function normalizeBooking(booking: any): BookingCardData {
  const paymentProof = booking?.payment_proof ?? null;

  const paymentProofUrl =
    booking?.payment_proof_url ||
    buildBackendUrl(paymentProof);

  return {
    id: booking?.id,

    image_path: booking?.image_path ?? null,
    image_full_url: booking?.image_full_url ?? null,

    product_name:
      booking?.product_name ??
      booking?.camera_name ??
      booking?.name ??
      null,

    camera_name:
      booking?.camera_name ??
      booking?.product_name ??
      booking?.name ??
      null,

    category: booking?.category ?? null,

    start_date: booking?.start_date ?? null,
    end_date: booking?.end_date ?? null,
    duration: booking?.duration ?? null,

    unit_price: booking?.unit_price ?? booking?.price_per_day ?? null,
    normal_total_price: booking?.normal_total_price ?? null,
    discount_percent: booking?.discount_percent ?? null,
    discount_amount: booking?.discount_amount ?? null,
    subtotal: booking?.subtotal ?? null,

    total_price: booking?.total_price ?? null,
    dp_amount: booking?.dp_amount ?? null,
    settlement_amount: booking?.settlement_amount ?? null,

    delivery_method: booking?.delivery_method ?? null,
    delivery_details: booking?.delivery_details ?? null,
    delivery_distance_km: booking?.delivery_distance_km ?? null,
    courier_fee: booking?.courier_fee ?? null,

    payment_proof: paymentProof,
    payment_proof_url: paymentProofUrl,

    status: booking?.status ?? null,
  };
}

export default function Profile() {
  const navigate = useNavigate();

  const {
    user: hookUser,
    bookings = [],
    isLoading,
    updateProfile,
    uploadProfilePhoto,
    uploadKtp,
    refetchProfile,
  } = useProfile();

  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState<ProfileTab>("edit-profile");
  const [localUser, setLocalUser] = useState<any>(null);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [isUploadingProfilePhoto, setIsUploadingProfilePhoto] =
    useState(false);

  const [isUploadingKtp, setIsUploadingKtp] = useState(false);

  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    full_name: "",
    username: "",
    email: "",
    whatsapp: "",
    profile_photo: "",
    gender: "Laki-laki",
    birth_date: "",
  });

  useEffect(() => {
    const session = localStorage.getItem("user_session");

    if (!session) return;

    try {
      setLocalUser(JSON.parse(session));
    } catch {
      localStorage.removeItem("user_session");
      localStorage.removeItem("user_id");
    }
  }, []);

  const user = hookUser || localUser;

  useEffect(() => {
    if (!user) return;

    setProfileForm({
      full_name: user.full_name || user.username || "",
      username: user.username || "",
      email: user.email || "",
      whatsapp: user.whatsapp || user.phone || "",
      profile_photo: user.profile_photo_url || user.profile_photo || "",
      gender: user.gender || "Laki-laki",
      birth_date: user.birth_date || "",
    });
  }, [user]);

  useEffect(() => {
    if (!isLoading && !user && !localStorage.getItem("user_session")) {
      navigate("/login", { replace: true });
    }
  }, [isLoading, user, navigate]);

  const normalizedBookings = useMemo(() => {
    const mapped = Array.isArray(bookings)
      ? bookings.map(normalizeBooking)
      : [];

    console.log("PROFILE BOOKINGS RAW:", bookings);
    console.log("PROFILE BOOKINGS NORMALIZED:", mapped);

    return mapped;
  }, [bookings]);

  const activeRentals = useMemo(() => {
    return normalizedBookings.filter((booking) =>
      ACTIVE_STATUSES.includes(normalizeStatus(booking.status))
    );
  }, [normalizedBookings]);

  const pelunasanBookings = useMemo(() => {
    return normalizedBookings.filter((booking) =>
      PELUNASAN_STATUSES.includes(normalizeStatus(booking.status))
    );
  }, [normalizedBookings]);

  const historyBookings = useMemo(() => {
    return normalizedBookings.filter((booking) =>
      HISTORY_STATUSES.includes(normalizeStatus(booking.status))
    );
  }, [normalizedBookings]);

  const handleSaveProfile = async () => {
    if (isSaving) return;

    if (!profileForm.email.trim()) {
      alert("Email wajib diisi");
      return;
    }

    setIsSaving(true);

    try {
      const result = await updateProfile({
        full_name: profileForm.full_name,
        email: profileForm.email,
        whatsapp: profileForm.whatsapp,
        gender: profileForm.gender,
        birth_date: profileForm.birth_date,
      });

      if (result.status !== "success") {
        alert(result.message || "Gagal update profile");
        return;
      }

      if ("user" in result && result.user) {
        setLocalUser(result.user);
      }

      await refetchProfile();

      alert("Profile berhasil diperbarui");
    } catch (error) {
      console.error("Save profile error:", error);
      alert("Gagal menyimpan profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadProfilePhoto = async (file: File) => {
    if (isUploadingProfilePhoto) return;

    setIsUploadingProfilePhoto(true);

    try {
      const result = await uploadProfilePhoto(file);

      if (result.status !== "success") {
        alert(result.message || "Gagal upload foto profile");
        return;
      }

      await refetchProfile();

      if (result.profile_photo_url) {
        setProfileForm((prev) => ({
          ...prev,
          profile_photo: result.profile_photo_url || "",
        }));
      }

      alert("Foto profile berhasil diupload");
    } catch (error) {
      console.error("Upload profile photo error:", error);
      alert("Gagal upload foto profile");
    } finally {
      setIsUploadingProfilePhoto(false);
    }
  };

  const handleUploadKtp = async (file: File) => {
    if (isUploadingKtp) return;

    setIsUploadingKtp(true);

    try {
      const result = await uploadKtp(file);

      if (result.status !== "success") {
        alert(result.message || "Gagal upload KTP");
        return;
      }

      await refetchProfile();

      alert("Foto KTP berhasil diupload");
    } catch (error) {
      console.error("Upload KTP error:", error);
      alert("Gagal upload KTP");
    } finally {
      setIsUploadingKtp(false);
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const result = await logout();

      if (result?.status !== "success") {
        alert(result?.message || "Logout gagal");
        return;
      }

      localStorage.removeItem("user_session");
      localStorage.removeItem("user_id");

      setLocalUser(null);
      window.location.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout gagal. Silakan coba lagi.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getPageTitle = () => {
    if (activeTab === "edit-profile") return "Edit Profile";
    if (activeTab === "address") return "Alamat Saya";
    if (activeTab === "active-camera") return "Kamera Aktif";
    if (activeTab === "pelunasan") return "Pelunasan";
    if (activeTab === "history") return "History Rental";
    return "Profile";
  };

  const getPageDescription = () => {
    if (activeTab === "edit-profile") {
      return "Kelola informasi akun, foto profile, dan data identitas kamu.";
    }

    if (activeTab === "address") {
      return "Kelola alamat pengiriman dan tentukan titik lokasi melalui maps.";
    }

    if (activeTab === "active-camera") {
      return "Pantau kamera yang sudah dikonfirmasi atau sedang kamu rental.";
    }

    if (activeTab === "pelunasan") {
      return "Lihat tagihan pembayaran dan status verifikasi rental.";
    }

    if (activeTab === "history") {
      return "Lihat riwayat rental kamera yang pernah kamu lakukan.";
    }

    return "Kelola akun ReadyToShot Studio kamu.";
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-[#F8F3EA] flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-3xl bg-white border border-[#E8DCCB] shadow-sm p-8 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F5E7D3] flex items-center justify-center mb-5">
            <Loader2 className="w-7 h-7 animate-spin text-[#8A5A2B]" />
          </div>

          <h1 className="text-lg font-black text-[#2D1E17]">
            Memuat Profile
          </h1>

          <p className="text-sm text-[#7B6A5B] mt-2">
            Mohon tunggu sebentar, data akun kamu sedang diproses.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F3EA] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl bg-white border border-[#E8DCCB] shadow-sm p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FFF4DC] flex items-center justify-center mb-5">
            <Info className="w-8 h-8 text-[#B7791F]" />
          </div>

          <h1 className="text-2xl font-black text-[#2D1E17]">
            Akses Ditolak
          </h1>

          <p className="text-sm text-[#7B6A5B] mt-3 mb-6 leading-relaxed">
            Silakan login terlebih dahulu untuk melihat dan mengelola profile
            kamu.
          </p>

          <button
            type="button"
            onClick={() => navigate("/login", { replace: true })}
            className="w-full rounded-2xl bg-[#2D1E17] px-6 py-3 text-sm font-bold text-white hover:bg-[#463025] transition"
          >
            Login Sekarang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F3EA] text-[#2D1E17]">
      <div className="pt-24 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <section className="mb-8 rounded-[28px] bg-white border border-[#E8DCCB] shadow-sm overflow-hidden">
            <div className="p-5 sm:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-[#F5E7D3] border border-[#E8DCCB] flex items-center justify-center overflow-hidden">
                  {profileForm.profile_photo ? (
                    <img
                      src={profileForm.profile_photo}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserRound className="w-8 h-8 text-[#8A5A2B]" />
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B07A3A]">
                    Customer Profile
                  </p>

                  <h1 className="text-2xl sm:text-3xl font-black mt-1">
                    {user?.full_name || user?.username || "Customer"}
                  </h1>

                  <p className="text-sm text-[#7B6A5B] mt-1">
                    {user?.email || "Email belum ditambahkan"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-[#F8F3EA] border border-[#E8DCCB] px-4 py-3 text-center">
                  <p className="text-lg font-black">{activeRentals.length}</p>
                  <p className="text-[11px] font-bold text-[#7B6A5B] uppercase">
                    Aktif
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F8F3EA] border border-[#E8DCCB] px-4 py-3 text-center">
                  <p className="text-lg font-black">
                    {pelunasanBookings.length}
                  </p>
                  <p className="text-[11px] font-bold text-[#7B6A5B] uppercase">
                    Bayar
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F8F3EA] border border-[#E8DCCB] px-4 py-3 text-center">
                  <p className="text-lg font-black">{historyBookings.length}</p>
                  <p className="text-[11px] font-bold text-[#7B6A5B] uppercase">
                    History
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
            <aside className="lg:sticky lg:top-28 h-fit">
              <ProfileSidebar
                user={user}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                activeCount={activeRentals.length}
                pelunasanCount={pelunasanBookings.length}
                historyCount={historyBookings.length}
                isLoggingOut={isLoggingOut}
                onLogout={handleLogout}
              />
            </aside>

            <main className="min-h-[680px] rounded-[28px] bg-white border border-[#E8DCCB] shadow-sm overflow-hidden">
              <div className="border-b border-[#EFE3D3] px-5 sm:px-8 py-6 bg-white">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B07A3A]">
                  ReadyToShot Studio
                </p>

                <h2 className="text-2xl sm:text-3xl font-black mt-2">
                  {getPageTitle()}
                </h2>

                <p className="text-sm text-[#7B6A5B] mt-2 max-w-2xl leading-relaxed">
                  {getPageDescription()}
                </p>
              </div>

              <div className="p-4 sm:p-6 lg:p-8">
                <AnimatePresence mode="wait">
                  {activeTab === "edit-profile" && (
                    <motion.div
                      key="edit-profile"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.2 }}
                    >
                      <EditProfileTab
                        user={user}
                        profileForm={profileForm}
                        setProfileForm={setProfileForm}
                        isSaving={isSaving}
                        isUploadingProfilePhoto={isUploadingProfilePhoto}
                        isUploadingKtp={isUploadingKtp}
                        onSave={handleSaveProfile}
                        onUploadProfilePhoto={handleUploadProfilePhoto}
                        onUploadKtp={handleUploadKtp}
                      />
                    </motion.div>
                  )}

                  {activeTab === "address" && (
                    <motion.div
                      key="address"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ProfileAddressTab
                        username={user?.full_name || user?.username}
                        whatsapp={user?.whatsapp || user?.phone}
                      />
                    </motion.div>
                  )}

                  {activeTab === "active-camera" && (
                    <motion.div
                      key="active-camera"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.2 }}
                    >
                      <BookingSection
                        title="Kamera Yang Sedang Dirental"
                        loading={isLoading}
                        data={activeRentals}
                        empty="Tidak ada kamera aktif. Booking yang masih menunggu verifikasi akan tampil di menu Pelunasan."
                      />
                    </motion.div>
                  )}

                  {activeTab === "pelunasan" && (
                    <motion.div
                      key="pelunasan"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.2 }}
                    >
                      <BookingSection
                        title="Pelunasan"
                        loading={isLoading}
                        data={pelunasanBookings}
                        empty="Tidak ada tagihan pelunasan."
                        showPaymentButton
                      />
                    </motion.div>
                  )}

                  {activeTab === "history" && (
                    <motion.div
                      key="history"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.2 }}
                    >
                      <BookingSection
                        title="History Rental"
                        loading={isLoading}
                        data={historyBookings}
                        empty="History rental masih kosong."
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}