"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Image as ImageIcon,
  RefreshCw,
  X,
  Save,
  Loader2,
} from "lucide-react";

import {
  useCrud,
  ProductItem,
  ProductFormPayload,
} from "../../components/hooks/UseCrud";

interface ProductFormState {
  id?: number;
  name: string;
  brand: string;
  category: string;
  description: string;
  price_per_day: string;
  status: string;
  imageFile: File | null;
}

const initialForm: ProductFormState = {
  name: "",
  brand: "",
  category: "",
  description: "",
  price_per_day: "",
  status: "available",
  imageFile: null,
};

const PRODUCT_IMAGE_BASE =
  "http://localhost/db_readytoshot/config/assets/products/";

function formatPrice(price: number | string | undefined) {
  const parsed = Number(price || 0);

  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
    return "0";
  }

  return new Intl.NumberFormat("id-ID").format(parsed);
}

function getProductImage(product: ProductItem) {
  const imageSource =
    product.image_full_url ||
    product.image ||
    product.image_path ||
    "";

  if (!imageSource) return null;

  if (
    imageSource.startsWith("http://") ||
    imageSource.startsWith("https://")
  ) {
    return imageSource;
  }

  const fileName = imageSource.split("/").pop();

  return fileName ? `${PRODUCT_IMAGE_BASE}${fileName}` : null;
}

function isReadyStatus(status?: string | null) {
  const value = status?.toLowerCase().trim() || "";

  return ["ready", "tersedia", "available", "aktif"].includes(value);
}

