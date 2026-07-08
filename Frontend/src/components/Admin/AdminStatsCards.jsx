const AdminStatsCards = ({ productsCount, categoriesCount, ordersCount, usersCount }) => (
  <>
    <div className="p-5 rounded-3xl border border-gray-200 bg-gradient-to-br from-blue-50 to-white">
      <p className="text-2xl md:text-4xl font-black text-primary">{productsCount}</p>
      <p className="text-sm text-[#64748b] font-bold mt-1">منتج</p>
    </div>
    <div className="p-5 rounded-3xl border border-gray-200 bg-gradient-to-br from-emerald-50 to-white">
      <p className="text-2xl md:text-4xl font-black text-emerald-600">{categoriesCount}</p>
      <p className="text-sm text-[#64748b] font-bold mt-1">تصنيف</p>
    </div>
    <div className="p-5 rounded-3xl border border-gray-200 bg-gradient-to-br from-purple-50 to-white">
      <p className="text-2xl md:text-4xl font-black text-purple-600">{ordersCount}</p>
      <p className="text-sm text-[#64748b] font-bold mt-1">طلب</p>
    </div>
    <div className="p-5 rounded-3xl border border-gray-200 bg-gradient-to-br from-amber-50 to-white">
      <p className="text-2xl md:text-4xl font-black text-amber-600">{usersCount}</p>
      <p className="text-sm text-[#64748b] font-bold mt-1">مستخدم</p>
    </div>
  </>
);

export default AdminStatsCards;
