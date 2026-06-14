import { useCallback, useEffect, useState } from "react";

const API_BASE = "http://localhost/db_readytoshot";
const CRUD_URL = `${API_BASE}/crud.php`;
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export interface ProductItem {
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
}

interface CrudResponse {
  status: "success" | "error";
  message?: string;
  total?: number;
  data?: ProductItem[];
  id?: number;
  debug?: unknown;
}

export interface ProductFormPayload {
  id?: number;
  name: string;
  brand: string;
  category: string;
  description?: string;
  price_per_day: number | string;
  status: string;
  imageFile?: File | null;
}

function normalizeProduct(product: ProductItem): ProductItem {
  const price = Number(product.price_per_day || product.price || 0);

  return {
    ...product,
    id: Number(product.id || 0),
    name: product.name || "",
    brand: product.brand || "",
    category: product.category || "",
    description: product.description || "",
    price_per_day: Number.isNaN(price) ? 0 : price,
    price: Number.isNaN(price) ? 0 : price,
    image_path: product.image_path || null,
    image: product.image || product.image_full_url || null,
    image_full_url: product.image_full_url || product.image || null,
    status: product.status || "available",
    created_at: product.created_at || null,
  };
}

async function safeJson<T>(response: Response): Promise<T | null> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    console.error("Response bukan JSON:", text);
    return null;
  }
}

function getBackendError(result: CrudResponse | null, fallback: string) {
  if (!result) {
    return fallback;
  }

  if (result.debug) {
    if (typeof result.debug === "string") {
      return `${result.message || fallback}: ${result.debug}`;
    }

    return `${result.message || fallback}: ${JSON.stringify(result.debug)}`;
  }

  return result.message || fallback;
}

function validateProductPayload(payload: ProductFormPayload) {
  if (!payload.name.trim()) {
    throw new Error("Nama produk wajib diisi");
  }

  if (!payload.brand.trim()) {
    throw new Error("Brand produk wajib diisi");
  }

  if (!payload.category.trim()) {
    throw new Error("Kategori produk wajib diisi");
  }

  const price = Number(payload.price_per_day || 0);

  if (Number.isNaN(price) || !Number.isFinite(price) || price <= 0) {
    throw new Error("Harga per hari wajib diisi dan harus lebih dari 0");
  }

  if (payload.imageFile) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(payload.imageFile.type)) {
      throw new Error("Format gambar harus JPG, PNG, atau WEBP");
    }

    if (payload.imageFile.size > MAX_IMAGE_SIZE_BYTES) {
      throw new Error(`Ukuran gambar maksimal ${MAX_IMAGE_SIZE_MB}MB`);
    }
  }
}

function buildProductFormData(
  action: "create" | "update",
  payload: ProductFormPayload
) {
  const formData = new FormData();

  formData.append("action", action);

  if (action === "update") {
    formData.append("id", String(payload.id || ""));
  }

  formData.append("name", payload.name.trim());
  formData.append("brand", payload.brand.trim());
  formData.append("category", payload.category.trim());
  formData.append("description", payload.description?.trim() || "");
  formData.append("price_per_day", String(payload.price_per_day));
  formData.append("status", payload.status || "available");

  if (payload.imageFile) {
    formData.append("image", payload.imageFile);
    formData.append("imageFile", payload.imageFile);
  }

  return formData;
}

export function useCrud() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(CRUD_URL, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      const result = await safeJson<CrudResponse>(response);

      if (response.status === 401) {
        throw new Error("Anda belum login");
      }

      if (response.status === 403) {
        throw new Error("Akses admin ditolak");
      }

      if (!response.ok || !result || result.status !== "success") {
        throw new Error(getBackendError(result, "Gagal mengambil data produk"));
      }

      const data = Array.isArray(result.data)
        ? result.data.map(normalizeProduct)
        : [];

      setProducts(data);

      return {
        status: "success" as const,
        data,
      };
    } catch (err) {
      console.error("Fetch products error:", err);

      const message =
        err instanceof Error ? err.message : "Gagal mengambil data produk";

      setProducts([]);
      setError(message);

      return {
        status: "error" as const,
        message,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(
    async (payload: ProductFormPayload) => {
      setSaving(true);
      setError(null);

      try {
        validateProductPayload(payload);

        const formData = buildProductFormData("create", payload);

        const response = await fetch(CRUD_URL, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        const result = await safeJson<CrudResponse>(response);

        if (response.status === 401) {
          throw new Error("Anda belum login");
        }

        if (response.status === 403) {
          throw new Error("Akses admin ditolak");
        }

        if (!response.ok || !result || result.status !== "success") {
          throw new Error(getBackendError(result, "Gagal menambahkan produk"));
        }

        await fetchProducts();

        return {
          status: "success" as const,
          message: result.message || "Produk berhasil ditambahkan",
          id: result.id,
        };
      } catch (err) {
        console.error("Create product error:", err);

        const message =
          err instanceof Error ? err.message : "Gagal menambahkan produk";

        setError(message);

        return {
          status: "error" as const,
          message,
        };
      } finally {
        setSaving(false);
      }
    },
    [fetchProducts]
  );

  const updateProduct = useCallback(
    async (payload: ProductFormPayload) => {
      setSaving(true);
      setError(null);

      try {
        if (!payload.id) {
          throw new Error("ID produk tidak valid");
        }

        validateProductPayload(payload);

        const formData = buildProductFormData("update", payload);

        const response = await fetch(CRUD_URL, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        const result = await safeJson<CrudResponse>(response);

        if (response.status === 401) {
          throw new Error("Anda belum login");
        }

        if (response.status === 403) {
          throw new Error("Akses admin ditolak");
        }

        if (!response.ok || !result || result.status !== "success") {
          throw new Error(getBackendError(result, "Gagal memperbarui produk"));
        }

        await fetchProducts();

        return {
          status: "success" as const,
          message: result.message || "Produk berhasil diperbarui",
        };
      } catch (err) {
        console.error("Update product error:", err);

        const message =
          err instanceof Error ? err.message : "Gagal memperbarui produk";

        setError(message);

        return {
          status: "error" as const,
          message,
        };
      } finally {
        setSaving(false);
      }
    },
    [fetchProducts]
  );

  const deleteProduct = useCallback(async (id: number) => {
    setDeleting(true);
    setError(null);

    try {
      if (!id || id <= 0) {
        throw new Error("ID produk tidak valid");
      }

      const response = await fetch(CRUD_URL, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          action: "delete",
          id,
        }),
      });

      const result = await safeJson<CrudResponse>(response);

      if (response.status === 401) {
        throw new Error("Anda belum login");
      }

      if (response.status === 403) {
        throw new Error("Akses admin ditolak");
      }

      if (!response.ok || !result || result.status !== "success") {
        throw new Error(getBackendError(result, "Gagal menghapus produk"));
      }

      setProducts((prev) => prev.filter((item) => item.id !== id));

      return {
        status: "success" as const,
        message: result.message || "Produk berhasil dihapus",
      };
    } catch (err) {
      console.error("Delete product error:", err);

      const message =
        err instanceof Error ? err.message : "Gagal menghapus produk";

      setError(message);

      return {
        status: "error" as const,
        message,
      };
    } finally {
      setDeleting(false);
    }
  }, []);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    saving,
    deleting,
    error,

    fetchProducts,
    refreshProducts: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,

    setProducts,
    setError,
  };
}