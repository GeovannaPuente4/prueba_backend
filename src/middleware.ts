import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { verify } from "hono/jwt";
import { env } from "./config.js";

export type AppEnv = {
  Variables: {
    userId: number;
  };
};

export const authMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const token = getCookie(c, "token");
  if (!token) throw new HTTPException(401, { message: "Unauthorized" });

  try {
    const payload = await verify(token, env.JWT_SECRET, "HS256");
    c.set("userId", Number(payload.sub));
  } catch {
    throw new HTTPException(401, { message: "Invalid or expired token" });
  }

  await next();
});
