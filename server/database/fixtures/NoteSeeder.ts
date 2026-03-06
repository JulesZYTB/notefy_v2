import AbstractSeeder from "./AbstractSeeder";
import UserSeeder from "./UserSeeder";

class NoteSeeder extends AbstractSeeder {
    constructor() {
        super({ table: "notes", truncate: true, dependencies: [UserSeeder] });
    }

    async run() {
        for (let i = 0; i < 10; i++) {
            const userRef = this.getRef(`user_${Math.floor(Math.random() * 5)}`) as any;

            this.insert({
                name: this.faker.lorem.words(3),
                slug: this.faker.helpers.slugify(this.faker.lorem.words(2)).substring(0, 10),
                is_private: this.faker.datatype.boolean(),
                linkshare: this.faker.datatype.boolean(),
                user_id: userRef.insertId,
                refName: `note_${i}`,
            });
        }
    }
}

export default NoteSeeder;
