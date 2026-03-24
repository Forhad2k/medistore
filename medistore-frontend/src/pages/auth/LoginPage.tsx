import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Pill } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../utils";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import toast from "react-hot-toast";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = "Email is required";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 bg-brand-500 rounded-2xl items-center justify-center shadow-xl shadow-brand-500/30 mb-4">
            <Pill size={24} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-100">Welcome back</h1>
          <p className="text-gray-500 mt-1.5 text-sm">Sign in to your MediStore account</p>
        </div>

        {/* Form Card */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={15} />}
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              error={errors.email}
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={15} />}
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              error={errors.password}
              autoComplete="current-password"
            />
            <Button type="submit" loading={loading} size="lg" className="mt-1">
              Sign in
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-surface rounded-xl border border-surface-border">
            <p className="text-xs text-gray-500 font-medium mb-2">Demo credentials:</p>
            <div className="space-y-1 font-mono text-xs">
              <p className="text-gray-600">customer@medistore.com / customer123</p>
              <p className="text-gray-600">seller@medistore.com / seller123</p>
              <p className="text-gray-600">admin@medistore.com / admin123</p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
