import multer, { diskStorage, FileFilterCallback, StorageEngine } from "multer";
import { Request } from "express";

// Define the file storage configuration
const fileStorage: StorageEngine = diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, "uploads/"); // Directory where files will be saved
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".").pop() || "";
    cb(null, `${uniqueSuffix}.${fileExtension}`);
  },
});

// Define file filter to only allow HTML files
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimeTypes = ["text/html"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false); // Reject file
  }
};

// Export multer configuration
export const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
});
