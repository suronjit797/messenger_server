// import axios from "axios";
// import fs from "fs";
// import ApiError from "../../ApiError";
// import httpStatus from "http-status";
// import { RequestHandler } from "express";
// import config from "../../config";
// import sendResponse from "../../shared/sendResponse";
// import { constructFileInfo } from "../../helper/fileHelper";

// const imagePath = "public/uploads/images";

// const HOSTNAME = config.REGION ? `https://${config.REGION}.${config.BASE_HOSTNAME}` : config.BASE_HOSTNAME;

// const bunnyStorageEndpoint = `${HOSTNAME}${config.STORAGE_ZONE_NAME}/DPS/images`;
// const bunnyStorageKey = config.BUNNY_API_KEY;


// const uploadToBunny: RequestHandler = async (req, res, next) => {
//   try {
//     const file = req.file;
//     if (!file) {
//       throw new ApiError(httpStatus.BAD_REQUEST, "File Upload Failed");
//     }

//     const fileName = file.filename;
//     const filePath = file?.path || `${imagePath}/${fileName}`;
//     const bunnyPath = `${bunnyStorageEndpoint}/${fileName}`;
//     const response = await axios.put(bunnyPath, fs.createReadStream(filePath), {
//       headers: {
//         AccessKey: bunnyStorageKey,
//         "Content-Type": file.mimetype,
//       },
//     });

//     if (response.status === 201) {
//       fs.unlinkSync(filePath);

//       const payload = {
//         success: true,
//         message: "File uploaded successfully",
//         data: constructFileInfo(file),
//       };
//       return sendResponse(res, httpStatus.OK, payload);
//     } else {
//       throw new ApiError(500, "Failed to upload file to BunnyCDN");
//     }
//   } catch (error) {
//     console.error("Error uploading to BunnyCDN:", error);
//     next(error);
//   }
// };

// export default uploadToBunny;
