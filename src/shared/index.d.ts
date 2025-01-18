import { JwtPayload } from "jsonwebtoken";
import { CustomJwtPayload } from "./globalInterfaces";

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Request {
      user: JwtPayload | CustomJwtPayload;
    }
  }
}
