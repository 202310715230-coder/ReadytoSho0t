"use client";

import { Outlet } from "react-router-dom";
import { CustomerNavbar } from "./CustomerNavbar";

// Layout khusus untuk halaman Customer/Umum
export function CustomerLayout() {
  return (
    <>
      <CustomerNavbar />
      {/* Tempat di mana halaman-halaman customer (Home, Katalog, dll) akan muncul */}
      <main className="pt-20"> 
        <Outlet />
      </main>
    </>
  );
}

// Layout khusus untuk halaman Admin
import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout() {
  return (
    <div className="flex bg-background min-h-screen">
      {/* Sidebar bersifat permanen di sini, tidak akan render ulang saat pindah menu */}
      <AdminSidebar />
      
      {/* Area konten admin yang dinamis di sebelah kanan sidebar */}
      <main className="flex-1 lg:pl-64 pl-0 lg:pt-6 pt-20 p-4 sm:p-6 min-h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}