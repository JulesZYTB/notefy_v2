import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type Note = {
  id: number;
  name: string;
  content_id: string | null;
  slug: string;
  is_private: boolean;
  linkshare: boolean;
  password?: string | null;
  created_at: string;
  updated_at: string;
  content?: string;
};

class NoteRepository {
  async create(note: Omit<Note, "id" | "created_at" | "updated_at" | "content" | "content_id">, content: string) {
    const connection = await databaseClient.getConnection();
    try {
      await connection.beginTransaction();

      const [noteResult] = await connection.query<Result>(
        "insert into notes (name, slug, is_private, linkshare, password, user_id) values (?, ?, ?, ?, ?, ?)",
        [
          note.name,
          note.slug,
          note.is_private,
          note.linkshare,
          note.password,
          (note as any).user_id,
        ],
      );

      const noteId = noteResult.insertId;

      const [contentResult] = await connection.query<Result>(
        "insert into content (note_id, content) values (?, ?)",
        [noteId, content],
      );

      const contentId = contentResult.insertId;

      await connection.query(
        "update notes set content_id = ? where id = ?",
        [contentId.toString(), noteId],
      );

      await connection.commit();
      return noteId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      `select n.*, c.content from notes n 
       left join content c on n.id = c.note_id 
       where n.id = ?`,
      [id],
    );

    return rows[0] as Note;
  }

  async readBySlug(slug: string) {
    const [rows] = await databaseClient.query<Rows>(
      `select n.*, c.content from notes n 
       left join content c on n.id = c.note_id 
       where n.slug = ?`,
      [slug],
    );

    return rows[0] as Note;
  }

  async readAll(userId?: number) {
    const [rows] = await databaseClient.query<Rows>(
      `select n.*, c.content from notes n 
       left join content c on n.id = c.note_id
       where n.is_private = false ${userId ? "OR n.user_id = ?" : ""}`,
      userId ? [userId] : [],
    );

    return rows as Note[];
  }

  async update(id: number, note: Partial<Omit<Note, "id" | "slug" | "created_at" | "updated_at">>) {
    const connection = await databaseClient.getConnection();
    try {
      await connection.beginTransaction();

      if (note.name !== undefined || note.is_private !== undefined || note.linkshare !== undefined || note.password !== undefined) {
        await connection.query(
          "update notes set name = coalesce(?, name), is_private = coalesce(?, is_private), linkshare = coalesce(?, linkshare), password = coalesce(?, password) where id = ?",
          [
            note.name ?? null,
            note.is_private ?? null,
            note.linkshare ?? null,
            note.password ?? null,
            id,
          ],
        );
      }

      if (note.content !== undefined) {
        await connection.query(
          "update content set content = ? where note_id = ?",
          [note.content, id],
        );
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "delete from notes where id = ?",
      [id],
    );
    return result.affectedRows;
  }
}

export default new NoteRepository();
