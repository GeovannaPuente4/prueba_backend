import { Hono } from "hono";
import { authController, noteController } from "./controler.js";
import { authMiddleware, type AppEnv } from "./middleware.js";

export const authRouter = new Hono<AppEnv>()
  .post("/register", ...authController.register)
  .post("/login", ...authController.login)
  .post("/logout", ...authController.logout)
  .get("/me", authMiddleware, ...authController.me);

export const notesRouter = new Hono<AppEnv>()
  .use(authMiddleware)
  .get("/", ...noteController.list)
  .post("/", ...noteController.create)
  .patch("/:id", ...noteController.update)
  .delete("/:id", ...noteController.remove);
