import AbstractSeeder from "./AbstractSeeder";
import argon2 from "argon2";

class UserSeeder extends AbstractSeeder {
    constructor() {
        super({ table: "user", truncate: true });
    }

    async run() {
        const hashedPassword = await argon2.hash("password123");

        for (let i = 0; i < 5; i++) {
            this.insert({
                email: this.faker.internet.email(),
                password: hashedPassword,
                firstname: this.faker.person.firstName(),
                lastname: this.faker.person.lastName(),
                role: "user",
                refName: `user_${i}`,
            });
        }

        this.insert({
            email: "admin@notefy.com",
            password: hashedPassword,
            firstname: "Admin",
            lastname: "Notefy",
            role: "admin",
            refName: "admin",
        });
    }
}

export default UserSeeder;
