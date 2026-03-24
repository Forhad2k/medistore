import React from "react";
import Navbar from "./Navbar";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-surface text-gray-200">
    <Navbar />
    <main className="animate-fade-in">{children}</main>
    <footer className="border-t border-surface-border mt-20 py-8 px-4 text-center text-gray-600 text-sm">
      <p>© 2024 MediStore — Your Trusted Online Medicine Shop 💊</p>
    </footer>
  </div>
);

export default MainLayout;
