import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useProducts } from "../contexts/ProductContext";
import { useToast } from "../contexts/ToastContext";
import { HiPlus, HiPencil, HiTrash, HiX, HiLogout, HiShieldCheck, HiUserGroup, HiViewGrid, HiCube } from "react-icons/hi";

const defaultProductImage = require("../assets/ProductsImage/iphone-14-pro.webp");

const Admin = () => {
  const { user, logout, users, deleteUser } = useAuth();
  const { products, categories, addProduct, updateProduct, deleteProduct, addCategory, updateCategory, deleteCategory } = useProducts();
  const { success: showSuccess, error: showError } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("products");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", stockQuantity: "", categoryId: "", image: "" });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: "" });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  const tabs = [
    { key: "products", label: "المنتجات", icon: <HiCube size={18} /> },
    { key: "categories", label: "التصنيفات", icon: <HiViewGrid size={18} /> },
    { key: "users", label: "المستخدمين", icon: <HiUserGroup size={18} /> },
  ];

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", stockQuantity: "", categoryId: "", image: "" });
    setEditingId(null);
    setModalMode("add");
  };

  const openAddModal = () => {
    resetForm();
    if (activeTab === "products") {
      setForm(prev => ({ ...prev, categoryId: categories.length > 0 ? categories[0].id : "" }));
    }
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setModalMode("edit");
    setEditingId(item.id);
    if (activeTab === "products") {
      setForm({
        name: item.name,
        description: item.description,
        price: item.price,
        stockQuantity: item.stockQuantity,
        categoryId: item.categoryId,
        image: typeof item.image === "string" ? item.image : "",
      });
    } else {
      setForm({ name: item.name, description: item.description, price: "", stockQuantity: "", categoryId: "", image: "" });
    }
    setModalOpen(true);
  };

  const handleSave = () => {
    if (activeTab === "products") {
      if (!form.name.trim() || !form.description.trim() || !form.price || !form.stockQuantity || !form.categoryId) {
        showError("يرجى ملء جميع الحقول");
        return;
      }
      const productData = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stockQuantity: parseInt(form.stockQuantity),
        categoryId: parseInt(form.categoryId),
        image: form.image.trim() || defaultProductImage,
      };
      if (modalMode === "add") {
        addProduct(productData);
        showSuccess("تم إضافة المنتج بنجاح");
      } else {
        updateProduct(editingId, productData);
        showSuccess("تم تحديث المنتج بنجاح");
      }
    } else if (activeTab === "categories") {
      if (!form.name.trim()) {
        showError("يرجى إدخال اسم التصنيف");
        return;
      }
      if (modalMode === "add") {
        addCategory({ name: form.name, description: form.description });
        showSuccess("تم إضافة التصنيف بنجاح");
      } else {
        updateCategory(editingId, { name: form.name, description: form.description });
        showSuccess("تم تحديث التصنيف بنجاح");
      }
    }
    setModalOpen(false);
  };

  const handleDeleteClick = (id, name) => {
    setDeleteDialog({ open: true, id, name });
  };

  const confirmDelete = () => {
    const { id } = deleteDialog;
    if (activeTab === "products") {
      deleteProduct(id);
      showSuccess("تم حذف المنتج بنجاح");
    } else if (activeTab === "categories") {
      deleteCategory(id);
      showSuccess("تم حذف التصنيف والمنتجات المرتبطة به");
    } else if (activeTab === "users") {
      deleteUser(id);
      showSuccess("تم حذف المستخدم بنجاح");
    }
    setDeleteDialog({ open: false, id: null, name: "" });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] bg-gray-50" dir="rtl">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
              <HiShieldCheck size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#1e293b]">لوحة التحكم</h1>
              <p className="text-sm text-[#64748b]">مرحباً، {user.name}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-xl font-bold text-sm hover:-translate-y-0.5 transition-all duration-300"
          >
            <HiLogout size={18} />
            تسجيل خروج
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-primary text-white"
                  : "bg-white text-[#64748b] hover:bg-gray-100"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:-translate-y-0.5 transition-all duration-300"
              >
                <HiPlus size={18} />
                إضافة منتج
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-right p-4 font-bold text-[#64748b]">#</th>
                    <th className="text-right p-4 font-bold text-[#64748b]">الاسم</th>
                    <th className="text-right p-4 font-bold text-[#64748b]">التصنيف</th>
                    <th className="text-right p-4 font-bold text-[#64748b]">السعر</th>
                    <th className="text-right p-4 font-bold text-[#64748b]">المخزون</th>
                    <th className="text-center p-4 font-bold text-[#64748b]">العمليات</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all duration-300">
                      <td className="p-4 text-[#64748b]">{i + 1}</td>
                      <td className="p-4 font-bold text-[#1e293b]">{p.name}</td>
                      <td className="p-4 text-[#64748b]">{p.categoryName}</td>
                      <td className="p-4 text-[#1e293b]">${p.price.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          p.stockQuantity > 10 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                        }`}>
                          {p.stockQuantity}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-2 rounded-lg text-primary hover:bg-primary/5 transition-all duration-300"
                            title="تعديل"
                          >
                            <HiPencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(p.id, p.name)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-all duration-300"
                            title="حذف"
                          >
                            <HiTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:-translate-y-0.5 transition-all duration-300"
              >
                <HiPlus size={18} />
                إضافة تصنيف
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-right p-4 font-bold text-[#64748b]">#</th>
                    <th className="text-right p-4 font-bold text-[#64748b]">الاسم</th>
                    <th className="text-right p-4 font-bold text-[#64748b]">الوصف</th>
                    <th className="text-center p-4 font-bold text-[#64748b]">العمليات</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c, i) => (
                    <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all duration-300">
                      <td className="p-4 text-[#64748b]">{i + 1}</td>
                      <td className="p-4 font-bold text-[#1e293b]">{c.name}</td>
                      <td className="p-4 text-[#64748b]">{c.description}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(c)}
                            className="p-2 rounded-lg text-primary hover:bg-primary/5 transition-all duration-300"
                            title="تعديل"
                          >
                            <HiPencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(c.id, c.name)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-all duration-300"
                            title="حذف"
                          >
                            <HiTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-right p-4 font-bold text-[#64748b]">#</th>
                  <th className="text-right p-4 font-bold text-[#64748b]">الاسم</th>
                  <th className="text-right p-4 font-bold text-[#64748b]">البريد الإلكتروني</th>
                  <th className="text-right p-4 font-bold text-[#64748b]">الدور</th>
                  <th className="text-center p-4 font-bold text-[#64748b]">العمليات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all duration-300">
                    <td className="p-4 text-[#64748b]">{i + 1}</td>
                    <td className="p-4 font-bold text-[#1e293b]">{u.name}</td>
                    <td className="p-4 text-[#64748b]">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        u.role === "admin" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
                      }`}>
                        {u.role === "admin" ? "مدير" : "مستخدم"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleDeleteClick(u.id, u.name)}
                          disabled={u.role === "admin" || u.id === user.id}
                          className={`p-2 rounded-lg transition-all duration-300 ${
                            u.role === "admin" || u.id === user.id
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-red-500 hover:bg-red-50"
                          }`}
                          title={u.role === "admin" ? "لا يمكن حذف مدير" : "حذف"}
                        >
                          <HiTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-[#1e293b]">
                {modalMode === "add" ? "إضافة" : "تعديل"} {activeTab === "products" ? "منتج" : "تصنيف"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
              >
                <HiX size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#1e293b] mb-1.5">الاسم</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-0 focus:rounded-2xl focus:border-primary transition-colors duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1e293b] mb-1.5">الوصف</label>
                {activeTab === "products" ? (
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-0 focus:rounded-2xl focus:border-primary transition-colors duration-300 resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-0 focus:rounded-2xl focus:border-primary transition-colors duration-300"
                  />
                )}
              </div>
              {activeTab === "products" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#1e293b] mb-1.5">السعر ($)</label>
                      <input
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
                        min={0}
                        step="0.01"
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-0 focus:rounded-2xl focus:border-primary transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#1e293b] mb-1.5">الكمية</label>
                      <input
                        type="number"
                        value={form.stockQuantity}
                        onChange={(e) => setForm(prev => ({ ...prev, stockQuantity: e.target.value }))}
                        min={0}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-0 focus:rounded-2xl focus:border-primary transition-colors duration-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#1e293b] mb-1.5">التصنيف</label>
                    <select
                      value={form.categoryId}
                      onChange={(e) => setForm(prev => ({ ...prev, categoryId: e.target.value }))}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-0 focus:rounded-2xl focus:border-primary transition-colors duration-300"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#1e293b] mb-1.5">رابط الصورة</label>
                    <input
                      type="url"
                      value={form.image}
                      onChange={(e) => setForm(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-0 focus:rounded-2xl focus:border-primary transition-colors duration-300"
                    />
                  </div>

                </>
              )}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:-translate-y-0.5 transition-all duration-300"
              >
                {modalMode === "add" ? "إضافة" : "حفظ التغييرات"}
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-3 bg-gray-100 text-[#64748b] rounded-xl font-bold text-sm hover:bg-gray-200 transition-all duration-300"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialog.open && (
        <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteDialog({ open: false, id: null, name: "" })} />
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiTrash size={28} className="text-red-500" />
            </div>
            <h2 className="text-xl font-black text-[#1e293b] mb-2">تأكيد الحذف</h2>
            <p className="text-[#64748b] mb-6">
              هل أنت متأكد من حذف <span className="font-bold text-[#1e293b]">"{deleteDialog.name}"</span>؟
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:-translate-y-0.5 transition-all duration-300"
              >
                تأكيد الحذف
              </button>
              <button
                onClick={() => setDeleteDialog({ open: false, id: null, name: "" })}
                className="px-6 py-3 bg-gray-100 text-[#64748b] rounded-xl font-bold text-sm hover:bg-gray-200 transition-all duration-300"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
