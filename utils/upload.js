import multer from "multer";
import dotenv from "dotenv";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

// cloudinary storage config

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const folder = (file.fieldname === "avatar"
      ? "avatar"
      : (file.fieldname === "backCover" ? "course" : "default"));
    const allowedFormats = file.mimetype.startsWith("video/")
      ? ["mp4", "mov", "avi"]
      : ["jpg", "jpeg", "png", "gif", "webp"];

    return {
      folder: folder,
      allowed_formats: allowedFormats,
      resource_type: file.mimetype.startsWith("video/") ? "video" : "image",
    };
  },
});

// mullter config

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter(req, file, cb) {
    console.log("file Details: ", file);
    const alledTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/avi",
      "video/mov",
    ];
    if (!alledTypes.includes(file.mimetype)) {
      const error = new Error("Invalid file type");
      error.code = "LIMIT_FILE_TYPE";
      return cb(error);
    }
    cb(null, true);
  },
}).fields([{ name: "backCover" }, { name: "avatar" }]);

// middleware to handle file upload

const uploadMiddleWare = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer Error: ' , err)
      return res.status(400).json({msg: 'File Upload Error', error: err.message})
    }

    if(err){
      console.error('Unknown upload error: ' ,err)
      return res.status(400).json({msg: 'File Upload Error', error: err.message || 'Unknown error'} )
    }
    // dubug

    next();
  });
};

export default uploadMiddleWare;
