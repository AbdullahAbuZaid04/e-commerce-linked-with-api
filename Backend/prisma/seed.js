const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("../src/utils/hash");

const prisma = new PrismaClient();

const generateSlug = (name) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function main() {
  console.log("Seeding database...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // ─── Admin User ───
  const hashedPassword = await hashPassword("admin123");
  await prisma.user.create({
    data: {
      name: "مدير الموقع",
      email: "admin@shop.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("  ✓ Admin user created");

  // ─── Categories ───
  const categoriesData = [
    { name: "إلكترونيات", slug: generateSlug("إلكترونيات") },
    { name: "ملابس", slug: generateSlug("ملابس") },
    { name: "كتب", slug: generateSlug("كتب") },
    { name: "منزل ومطبخ", slug: generateSlug("منزل ومطبخ") },
    { name: "رياضة", slug: generateSlug("رياضة") },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    categories[cat.slug] = await prisma.category.create({ data: cat });
  }

  console.log("  ✓ Categories created");

  // ─── Products ───
  const IMG = (id) => `https://images.unsplash.com/photo-${id}?w=400&h=400&fit=crop`;
  const productsData = [
    {
      name: "سماعات بلوتوث لاسلكية",
      description: "سماعات بلوتوث عالية الجودة مع عزل الضوضاء، تدوم البطارية حتى 20 ساعة. مثالية للموسيقى والمكالمات.",
      price: 149.99,
      images: [IMG("1505740420928-5e560c06d30e")],
      stock: 50,
      categorySlug: generateSlug("إلكترونيات"),
    },
    {
      name: "ساعة ذكية رياضية",
      description: "ساعة ذكية متعددة الوظائف مع مراقبة معدل ضربات القلب، عداد الخطوات، ومقاومة الماء. متوافقة مع iOS و Android.",
      price: 299.99,
      images: [IMG("1523275335684-37898b6baf30")],
      stock: 30,
      categorySlug: generateSlug("إلكترونيات"),
    },
    {
      name: "شاحن متنقل باور بانك 20000mAh",
      description: "باور بانك بسعة 20000 ملي أمبير مع منفذي USB وشحن سريع. مناسب للسفر والاستخدام اليومي.",
      price: 89.99,
      images: [IMG("1583394838336-acd977736f90")],
      stock: 100,
      categorySlug: generateSlug("إلكترونيات"),
    },
    {
      name: "قميص قطني كلاسيكي",
      description: "قميص قطني مريح بتصميم كلاسيكي مناسب لجميع الأوقات. متوفر بمقاسات مختلفة.",
      price: 45.00,
      images: [IMG("1521572163474-6864f9cf17ab"), IMG("1583743814966-8936f5b7be1a")],
      stock: 200,
      categorySlug: generateSlug("ملابس"),
    },
    {
      name: "حذاء رياضي مريح",
      description: "حذاء رياضي بتصميم عصري ونعل مريح، مناسب للجري والمشي والاستخدام اليومي.",
      price: 159.99,
      images: [IMG("1542291026-7eec264c27ff")],
      stock: 40,
      categorySlug: generateSlug("ملابس"),
    },
    {
      name: "حذاء رياضي نايك اير ماكس",
      description: "حذاء رياضي من نايك بتصميم عصري ونعل Air Max مريح، مناسب للرياضة والاستخدام اليومي.",
      price: 249.99,
      images: [IMG("1542291026-7eec264c27ff"), IMG("1606107557195-0e29a4b5b4aa")],
      stock: 35,
      categorySlug: generateSlug("ملابس"),
    },
    {
      name: "حذاء رياضي اديداس الترا بوست",
      description: "حذاء رياضي من اديداس بتقنية Ultraboost، يوفر أقصى راحة للأداء الرياضي والجري.",
      price: 279.99,
      images: [IMG("1551107696-a4b0c5a0d9a2")],
      stock: 28,
      categorySlug: generateSlug("ملابس"),
    },
    {
      name: "بدلة كلاسيكية أنيقة",
      description: "بدلة كلاسيكية بقصّة عصرية، مناسبة للمناسبات الرسمية والعمل.",
      price: 399.99,
      images: [IMG("1594938298603-c8148c4dae35"), IMG("1521572163474-6864f9cf17ab")],
      stock: 15,
      categorySlug: generateSlug("ملابس"),
    },
    {
      name: "وشاح صوف ناعم",
      description: "وشاح صوف ناعم ودافئ، مثالي لفصل الشتاء مع تصميم عصري.",
      price: 49.99,
      images: [IMG("1601924994987-69e26d50dc26")],
      stock: 45,
      categorySlug: generateSlug("ملابس"),
    },
    {
      name: "قبعة صيفية عصرية",
      description: "قبعة صيفية أنيقة تحمي من الشمس، مناسبة للسفر والنزهات.",
      price: 39.99,
      images: [IMG("1534215754734-18e55d13e346")],
      stock: 50,
      categorySlug: generateSlug("ملابس"),
    },
    {
      name: "لابتوب ماك بوك برو 16",
      description: "لابتوب Apple MacBook Pro بشاشة 16 إنش، معالج M3 Pro، ذاكرة 18GB، مناسب للمحترفين.",
      price: 4999.99,
      images: [IMG("1517336714731-489689fd1ca8")],
      stock: 10,
      categorySlug: generateSlug("إلكترونيات"),
    },
    {
      name: "آيفون 14 برو",
      description: "هاتف Apple iPhone 14 Pro مع كاميرا 48 ميجابكسل وشاشة Super Retina XDR.",
      price: 3999.99,
      images: [IMG("1592750475338-74b7b21085ab")],
      stock: 25,
      categorySlug: generateSlug("إلكترونيات"),
    },
    {
      name: "آيباد إير",
      description: "جهاز Apple iPad Air بشاشة 10.9 إنش، معالج M1، مثالي للدراسة والإبداع.",
      price: 2499.99,
      images: [IMG("1544244015-0df4b3ffc6b0")],
      stock: 18,
      categorySlug: generateSlug("إلكترونيات"),
    },
    {
      name: "سماعات سوني WH-1000XM5",
      description: "سماعات لاسلكية من سوني مع إلغاء الضوضاء النشط، جودة صوت استثنائية.",
      price: 899.99,
      images: [IMG("1505740420928-5e560c06d30e")],
      stock: 22,
      categorySlug: generateSlug("إلكترونيات"),
    },
    {
      name: "كاميرا كانون EOS R5",
      description: "كاميرا احترافية من كانون بدقة 45 ميجابكسل، تصوير فيديو 8K، مثالية للمصورين المحترفين.",
      price: 8499.99,
      images: [IMG("1516035069371-29a1b244cc32")],
      stock: 5,
      categorySlug: generateSlug("إلكترونيات"),
    },
    {
      name: "درون DJI Mavic 3",
      description: "درون DJI Mavic 3 مع كاميرا Hasselblad 4/3، تصوير 5.1K، مدى طيران 30 كم.",
      price: 5999.99,
      images: [IMG("1473968512647-3e447244af8f")],
      stock: 7,
      categorySlug: generateSlug("إلكترونيات"),
    },
    {
      name: "ننتندو سويتش OLED",
      description: "جهاز ألعاب Nintendo Switch OLED بشاشة 7 إنش، ذاكرة 64GB، مناسب للعب الفردي والجماعي.",
      price: 1299.99,
      images: [IMG("1578303512597-81e6cc155b3e")],
      stock: 12,
      categorySlug: generateSlug("إلكترونيات"),
    },
    {
      name: "كيبورد ميكانيكية Keychron K2",
      description: "لوحة مفاتيح ميكانيكية لاسلكية Keychron K2 بمفاتيح Gateron، إضاءة RGB.",
      price: 349.99,
      images: [IMG("1587829741301-dc798b83add3")],
      stock: 30,
      categorySlug: generateSlug("إلكترونيات"),
    },
    {
      name: "ماوس لوجيتك MX Master 3S",
      description: "ماوس لاسلكي Logitech MX Master 3S بيئي، حساسية 8000 DPI، عمر بطارية 70 يوماً.",
      price: 299.99,
      images: [IMG("1615663245857-ac93bb7c39e7")],
      stock: 35,
      categorySlug: generateSlug("إلكترونيات"),
    },
    {
      name: "سامسونج جالاكسي S23",
      description: "هاتف Samsung Galaxy S23 مع كاميرا 50 ميجابكسل، شاشة Dynamic AMOLED 120Hz.",
      price: 2999.99,
      images: [IMG("1610945265064-0e34e5519bbf")],
      stock: 20,
      categorySlug: generateSlug("إلكترونيات"),
    },
    {
      name: "ساعة أبل واتش Series 8",
      description: "ساعة Apple Watch Series 8 مع مراقبة الصحة، تخطيط القلب، مقاومة الماء.",
      price: 1899.99,
      images: [IMG("1523275335684-37898b6baf30")],
      stock: 15,
      categorySlug: generateSlug("إلكترونيات"),
    },
    {
      name: "رواية - ألف ليلة وليلة",
      description: "نسخة فاخرة من ألف ليلة وليلة مع رسوم توضيحية، طبعة حديثة مع هوامش وشروح.",
      price: 65.00,
      images: [IMG("1544947950-fa07a98d237f")],
      stock: 60,
      categorySlug: generateSlug("كتب"),
    },
  ];

  for (const product of productsData) {
    const { categorySlug, ...data } = product;
    await prisma.product.create({
      data: {
        ...data,
        slug: generateSlug(product.name),
        categoryId: categories[categorySlug].id,
      },
    });
  }

  console.log("  ✓ Products created");
  console.log("\n──────────────────────────────────────");
  console.log("Seed completed successfully!");
  console.log("──────────────────────────────────────");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error("Seed failed:", err);
    await prisma.$disconnect();
    process.exit(1);
  });
