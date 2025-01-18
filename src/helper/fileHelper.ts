import { Request } from "express";

export const constructFileInfo = (file: Express.Multer.File) => ({
  uid: file.filename,
  name: file.originalname,
  size: file.size,
  type: file.mimetype,
  thumbUrl: `https://fai-cg.b-cdn.net/DPS/images/${file.filename}`,
});
