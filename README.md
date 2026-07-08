<div dir="rtl">

# متجرنا - E-Commerce Full Stack

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwind-css&logoColor=white)

**متجر إلكتروني متكامل** بواجهة عربية، يدعم إدارة المنتجات، التصنيفات، الطلبات، والمستخدمين مع نظام صلاحيات كامل.

</div>

---

## المميزات

- **المتجر** - تصفح المنتجات مع بحث، فلترة، فرز، وترقيم صفحات
- **سلة التسوق** - إضافة/إزالة/تعديل الكميات مع حفظ محلي
- **الطلبات** - إنشاء طلب، متابعة حالة الطلب، سجل الطلبات
- **لوحة التحكم** - إدارة كاملة للمنتجات، التصنيفات، الطلبات، والمستخدمين
- **نظام صلاحيات** - أدوار `CUSTOMER` و `ADMIN` مع حماية المسارات
- **مصادقة JWT** - Access + Refresh tokens مع تجديد تلقائي
- **تصميم متجاوب** - يدوم Mobile, Tablet, Desktop
- **RTL** - واجهة عربية كاملة
- **Lazy Loading** - تحميل الصفحات عند الطلب
- **حالات UI** - معالجة كاملة لحالات التحميل والخطأ والبيانات الفارغة

---

## التقنيات المستخدمة

### Frontend
| التقنية | الاستخدام |
|---------|-----------|
| React 19 | مكتبة بناء واجهة المستخدم |
| React Router v7 | التوجيه والتنقل |
| Tailwind CSS 3.4 | التصميم والتنسيق |
| React Icons | الأيقونات (Hero Icons) |
| Context API + useReducer | إدارة الحالة (Auth, Cart, Products, Toast) |
| React.lazy + Suspense | التحميل البطيء للصفحات |

### Backend
| التقنية | الاستخدام |
|---------|-----------|
| Node.js + Express 4.21 | خادم API |
| PostgreSQL | قاعدة البيانات العلائقية |
| Prisma 5 | ORM وإدارة المخططات |
| JWT (jsonwebtoken) | المصادقة (Access + Refresh) |
| bcrypt | تشفير كلمات المرور |
| helmet | حماية الرؤوس |
| express-rate-limit | تحديد معدل الطلبات |
| multer | رفع الملفات |
| morgan | تسجيل الطلبات |

---

## بنية المشروع

```
e-commerce/
  Backend/
    prisma/            # Schema, migrations, seed
    src/
      config/          # إعدادات البيئة
      controllers/     # منطق API
      middleware/      # auth, error handler
      routes/          # تعريف المسارات
      utils/           # ApiError, ApiResponse, JWT, hash
    .env.example       # نموذج المتغيرات
    package.json
  Frontend/
    public/
    src/
      api/             # apiClient, services
      components/      # Header, Footer, ProductCard, Skeleton
      contexts/        # AuthContext, CartContext, ProductContext, ToastContext
      pages/           # 11 صفحة
      routes/          # AppRoutes, ProtectedRoute
      utils/           # usePageTitle
    package.json
  README.md
  .gitignore
```

---

## API Endpoints

### المصادقة
| الطريقة | المسار | الوصف | الحماية |
|---------|--------|-------|---------|
| POST | `/api/auth/register` | إنشاء حساب | ❌ |
| POST | `/api/auth/login` | تسجيل دخول | ❌ |
| POST | `/api/auth/refresh` | تجديد التوكن | ❌ |
| GET | `/api/auth/me` | بيانات المستخدم الحالي | ✅ |

### المنتجات
| الطريقة | المسار | الوصف | الحماية |
|---------|--------|-------|---------|
| GET | `/api/products` | قائمة المنتجات (بحث، تصنيف، فرز، ترقيم) | ❌ |
| GET | `/api/products/:slug` | تفاصيل منتج | ❌ |
| POST | `/api/products` | إنشاء منتج | ADMIN |
| PUT | `/api/products/:id` | تحديث منتج | ADMIN |
| DELETE | `/api/products/:id` | حذف منتج | ADMIN |

### التصنيفات
| الطريقة | المسار | الوصف | الحماية |
|---------|--------|-------|---------|
| GET | `/api/categories` | قائمة التصنيفات | ❌ |
| GET | `/api/categories/:slug` | تصنيف مع منتجاته | ❌ |
| POST | `/api/categories` | إنشاء تصنيف | ADMIN |
| PUT | `/api/categories/:id` | تحديث تصنيف | ADMIN |
| DELETE | `/api/categories/:id` | حذف تصنيف | ADMIN |

