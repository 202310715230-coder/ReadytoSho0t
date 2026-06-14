"use client";

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { AlertCircle, Calendar, CreditCard, RefreshCw } from 'lucide-react';
import { useUserRentalStatus } from '../components/hooks/UseUserRentalStatus';

export default function PaymentStatus() {
  // Simulasi nomor whatsapp user yang sedang login aktif (Faiq dari database kamu)
  const userWhatsapp = "081314342077"; 
  
  const { rental, loading, refetchStatus } = useUserRentalStatus(userWhatsapp);
  const [viewDetail, setViewDetail] = useState(false);

  const formatPrice = (num: number) => new Intl.NumberFormat('id-ID').format(num);

  if (loading) {
    return (
      <div className="p-8 text-center font-mono font-black animate-pulse text-primary">
        CHECKING_RENTAL_BILLING_STATUS...
      </div>
    );
  }

  // Jika statusnya bukan 'Menunggu Pembayaran' (sudah disetujui admin), kunci layar terbuka otomatis
  if (!rental) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 text-center border-4 border-black bg-green-100 font-mono font-bold shadow-[4px_4px_0_0_#000]">
        🎉 TIDAK ADA TAGIHAN PENDING.<br />AKSES SEWA KAMERA TERBUKA.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-6 border-4 border-black shadow-[6px_6px_0_0_#000] bg-[#E0F2FE] text-black rounded-none">
      {/* Tab Header */}
      <div className="flex border-b-4 border-black font-mono text-xs font-black">
        <button className="flex-1 bg-[#10B981] text-white p-3 uppercase tracking-wider">Deposit & Pay</button>
        <button className="flex-1 bg-white/40 p-3 uppercase tracking-wider border-l-4 border-black text-gray-600 cursor-not-allowed">Penarikan Dana</button>
      </div>

      {/* Warning Alert Banner */}
      <div className="p-4 text-center text-xs font-mono font-black border-b-2 border-black space-y-1 bg-amber-50">
        <p className="uppercase text-amber-700 flex items-center justify-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> Kamu Memiliki Sewa Pending Sebesar :
        </p>
        <p className="text-xl font-black text-[#80243C]">IDR {formatPrice(rental.total_price)}</p>
        
        <div className="pt-2 flex justify-center gap-2">
          <button 
            onClick={() => setViewDetail(!viewDetail)}
            className="px-4 py-1.5 bg-[#2563EB] text-white font-black text-[11px] uppercase border-2 border-black shadow-[2px_2px_0_0_#000] active:shadow-none cursor-pointer"
          >
            {viewDetail ? 'LIHAT QRIS CODE' : 'LIHAT DETAIL INVOICE'}
          </button>
          <button 
            onClick={refetchStatus}
            className="p-1.5 bg-white border-2 border-black shadow-[2px_2px_0_0_#000] active:shadow-none cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tampilan Konten Utama */}
      <div className="p-6 bg-white min-h-[320px] flex flex-col items-center justify-center font-mono">
        {!viewDetail ? (
          <div className="space-y-4 text-center w-full flex flex-col items-center">
            <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-1">
              <CreditCard className="w-4 h-4" /> PINDAI UNTUK MEMBAYAR
            </h3>
            <div className="p-3 border-4 border-black shadow-[4px_4px_0_0_#000] bg-white">
              <QRCodeSVG value={rental.qris_data} size={190} />
            </div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">READY_TO_SHOT_OFFICIAL_QRIS</p>
          </div>
        ) : (
          <div className="w-full space-y-3 text-left text-xs font-bold">
            <div className="border-b-2 border-dashed border-gray-200 pb-1.5">
              <span className="text-[10px] text-gray-400 block uppercase font-black">ID Sewa / No. Invoice</span>
              <span className="font-black text-blue-600">#{rental.id}</span>
            </div>
            <div className="border-b-2 border-dashed border-gray-200 pb-1.5">
              <span className="text-[10px] text-gray-400 block uppercase font-black">Nama Penyewa</span>
              <span className="uppercase font-black text-gray-800">{rental.renter_name}</span>
            </div>
            <div className="border-b-2 border-dashed border-gray-200 pb-1.5">
              <span className="text-[10px] text-gray-400 block uppercase font-black">Alat Kamera</span>
              <span className="uppercase font-black text-red-700">{rental.camera_brand} {rental.camera_name}</span>
            </div>
            <div className="border-b-2 border-dashed border-gray-200 pb-1.5">
              <span className="text-[10px] text-gray-400 block uppercase font-black">Durasi Rental</span>
              <span className="text-gray-800 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5" /> {rental.start_date} s/d {rental.end_date}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block uppercase font-black">Status Invoice</span>
              <span className="px-2 py-0.5 inline-block text-[10px] font-black uppercase border-2 border-black bg-amber-300 mt-1">
                {rental.status}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}