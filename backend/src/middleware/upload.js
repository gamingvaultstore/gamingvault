const multer = require("multer");

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const videoTypes = ["video/mp4", "video/webm"];

const memoryStorage = multer.memoryStorage();

const upload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, and WebP images are allowed"));
    }

    cb(null, true);
  },
});

const accountUpload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 50 * 1024 * 1024,
    files: 6,
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "images" && allowedTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    if (file.fieldname === "video" && videoTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    cb(
      new Error("Images must be JPG, PNG, or WebP. Videos must be MP4 or WebM"),
    );
  },
});

module.exports = upload;
module.exports.accountUpload = accountUpload;
