# E-Commerce API

باك إند متجر إلكتروني: Express + PostgreSQL + Prisma + JWT Auth.

## التشغيل محلياً

```bash
npm install
cp .env.example .env   # عدّل DATABASE_URL و JWT secrets
npx prisma migrate dev
npm run dev            # http://localhost:3000
```

## نقاط الدخول

| المسار | الطريقة | الوصف | الحماية |
|--------|---------|-------|---------|
| `/api/auth/register` | POST | إنشاء حساب | ❌ |
| `/api/auth/login` | POST | تسجيل دخول | ❌ |
| `/api/auth/refresh` | POST | تجديد التوكن | ❌ |
| `/api/auth/me` | GET | بياناتي | ✅ |
| `/api/products` | GET | قائمة منتجات (فلترة: `?category=&search=&sort=&page=&limit=`) | ❌ |
| `/api/products/:slug` | GET | تفاصيل منتج | ❌ |
| `/api/products` | POST | إنشاء منتج | ADMIN |
| `/api/products/:id` | PUT/PATCH | تحديث منتج | ADMIN |
| `/api/products/:id` | DELETE | حذف / أرشفة | ADMIN |
| `/api/categories` | GET | قائمة تصنيفات | ❌ |
| `/api/categories/:slug` | GET | تصنيف مع منتجاته | ❌ |
| `/api/categories` | POST | إنشاء تصنيف | ADMIN |
| `/api/categories/:id` | PUT | تحديث تصنيف | ADMIN |
| `/api/categories/:id` | DELETE | حذف تصنيف (فارغ فقط) | ADMIN |
| `/api/orders` | POST | إنشاء طلب | ✅ |
| `/api/orders` | GET | طلباتي | ✅ |
| `/api/orders/:id` | GET | تفاصيل طلب | ✅ |
| `/api/orders/:id/status` | PATCH | تحديث الحالة | ADMIN |

المحمية تحتاج Header: `Authorization: Bearer <token>`

## الأدوار

- `CUSTOMER` — تصفح، شراء
- `ADMIN` — إدارة منتجات، تصنيفات، طلبات

## الرفع على Render

1. ارفع الكود على GitHub
2. [Render.com](https://render.com) → New Web Service → اربط الـ repo
3. Build: `npm install && npm run prisma:generate` | Start: `npm start`
4. New PostgreSQL → انسخ `Internal Database URL`
5. أضف Environment Variables: `DATABASE_URL`، `JWT_ACCESS_SECRET`، `JWT_REFRESH_SECRET`، `NODE_ENV=production`، `CORS_ORIGIN`
6. Start Command: `npx prisma migrate deploy && npm start` (يشغل المايجريشن تلقائياً مع كل deploy)

## أوامر

| الأمر | الوصف |
|-------|-------|
| `npm run dev` | تشغيل مع nodemon |
| `npm start` | تشغيل عادي |
| `npx prisma studio` | واجهة قاعدة البيانات |
| `npx prisma migrate deploy` | تطبيق المايجريشن (إنتاج) |
