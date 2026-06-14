import { useState, useEffect } from 'react';

export interface RentalPendingData {
  id: number;
  renter_name: string;
  camera_name: string;
  camera_brand: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  created_at: string;
  qris_data: string;
}

export function useUserRentalStatus(whatsappNumber: string) {
  const [rental, setRental] = useState<RentalPendingData | null>(null);
  const [loading, setLoading] = useState(true);

  const checkPaymentStatus = async () => {
    // 🎯 FIX 1: Jika nomor WhatsApp belum siap, matikan loading sebelum keluar dari fungsi
    if (!whatsappNumber) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // 🎯 FIX 2: Sesuaikan alamat URL absolut ke folder XAMPP yang benar
      // 🎯 FIX 3: Tambahkan encodeURIComponent untuk mengamankan karakter seperti '+' pada nomor WhatsApp
      const targetUrl = `http://localhost/db_readytoshot/get_or_create_qris.php?whatsapp=${encodeURIComponent(whatsappNumber)}`;
      
      const response = await fetch(targetUrl);
      
      if (!response.ok) throw new Error(`NETWORK_RESPONSE_ERROR: Status ${response.status}`);
      
      const result = await response.json();
      
      if (result.status === "pending_exists" || result.status === "success") {
        setRental(result.data);
      } else {
        setRental(null);
      }
    } catch (error) {
      console.error("Gagal memuat status rental user:", error);
      setRental(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkPaymentStatus();
  }, [whatsappNumber]);

  return { rental, loading, refetchStatus: checkPaymentStatus };
}