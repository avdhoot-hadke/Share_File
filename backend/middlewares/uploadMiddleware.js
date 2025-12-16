import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "text/csv"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error("Invalid file type. Only JPEG, PNG, PDF, and CSV are allowed."),
            false
        );
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter
});

export { upload, cloudinary };
