"use client";

import { RouterProvider } from 'react-router-dom'; 
import { router } from './routes'; // Pastikan path file router Anda sudah benar
import { Toaster } from 'sonner';

export default function App() {
  return (
    <>
      {/* Komponen Notifikasi Global */}
      <Toaster 
        position="top-center" 
        expand={false} 
        richColors 
        theme="system" /* Perbaikan komentar: Menggunakan format JS biasa agar tidak merusak properti */
        toastOptions={{
          style: {
            borderRadius: '0px',
            border: '3px solid #2D1E17',
            backgroundColor: '#FFFFFF',
            color: '#2D1E17',
            fontFamily: 'monospace',
            boxShadow: '4px 4px 0px 0px #2D1E17',
          },
          // Pastikan text-xs tidak membuat notifikasi terlalu kecil di perangkat mobile
          className: "font-mono font-black uppercase text-xs sm:text-sm",
        }}
      />
      
      {/* RouterProvider menyuntikkan konfigurasi rute multi-layout 
          (CustomerLayout & AdminLayout) ke seluruh aplikasi
      */}
      <RouterProvider router={router} />
    </>
  );
}