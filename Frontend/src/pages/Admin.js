import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useProducts } from "../contexts/ProductContext";
import { useToast } from "../contexts/ToastContext";
import {
  getUsersApi,
  deleteUserApi,
  updateUserRoleApi,
} from "../api/userService";
import { getOrdersApi, updateOrderStatusApi } from "../api/orderService";
import { uploadImage } from "../api/apiClient";
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiX,
  HiLogout,
  HiShieldCheck,
  HiViewGrid,
  HiCube,
  HiUserGroup,
  HiDocumentText,
  HiEye,
  HiChevronDown,
  HiPhotograph,
  HiRefresh,
} from "react-icons/hi";
import usePageTitle from "../utils/usePageTitle";

const Admin = () => {
  usePageTitle("لوحة التحكم");
  const { user, logout } = useAuth();
  const {
    products,
    totalProducts,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    fetchProducts,
    loading,
    error,
  } = useProducts();
  const { success: showSuccess, error: showError } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("products");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    categoryId: "",
    image: "",
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
    name: "",
    type: "product",
  });
  const [operationLoading, setOperationLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);
  const ORDERS_PER_PAGE = 10;
  const [productsPage, setProductsPage] = useState(1);
  const [productsTotalPages, setProductsTotalPages] = useState(1);
  const PRODUCTS_PER_PAGE = 12;

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await getUsersApi();
      if (res && res.data) {
        setUsers(res.data);
      } else {
        setUsers([]);
      }
    } catch {
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const params = { page: ordersPage, limit: ORDERS_PER_PAGE };
      if (orderStatusFilter) params.status = orderStatusFilter;
      const res = await getOrdersApi(params);
      if (res && res.data) {
        setOrders(res.data);
        if (res.pagination) {
          setOrdersTotalPages(res.pagination.totalPages || 1);
        } else {
          setOrdersTotalPages(1);
        }
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, [orderStatusFilter, ordersPage, ORDERS_PER_PAGE]);

  useEffect(() => {
    if (user && user.role === "ADMIN") {
      fetchUsers();
    }
  }, [user, fetchUsers]);

  useEffect(() => {
    setOrdersPage(1);
  }, [orderStatusFilter]);

  useEffect(() => {
    setProductsPage(1);
  }, [activeTab]);

  useEffect(() => {
    if (user && user.role === "ADMIN" && activeTab === "products") {
      fetchProducts({ page: productsPage, limit: PRODUCTS_PER_PAGE }).then(
        (res) => {
          if (res?.pagination) {
            setProductsTotalPages(res.pagination.totalPages || 1);
          }
        },
      );
    }
  }, [user, activeTab, productsPage, fetchProducts, PRODUCTS_PER_PAGE]);

  useEffect(() => {
    if (user && user.role === "ADMIN" && activeTab === "orders") {
      fetchOrders();
    }
  }, [user, activeTab, ordersPage, fetchOrders]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatusApi(orderId, newStatus);
      showSuccess("تم تحديث حالة الطلب بنجاح");
      fetchOrders();
    } catch (err) {
      showError(err.message || "فشل تحديث حالة الطلب");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await updateUserRoleApi(userId, newRole);
      showSuccess("تم تحديث صلاحية المستخدم بنجاح");
      fetchUsers();
    } catch (err) {
      showError(err.message || "فشل تحديث صلاحية المستخدم");
    }
  };

  const orderStatuses = [
    "PENDING",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  const getNextStatuses = (currentStatus) => {
    const flow = {
      PENDING: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["SHIPPED", "CANCELLED"],
      SHIPPED: ["DELIVERED"],
      DELIVERED: [],
      CANCELLED: [],
    };
    return flow[currentStatus] || [];
  };

  const statusColors = {
    PENDING: "bg-amber-50 text-amber-600",
    CONFIRMED: "bg-blue-50 text-blue-600",
    SHIPPED: "bg-purple-50 text-purple-600",
    DELIVERED: "bg-green-50 text-green-600",
    CANCELLED: "bg-red-50 text-red-600",
  };

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user || user.role !== "ADMIN") return null;

  const tabs = [
    { key: "products", label: "المنتجات", icon: <HiCube size={18} /> },
    { key: "categories", label: "التصنيفات", icon: <HiViewGrid size={18} /> },
    { key: "orders", label: "الطلبات", icon: <HiDocumentText size={18} /> },
    { key: "users", label: "المستخدمين", icon: <HiUserGroup size={18} /> },
    { key: "overview", label: "نظرة عامة", icon: <HiViewGrid size={18} /> },
  ];

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      stockQuantity: "",
      categoryId: "",
      image: "",
    });
    setEditingId(null);
    setModalMode("add");
  };

  const openAddModal = () => {
    resetForm();
    if (activeTab === "products") {
      setForm((prev) => ({
        ...prev,
        categoryId: categories.length > 0 ? categories[0].id : "",
      }));
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
      setForm({
        name: item.name,
        description: item.description,
        price: "",
        stockQuantity: "",
        categoryId: "",
        image: "",
      });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    setOperationLoading(true);
    try {
      if (activeTab === "products") {
        if (
          !form.name.trim() ||
          !form.description.trim() ||
          !form.price ||
          !form.stockQuantity ||
          !form.categoryId
        ) {
          showError("يرجى ملء جميع الحقول");
          setOperationLoading(false);
          return;
        }
        let imageUrl = form.image.trim() || null;
        if (imageFile) {
          setImageUploading(true);
          const uploadRes = await uploadImage(imageFile);
          imageUrl = uploadRes.data.url;
          setImageUploading(false);
        }
        const productData = {
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          stockQuantity: parseInt(form.stockQuantity),
          categoryId: form.categoryId,
          image: imageUrl,
        };
        if (modalMode === "add") {
          await addProduct(productData);
          showSuccess("تم إضافة المنتج بنجاح");
        } else {
          await updateProduct(editingId, productData);
          showSuccess("تم تحديث المنتج بنجاح");
        }
        setImageFile(null);
      } else if (activeTab === "categories") {
        if (!form.name.trim()) {
          showError("يرجى إدخال اسم التصنيف");
          setOperationLoading(false);
          return;
        }
        if (modalMode === "add") {
          await addCategory({ name: form.name });
          showSuccess("تم إضافة التصنيف بنجاح");
        } else {
          await updateCategory(editingId, { name: form.name });
          showSuccess("تم تحديث التصنيف بنجاح");
        }
      }
      setModalOpen(false);
    } catch (err) {
      showError(err.message || "فشلت العملية");
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeleteClick = (id, name, type) => {
    setDeleteDialog({ open: true, id, name, type });
  };

  const confirmDelete = async () => {
    setOperationLoading(true);
    try {
      const { id, type } = deleteDialog;
      if (type === "product") {
        await deleteProduct(id);
        showSuccess("تم حذف المنتج بنجاح");
      } else if (type === "category") {
        await deleteCategory(id);
        showSuccess("تم حذف التصنيف والمنتجات المرتبطة به");
      } else if (type === "user") {
        await deleteUserApi(id);
        setUsers((prev) => prev.filter((x) => x.id !== id));
        showSuccess("تم حذف المستخدم بنجاح");
      }
    } catch (err) {
      showError(err.message || "فشلت عملية الحذف");
    } finally {
      setOperationLoading(false);
    }
    setDeleteDialog({ open: false, id: null, name: "", type: "product" });
  };

  return (
    <div
      className="min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] bg-gray-50"
      dir="rtl"
    >
      <div className="flex max-w-[1440px] min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)]">
        {/* Sidebar - desktop */}
        <aside className="hidden md:flex w-72 bg-white shadow-sm shrink-0 flex-col sticky top-0 h-screen">
          <div className="p-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-md">
                <HiShieldCheck size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-black text-[#1e293b]">
                  لوحة التحكم
                </h2>
                <p className="text-[11px] text-[#94a3b8] font-medium">
                  {user.name}
                </p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-[#64748b] hover:bg-gray-100 hover:text-[#334155]"
                }`}
              >
                <span className="shrink-0 w-5 flex justify-center">
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-[#1e293b]">
                {tabs.find((t) => t.key === activeTab)?.label}
              </h1>
              <p className="text-sm text-[#64748b] mt-1">مرحباً، {user.name}</p>
            </div>
            {/* Mobile logout */}
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="md:hidden p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all"
            >
              <HiLogout size={20} />
            </button>
          </div>

          {/* Mobile Tabs */}
          <div className="flex md:hidden gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 whitespace-nowrap ${
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
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
                <h3 className="font-black text-lg text-[#1e293b]">المنتجات</h3>
                <button
                  onClick={openAddModal}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <HiPlus size={18} />
                  إضافة منتج
                </button>
              </div>
              {loading ? (
                <div className="text-center py-16 text-[#64748b]">
                  جاري التحميل...
                </div>
              ) : error ? (
                <div className="text-center py-16 text-red-500 font-bold">
                  فشل تحميل المنتجات
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16 text-[#64748b] font-bold">
                  لا يوجد منتجات بعد
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50/80">
                          <th className="text-right p-4 pr-6 font-bold text-[#64748b] text-xs uppercase tracking-wider">
                            #
                          </th>
                          <th className="text-center p-4 font-bold text-[#64748b] text-xs uppercase tracking-wider">
                            الصورة
                          </th>
                          <th className="text-right p-4 font-bold text-[#64748b] text-xs uppercase tracking-wider">
                            الاسم
                          </th>
                          <th className="text-right p-4 font-bold text-[#64748b] text-xs uppercase tracking-wider">
                            التصنيف
                          </th>
                          <th className="text-right p-4 font-bold text-[#64748b] text-xs uppercase tracking-wider">
                            السعر
                          </th>
                          <th className="text-right p-4 font-bold text-[#64748b] text-xs uppercase tracking-wider">
                            المخزون
                          </th>
                          <th className="text-center p-4 pl-6 font-bold text-[#64748b] text-xs uppercase tracking-wider">
                            العمليات
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p, i) => (
                          <tr
                            key={p.id}
                            className="border-b border-gray-50 hover:bg-gray-50/50 transition-all duration-300"
                          >
                            <td className="p-4 text-[#64748b]">
                              {(productsPage - 1) * PRODUCTS_PER_PAGE + i + 1}
                            </td>
                            <td className="p-4 text-center">
                              {p.image ? (
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-10 h-10 rounded-xl object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto">
                                  <HiPhotograph
                                    size={20}
                                    className="text-gray-400"
                                  />
                                </div>
                              )}
                            </td>
                            <td className="p-4 font-bold text-[#1e293b]">
                              {p.name}
                            </td>
                            <td className="p-4 text-[#64748b]">
                              {p.categoryName}
                            </td>
                            <td className="p-4 text-[#1e293b]">
                              ${Number(p.price).toFixed(2)}
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                                  p.stockQuantity > 10
                                    ? "bg-green-50 text-green-600"
                                    : "bg-red-50 text-red-600"
                                }`}
                              >
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
                                  onClick={() =>
                                    handleDeleteClick(p.id, p.name, "product")
                                  }
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
                  {productsTotalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 p-6 border-t border-gray-100">
                      <button
                        onClick={() =>
                          setProductsPage((p) => Math.max(1, p - 1))
                        }
                        disabled={productsPage === 1}
                        className="px-4 py-2 rounded-xl text-sm font-bold bg-white border border-gray-200 text-[#64748b] hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        السابق
                      </button>
                      {Array.from(
                        { length: productsTotalPages },
                        (_, i) => i + 1,
                      ).map((page) => (
                        <button
                          key={page}
                          onClick={() => setProductsPage(page)}
                          className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-300 ${
                            productsPage === page
                              ? "bg-primary text-white shadow-md"
                              : "bg-white border border-gray-200 text-[#64748b] hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() =>
                          setProductsPage((p) =>
                            Math.min(productsTotalPages, p + 1),
                          )
                        }
                        disabled={productsPage === productsTotalPages}
                        className="px-4 py-2 rounded-xl text-sm font-bold bg-white border border-gray-200 text-[#64748b] hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        التالي
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === "categories" && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
                <h3 className="font-black text-lg text-[#1e293b]">التصنيفات</h3>
                <button
                  onClick={openAddModal}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <HiPlus size={18} />
                  إضافة تصنيف
                </button>
              </div>
              {loading ? (
                <div className="text-center py-16 text-[#64748b]">
                  جاري التحميل...
                </div>
              ) : error ? (
                <div className="text-center py-16 text-red-500 font-bold">
                  فشل تحميل التصنيفات
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-16 text-[#64748b] font-bold">
                  لا يوجد تصنيفات بعد
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50/80">
                        <th className="text-right p-4 pr-6 font-bold text-[#64748b] text-xs uppercase tracking-wider">
                          #
                        </th>
                        <th className="text-right p-4 font-bold text-[#64748b] text-xs uppercase tracking-wider">
                          الاسم
                        </th>
                        <th className="text-center p-4 pl-6 font-bold text-[#64748b] text-xs uppercase tracking-wider">
                          العمليات
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((c, i) => (
                        <tr
                          key={c.id}
                          className="border-b border-gray-50 hover:bg-gray-50/50 transition-all duration-300"
                        >
                          <td className="p-4 text-[#64748b]">{i + 1}</td>
                          <td className="p-4 font-bold text-[#1e293b]">
                            {c.name}
                          </td>
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
                                onClick={() =>
                                  handleDeleteClick(c.id, c.name, "category")
                                }
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
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <>
              <div className="flex gap-2 mb-4 overflow-x-auto">
                <button
                  onClick={() => setOrderStatusFilter("")}
                  className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                    !orderStatusFilter
                      ? "bg-primary text-white"
                      : "bg-white text-[#64748b] hover:bg-gray-100"
                  }`}
                >
                  الكل
                </button>
                {orderStatuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => setOrderStatusFilter(s)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                      orderStatusFilter === s
                        ? "bg-primary text-white"
                        : "bg-white text-[#64748b] hover:bg-gray-100"
                    }`}
                  >
                    {s === "PENDING"
                      ? "قيد الانتظار"
                      : s === "CONFIRMED"
                        ? "مؤكد"
                        : s === "SHIPPED"
                          ? "تم الشحن"
                          : s === "DELIVERED"
                            ? "تم التوصيل"
                            : "ملغي"}
                  </button>
                ))}
              </div>
              {ordersLoading ? (
                <div className="text-center py-12 text-[#64748b]">
                  جاري التحميل...
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 text-[#64748b] font-bold">
                  لا يوجد طلبات
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="text-right p-4 font-bold text-[#64748b]">
                          #
                        </th>
                        <th className="text-right p-4 font-bold text-[#64748b]">
                          المستخدم
                        </th>
                        <th className="text-right p-4 font-bold text-[#64748b]">
                          المجموع
                        </th>
                        <th className="text-right p-4 font-bold text-[#64748b]">
                          الحالة
                        </th>
                        <th className="text-right p-4 font-bold text-[#64748b]">
                          تاريخ
                        </th>
                        <th className="text-center p-4 font-bold text-[#64748b]">
                          العمليات
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o, i) => (
                        <>
                          <tr
                            key={o.id}
                            className="border-b border-gray-50 hover:bg-gray-50/50 transition-all duration-300"
                          >
                            <td className="p-4 text-[#64748b]">{i + 1}</td>
                            <td className="p-4 font-bold text-[#1e293b]">
                              {o.user?.name || o.shippingName || "—"}
                            </td>
                            <td className="p-4 text-[#1e293b]">
                              ${Number(o.total).toFixed(2)}
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${statusColors[o.status] || "bg-gray-50 text-gray-600"}`}
                              >
                                {o.status === "PENDING"
                                  ? "قيد الانتظار"
                                  : o.status === "CONFIRMED"
                                    ? "مؤكد"
                                    : o.status === "SHIPPED"
                                      ? "تم الشحن"
                                      : o.status === "DELIVERED"
                                        ? "تم التوصيل"
                                        : o.status === "CANCELLED"
                                          ? "ملغي"
                                          : o.status}
                              </span>
                            </td>
                            <td className="p-4 text-[#64748b] text-xs">
                              {o.createdAt
                                ? new Date(o.createdAt).toLocaleDateString(
                                    "en-GB",
                                  )
                                : "—"}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() =>
                                    setExpandedOrder(
                                      expandedOrder === o.id ? null : o.id,
                                    )
                                  }
                                  className="p-2 rounded-lg text-primary hover:bg-primary/5 transition-all duration-300"
                                  title="عرض التفاصيل"
                                >
                                  <HiEye size={16} />
                                </button>
                                {getNextStatuses(o.status).length > 0 && (
                                  <div className="relative group">
                                    <button
                                      className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-all duration-300"
                                      title="تحديث الحالة"
                                    >
                                      <HiChevronDown size={16} />
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-10 hidden group-hover:block min-w-[140px]">
                                      {getNextStatuses(o.status).map((ns) => (
                                        <button
                                          key={ns}
                                          onClick={() =>
                                            handleUpdateOrderStatus(o.id, ns)
                                          }
                                          disabled={updatingOrderId === o.id}
                                          className="block w-full text-right px-4 py-2 text-sm font-bold hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
                                        >
                                          {ns === "CONFIRMED"
                                            ? "تأكيد"
                                            : ns === "SHIPPED"
                                              ? "شحن"
                                              : ns === "DELIVERED"
                                                ? "توصيل"
                                                : ns === "CANCELLED"
                                                  ? "إلغاء"
                                                  : ns}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                          {expandedOrder === o.id && (
                            <tr key={`${o.id}-details`}>
                              <td colSpan={6} className="p-4 bg-gray-50">
                                <div className="text-sm">
                                  <p>
                                    <span className="font-bold">
                                      جهة الشحن:
                                    </span>{" "}
                                    {o.shippingName} — {o.shippingPhone}
                                  </p>
                                  <p className="mt-1">
                                    <span className="font-bold">العنوان:</span>{" "}
                                    {o.shippingAddress}
                                  </p>
                                  {o.items && o.items.length > 0 && (
                                    <div className="mt-2">
                                      <p className="font-bold mb-1">
                                        المنتجات:
                                      </p>
                                      {o.items.map((item) => (
                                        <div
                                          key={item.id}
                                          className="flex justify-between items-center py-1 border-b border-gray-200 last:border-0"
                                        >
                                          <span>
                                            {item.product?.name || "منتج"}
                                          </span>
                                          <span>
                                            {item.quantity} × $
                                            {Number(item.price).toFixed(2)}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {ordersTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                    disabled={ordersPage === 1}
                    className="px-4 py-2 rounded-xl text-sm font-bold bg-white border border-gray-200 text-[#64748b] hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    السابق
                  </button>
                  {Array.from(
                    { length: ordersTotalPages },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => setOrdersPage(page)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-300 ${
                        ordersPage === page
                          ? "bg-primary text-white shadow-md"
                          : "bg-white border border-gray-200 text-[#64748b] hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setOrdersPage((p) => Math.min(ordersTotalPages, p + 1))
                    }
                    disabled={ordersPage === ordersTotalPages}
                    className="px-4 py-2 rounded-xl text-sm font-bold bg-white border border-gray-200 text-[#64748b] hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    التالي
                  </button>
                </div>
              )}
            </>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <>
              {usersLoading ? (
                <div className="text-center py-12 text-[#64748b]">
                  جاري التحميل...
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12 text-[#64748b] font-bold">
                  لا يوجد مستخدمين بعد
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="text-right p-4 font-bold text-[#64748b]">
                          #
                        </th>
                        <th className="text-right p-4 font-bold text-[#64748b]">
                          الاسم
                        </th>
                        <th className="text-right p-4 font-bold text-[#64748b]">
                          البريد
                        </th>
                        <th className="text-right p-4 font-bold text-[#64748b]">
                          الدور
                        </th>
                        <th className="text-center p-4 font-bold text-[#64748b]">
                          العمليات
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, i) => (
                        <tr
                          key={u.id}
                          className="border-b border-gray-50 hover:bg-gray-50/50 transition-all duration-300"
                        >
                          <td className="p-4 text-[#64748b]">{i + 1}</td>
                          <td className="p-4 font-bold text-[#1e293b]">
                            {u.name}
                          </td>
                          <td className="p-4 text-[#64748b]">{u.email}</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                                u.role === "ADMIN"
                                  ? "bg-purple-50 text-purple-600"
                                  : "bg-blue-50 text-blue-600"
                              }`}
                            >
                              {u.role === "ADMIN" ? "مدير" : "مستخدم"}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() =>
                                  handleUpdateUserRole(
                                    u.id,
                                    u.role === "ADMIN" ? "CUSTOMER" : "ADMIN",
                                  )
                                }
                                className="p-2 rounded-lg text-primary hover:bg-primary/5 transition-all duration-300"
                                title={
                                  u.role === "ADMIN"
                                    ? "خفض الصلاحية"
                                    : "رفع الصلاحية"
                                }
                              >
                                <HiShieldCheck size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteClick(u.id, u.name, "user")
                                }
                                className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                                title="حذف"
                                disabled={u.role === "ADMIN"}
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
            </>
          )}

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                    <HiCube size={20} className="text-blue-500" />
                  </div>
                  <p className="text-xs text-[#64748b] font-bold mb-1">
                    المنتجات
                  </p>
                  <p className="text-3xl font-black text-[#1e293b]">
                    {totalProducts}
                  </p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
                    <HiViewGrid size={20} className="text-purple-500" />
                  </div>
                  <p className="text-xs text-[#64748b] font-bold mb-1">
                    التصنيفات
                  </p>
                  <p className="text-3xl font-black text-[#1e293b]">
                    {categories.length}
                  </p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-3">
                    <HiDocumentText size={20} className="text-green-500" />
                  </div>
                  <p className="text-xs text-[#64748b] font-bold mb-1">
                    الطلبات
                  </p>
                  <p className="text-3xl font-black text-[#1e293b]">
                    {orders.length}
                  </p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
                    <HiUserGroup size={20} className="text-amber-500" />
                  </div>
                  <p className="text-xs text-[#64748b] font-bold mb-1">
                    المستخدمين
                  </p>
                  <p className="text-3xl font-black text-[#1e293b]">
                    {users.length}
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />
            <div className="relative bg-white rounded-3xl w-full max-w-lg overflow-hidden animate-[fadeIn_0.2s_ease-out]">
              {/* Modal Header */}
              <div className="bg-gradient-to-l from-primary/10 to-transparent px-6 pt-6 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                      {activeTab === "products" ? (
                        <HiCube size={20} className="text-primary" />
                      ) : (
                        <HiViewGrid size={20} className="text-primary" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-[#1e293b]">
                        {modalMode === "add" ? "إضافة" : "تعديل"}{" "}
                        {activeTab === "products" ? "منتج" : "تصنيف"}
                      </h2>
                      <p className="text-xs text-[#94a3b8]">
                        {modalMode === "add"
                          ? "أدخل بيانات العنصر الجديد"
                          : "قم بتحديث بيانات العنصر"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300"
                  >
                    <HiX size={16} className="text-[#64748b]" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-[#1e293b] mb-1.5">
                    الاسم
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder={
                      activeTab === "products" ? "اسم المنتج" : "اسم التصنيف"
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-0 focus:rounded-2xl focus:border-primary transition-colors duration-300"
                  />
                </div>
                {activeTab === "products" && (
                  <div>
                    <label className="block text-sm font-bold text-[#1e293b] mb-1.5">
                      الوصف
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                      placeholder="وصف المنتج"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-0 focus:rounded-2xl focus:border-primary transition-colors duration-300 resize-none"
                    />
                  </div>
                )}
                {activeTab === "products" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-[#1e293b] mb-1.5">
                          السعر ($)
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] text-sm font-bold">
                            $
                          </span>
                          <input
                            type="number"
                            value={form.price}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                price: e.target.value,
                              }))
                            }
                            min={0}
                            step="0.01"
                            placeholder="0.00"
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-0 focus:rounded-2xl focus:border-primary transition-colors duration-300 pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#1e293b] mb-1.5">
                          الكمية
                        </label>
                        <input
                          type="number"
                          value={form.stockQuantity}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              stockQuantity: e.target.value,
                            }))
                          }
                          min={0}
                          placeholder="0"
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-0 focus:rounded-2xl focus:border-primary transition-colors duration-300"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#1e293b] mb-1.5">
                        التصنيف
                      </label>
                      <div className="relative">
                        <select
                          value={form.categoryId}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              categoryId: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-0 focus:rounded-2xl focus:border-primary transition-colors duration-300 appearance-none bg-white"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none">
                          <HiChevronDown size={12} />
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#1e293b] mb-1.5">
                        صورة المنتج
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl px-4 py-2.5 flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setImageFile(file);
                                setForm((prev) => ({
                                  ...prev,
                                  image: URL.createObjectURL(file),
                                }));
                              }
                            }}
                            className="w-full text-sm text-gray-500 file:ml-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                          />
                        </div>
                        {imageFile && (
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null);
                              setForm((prev) => ({ ...prev, image: "" }));
                            }}
                            className="text-xs text-red-500 hover:text-red-700"
                          >
                            إزالة
                          </button>
                        )}
                      </div>
                      {imageUploading && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-primary font-bold">
                          <HiRefresh className="animate-spin" size={16} />
                          جاري رفع الصورة...
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 px-6 pb-6">
                <button
                  onClick={handleSave}
                  disabled={operationLoading}
                  className="flex-1 py-3 bg-primary text-white rounded-2xl font-bold text-sm hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                >
                  {operationLoading && (
                    <HiRefresh className="animate-spin" size={16} />
                  )}
                  {modalMode === "add" ? "إضافة" : "حفظ التغييرات"}
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  disabled={operationLoading}
                  className="px-8 py-3 bg-gray-100 text-[#64748b] rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all duration-300 disabled:opacity-50"
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
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() =>
                setDeleteDialog({
                  open: false,
                  id: null,
                  name: "",
                  type: "product",
                })
              }
            />
            <div className="relative bg-white rounded-3xl w-full max-w-sm overflow-hidden animate-[fadeIn_0.2s_ease-out]">
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-50 flex items-center justify-center">
                  <HiTrash size={28} className="text-red-500" />
                </div>
                <h2 className="text-xl font-black text-[#1e293b] mb-2">
                  تأكيد الحذف
                </h2>
                <p className="text-sm text-[#64748b] leading-relaxed">
                  هل أنت متأكد من حذف{" "}
                  <span className="font-bold text-[#1e293b]">
                    "{deleteDialog.name}"
                  </span>{" "}
                  ؟ لا يمكن التراجع عن هذا الإجراء.
                </p>
              </div>
              <div className="flex gap-3 px-8 pb-8">
                <button
                  onClick={confirmDelete}
                  disabled={operationLoading}
                  className="flex-1 py-3 bg-red-500 text-white rounded-2xl font-bold text-sm hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                >
                  {operationLoading && (
                    <HiRefresh className="animate-spin" size={16} />
                  )}
                  تأكيد الحذف
                </button>
                <button
                  onClick={() =>
                    setDeleteDialog({
                      open: false,
                      id: null,
                      name: "",
                      type: "product",
                    })
                  }
                  disabled={operationLoading}
                  className="flex-1 py-3 bg-gray-100 text-[#64748b] rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all duration-300 disabled:opacity-50"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
