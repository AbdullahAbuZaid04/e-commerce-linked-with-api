import { Component } from "react";
import { Link } from "react-router-dom";
import { HiExclamationCircle } from "react-icons/hi";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center" dir="rtl">
          <div className="text-center max-w-md px-4">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-red-50 flex items-center justify-center">
              <HiExclamationCircle size={40} className="text-red-400" />
            </div>
            <h2 className="text-xl font-black text-[#1e293b] mb-2">عذراً، حدث خطأ غير متوقع</h2>
            <p className="text-[#64748b] mb-6 text-sm">
              حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm transition-all duration-300"
              >
                إعادة تحميل الصفحة
              </button>
              <Link
                to="/"
                className="px-6 py-2.5 bg-gray-100 text-[#64748b] rounded-xl font-bold text-sm transition-all duration-300"
              >
                الرئيسية
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
