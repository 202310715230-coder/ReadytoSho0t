"use client";

import { Outlet, useLocation } from 'react-router-dom';
import { CustomerNavbar } from './components/navigation/CustomerNavbar';
import { AdminSidebar } from './components/navigation/AdminSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

// 1. Wrapper Animasi Halaman (Tetap dipertahankan agar perpindahan halaman mulus)
function PageWrapper() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}

// 2. LAYOUT KHUSUS CUSTOMER (Menggunakan Navbar Atas + Tema Krem)
export function CustomerLayout() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F2E7D5] font-mono selection:bg-[#E6A34A] selection:text-[#2D1E17]">
      <CustomerNavbar />

      <main className="min-h-screen w-full overflow-x-hidden pt-20">
        <PageWrapper />
      </main>
    </div>
  );
}

export function AdminLayout() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background text-foreground font-mono selection:bg-primary selection:text-white">
      <AdminSidebar />

      <main
        className="
          min-h-screen
          w-full
          min-w-0
          overflow-x-hidden
          px-4
          py-5
          pt-24
          sm:px-6
          lg:pl-72
          lg:pr-8
          lg:pt-8
        "
      >
        <div className="mx-auto w-full max-w-7xl min-w-0">
          <PageWrapper />
        </div>
      </main>
    </div>
  );
}