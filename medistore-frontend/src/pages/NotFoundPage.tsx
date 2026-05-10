import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Pill } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";

const NotFoundPage: React.FC = () => (
  <MainLayout>
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      {/* Background glow */}
      <div className="absolute pointer-events-none">
        <div className="w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Pill icon */}
        <div className="inline-flex w-20 h-20 bg-brand-500/10 border border-brand-500/20 rounded-3xl items-center justify-center mb-8">
          <Pill size={36} className="text-brand-500" />
        </div>

        {/* 404 text */}
        <div className="font-display font-bold text-[120px] leading-none text-transparent bg-clip-text bg-gradient-to-b from-gray-500 to-surface mb-4 select-none">
          404
        </div>

        <h1 className="font-display text-2xl font-bold text-gray-200 mb-3">Page not found</h1>
        <p className="text-gray-600 max-w-sm mx-auto mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-brand-500/20"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 border border-surface-border hover:border-brand-500/40 text-gray-400 hover:text-gray-200 rounded-xl font-medium transition-all"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  </MainLayout>
);

export default NotFoundPage;
