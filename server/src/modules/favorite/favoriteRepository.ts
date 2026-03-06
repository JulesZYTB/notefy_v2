import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Favorite = {
    user_id: number;
    note_id: number;
    created_at: string;
};

class FavoriteRepository {
    async create(userId: number, noteId: number) {
        const [result] = await databaseClient.query<Result>(
            "insert into favorite (user_id, note_id) values (?, ?)",
            [userId, noteId],
        );

        return result.affectedRows;
    }

    async readAllByUser(userId: number) {
        const [rows] = await databaseClient.query<Rows>(
            `select f.created_at, n.*, c.content from favorite f 
       join notes n on f.note_id = n.id 
       left join content c on n.id = c.note_id 
       where f.user_id = ?`,
            [userId],
        );

        return rows;
    }

    async delete(userId: number, noteId: number) {
        const [result] = await databaseClient.query<Result>(
            "delete from favorite where user_id = ? and note_id = ?",
            [userId, noteId],
        );

        return result.affectedRows;
    }
}

export default new FavoriteRepository();
