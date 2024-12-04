import jwt from "jsonwebtoken";
import User, { IUser } from "../models/userModel";

export const authenticate = async (
  authHeader: string | undefined,
  secret: string
): Promise<IUser | null> => {
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);

    try {
      const decodedToken = jwt.verify(token, secret) as { id: string };

      return await User.findById(decodedToken.id).populate("friends")
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  }

  return null;
};
