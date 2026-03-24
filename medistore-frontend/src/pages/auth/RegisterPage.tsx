import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, Pill } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../utils";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import toast from "react-hot-toast";

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "CUSTOMER" as "CUSTOMER" | "SELLER", phone: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    if (!form.password || form.password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ ...form, phone: form.phone || undefined });
      navigate(form.role === "SELLER" ? "/seller/dashboard" : "/", { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 bg-brand-500 rounded-2xl items-center justify-center shadow-xl shadow-brand-500/30 mb-4">
            <Pill size={24} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-100">Create account</h1>
          <p className="text-gray-500 mt-1.5 text-sm">Join MediStore today</p>
        </div>

        <div className="bg-surface-card border border-surface-border rounded-2xl p-8 shadow-2xl">
          {/* Role toggle */}
          <div className="flex rounded-xl border border-surface-border overflow-hidden mb-6">
            {(["CUSTOMER", "SELLER"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setForm((p) => ({ ...p, role }))}
                className={`flex-1 py-2.5 text-sm font-medium transition-all
                  ${form.role === role
                    ? "bg-brand-500 text-white shadow-inner"
                    : "text-gray-500 hover:text-gray-300 hover:bg-surface-hover"}`}
              >
                {role === "CUSTOMER" ? "🛒 Customer" : "🏪 Seller"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Full name" placeholder="John Doe" icon={<User size={15} />}
              value={form.name} onChange={set("name")} error={errors.name} />
            <Input label="Email address" type="email" placeholder="you@example.com" icon={<Mail size={15} />}
              value={form.email} onChange={set("email")} error={errors.email} autoComplete="email" />
            <Input label="Password" type="password" placeholder="Min. 6 characters" icon={<Lock size={15} />}
              value={form.password} onChange={set("password")} error={errors.password} autoComplete="new-password" />
            <Input label="Phone (optional)" placeholder="+880..." icon={<Phone size={15} />}
              value={form.phone} onChange={set("phone")} />
            <Button type="submit" loading={loading} size="lg" className="mt-1">
              Create account
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
