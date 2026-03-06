import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type User = {
  id: number;
  email: string;
  password?: string;
  firstname: string | null;
  lastname: string | null;
  role: string;
  created_at: string;
  updated_at: string;
};

class UserRepository {
  async create(user: Omit<User, "id" | "created_at" | "updated_at">) {
    const [result] = await databaseClient.query<Result>(
      "insert into user (email, password, firstname, lastname, role) values (?, ?, ?, ?, ?)",
      [user.email, user.password, user.firstname, user.lastname, user.role],
    );

    return result.insertId;
  }

  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "select id, email, firstname, lastname, role, created_at, updated_at from user where id = ?",
      [id],
    );

    return rows[0] as User;
  }

  async readByEmail(email: string) {
    const [rows] = await databaseClient.query<Rows>(
      "select * from user where email = ?",
      [email],
    );

    return rows[0] as User;
  }

  async readAll() {
    const [rows] = await databaseClient.query<Rows>(
      "select id, email, firstname, lastname, role, created_at, updated_at from user",
    );

    return rows as User[];
  }
}

export default new UserRepository();
