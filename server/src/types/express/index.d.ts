// to make the file a module and avoid the TypeScript error
export type { };
import type { User } from "../modules/user/userRepository";

declare global {
  namespace Express {
    export interface Request {
      sub: number,
      role: string,
      email: string,
      auth?: {
        sub: number,
        role: string,
        email: string,
      }
      user?: User;
    }
  }
}
