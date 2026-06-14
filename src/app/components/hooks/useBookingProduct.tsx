import { useState, useEffect } from 'react';

export interface ProductData {
  id: string | number;
  name: string;
  brand: string;
  price: number;
  image: string;
}

export function useBookingProduct(id: string | undefined) {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductFromDB = async () => {
      // 🎯 FIX 1: Jika ID tidak ada, matikan loading terlebih dahulu sebelum keluar (Early Return Guard)
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // 🎯 FIX 2: Sesuaikan path URL menembak folder XAMPP asli Anda
        const response = await fetch(`http://localhost/db_readytoshot/get_product_detail.php?id=${id}`);
        
        if (!response.ok) throw new Error(`NETWORK_RESPONSE_ERROR: Status ${response.status}`);
        
        const data = await response.json();

        if (data.status === 'success' || data.id) {
          const item = data.data || data;
          
          // 🎯 FIX 3: Sesuaikan path dasar folder penyimpanan aset gambar produk
          const backendImageBase = "http://localhost/db_readytoshot/config/assets/products/";

          setProduct({
            id: item.id,
            name: item.name,
            brand: item.brand || 'CAMERA',
            price: Number(item.price_per_day || item.price || 0),
            image: item.image || (item.image_path ? `${backendImageBase}${item.image_path}` : ''),
          });
        }
      } catch (error) {
        console.error("Transmission Error:", error);
        setProduct(null); // Reset ke null jika terjadi kegagalan transmisi data
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductFromDB();
  }, [id]);

  return { product, isLoading };
}