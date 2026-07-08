const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { authenticate, authorize } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public/uploads/products"));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|webp|gif)$/i;
    const allowedMime = /^image\/(jpeg|png|webp|gif)$/;
    if (allowed.test(path.extname(file.originalname)) && allowedMime.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("يُسمح فقط بصور JPG, PNG, WebP, GIF"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/", authenticate, authorize("ADMIN"), upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "لم يتم رفع صورة" });
  }
  const url = `/uploads/products/${req.file.filename}`;
  res.json({ success: true, data: { url } });
});

router.post("/multiple", authenticate, authorize("ADMIN"), upload.array("images", 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, error: "لم يتم رفع صور" });
  }
  const urls = req.files.map((f) => `/uploads/products/${f.filename}`);
  res.json({ success: true, data: { urls } });
});

module.exports = router;
