import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Medicine, Category, PaginationMeta } from "../types";
import { medicinesApi, MedicineFilters } from "../api/medicines";
import { categoriesApi } from "../api/categories";
import MedicineCard from "../components/medicine/MedicineCard";
import MainLayout from "../components/layout/MainLayout";
import Spinner from "../components/common/Spinner";
import Pagination from "../components/common/Pagination";
import EmptyState from "../components/common/EmptyState";
import useDebounce from "../hooks/useDebounce";
import { Package } from "lucide-react";

const SORT_OPTIONS = [
  { value: "newest",    label: "Newest first" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc",label: "Price: High → Low" },
];

const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [medicines, setMedicines]   = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading]       = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [search, setSearch]         = useState(searchParams.get("search")     ?? "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") ?? "");
  const [minPrice, setMinPrice]     = useState(searchParams.get("minPrice")   ?? "");
  const [maxPrice, setMaxPrice]     = useState(searchParams.get("maxPrice")   ?? "");
  const [page, setPage]             = useState(Number(searchParams.get("page") ?? 1));

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    categoriesApi.getAll().then((r) => setCategories(r.data.data));
  }, []);

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    try {
      const params: MedicineFilters = { limit: 12, page };
      if (debouncedSearch) params.search = debouncedSearch;
      if (categoryId) params.categoryId = categoryId;
      if (minPrice)   params.minPrice   = minPrice;
      if (maxPrice)   params.maxPrice   = maxPrice;

      const res = await medicinesApi.getAll(params);
      setMedicines(res.data.data.medicines);
      setPagination(res.data.data.pagination);

      // Sync URL params
      const p = new URLSearchParams();
      if (debouncedSearch) p.set("search", debouncedSearch);
      if (categoryId)      p.set("categoryId", categoryId);
      if (minPrice)        p.set("minPrice", minPrice);
      if (maxPrice)        p.set("maxPrice", maxPrice);
      if (page > 1)        p.set("page", String(page));
      setSearchParams(p, { replace: true });
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [debouncedSearch, categoryId, minPrice, maxPrice, page, setSearchParams]);

  useEffect(() => { fetchMedicines(); }, [fetchMedicines]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [debouncedSearch, categoryId, minPrice, maxPrice]);

  const clearFilters = () => {
    setSearch(""); setCategoryId(""); setMinPrice(""); setMaxPrice(""); setPage(1);
    setSearchParams({}, { replace: true });
  };

  const hasActive = search || categoryId || minPrice || maxPrice;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-100">Medicine Shop</h1>
            <p className="text-gray-600 text-sm mt-1">
              {pagination ? `${pagination.total} products available` : "Browse all medicines"}
            </p>
          </div>
          {/* Mobile filter toggle */}
          <button
            onClick={() => setFiltersOpen((p) => !p)}
            className="flex items-center gap-2 px-4 py-2 border border-surface-border rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:border-brand-500/40 transition-all sm:hidden"
          >
            <SlidersHorizontal size={15} />
            Filters
            {hasActive && <span className="w-1.5 h-1.5 bg-brand-500 rounded-full" />}
          </button>
        </div>

        <div className="flex gap-6">

          {/* ── Sidebar Filters ─────────────────────────────────── */}
          <aside className={`w-56 flex-shrink-0 flex-col gap-4 ${filtersOpen ? "flex" : "hidden sm:flex"}`}>

            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
              <input
                type="text"
                placeholder="Search medicines…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface-card border border-surface-border rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Filter card */}
            <div className="bg-surface-card border border-surface-border rounded-xl overflow-hidden sticky top-20">

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Filters</span>
                {hasActive && (
                  <button onClick={clearFilters} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
                    <X size={11} /> Clear
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="p-3 border-b border-surface-border">
                <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-2 px-1">Category</p>
                <div className="flex flex-col gap-0.5 max-h-52 overflow-y-auto">
                  <button
                    onClick={() => setCategoryId("")}
                    className={`text-left px-3 py-2 text-sm rounded-lg transition-all
                      ${!categoryId
                        ? "bg-brand-500/15 text-brand-400"
                        : "text-gray-500 hover:text-gray-300 hover:bg-surface-hover"}`}
                  >
                    All categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryId(cat.id)}
                      className={`text-left px-3 py-2 text-sm rounded-lg transition-all flex items-center justify-between
                        ${categoryId === cat.id
                          ? "bg-brand-500/15 text-brand-400"
                          : "text-gray-500 hover:text-gray-300 hover:bg-surface-hover"}`}
                    >
                      <span>{cat.name}</span>
                      {cat._count && (
                        <span className="text-[10px] text-gray-700">{cat._count.medicines}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="p-3">
                <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-2 px-1">Price (৳)</p>
                <div className="flex gap-2">
                  <input
                    type="number" placeholder="Min" min={0}
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-surface border border-surface-border rounded-lg px-2.5 py-2 text-xs text-gray-300 placeholder-gray-700 focus:outline-none focus:border-brand-500/50 transition-all"
                  />
                  <input
                    type="number" placeholder="Max" min={0}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-surface border border-surface-border rounded-lg px-2.5 py-2 text-xs text-gray-300 placeholder-gray-700 focus:outline-none focus:border-brand-500/50 transition-all"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* ── Products Area ─────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Active filter pills */}
            {hasActive && (
              <div className="flex flex-wrap gap-2 mb-4">
                {search && (
                  <span className="flex items-center gap-1.5 text-xs bg-brand-500/10 border border-brand-500/20 text-brand-400 px-2.5 py-1 rounded-full">
                    "{search}" <X size={11} className="cursor-pointer hover:text-brand-300" onClick={() => setSearch("")} />
                  </span>
                )}
                {categoryId && (
                  <span className="flex items-center gap-1.5 text-xs bg-brand-500/10 border border-brand-500/20 text-brand-400 px-2.5 py-1 rounded-full">
                    {categories.find((c) => c.id === categoryId)?.name ?? "Category"}
                    <X size={11} className="cursor-pointer hover:text-brand-300" onClick={() => setCategoryId("")} />
                  </span>
                )}
                {(minPrice || maxPrice) && (
                  <span className="flex items-center gap-1.5 text-xs bg-brand-500/10 border border-brand-500/20 text-brand-400 px-2.5 py-1 rounded-full">
                    ৳{minPrice || "0"} – ৳{maxPrice || "∞"}
                    <X size={11} className="cursor-pointer hover:text-brand-300" onClick={() => { setMinPrice(""); setMaxPrice(""); }} />
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <Spinner size={32} className="py-32" />
            ) : medicines.length === 0 ? (
              <EmptyState
                icon={<Package size={28} />}
                title="No medicines found"
                description="Try different search terms or clear your filters"
                action={
                  <button onClick={clearFilters} className="text-sm text-brand-400 hover:text-brand-300 transition-colors">
                    Clear all filters
                  </button>
                }
              />
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {medicines.map((med, i) => (
                    <div
                      key={med.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${i * 35}ms`, animationFillMode: "backwards" }}
                    >
                      <MedicineCard medicine={med} />
                    </div>
                  ))}
                </div>
                {pagination && (
                  <Pagination meta={pagination} onPageChange={setPage} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ShopPage;
