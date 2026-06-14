import { useRef } from "react";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import {
  Loader2,
  Save,
  X,
  Upload,
  UserCircle,
  ImagePlus,
  Check,
} from "lucide-react";

import ProfileRow from "./ProfileRow";
import ProfileInput from "./ProfileInput";
import KtpUploadBox from "./KtpUploadBox";

interface ProfileFormState {
  full_name: string;
  username: string;
  email: string;
  whatsapp: string;
  profile_photo: string;
  gender: string;
  birth_date: string;
}

interface EditProfileTabProps {
  user: any;
  profileForm: ProfileFormState;
  setProfileForm: Dispatch<SetStateAction<ProfileFormState>>;
  isSaving: boolean;
  isUploadingProfilePhoto?: boolean;
  isUploadingKtp?: boolean;
  onSave: () => void;
  onUploadProfilePhoto?: (file: File) => Promise<void> | void;
  onUploadKtp?: (file: File) => Promise<void> | void;
}

const GENDER_OPTIONS = ["Laki-laki", "Perempuan", "Lainnya"];

export default function EditProfileTab({
  user,
  profileForm,
  setProfileForm,
  isSaving,
  isUploadingProfilePhoto = false,
  isUploadingKtp = false,
  onSave,
  onUploadProfilePhoto,
  onUploadKtp,
}: EditProfileTabProps) {
  const profileInputRef = useRef<HTMLInputElement | null>(null);

  const fallbackImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${
    user?.username || "ReadyToShot"
  }`;

  const profileImage =
    user?.profile_photo_url ||
    profileForm.profile_photo ||
    user?.profile_photo ||
    fallbackImage;

  const resetForm = () => {
    setProfileForm({
      full_name: user?.full_name || user?.username || "",
      username: user?.username || "",
      email: user?.email || "",
      whatsapp: user?.whatsapp || user?.phone || "",
      profile_photo: user?.profile_photo_url || user?.profile_photo || "",
      gender: user?.gender || "Laki-laki",
      birth_date: user?.birth_date || "",
    });
  };

  const handleProfilePhotoChange = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      alert("Format foto profil harus JPG, JPEG, PNG, atau WEBP");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran foto profil maksimal 2MB");
      e.target.value = "";
      return;
    }

    if (onUploadProfilePhoto) {
      await onUploadProfilePhoto(file);
    }

    e.target.value = "";
  };

  const handleGenderChange = (gender: string) => {
    setProfileForm((prev) => ({
      ...prev,
      gender,
    }));
  };

  return (
    <section className="space-y-8">
      <div className="rounded-[24px] border border-[#E8DCCB] bg-[#F8F3EA] p-5 sm:p-6">
        <h1 className="text-2xl font-black text-[#2D1E17]">Profil Saya</h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#7B6A5B]">
          Kelola informasi profil, foto akun, dan dokumen identitas untuk
          memudahkan proses rental kamera di ReadyToShot Studio.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_320px]">
        {/* FORM KIRI */}
        <div className="rounded-[24px] border border-[#E8DCCB] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-black text-[#2D1E17]">
              Informasi Akun
            </h2>

            <p className="mt-1 text-sm text-[#7B6A5B]">
              Pastikan data kamu sudah benar sebelum melakukan rental.
            </p>
          </div>

          <div className="space-y-5">
            <ProfileRow
              label="Username"
              value={
                <div className="w-full rounded-2xl border border-[#E8DCCB] bg-[#F8F3EA] px-4 py-3 font-bold text-[#2D1E17]">
                  {profileForm.username || "-"}
                </div>
              }
            />

            <ProfileInput
              label="Nama"
              value={profileForm.full_name}
              onChange={(value) =>
                setProfileForm((prev) => ({
                  ...prev,
                  full_name: value,
                }))
              }
            />

            <ProfileInput
              label="Email"
              type="email"
              value={profileForm.email}
              onChange={(value) =>
                setProfileForm((prev) => ({
                  ...prev,
                  email: value,
                }))
              }
            />

            <ProfileInput
              label="Nomor Telepon"
              value={profileForm.whatsapp}
              onChange={(value) =>
                setProfileForm((prev) => ({
                  ...prev,
                  whatsapp: value,
                }))
              }
            />

            <ProfileRow
              label="Jenis Kelamin"
              value={
                <div className="flex flex-wrap gap-2">
                  {GENDER_OPTIONS.map((gender) => {
                    const active = profileForm.gender === gender;

                    return (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => handleGenderChange(gender)}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-black transition-all ${
                          active
                            ? "border-[#2D1E17] bg-[#2D1E17] text-white shadow-[3px_3px_0_0_#B07A3A]"
                            : "border-[#E8DCCB] bg-white text-[#2D1E17] hover:border-[#B07A3A] hover:bg-[#F8F3EA]"
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                            active ? "border-white bg-white" : "border-[#2D1E17]"
                          }`}
                        >
                          {active && <Check className="h-3 w-3 text-[#2D1E17]" />}
                        </span>

                        <span>{gender}</span>
                      </button>
                    );
                  })}
                </div>
              }
            />

            <ProfileInput
              label="Tanggal Lahir"
              type="date"
              value={profileForm.birth_date}
              onChange={(value) =>
                setProfileForm((prev) => ({
                  ...prev,
                  birth_date: value,
                }))
              }
            />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E8DCCB] bg-white px-6 py-3 text-sm font-black text-[#2D1E17] transition hover:bg-[#F8F3EA]"
            >
              <X className="h-4 w-4" />
              Reset
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2D1E17] px-7 py-3 text-sm font-black text-white transition hover:bg-[#463025] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </div>

        {/* KANAN */}
        <div className="space-y-6">
          {/* UPLOAD FOTO PROFILE */}
          <div className="rounded-[24px] border border-[#E8DCCB] bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#F5E7D3]">
                <UserCircle className="h-4 w-4 text-[#8A5A2B]" />
              </div>

              <div>
                <h3 className="font-black text-sm text-[#2D1E17]">
                  Foto Profil
                </h3>

                <p className="mt-0.5 text-xs text-[#7B6A5B]">
                  Foto ini akan tampil di akun kamu.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={profileImage}
                  alt="Avatar"
                  className="h-36 w-36 rounded-[32px] border border-[#E8DCCB] bg-[#F8F3EA] object-cover"
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage;
                  }}
                />

                <div className="absolute -bottom-3 -right-3 flex h-11 w-11 items-center justify-center rounded-2xl border-4 border-white bg-[#2D1E17]">
                  <ImagePlus className="h-5 w-5 text-white" />
                </div>
              </div>

              <input
                ref={profileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleProfilePhotoChange}
                className="hidden"
              />

              <button
                type="button"
                disabled={isUploadingProfilePhoto || !onUploadProfilePhoto}
                onClick={() => profileInputRef.current?.click()}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F5E7D3] px-5 py-3 text-sm font-black text-[#2D1E17] transition hover:bg-[#ECD8BA] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUploadingProfilePhoto ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}

                {isUploadingProfilePhoto ? "Mengupload..." : "Upload Foto"}
              </button>

              <p className="mt-3 text-center text-[11px] leading-relaxed text-[#7B6A5B]">
                Format: JPG, JPEG, PNG, WEBP. Maksimal ukuran file 2MB.
              </p>
            </div>
          </div>

          {onUploadKtp && (
            <KtpUploadBox
              ktpPhotoUrl={user?.ktp_photo_url}
              isUploading={isUploadingKtp}
              onUpload={onUploadKtp}
            />
          )}
        </div>
      </div>
    </section>
  );
}