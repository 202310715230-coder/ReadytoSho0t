import { useState, useEffect } from 'react';

export interface Category {
  id: number;
  name: string;
  count: string;
  image: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCategories = async () => {
      try {
        setLoading(true); // Memastikan state loading direset ke true saat fetch dimulai
        setError(null);   // Membersihkan error lama jika ada

        // 🎯 FIX: Jalur URL disesuaikan dengan hierarki folder XAMPP asli Anda
        const response = await fetch('http://localhost/db_readytoshot/get_categories.php', {
          signal: controller.signal
        });
        
        if (!response.ok) {
          throw new Error(`NETWORK_RESPONSE_ERROR: Status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && Array.isArray(data.data)) {
          const mapped = data.data.map((c: any) => ({
            id: Number(c.id),
            name: c.name,
            count: `${c.count || 0} Koleksi`,
            // 💡 TIPS: Jika backend PHP Anda melempar nama file gambar mentah (misal: "dslr.jpg"),
            // Anda bisa menyambungkannya dengan base path aset di sini jika diperlukan.
            image: c.image || ''
          }));
          setCategories(mapped);
        } else {
          setError(data.message || 'Gagal memuat kategori');
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Terjadi kesalahan sistem');
          console.error("Error fetching categories:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    
    // Cleanup function untuk membatalkan request jika komponen di-unmount sebelum selesai
    return () => controller.abort();
  }, []);

  return { categories, loading, error };
}