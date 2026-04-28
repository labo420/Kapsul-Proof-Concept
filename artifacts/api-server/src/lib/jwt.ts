import jwt from "jsonwebtoken";

const envSecret = process.env.JWT_SECRET;
if (!envSecret) {
  if (process.env.NODE_ENV === "production") {
    console.error("FATAL: JWT_SECRET env var is required in production");
    process.exit(1);
  } else {
    console.warn("WARNING: JWT_SECRET not set. Using insecure dev-only fallback.");
  }
}
const JWT_SECRET = envSecret ?? "kapsul_dev_secret_change_in_production";

export interface JwtPayload {
  userId: string;
  email: string;
  username: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "90d" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
