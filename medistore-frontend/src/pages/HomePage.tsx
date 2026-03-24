import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck, Clock, Star, Pill } from "lucide-react";
import { Category, Medicine } from "../types";
import { categoriesApi } from "../api/categories";
import { medicinesApi } from "../api/medicines";
import MedicineCard from "../components/medicine/MedicineCard";
import MainLayout from "../components/layout/MainLayout";
import Spinner from "../components/common/Spinner";

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, medRes] = await Promise.all([
          categoriesApi.getAll(),
          medicinesApi.getAll({ limit: 8 }),
        ]);
        setCategories(catRes.data.data.slice(0, 8));
        setFeatured(medRes.data.data.medicines);
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-500/6 rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-600/4 rounded-full blur-3xl translate-y-1/3" />
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 text-brand-400 text-xs font-medium mb-6 animate-pulse-soft">
            <Pill size={12} /> OTC medicines delivered to your door
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-gray-100 leading-tight mb-6">
            Your health,<br />
            <span className="text-brand-400">our priority.</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Browse thousands of over-the-counter medicines from trusted pharmacies. Fast delivery, genuine products.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-500 hover:bg-brand-400 text-white rounded-xl font-semibold transition-all shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5">
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-surface-border hover:border-brand-500/40 text-gray-300 hover:text-gray-100 rounded-xl font-semibold transition-all hover:-translate-y-0.5">
              Become a Seller
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-14">
            {[
              { icon: <ShieldCheck size={16} />, text: "Genuine Products" },
              { icon: <Truck size={16} />,       text: "Fast Delivery" },
              { icon: <Clock size={16} />,       text: "24/7 Support" },
              { icon: <Star size={16} />,        text: "Top Rated" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-gray-500 text-sm">
                <span className="text-brand-500">{item.icon}</span> {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-100">Browse Categories</h2>
            <p className="text-gray-600 text-sm mt-1">Find what you need quickly</p>
          </div>
          <Link to="/shop" className="text-brand-400 hover:text-brand-300 text-sm flex items-center gap-1 transition-colors">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/shop?categoryId=${cat.id}`}
              className="bg-surface-card border border-surface-border rounded-xl p-4 hover:border-brand-500/30 hover:bg-surface-hover transition-all group animate-slide-up"
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: "backwards" }}
            >
              <div className="w-8 h-8 bg-brand-500/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-brand-500/20 transition-colors">
                <Pill size={15} className="text-brand-500" />
              </div>
              <p className="text-sm font-medium text-gray-300 group-hover:text-gray-100 transition-colors">{cat.name}</p>
              {cat._count && (
                <p className="text-xs text-gray-600 mt-0.5">{cat._count.medicines} items</p>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Medicines */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-100">Featured Medicines</h2>
            <p className="text-gray-600 text-sm mt-1">Popular picks from our sellers</p>
          </div>
          <Link to="/shop" className="text-brand-400 hover:text-brand-300 text-sm flex items-center gap-1 transition-colors">
            See all <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <Spinner size={32} className="py-20" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((med, i) => (
              <div key={med.id} className="animate-slide-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}>
                <MedicineCard medicine={med} />
              </div>
            ))}
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default HomePage;
