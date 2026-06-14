"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Cpu,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { ProductCard } from "../../components/catalog/ProductCard";
import { Footer } from "../../components/Footer";
import { useProducts } from "../../components/hooks/UseProducts";

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("category");
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    type: "all",
    priceRange: [0, 5000000],
    availability: "all",
  });

  const { products = [], isLoading } = useProducts();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, sortBy]);

  const categories = useMemo(() => {
    if (!products || products.length === 0) return ["all"];

    const types = products
      .map((product) => String(product.category || "").trim())
      .filter(Boolean);

    return ["all", ...Array.from(new Set(types)).sort((a, b) =>
      a.localeCompare(b)
    )];
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    const query = searchQuery.toLowerCase().trim();

    const filtered = products.filter((product) => {
      const productName = String(product.name || "").toLowerCase();
      const productBrand = String(product.brand || "").toLowerCase();
      const productCategory = String(product.category || "");

      const matchesSearch =
        !query ||
        productName.includes(query) ||
        productBrand.includes(query) ||
        productCategory.toLowerCase().includes(query);

      const matchesType =
        filters.type === "all" || productCategory === filters.type;

      const itemPrice = Number(product.price_per_day || product.price || 0);

      const matchesPrice =
        itemPrice >= filters.priceRange[0] &&
        itemPrice <= filters.priceRange[1];

      const isAvailable =
        String(product.status || "").toLowerCase().trim() === "available";

      const matchesAvailability =
        filters.availability === "all" ||
        (filters.availability === "available" && isAvailable);

      return (
        matchesSearch &&
        matchesType &&
        matchesPrice &&
        matchesAvailability
      );
    });

    const mapped = filtered.map((product) => {
      const imageFile = product.image_path
        ? String(product.image_path).split("/").pop()
        : "";

      return {
        ...product,
        image:
          product.image_full_url ||
          product.image ||
          (imageFile
            ? `http://localhost/db_readytoshot/config/assets/products/${imageFile}`
            : ""),
        image_full_url:
          product.image_full_url ||
          product.image ||
          (imageFile
            ? `http://localhost/db_readytoshot/config/assets/products/${imageFile}`
            : ""),
        price: Number(product.price_per_day || product.price || 0),
      };
    });

    return mapped.sort((a, b) => {
      const categoryA = String(a.category || "").toLowerCase();
      const categoryB = String(b.category || "").toLowerCase();
      const nameA = String(a.name || "").toLowerCase();
      const nameB = String(b.name || "").toLowerCase();

      if (sortBy === "category") {
        const categoryCompare = categoryA.localeCompare(categoryB);

        if (categoryCompare !== 0) {
          return categoryCompare;
        }

        return nameA.localeCompare(nameB);
      }

      if (sortBy === "price-low") {
        return Number(a.price || 0) - Number(b.price || 0);
      }

      if (sortBy === "price-high") {
        return Number(b.price || 0) - Number(a.price || 0);
      }

      if (sortBy === "name") {
        return nameA.localeCompare(nameB);
      }

      return 0;
    });
  }, [products, searchQuery, filters, sortBy]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    return filteredAndSortedProducts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredAndSortedProducts, currentPage]);

  return (
    <div className="min-h-screen bg-background pt-0 selection:bg-secondary selection:text-foreground overflow-x-hidden font-mono">
      <section className="pt-6 pb-8 px-4 sm:px-6 lg:px-8 border-b-[3px] border-foreground bg-muted/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Cpu className="size-48" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-secondary font-mono text-[10px] font-black tracking-[0.4em] uppercase">
              <Activity className="size-3.5 animate-pulse" />
              System Inventory v1.0 || Access: Granted
            </div>

            <h1 className="text-5xl sm:text-7xl font-black uppercase italic tracking-tighter leading-none">
              LIST{" "}
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "2px currentColor" }}
              >
                KAMERA
              </span>
            </h1>
          </div>

          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />

              <input
                type="text"
                placeholder="CARI PRODUCT / BRAND / CATEGORY"
                className="w-full bg-background border-[3px] border-foreground p-3 pl-11 font-mono font-bold text-sm uppercase focus:bg-secondary/5 focus:border-secondary outline-none transition-all shadow-[4px_4px_0_0_#000] focus:shadow-none focus:translate-x-1 focus:translate-y-1 rounded-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="bg-background border-[3px] border-foreground p-3 font-mono font-bold text-sm uppercase outline-none cursor-pointer hover:bg-muted shadow-[4px_4px_0_0_#000] active:shadow-none rounded-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="category">SORT BY CATEGORY</option>
              <option value="name">SORT BY NAME</option>
              <option value="price-low">PRICE LOW TO HIGH</option>
              <option value="price-high">PRICE HIGH TO LOW</option>
            </select>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
              <div className="size-10 border-4 border-foreground border-t-secondary animate-spin rounded-none" />

              <span className="font-mono text-[10px] font-black animate-pulse text-secondary uppercase italic">
                Retrieving_Core_Database...
              </span>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              <aside className="w-full lg:w-48 space-y-4 flex-shrink-0">
                <div>
                  <h3 className="font-black uppercase italic text-sm mb-2.5 border-b-4 border-secondary inline-block">
                    Filter Category
                  </h3>

                  <div className="flex flex-wrap lg:flex-col gap-1.5">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            type: cat,
                          }))
                        }
                        className={`text-left px-3 py-1.5 border-2 border-foreground font-mono text-[9px] font-black uppercase transition-all shadow-[2px_2px_0_0_#000] active:shadow-none rounded-none cursor-pointer ${
                          filters.type === cat
                            ? "bg-secondary translate-x-0.5 translate-y-0.5 shadow-none"
                            : "hover:bg-muted"
                        }`}
                      >
                        {cat === "all" ? "ALL CATEGORY" : cat.replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  <AnimatePresence mode="popLayout">
                    {paginatedProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ProductCard product={product} index={index} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {filteredAndSortedProducts.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 border-[3px] border-dashed border-foreground/20 uppercase font-mono text-xs italic bg-muted/10"
                  >
                    Zero_Results_Found_In_Current_Scope
                  </motion.div>
                )}

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 pt-6 border-t-2 border-foreground/10">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                      className="p-2 border-2 border-foreground hover:bg-secondary disabled:opacity-30 disabled:hover:bg-transparent transition-colors rounded-none cursor-pointer"
                    >
                      <ChevronLeft className="size-4" />
                    </button>

                    <span className="font-mono font-black text-xs uppercase">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      className="p-2 border-2 border-foreground hover:bg-secondary disabled:opacity-30 disabled:hover:bg-transparent transition-colors rounded-none cursor-pointer"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
} 