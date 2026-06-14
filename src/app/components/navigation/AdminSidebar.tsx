"use client";

import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Camera,
  ClipboardList,
  Users,
  LogOut,
  Menu,
  X,
  Image as ImageIcon,
} from "lucide-react";

const API_BASE = "http://localhost/db_readytoshot";

const navItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Kelola Kamera",
    path: "/admin/products",
    icon: Camera,
  },
  {
    label: "Pesanan Sewa",
    path: "/admin/orders",
    icon: ClipboardList,
  },
  {
    label: "Data Penyewa",
    path: "/admin/users",
    icon: Users,
  },
];

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  const clearClientSession = () => {
    localStorage.removeItem("user_session");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    sessionStorage.clear();
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setIsOpen(false);

    try {
      await fetch(`${API_BASE}/logout.php`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });
    } catch (error) {
      console.error("Logout backend error:", error);
    } finally {
      clearClientSession();

      window.location.replace("/login");
    }
  };

  return (
    <>
      {/* TOPBAR MOBILE */}
      <header className="fixed left-0 top-0 z-[80] flex h-20 w-full items-center justify-between border-b-4 border-[#2D1E17] bg-[#F8F3EA] px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 rotate-[-3deg] items-center justify-center border-2 border-[#2D1E17] bg-[#80243C] text-white shadow-[3px_3px_0_0_#2D1E17]">
            <ImageIcon className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-black uppercase italic tracking-tight text-[#2D1E17]">
              READYTOADMIN
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#7B6A5B]">
              Admin Panel
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="border-2 border-[#2D1E17] bg-white p-3 text-[#2D1E17] shadow-[3px_3px_0_0_#2D1E17] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          aria-label="Buka menu admin"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* OVERLAY MOBILE */}
      {isOpen && (
        <button
          type="button"
          aria-label="Tutup menu admin"
          onClick={closeMenu}
          className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 z-[70] flex h-screen w-[78vw] max-w-[320px] flex-col border-r-4 border-[#2D1E17] bg-[#F8F3EA] px-5 py-6 transition-transform duration-300 ease-out lg:z-50 lg:w-64 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* HEADER SIDEBAR */}
        <div className="mb-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 rotate-[-3deg] items-center justify-center border-2 border-[#2D1E17] bg-[#80243C] text-white shadow-[3px_3px_0_0_#2D1E17]">
              <ImageIcon className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-black uppercase italic tracking-tight text-[#2D1E17]">
                READYTOADMIN
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#7B6A5B]">
                Control Panel
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeMenu}
            className="border-2 border-[#2D1E17] bg-white p-2 text-[#2D1E17] shadow-[2px_2px_0_0_#2D1E17] lg:hidden"
            aria-label="Tutup menu admin"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-1 flex-col gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 border-2 border-[#2D1E17] px-4 py-4 text-xs font-black uppercase tracking-wide shadow-[3px_3px_0_0_#2D1E17] transition-all ${
                    isActive
                      ? "bg-[#80243C] text-white"
                      : "bg-white text-[#2D1E17] hover:bg-[#F2E7D5]"
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="mt-6 flex items-center justify-center gap-3 border-2 border-red-800 bg-red-600 px-4 py-4 text-xs font-black uppercase tracking-wide text-white shadow-[3px_3px_0_0_#2D1E17] transition-all hover:bg-red-700 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut className="h-5 w-5" />
          {isLoggingOut ? "Keluar..." : "Keluar"}
        </button>
      </aside>
    </>
  );
}