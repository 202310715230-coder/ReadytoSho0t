import {
  User,
  Pencil,
  Camera,
  CreditCard,
  History,
  LogOut,
  Loader2,
  MapPin,
} from "lucide-react";

export type ProfileTab =
  | "edit-profile"
  | "address"
  | "active-camera"
  | "pelunasan"
  | "history";

interface ProfileMenuItem {
  id: ProfileTab;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  count: number | null;
}

interface ProfileSidebarProps {
  user: any;
  activeTab: ProfileTab;
  setActiveTab: (tab: ProfileTab) => void;
  activeCount: number;
  pelunasanCount: number;
  historyCount: number;
  isLoggingOut: boolean;
  onLogout: () => void;
}

export default function ProfileSidebar({
  user,
  activeTab,
  setActiveTab,
  activeCount,
  pelunasanCount,
  historyCount,
  isLoggingOut,
  onLogout,
}: ProfileSidebarProps) {
  const menus: ProfileMenuItem[] = [
    {
      id: "edit-profile",
      label: "Profil",
      shortLabel: "Profil",
      icon: Pencil,
      count: null,
    },
    {
      id: "address",
      label: "Alamat Saya",
      shortLabel: "Alamat",
      icon: MapPin,
      count: null,
    },
    {
      id: "active-camera",
      label: "Kamera Dirental",
      shortLabel: "Rental",
      icon: Camera,
      count: activeCount,
    },
    {
      id: "pelunasan",
      label: "Pelunasan",
      shortLabel: "Bayar",
      icon: CreditCard,
      count: pelunasanCount,
    },
    {
      id: "history",
      label: "History Rental",
      shortLabel: "Riwayat",
      icon: History,
      count: historyCount,
    },
  ];

  const fallbackImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${
    user?.username || "ReadyToShot"
  }`;

  const profileImage =
    user?.profile_photo_url || user?.profile_photo || fallbackImage;

  return (
    <aside className="w-full rounded-[28px] bg-white border border-[#E8DCCB] shadow-sm p-4 sm:p-5 h-fit">
      {/* USER INFO */}
      <div className="rounded-3xl bg-[#F8F3EA] border border-[#E8DCCB] p-4">
        <div className="flex items-center gap-4">
          <img
            src={profileImage}
            alt="Profile"
            className="w-14 h-14 rounded-2xl border border-[#E8DCCB] object-cover bg-white flex-shrink-0"
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
          />

          <div className="min-w-0 flex-1">
            <h2 className="font-black text-base leading-tight truncate text-[#2D1E17]">
              {user?.full_name || user?.username || "Customer"}
            </h2>

            <p className="text-xs text-[#7B6A5B] truncate mt-1">
              {user?.email || user?.whatsapp || "Akun ReadyToShot"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab("edit-profile")}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-[#E8DCCB] px-4 py-2.5 text-xs font-bold text-[#2D1E17] hover:bg-[#F5E7D3] transition"
        >
          <Pencil className="w-3.5 h-3.5" />
          Ubah Profil
        </button>
      </div>

      {/* MENU TITLE */}
      <div className="pt-5">
        <div className="hidden lg:flex items-center gap-2 mb-3 px-1">
          <div className="w-9 h-9 rounded-2xl bg-[#F5E7D3] flex items-center justify-center">
            <User className="w-4 h-4 text-[#8A5A2B]" />
          </div>

          <div>
            <h3 className="font-black text-sm text-[#2D1E17]">Akun Saya</h3>
            <p className="text-xs text-[#7B6A5B]">Menu profile customer</p>
          </div>
        </div>

        {/* MENU MOBILE / TABLET */}
        <nav className="lg:hidden -mx-1 overflow-x-auto pb-2">
          <div className="flex gap-2 px-1 min-w-max">
            {menus.map((menu) => {
              const Icon = menu.icon;
              const active = activeTab === menu.id;

              return (
                <button
                  key={menu.id}
                  type="button"
                  onClick={() => setActiveTab(menu.id)}
                  className={`relative flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold whitespace-nowrap border transition ${
                    active
                      ? "bg-[#2D1E17] text-white border-[#2D1E17]"
                      : "bg-white text-[#2D1E17] border-[#E8DCCB] hover:bg-[#F8F3EA]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {menu.shortLabel}

                  {menu.count !== null && (
                    <span
                      className={`ml-1 min-w-5 h-5 px-1.5 rounded-full text-[10px] flex items-center justify-center font-black ${
                        active
                          ? "bg-white text-[#2D1E17]"
                          : "bg-[#F5E7D3] text-[#8A5A2B]"
                      }`}
                    >
                      {menu.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* MENU DESKTOP */}
        <nav className="hidden lg:flex flex-col gap-2 mt-4">
          {menus.map((menu) => {
            const Icon = menu.icon;
            const active = activeTab === menu.id;

            return (
              <button
                key={menu.id}
                type="button"
                onClick={() => setActiveTab(menu.id)}
                className={`w-full flex items-center justify-between text-left text-sm px-4 py-3 rounded-2xl border transition ${
                  active
                    ? "bg-[#2D1E17] text-white border-[#2D1E17] shadow-sm"
                    : "bg-white text-[#2D1E17] border-transparent hover:border-[#E8DCCB] hover:bg-[#F8F3EA]"
                }`}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      active ? "bg-white/15" : "bg-[#F8F3EA]"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        active ? "text-white" : "text-[#8A5A2B]"
                      }`}
                    />
                  </span>

                  <span className="truncate font-bold">{menu.label}</span>
                </span>

                {menu.count !== null && (
                  <span
                    className={`min-w-6 h-6 px-2 rounded-full text-[11px] flex items-center justify-center font-black flex-shrink-0 ${
                      active
                        ? "bg-white text-[#2D1E17]"
                        : "bg-[#F5E7D3] text-[#8A5A2B]"
                    }`}
                  >
                    {menu.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* LOGOUT */}
      <button
        type="button"
        onClick={onLogout}
        disabled={isLoggingOut}
        className="mt-5 w-full flex items-center justify-center gap-2 rounded-2xl bg-[#FFF1F1] border border-[#F3C2C2] py-3 text-sm font-black text-[#B42318] hover:bg-[#FFE4E4] transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoggingOut ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <LogOut className="w-4 h-4" />
        )}

        {isLoggingOut ? "Keluar..." : "Logout"}
      </button>
    </aside>
  );
}