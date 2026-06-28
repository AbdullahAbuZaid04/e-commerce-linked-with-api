import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { HiLogin } from "react-icons/hi";

const Login = () => {
  const { user, login } = useAuth();
  const { error: showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate(user.role === "admin" ? "/dashboard" : from, { replace: true });
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      showError("يرجى ملء جميع الحقول");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const success = login(form.email, form.password);
      setLoading(false);
      if (success) {
        navigate(from);
      } else {
        showError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }
    }, 500);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HiLogin size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-[#1e293b]">تسجيل الدخول</h1>
          <p className="text-[#64748b] mt-1">أهلاً بك مرة أخرى</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#1e293b] mb-1.5">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="example@mail.com"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-0 focus:rounded-2xl focus:border-primary transition-colors duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1e293b] mb-1.5">
              كلمة المرور
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder="******"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-0 focus:rounded-2xl focus:border-primary transition-colors duration-300"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60"
          >
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <p className="text-center text-sm text-[#64748b] mt-6">
          ليس لديك حساب؟{" "}
          <Link
            to="/register"
            className="text-primary font-bold hover:underline transition-all duration-300"
          >
            إنشاء حساب جديد
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
