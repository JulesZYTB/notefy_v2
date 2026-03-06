import AbstractSeeder from "./AbstractSeeder";
import NoteSeeder from "./NoteSeeder";

class ContentSeeder extends AbstractSeeder {
    constructor() {
        super({ table: "content", truncate: true, dependencies: [NoteSeeder] });
    }

    run() {
        for (let i = 0; i < 10; i += 1) {
            const fakeContent = {
                note_id: this.getRef(`note_${i}`).insertId,
                content: this.faker.lorem.paragraphs(3),
            };

            this.insert(fakeContent);
        }
    }
}

export default ContentSeeder;
