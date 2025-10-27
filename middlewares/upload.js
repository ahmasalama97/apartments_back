import multer from "multer";
import path from "path";
import fs from "fs";

// Base uploads directory
const BASE_UPLOADS = "uploads";

// Ensure folder exists
function ensureDirExist(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Multer storage with dynamic folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Default folder "specialists"
        const uploadPath = path.join(BASE_UPLOADS, "");

        ensureDirExist(uploadPath);

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Multer instance
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB max
    },
});

// For specialist image (only one)
export const uploadSpecialistImage = upload.single("image");

export default upload;