export default function AdminProducts() {
  const {
    products,
    loading,
    saving,
    deleting,
    error,
    refreshProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useCrud();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<ProductItem | null>(null);

  const [form, setForm] = useState<ProductFormState>(initialForm);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (!form.imageFile) return;

    const objectUrl = URL.createObjectURL(form.imageFile);
    setPreviewImage(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [form.imageFile]);

  const openAddModal = () => {
    setEditingProduct(null);
    setForm(initialForm);
    setPreviewImage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: ProductItem) => {
    setEditingProduct(product);

    setForm({
      id: product.id,
      name: product.name || "",
      brand: product.brand || "",
      category: product.category || "",
      description: product.description || "",
      price_per_day: String(product.price_per_day || product.price || ""),
      status: product.status || "available",
      imageFile: null,
    });

    setPreviewImage(getProductImage(product));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setIsModalOpen(false);
    setEditingProduct(null);
    setForm(initialForm);
    setPreviewImage(null);
  };

  const handleChange = (
    field: keyof ProductFormState,
    value: string | File | null
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert("Nama produk wajib diisi");
      return;
    }

    if (!form.brand.trim()) {
      alert("Brand wajib diisi");
      return;
    }

    if (!form.category.trim()) {
      alert("Kategori wajib diisi");
      return;
    }

    if (!form.price_per_day || Number(form.price_per_day) <= 0) {
      alert("Harga per hari wajib diisi");
      return;
    }

    const payload: ProductFormPayload = {
      id: form.id,
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      price_per_day: form.price_per_day,
      status: form.status,
      imageFile: form.imageFile,
    };

    const result = editingProduct
      ? await updateProduct(payload)
      : await createProduct(payload);

    if (result.status !== "success") {
      alert(result.message || "Gagal menyimpan produk");
      return;
    }

    alert(result.message || "Produk berhasil disimpan");
    closeModal();
  };

  const handleDelete = async (product: ProductItem) => {
    const confirmDelete = window.confirm(
      `Yakin ingin menghapus produk "${product.name}"?`
    );

    if (!confirmDelete) return;

    const result = await deleteProduct(product.id);

    if (result.status !== "success") {
      alert(result.message || "Gagal menghapus produk");
      return;
    }

    alert(result.message || "Produk berhasil dihapus");
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 text-center font-mono text-xs font-black uppercase sm:text-sm animate-pulse">
        Mengunduh Katalog Kamera...
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-8 animate-fadeIn text-foreground">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="break-words text-2xl font-black uppercase tracking-tight sm:text-3xl">
            Katalog Kamera
          </h1>

          <p className="mt-1 break-words text-xs font-bold text-foreground/60 uppercase sm:text-sm">
            Data real-time dari MySQL products table
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
          <button
            type="button"
            onClick={refreshProducts}
            className="flex items-center justify-center gap-2 border-2 border-foreground bg-white px-4 py-3 text-xs font-black uppercase text-foreground shadow-[4px_4px_0_0_#000] transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none sm:px-5"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 border-2 border-foreground bg-primary px-4 py-3 text-xs font-black uppercase text-white shadow-[4px_4px_0_0_#000] transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none sm:px-5"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="border-4 border-red-600 bg-red-100 p-4 text-xs font-black uppercase text-red-700 shadow-[4px_4px_0_0_#000] sm:text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:hidden">
        {products.length === 0 ? (
          <div className="border-4 border-foreground bg-white p-6 text-center text-xs font-black uppercase italic text-foreground/50 shadow-[4px_4px_0_0_#000]">
            Belum ada kamera di database Anda.
          </div>
        ) : (
          products.map((product) => {
            const imageUrl = getProductImage(product);
            const ready = isReadyStatus(product.status);

            return (
              <article
                key={product.id}
                className="overflow-hidden border-4 border-foreground bg-white shadow-[4px_4px_0_0_rgba(61,35,35,1)]"
              >
                <div className="flex gap-3 p-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden border-2 border-foreground bg-card shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/150x150?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-secondary/30">
                        <ImageIcon className="h-6 w-6 text-foreground/40" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="break-words text-base font-black uppercase leading-tight tracking-tight">
                      {product.name || "-"}
                    </h2>

                    <p className="mt-1 break-words text-xs font-black uppercase text-primary">
                      {product.brand || "-"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="border border-foreground bg-card px-2 py-0.5 text-[10px] font-black uppercase shadow-[1px_1px_0_0_#000]">
                        {product.category || "-"}
                      </span>

                      <span
                        className={`border-2 border-foreground px-2 py-0.5 text-[10px] font-black uppercase shadow-[1px_1px_0_0_#000] ${
                          ready ? "bg-green-400" : "bg-amber-400"
                        }`}
                      >
                        {product.status || "available"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-foreground p-4">
                  <p className="font-mono text-lg font-black">
                    Rp {formatPrice(product.price_per_day || product.price)}
                    <span className="text-xs"> / Hari</span>
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => openEditModal(product)}
                      className="flex items-center justify-center gap-2 border-2 border-foreground bg-amber-300 p-3 text-xs font-black uppercase shadow-[2px_2px_0_0_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={deleting}
                      onClick={() => handleDelete(product)}
                      className="flex items-center justify-center gap-2 border-2 border-foreground bg-red-400 p-3 text-xs font-black uppercase text-white shadow-[2px_2px_0_0_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-60"
                    >
                      {deleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Hapus
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      <div className="hidden border-4 border-foreground bg-white shadow-[6px_6px_0_0_rgba(61,35,35,1)] md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-left">
            <thead>
              <tr className="border-b-4 border-foreground bg-secondary/20 text-xs font-black uppercase tracking-wider">
                <th className="w-24 border-r-2 border-foreground p-4 text-center">
                  Preview
                </th>
                <th className="border-r-2 border-foreground p-4">
                  Nama & Brand
                </th>
                <th className="border-r-2 border-foreground p-4">
                  Kategori
                </th>
                <th className="border-r-2 border-foreground p-4">
                  Harga / Hari
                </th>
                <th className="border-r-2 border-foreground p-4 text-center">
                  Status
                </th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="font-mono text-sm font-bold">
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center font-black uppercase italic text-foreground/50"
                  >
                    Belum ada kamera di database Anda.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const imageUrl = getProductImage(product);
                  const ready = isReadyStatus(product.status);

                  return (
                    <tr
                      key={product.id}
                      className="border-b-2 border-foreground last:border-0 hover:bg-secondary/5"
                    >
                      <td className="border-r-2 border-foreground p-3 text-center">
                        <div className="inline-block h-14 w-14 overflow-hidden border-2 border-foreground bg-card shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://placehold.co/150x150?text=No+Image";
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-secondary/30">
                              <ImageIcon className="h-5 w-5 text-foreground/40" />
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="border-r-2 border-foreground p-4">
                        <span className="block break-words text-base font-black uppercase tracking-tight">
                          {product.name || "-"}
                        </span>
                        <span className="break-words text-xs font-black uppercase text-primary">
                          {product.brand || "-"}
                        </span>
                      </td>

                      <td className="border-r-2 border-foreground p-4">
                        <span className="border border-foreground bg-card px-2 py-0.5 text-xs font-black uppercase shadow-[1px_1px_0_0_#000]">
                          {product.category || "-"}
                        </span>
                      </td>

                      <td className="border-r-2 border-foreground p-4 text-base font-black">
                        Rp {formatPrice(product.price_per_day || product.price)}
                      </td>

                      <td className="border-r-2 border-foreground p-4 text-center">
                        <span
                          className={`block w-full border-2 border-foreground px-2 py-1 text-center text-xs font-black uppercase shadow-[2px_2px_0_0_#000] ${
                            ready ? "bg-green-400" : "bg-amber-400"
                          }`}
                        >
                          {product.status || "available"}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(product)}
                            className="border-2 border-foreground bg-amber-300 p-2 shadow-[2px_2px_0_0_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            disabled={deleting}
                            onClick={() => handleDelete(product)}
                            className="border-2 border-foreground bg-red-400 p-2 text-white shadow-[2px_2px_0_0_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-60"
                          >
                            {deleting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-end justify-center bg-black/50 p-3 sm:items-center sm:p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto border-4 border-foreground bg-white shadow-[8px_8px_0_0_#000]">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b-4 border-foreground bg-secondary/20 p-4 sm:p-5">
              <h2 className="text-lg font-black uppercase sm:text-xl">
                {editingProduct ? "Edit Kamera" : "Tambah Kamera"}
              </h2>

              <button
                type="button"
                onClick={closeModal}
                className="border-2 border-foreground bg-white p-2 shadow-[2px_2px_0_0_#000]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 p-4 sm:p-6 md:grid-cols-[1fr_220px] md:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <input
                  type="text"
                  placeholder="Nama Kamera"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full border-2 border-foreground p-3 font-mono text-sm font-bold outline-none"
                />

                <input
                  type="text"
                  placeholder="Brand"
                  value={form.brand}
                  onChange={(e) => handleChange("brand", e.target.value)}
                  className="w-full border-2 border-foreground p-3 font-mono text-sm font-bold outline-none"
                />

                <input
                  type="text"
                  placeholder="Kategori"
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full border-2 border-foreground p-3 font-mono text-sm font-bold outline-none"
                />

                <input
                  type="number"
                  placeholder="Harga per Hari"
                  value={form.price_per_day}
                  onChange={(e) =>
                    handleChange("price_per_day", e.target.value)
                  }
                  className="w-full border-2 border-foreground p-3 font-mono text-sm font-bold outline-none"
                />

                <textarea
                  placeholder="Deskripsi"
                  value={form.description}
                  onChange={(e) =>
                    handleChange("description", e.target.value)
                  }
                  className="min-h-[100px] w-full border-2 border-foreground p-3 font-mono text-sm font-bold outline-none"
                />

                <select
                  value={form.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full border-2 border-foreground p-3 font-mono text-sm font-bold outline-none"
                >
                  <option value="available">available</option>
                  <option value="unavailable">unavailable</option>
                  <option value="maintenance">maintenance</option>
                </select>
              </div>

              <div>
                <div className="flex h-44 w-full items-center justify-center overflow-hidden border-4 border-foreground bg-muted sm:h-40">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-12 w-12 opacity-40" />
                  )}
                </div>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) =>
                    handleChange("imageFile", e.target.files?.[0] || null)
                  }
                  className="mt-4 w-full text-xs font-bold"
                />

                <p className="mt-2 font-mono text-[10px] opacity-60">
                  Format: JPG, PNG, WEBP. Maksimal 2MB.
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 flex flex-col gap-3 border-t-4 border-foreground bg-white p-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="border-2 border-foreground bg-white px-5 py-3 text-xs font-black uppercase shadow-[2px_2px_0_0_#000] disabled:opacity-60"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="flex items-center justify-center gap-2 border-2 border-foreground bg-primary px-5 py-3 text-xs font-black uppercase text-white shadow-[2px_2px_0_0_#000] disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}