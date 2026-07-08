import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { HiUserAdd, HiEye, HiEyeOff } from "react-icons/hi";
import usePageTitle from "../utils/usePageTitle";

const Register = () => {
  usePageTitle("إنشاء حساب");
  const { user, register } = useAuth();
  const { error: showError } = useToast();
  const navigate = useNavigate();
  const registerInProgress = useRef(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !registerInProgress.current) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!form.name.trim()) {
      errors.name = "الاسم مطلوب";
    }
    if (!form.email.trim()) {
      errors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "البريد الإلكتروني غير صالح";
    }
    if (!form.password.trim()) {
      errors.password = "كلمة المرور مطلوبة";
    } else if (form.password.length < 8) {
      errors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    }
    if (!form.confirmPassword.trim()) {
      errors.confirmPassword = "تأكيد كلمة المرور مطلوب";
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "كلمة المرور غير متطابقة";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showError("يرجى تصحيح الأخطاء أدناه");
      return;
    }
    setLoading(true);
    registerInProgress.current = true;
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      showError(err.message || "فشل إنشاء الحساب");
    } finally {
      setLoading(false);
      registerInProgress.current = false;
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HiUserAdd size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-[#1e293b]">إنشاء حساب جديد</h1>
          <p className="text-[#64748b] mt-1">انضم إلينا الآن</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#1e293b] mb-1.5">الاسم الكامل</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => { setForm(prev => ({ ...prev, name: e.target.value })); setFieldErrors(prev => ({ ...prev, name: "" })); }}
              placeholder="الاسم الكامل"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-0 focus:rounded-2xl focus:border-primary transition-colors duration-300"
            />
            {fieldErrors.name && <p className="text-red-500 text-xs mt-1 font-bold">{fieldErrors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1e293b] mb-1.5">البريد الإلكتروني</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => { setForm(prev => ({ ...prev, email: e.target.value })); setFieldErrors(prev => ({ ...prev, email: "" })); }}
              placeholder="example@mail.com"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-0 focus:rounded-2xl focus:border-primary transition-colors duration-300"
            />
            {fieldErrors.email && <p className="text-red-500 text-xs mt-1 font-bold">{fieldErrors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1e293b] mb-1.5">كلمة المرور</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => { setForm(prev => ({ ...prev, password: e.target.value })); setFieldErrors(prev => ({ ...prev, password: "" })); }}
                placeholder="******"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-0 focus:rounded-2xl focus:border-primary transition-colors duration-300 pl-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>
            {fieldErrors.password && <p className="text-red-500 text-xs mt-1 font-bold">{fieldErrors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1e293b] mb-1.5">تأكيد كلمة المرور</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(e) => { setForm(prev => ({ ...prev, confirmPassword: e.target.value })); setFieldErrors(prev => ({ ...prev, confirmPassword: "" })); }}
                placeholder="******"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-0 focus:rounded-2xl focus:border-primary transition-colors duration-300 pl-11"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>
            {fieldErrors.confirmPassword && <p className="text-red-500 text-xs mt-1 font-bold">{fieldErrors.confirmPassword}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60"
          >
            {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
          </button>
        </form>

        <p className="text-center text-sm text-[#64748b] mt-6">
          لديك حساب بالفعل؟{" "}
          <Link to="/login" className="text-primary font-bold hover:underline transition-all duration-300">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
