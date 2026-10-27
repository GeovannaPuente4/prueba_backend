import { zValidator } from "@hono/zod-validator"; 
import { deleteCookie, setCookie } from "hono/cookie"; 
import { createFactory } from "hono/factory"; 
import type { AppEnv } from "./middleware.js"; 
import { authService, noteService } from "./servises.js"; 
import { createNoteSchema, credentialsSchema, idParamSchema, updateNoteSchema } from "./validators.js";

const factory = createFactory

export const authController = {
  register: factory.createHandlers(
    zValidator("json", credentialsSchema),
    async (c) => {
      const { email, password } = c.req.valid("json");

      const user = await authService.register(email, password);

      return c.json(user, 201);
    },
  ),

  login: factory.createHandlers(
    zValidator("json", credentialsSchema),
    async (c) => {
      const { email, password } = c.req.valid("json");

      const { token, user } = await authService.login(email, password);

      setCookie(c, "token", token, {
        path: "/",
        sameSite: "Lax",
        maxAge: 60 * 60,
        httpOnly: true,
      });

      return c.json({ user });
    },
  ),

  logout: factory.createHandlers((c) => {
    deleteCookie(c, "token", {
      path: "/",
    });

    return c.body(null, 204);
  }),

  me: factory.createHandlers(async (c) => {
    const user = await authService.me(c.get("userId"));

    return c.json(user);
  }),
};

export const noteController = {
  list: factory.createHandlers(async (c) => {
    const notes = await noteService.listByUser(c.get("userId"));

    return c.json(notes);
  }),

  create: factory.createHandlers(
    zValidator("json", createNoteSchema),
    async (c) => {
      const note = await noteService.create(
        c.get("userId"),
        c.req.valid("json"),
      );

      return c.json(note, 201);
    },
  ),

  update: factory.createHandlers(
    zValidator("param", idParamSchema),
    zValidator("json", updateNoteSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const userId = c.get("userId");

      const note = await noteService.update(
        id,
        userId,
        c.req.valid("json"),
      );

      return c.json(note);
    },
  ),

  remove: factory.createHandlers(
    zValidator("param", idParamSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const userId = c.get("userId");

      await noteService.remove(id, userId);

      return c.body(null, 204);
    },
  ),
};