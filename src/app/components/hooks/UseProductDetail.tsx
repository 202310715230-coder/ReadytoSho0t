import { useCallback, useEffect, useState } from "react";

// ================================
// TYPES
// ================================

export interface ProductSpecifications {
  sensor?: string;
  video?: string;
  output?: string;
  resolution?: string;
  iso?: string;
  lens?: string;
  battery?: string;
  [key: string]: string | undefined;
}

export interface ProductDetailData {
  id: number;
  name: string;
  brand: string;
  category: string;

  description: string;

  price_per_day: number;
  price: number;

  image_path: string;
  image: string;
  image_full_url: string;

  status: string;

  specs?: ProductSpecifications;

  rating?: number;
  reviews?: number;
  includes?: string[];
  requirements?: string[];

  created_at?: string | null;
  message?: string;
}

interface ProductDetailResponse {
  status: "success" | "error";
  message?: string;
  data?: unknown;
  debug?: unknown;
}

// ================================
// CONFIG
// ================================

const API_BASE = "http://localhost/db_readytoshot";
const PRODUCT_IMAGE_BASE = `${API_BASE}/config/assets/products/`;

// ================================
// HELPERS
// ================================

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

function getBackendError(
  result: ProductDetailResponse | null,
  fallback: string
) {
  if (!result) return fallback;

  if (result.debug) {
    if (typeof result.debug === "string") {
      return `${result.message || fallback}: ${result.debug}`;
    }

    return `${result.message || fallback}: ${JSON.stringify(result.debug)}`;
  }

  return result.message || fallback;
}

function toNumber(value: unknown): number {
  const parsed = Number(value || 0);

  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
    return 0;
  }

  return parsed;
}

function normalizeImagePath(imagePath?: string | null) {
  if (!imagePath) return "";

  const fileName = String(imagePath).split("/").pop();

  return fileName || "";
}

function normalizeImageUrl(
  image?: string | null,
  imageFullUrl?: string | null,
  imagePath?: string | null
) {
  const source = imageFullUrl || image || imagePath || "";

  if (!source) return "";

  if (
    source.startsWith("http://") ||
    source.startsWith("https://")
  ) {
    return source;
  }

  const fileName = source.split("/").pop();

  return fileName ? `${PRODUCT_IMAGE_BASE}${fileName}` : "";
}

function parseSpecsSafe(value: unknown): ProductSpecifications {
  if (!value) {
    return {
      sensor: "Digital Camera",
      video: "Photo Output",
    };
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      if (parsed && typeof parsed === "object") {
        return parsed as ProductSpecifications;
      }

      return {
        sensor: "Digital Camera",
        video: "Photo Output",
      };
    } catch {
      return {
        sensor: "Digital Camera",
        video: "Photo Output",
      };
    }
  }

  if (typeof value === "object") {
    return value as ProductSpecifications;
  }

  return {
    sensor: "Digital Camera",
    video: "Photo Output",
  };
}

function parseStringArray(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item));
      }

      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function normalizeProduct(item: any): ProductDetailData {
  const imagePath = normalizeImagePath(item?.image_path || item?.image);
  const imageUrl = normalizeImageUrl(
    item?.image,
    item?.image_full_url,
    imagePath
  );

  const price = toNumber(item?.price_per_day || item?.price);

  return {
    id: toNumber(item?.id),

    name: item?.name || "UNNAMED_GEAR",
    brand: item?.brand || "READYTOSHOT",
    category: item?.category || "Kamera",

    description: item?.description || "",

    price_per_day: price,
    price,

    image_path: imagePath,
    image: imageUrl,
    image_full_url: imageUrl,

    status: item?.status || "available",

    specs: parseSpecsSafe(
      item?.specs || {
        sensor: item?.sensor,
        video: item?.video,
      }
    ),

    rating: toNumber(item?.rating),
    reviews: toNumber(item?.reviews),

    includes: parseStringArray(item?.includes),
    requirements: parseStringArray(item?.requirements),

    created_at: item?.created_at || null,
  };
}

// ================================
// HOOK
// ================================

export function useProductDetail(id: string | undefined) {
  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductDetail = useCallback(async () => {
    if (!id) {
      setProduct(null);
      setError("ID produk tidak ditemukan");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE}/get_product_detail.php?id=${encodeURIComponent(id)}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const result = await safeJson<ProductDetailResponse | any>(response);

      if (!response.ok) {
        throw new Error(
          getBackendError(
            result && typeof result === "object" ? result : null,
            `SERVER_ERROR: Status ${response.status}`
          )
        );
      }

      if (!result || typeof result !== "object") {
        throw new Error("Format response backend tidak valid");
      }

      if (result.status === "error") {
        throw new Error(result.message || "Produk tidak ditemukan");
      }

      const item =
        "data" in result && result.data
          ? result.data
          : result;

      if (!item || typeof item !== "object") {
        throw new Error("Data produk tidak ditemukan");
      }

      const formattedItem = normalizeProduct(item);

      if (!formattedItem.id) {
        setProduct({
          id: 0,
          name: "",
          brand: "",
          category: "",
          description: "",
          price_per_day: 0,
          price: 0,
          image_path: "",
          image: "",
          image_full_url: "",
          status: "",
          message: "Not Found",
        });

        setError("Produk tidak ditemukan");
        return;
      }

      setProduct(formattedItem);
    } catch (err) {
      console.error("Fetch product detail error:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Gagal mengambil detail produk";

      setError(message);
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchProductDetail();
  }, [fetchProductDetail]);

  return {
    product,
    isLoading,
    error,
    refetchProduct: fetchProductDetail,
  };
}