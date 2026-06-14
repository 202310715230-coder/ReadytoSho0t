import { useCallback, useEffect, useState } from "react";

const API_BASE = "http://localhost/db_readytoshot";
const PRODUCTS_URL = `${API_BASE}/get_all_products.php`;
const PRODUCT_IMAGE_BASE = `${API_BASE}/config/assets/products/`;

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  description?: string | null;

  price_per_day: number;
  price?: number;

  image_path?: string | null;
  image?: string | null;
  image_full_url?: string | null;

  status: string;

  created_at?: string | null;
  category_id?: number | null;
}

interface ProductsResponse {
  status: "success" | "error";
  message?: string;
  total?: number;
  data?: Product[];
  debug?: unknown;
}

function formatBackendError(result: ProductsResponse | null, fallback: string) {
  if (!result) return fallback;

  if (result.debug) {
    if (typeof result.debug === "string") {
      return `${result.message || fallback}: ${result.debug}`;
    }

    return `${result.message || fallback}: ${JSON.stringify(result.debug)}`;
  }

  return result.message || fallback;
}

async function safeJson<T>(response: Response): Promise<T | null> {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    console.error("Response bukan JSON:", text);
    return null;
  }
}

function normalizeImageUrl(
  image?: string | null,
  imageFullUrl?: string | null,
  imagePath?: string | null
) {
  const source = imageFullUrl || image || imagePath || "";

  if (!source) return null;

  if (source.startsWith("http://") || source.startsWith("https://")) {
    return source;
  }

  const fileName = source.split("/").pop();

  return fileName ? `${PRODUCT_IMAGE_BASE}${fileName}` : null;
}

function normalizeImagePath(imagePath?: string | null) {
  if (!imagePath) return null;

  const fileName = imagePath.split("/").pop();

  return fileName || null;
}

function normalizeProduct(item: Product): Product {
  const price = Number(item.price_per_day || item.price || 0);

  const imagePath = normalizeImagePath(item.image_path || item.image || "");
  const imageUrl = normalizeImageUrl(
    item.image,
    item.image_full_url,
    imagePath
  );

  return {
    ...item,

    id: Number(item.id || 0),

    name: item.name || "UNNAMED_GEAR",
    brand: item.brand || "READYTOSHOT",
    category: item.category || "Kamera",
    description: item.description || "",

    price_per_day: Number.isNaN(price) ? 0 : price,
    price: Number.isNaN(price) ? 0 : price,

    image_path: imagePath,
    image: imageUrl,
    image_full_url: imageUrl,

    status: item.status || "available",

    created_at: item.created_at || null,
    category_id: item.category_id ? Number(item.category_id) : null,
  };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(PRODUCTS_URL, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      const result = await safeJson<ProductsResponse>(response);

      if (!response.ok || !result || result.status !== "success") {
        throw new Error(
          formatBackendError(result, "Gagal mengambil data produk")
        );
      }

      const productData = Array.isArray(result.data)
        ? result.data.map(normalizeProduct)
        : [];

      setProducts(productData);

      return {
        status: "success" as const,
        data: productData,
      };
    } catch (err) {
      console.error("Fetch products error:", err);

      const message =
        err instanceof Error
          ? err.message
          : "UNKNOWN_ERROR_ENCOUNTERED";

      setError(message);
      setProducts([]);

      return {
        status: "error" as const,
        message,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    error,
    refetchProducts: fetchProducts,
    refreshProducts: fetchProducts,
    setProducts,
    setError,
  };
}