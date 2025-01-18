import dotenv from "dotenv";
import { Secret } from "jsonwebtoken";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  PORT: process.env.PORT || 5000,
  DB_URI: process.env.DB_URI,
  NODE_ENV: process.env.NODE_ENV || "production",
  sault_round: Number(process.env.SAULT_ROUND),
  token: {
    access_token_time: process.env.ACCESS_TOKEN_TIME,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET as Secret,
    refresh_token_time: process.env.REFRESH_TOKEN_TIME,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET as Secret,
  },
};
