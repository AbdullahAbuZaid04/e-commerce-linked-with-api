// ─── src/index.js ───

require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const config = require("./config");
const errorHandler = require("./middleware/errorHandler");

const path = require("path");
const app = express();
const PORT = config.port;

// ═══════════════════════════════════
// Middleware (الترتيب مهم — لا تغيّره)
// ═══════════════════════════════════
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: "500kb" }));
app.use("/uploads/products", (req, res, next) => {
  const filePath = path.join(__dirname, "../public/uploads/products", req.path);
  if (!require("fs").existsSync(filePath)) {
    return res.sendFile(path.join(__dirname, "../public/uploads/products/placeholder.svg"));
  }
  next();
});
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: "طلبات كثيرة جداً. حاول بعد 15 دقيقة." },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: "طلبات كثيرة جداً. حاول بعد 15 دقيقة." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", globalLimiter);
app.use("/api/auth", authLimiter);
app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));

// ═══════════════════════════════════
// Routes
// ═══════════════════════════════════
app.use("/api", require("./routes"));

// ═══════════════════════════════════
// Health Check
// ═══════════════════════════════════
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API تعمل ✅",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
    },
  });
});

// ═══════════════════════════════════
// Error & 404 Handlers (آخر شيء دائماً)
// ═══════════════════════════════════
app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "المسار غير موجود",
    path: req.url,
  });
});

app.listen(PORT, () => {
  console.log(`✅ server is running on port http://localhost:${PORT}`);
});
