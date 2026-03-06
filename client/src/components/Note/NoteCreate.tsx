import { useState } from "react";

interface NoteCreateProps {
    token: string | null;
    onSuccess: () => void;
}

export default function NoteCreate({ token, onSuccess }: NoteCreateProps) {
    const [noteName, setNoteName] = useState("");
    const [content, setContent] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: noteName,
                    content,
                    is_private: isPrivate,
                    password: password || null
                }),
            });

            if (response.status === 201) {
                setNoteName("");
                setContent("");
                setIsPrivate(false);
                setPassword("");
                onSuccess();
            } else {
                alert("Echec de la création de la note");
            }
        } catch (err) {
            console.error("Erreur lors de la création de la note : ", err);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Nouvelle Note</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Nom de la note (optionnel)"
                    value={noteName}
                    onChange={(e) => setNoteName(e.target.value)}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <textarea
                    placeholder="Votre texte ici..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                    required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_private"
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                            className="w-4 h-4 text-blue-600"
                        />
                        <label htmlFor="is_private" className="text-sm text-gray-700 dark:text-gray-300 font-medium cursor-pointer">
                            Rendre cette note privée
                        </label>
                    </div>
                    <input
                        type="password"
                        placeholder="Mot de passe (optionnel)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3 py-1 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-6 hover:bg-blue-700 transition w-full md:w-auto font-medium"
                >
                    Enregistrer
                </button>
            </form>
        </div>
    );
}
