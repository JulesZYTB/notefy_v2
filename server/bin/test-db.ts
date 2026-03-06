import mysql from "mysql2/promise";

const combinations = [
    { user: "root", password: "" },
    { user: "root", password: "root" },
    { user: "root", password: "password" },
    { user: "user", password: "password" },
];

const testConnections = async () => {
    for (const { user, password } of combinations) {
        try {
            console.log(`Testing ${user}:${password}...`);
            const connection = await mysql.createConnection({
                host: "localhost",
                port: 3306,
                user,
                password,
            });
            console.log(`SUCCESS: ${user}:${password}`);
            await connection.end();
            return;
        } catch (err: any) {
            console.log(`FAILED: ${err.code || err.message}`);
        }
    }
};

testConnections();
