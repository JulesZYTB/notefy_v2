import "dotenv/config";
import mysql from "mysql2/promise";

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const probe = async () => {
    try {
        console.log(`Connecting as ${DB_USER} to ${DB_HOST}:${DB_PORT}...`);
        const connection = await mysql.createConnection({
            host: DB_HOST,
            port: Number(DB_PORT),
            user: DB_USER,
            password: DB_PASSWORD,
        });
        console.log("Connection successful!");

        const [databases] = await connection.query("SHOW DATABASES");
        console.log("Databases:", databases);

        const [users] = await connection.query("SELECT User FROM mysql.user");
        console.log("Users:", users);

        await connection.end();
    } catch (err) {
        console.error("Probe failed:", err);
    }
};

probe();