### الطلبات
| الطريقة | المسار | الوصف | الحماية |
|---------|--------|-------|---------|
| POST | `/api/orders` | إنشاء طلب | ✅ |
| GET | `/api/orders` | طلبات المستخدم | ✅ |
| GET | `/api/orders/:id` | تفاصيل طلب | ✅ |
| PATCH | `/api/orders/:id/status` | تحديث حالة الطلب | ADMIN |

### المستخدمون
| الطريقة | المسار | الوصف | الحماية |
|---------|--------|-------|---------|
| GET | `/api/users` | قائمة المستخدمين | ADMIN |
| PUT | `/api/users/:id/role` | تغيير صلاحية | ADMIN |

### الرفع
| الطريقة | المسار | الوصف | الحماية |
|---------|--------|-------|---------|
| POST | `/api/uploads` | رفع صورة | ADMIN |

> المصادقة عبر Header: `Authorization: Bearer <access_token>`

---

## صفحات Frontend

| المسار | الصفحة | الوصف |
|--------|--------|-------|
| `/` | الرئيسية | عرض 4 منتجات مميزة |
| `/products` | المنتجات | بحث، تصنيف، فرز، ترقيم |
| `/product/:slug` | تفاصيل المنتج | عرض وإضافة للسلة |
| `/cart` | سلة التسوق | إدارة العناصر |
| `/login` | تسجيل دخول | - |
| `/register` | إنشاء حساب | - |
| `/dashboard` | لوحة التحكم | إدارة المنتجات/التصنيفات/الطلبات/المستخدمين |
| `/my-orders` | طلباتي | عرض سجل الطلبات |
| `/order-success` | نجاح الطلب | تأكيد بعد إنشاء طلب |
| `/403` | ممنوع | لا توجد صلاحية |
| `/404` | غير موجود | مسار غير صحيح |

---

## تشغيل المشروع محلياً

### المتطلبات
- Node.js 18+
- PostgreSQL 16+

### 1. Backend

```bash
cd Backend

# تثبيت المكتبات
npm install

# نسخ ملف البيئة وتعديل القيم
cp .env.example .env

# تشغيل الترحيلات
npx prisma migrate dev

# (اختياري) إضافة بيانات تجريبية
npm run seed

# تشغيل الخادم
npm run dev    # http://localhost:5000
```

### 2. Frontend

```bash
cd Frontend

npm install

# إنشاء ملف البيئة
echo "REACT_APP_API_URL=http://localhost:5000" > .env.development

npm start      # http://localhost:3000
```

### متغيرات Backend

| المتغير | الوصف | مثال |
|---------|-------|------|
| `DATABASE_URL` | رابط قاعدة البيانات | `postgresql://postgres:pass@localhost:5432/ecommerce_db` |
| `PORT` | منفذ الخادم | `5000` |
| `NODE_ENV` | بيئة التشغيل | `development` / `production` |
| `CORS_ORIGIN` | النطاقات المسموحة | `http://localhost:3000` |
| `JWT_ACCESS_SECRET` | مفتاح Access Token | (64 حرف عشوائي) |
| `JWT_REFRESH_SECRET` | مفتاح Refresh Token | (64 حرف عشوائي) |

### متغيرات Frontend

| المتغير | الوصف | مثال |
|---------|-------|------|
| `REACT_APP_API_URL` | رابط API | `http://localhost:5000` |

---

## النشر

### Backend (Render)

1. ارفع المشروع على GitHub
2. في [Render.com](https://render.com) → New Web Service
3. Build Command: `cd Backend && npm install && npx prisma generate`
4. Start Command: `cd Backend && npx prisma migrate deploy && node src/index.js`
5. أضف Environment Variables من `.env.example`

### Frontend (Vercel / Netlify)

1. اربط GitHub repo
2. Build Command: `cd Frontend && npm install && npm run build`
3. Output Directory: `Frontend/build`
4. Environment Variable: `REACT_APP_API_URL` = رابط الـ Backend المنشور

---

## لقطة شاشة

> قريباً — Screenshots

---

## التطوير المستقبلي

- [ ] تكامل دفع (Stripe)
- [ ] Docker + docker-compose
- [ ] اختبارات (Jest + Supertest + React Testing Library)
- [ ] CI/CD (GitHub Actions)
- [ ] إعادة تعيين كلمة المرور
- [ ] تحديث الملف الشخصي
- [ ] Refresh Token Rotation
- [ ] إشعارات (Email)
- [ ] إحصائيات متقدمة

---

## التراخيص

MIT © [Abdullah Abu Zaid](https://github.com/AbdullahAbuZaid04)

</div>

---

<p align="center" dir="ltr">
  Made with ❤️ in Palestine
</p>
