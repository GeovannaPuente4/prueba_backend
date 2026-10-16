import { HTTPException } from "hono/http-exception";
import { sign } from "hono/jwt";
import { env } from "./config.js";
import { noteRepository, userRepository, type Note, type User } from "./repositorie.js";
import type { CreateNoteInput, UpdateNoteInput } from "./validators.js";

const TOKEN_TTL_SECONDS = 60 * 60;

export type PublicUser = Omit<User, "password">;

const toPublicUser = ({ password: _password, ...user }: User): PublicUser => user;

export const authService = {
  async register(email: string, password: string): Promise<PublicUser> {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new HTTPException(409, { message: "Email already registered" });

    const user = await userRepository.create({ email, password });
    return toPublicUser(user);
  },

  async login(email: string, password: string): Promise<{ token: string; user: PublicUser }> {
    const user = await userRepository.findByEmail(email);
    if (!user || user.password !== password) {
      throw new HTTPException(401, { message: "Invalid credentials" });
    }

    const now = Math.floor(Date.now() / 1000);
    const token = await sign({ sub: String(user.id), iat: now, exp: now + TOKEN_TTL_SECONDS }, env.JWT_SECRET);

    return { token, user: toPublicUser(user) };
  },

  async me(userId: number): Promise<PublicUser> {
    const user = await userRepository.findById(userId);
    if (!user) throw new HTTPException(404, { message: "User not found" });
    return toPublicUser(user);
  },
};

export const noteService = {
  listByUser(userId: number): Promise<Note[]> {
    return noteRepository.findByUserId(userId);
  },

  create(userId: number, input: CreateNoteInput): Promise<Note> {
    return noteRepository.create({ ...input, userId });
  },

  async update(id: number, input: UpdateNoteInput): Promise<Note> {
    const note = await noteRepository.updateNote(id, { ...input, updateAt: new Date() });
    if (!note) throw new HTTPException(404, { message: "Note not found" });
    return note;
  },

  async remove(id: number): Promise<void> {
    const result = await noteRepository.deleteNote(id);
    if (!result.rowCount) throw new HTTPException(404, { message: "Note not found" });
  },
};
