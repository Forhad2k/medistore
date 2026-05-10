import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck, Clock, Star, Pill, Stethoscope, Syringe, HeartPulse, FilePlus, UserCircle2, MessageCircle } from "lucide-react";
import { Category, Medicine } from "../types";
import { categoriesApi } from "../api/categories";
import { medicinesApi } from "../api/medicines";
import MedicineCard from "../components/medicine/MedicineCard";
import MainLayout from "../components/layout/MainLayout";
import Spinner from "../components/common/Spinner";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

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
      {/* Hero Section */}
      <section className="relative bg-white text-blue-900 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl translate-y-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-full px-4 py-1.5 text-blue-500 text-xs font-medium mb-6 animate-pulse-soft">
            <Pill size={14} /> Online Medicine Delivery
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-blue-900 leading-tight mb-6">
            Trusted Healthcare,<br />
            <span className="text-blue-600">delivered to you.</span>
          </h1>
          <p className="text-blue-700 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Order medicines and healthcare essentials from the comfort of your home. Fast, safe, and reliable delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5">
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-blue-200 hover:border-blue-400 text-blue-700 hover:text-blue-900 rounded-xl font-semibold transition-all hover:-translate-y-0.5">
              Become a Seller
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-10">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8">
          {[
            { icon: <Truck size={32} className="text-blue-600" />, title: "Fast Delivery", desc: "Get your medicines delivered quickly and safely." },
            { icon: <ShieldCheck size={32} className="text-blue-600" />, title: "Trusted Pharmacy", desc: "Only genuine, quality-checked products." },
            { icon: <Clock size={32} className="text-blue-600" />, title: "24/7 Support", desc: "We’re here for you anytime, anywhere." },
          ].map((f) => (
            <div key={f.title} className="flex flex-col items-center bg-white rounded-2xl shadow-md p-6 w-64 hover:shadow-blue-200 transition-shadow">
              {f.icon}
              <h3 className="mt-4 font-bold text-lg text-blue-900">{f.title}</h3>
              <p className="text-blue-700 text-sm mt-2 text-center">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-blue-900">Browse Categories</h2>
            <p className="text-blue-600 text-sm mt-1">Find what you need quickly</p>
          </div>
          <Link to="/shop" className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 transition-colors">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/shop?categoryId=${cat.id}`}
              className="bg-white border border-blue-100 rounded-xl p-6 hover:border-blue-400 hover:shadow-lg transition-all group animate-slide-up flex flex-col items-center"
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: "backwards" }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                {/* Example icon, you can map category to icon for more variety */}
                <Pill size={24} className="text-blue-600" />
              </div>
              <p className="text-base font-semibold text-blue-900 group-hover:text-blue-700 transition-colors">{cat.name}</p>
              {cat._count && (
                <p className="text-xs text-blue-500 mt-0.5">{cat._count.medicines} items</p>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Medicines Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-blue-900">Featured Medicines</h2>
            <p className="text-blue-600 text-sm mt-1">Popular picks from our sellers</p>
          </div>
          <Link to="/shop" className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 transition-colors">
            See all <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <Spinner size={32} className="py-20" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map((med, i) => (
              <div key={med.id} className="animate-slide-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}>
                <MedicineCard medicine={med} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Prescription Upload Section removed as requested */}

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-display text-2xl font-bold text-blue-900 text-center mb-10">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Ayesha Rahman", text: "Super fast delivery and genuine medicines. I trust MediStore for my family!", rating: 5 },
            { name: "Md. Hasan", text: "Easy to order and great support. Highly recommended!", rating: 4 },
            { name: "Sadia Islam", text: "Prescription upload was simple and my order arrived on time.", rating: 5 },
          ].map((t, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center">
              <UserCircle2 size={48} className="text-blue-200 mb-3" />
              <div className="flex gap-1 mb-2">
                {[...Array(t.rating)].map((_, j) => <Star key={j} size={18} className="text-yellow-400" />)}
              </div>
              <p className="text-blue-800 text-center mb-3">“{t.text}”</p>
              <span className="font-semibold text-blue-900">{t.name}</span>
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
