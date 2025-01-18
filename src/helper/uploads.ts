import multer from "multer";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const imagePath = "public/uploads/images";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(imagePath, { recursive: true });
    return cb(null, imagePath);
  },
  filename: (req, file, cb) => cb(null, `${uuidv4()}-${file.originalname.replace(/\s+/g, "_")}`),
});

const upload = multer({ storage });

export default upload;
