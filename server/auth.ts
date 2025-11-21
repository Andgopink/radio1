import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "navichat-radio-secret-key";

export interface AuthPayload {
  username: string;
}

export function generateToken(username: string): string {
  return jwt.sign({ username }, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
}
