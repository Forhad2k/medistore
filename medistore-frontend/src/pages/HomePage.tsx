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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#046c59] h-[90vh]">
        {/* Background Glow */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-20 w-[400px] h-[400px] bg-emerald-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-yellow-300/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 h-full">
          <div className="grid lg:grid-cols-2 items-center gap-10 h-full">

            {/* Left Content */}
            <div className="text-center lg:text-left z-10">
              <h1 className="text-white font-bold leading-tight text-4xl sm:text-5xl lg:text-6xl max-w-xl">
                Your Trusted <br />
                Online Pharmacy <br />
                for Every Need
              </h1>

              <p className="mt-5 text-gray-200 text-base sm:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed">
                Order medicines, consult doctors online, and get doorstep
                delivery within 24 hours.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
                <Link
                  to="/shop"
                  className="px-7 py-3 bg-lime-300 hover:bg-lime-400 text-black font-semibold rounded-full transition-all duration-300 shadow-lg"
                >
                  Shop Now
                </Link>

                <Link
                  to="/register"
                  className="px-7 py-3 border border-white/40 hover:border-white text-white rounded-full transition-all duration-300"
                >
                  Explore More
                </Link>
              </div>

              {/* Review Section */}
              <div className="flex items-center gap-4 mt-10 justify-center lg:justify-start">
                <div className="flex -space-x-3">
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    className="w-10 h-10 rounded-full border-2 border-[#046c59] object-cover"
                    alt=""
                  />
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    className="w-10 h-10 rounded-full border-2 border-[#046c59] object-cover"
                    alt=""
                  />
                  <img
                    src="https://randomuser.me/api/portraits/women/68.jpg"
                    className="w-10 h-10 rounded-full border-2 border-[#046c59] object-cover"
                    alt=""
                  />
                </div>

                <div>
                  <div className="text-yellow-300 text-sm font-medium">
                    ★ 4.9/5
                  </div>
                  <p className="text-gray-200 text-sm">
                    Rated by 2,400+ families
                  </p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-full flex justify-end">
              <img
                src="https://res.cloudinary.com/medistore/image/upload/v1778688042/Gemini_Generated_Image_1aoypw1aoypw1aoy_lhql9l.png"
                alt="Doctor"
                className="absolute bottom-0 right-0 z-10 max-h-[850px] object-contain"
              />

              {/* Floating Product Card */}
              <div className="absolute bottom-10 right-0 sm:right-10 bg-white rounded-2xl p-4 shadow-2xl flex items-center gap-4 w-[230px] z-20">
                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4320/4320371.png"
                    alt=""
                    className="w-12 h-12 object-contain"
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-500">Recommended</p>
                  <h4 className="text-sm font-semibold text-gray-800 leading-tight">
                    Quamtrax <br />
                    nutrition acid
                  </h4>
                </div>

                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-lime-300 flex items-center justify-center">
                  ↗
                </div>
              </div>
            </div>
          </div>

          {/* Background Text */}
          <div className="absolute bottom-0 left-6 text-[90px] lg:text-[160px] font-bold text-white/5 leading-none pointer-events-none select-none">
            PHARMACY
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
