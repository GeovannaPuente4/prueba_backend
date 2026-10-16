import { eq } from "drizzle-orm";
import { db } from "./db/index.js";
import { notes, users } from "./db/schemas.js";

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Note = typeof notes.$inferSelect;
export type NewNotes = typeof notes.$inferInsert;

export const userRepository = {
  async findByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  },

  async findById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  },

  async create(data: NewUser): Promise<User> {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  },
};

export const noteRepository = {
  async readAll(): Promise<Note[]> {
    return await db.select().from(notes);
  },
  async findByUserId(id: number): Promise<Note[]> {
    return await db.select().from(notes).where(eq(notes.userId, id));
  },
  async updateNote(
    id: number,
    data: Partial<NewNotes>,
  ): Promise<Note | undefined> {
    const [note] = await db.update(notes).set(data).returning();
    return note;
  },
  async deleteNote(id: number) {
    return await db.delete(notes).where(eq(notes.id, id));
  },

  async create(data: NewNotes): Promise<Note> {
    const [note] = await db.insert(notes).values(data).returning();
    return note;
  },
};
