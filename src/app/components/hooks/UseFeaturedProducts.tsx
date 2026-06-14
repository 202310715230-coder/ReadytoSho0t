import { useState, useEffect } from 'react';

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  status: string;
  rating: number;
  reviews: number;
  popular: boolean;
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🎯 FIX 1: Jalur endpoint disesuaikan dengan absolute path XAMPP Anda (Dihapus '/api/' dan diarahkan ke folder yang benar)
        const response = await fetch('http://localhost/db_readytoshot/get_featured.php', {
          signal: controller.signal
        });
        
        if (!response.ok) throw new Error(`NETWORK_RESPONSE_ERROR: Status ${response.status}`);
        
        const data = await response.json();

        if (data.status === 'success' && Array.isArray(data.data)) {
          const mappedProducts = data.data.map((item: any) => ({
            id: Number(item.id),
            name: item.name,
            brand: item.brand || 'CAMERA',
            price: Number(item.price_per_day || 0),
            // 🎯 FIX 2: Sesuaikan path dasar folder penyimpanan aset gambar produk agar muncul di UI
            image: `http://localhost/db_readytoshot/config/assets/products/${item.image_path}`,
            category: item.category,
            status: item.status || 'available',
            rating: 4.9, 
            reviews: Math.floor(Math.random() * 40) + 15, // Mock reviews tetap aman
            popular: item.id % 2 === 0, 
          }));
          setProducts(mappedProducts);
        } else {
          setError(data.message || 'Format respons tidak valid');
          setProducts([]);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Gagal memuat produk unggulan');
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, []);

  return { products, loading, error };
}