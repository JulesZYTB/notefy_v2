import { useEffect, useState } from "react";
import type { Note } from "../../types";
import Footer from "../Footer";
import { islogin } from "../../utils/auth";

interface NoteEditProps {
    note: Note;
    token: string | null;
    onCancel: () => void;
    onUpdateSuccess: () => void;
}

export default function NoteEdit({ note, token, onCancel, onUpdateSuccess }: NoteEditProps) {
    const [editName, setEditName] = useState(note.name || "");
    const [editContent, setEditContent] = useState(note.content || "");
    const [editIsPrivate, setEditIsPrivate] = useState(note.is_private || false);
    const [editPassword, setEditPassword] = useState("");

    useEffect(() => {
        islogin(true);
    }, []);
    
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        try {
            const response = await fetch(`/api/notes/${note.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: editName,
                    content: editContent,
                    is_private: editIsPrivate,
                    password: editPassword || undefined
                }),
            });

            if (response.ok) {
                onUpdateSuccess();
            } else {
                console.error("Echec de la mise à jour de la note");
            }
        } catch (err) {
            console.error("Erreur lors de la mise à jour de la note : ", err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <header className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-4 gap-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Modifier</h1>
                <button
                    onClick={onCancel}
                    className="bg-gray-800 dark:bg-gray-700 text-white px-4 py-2 hover:bg-gray-900 dark:hover:bg-gray-600 transition text-sm font-medium"
                >
                    Annuler
                </button>
            </header>

            <main className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
                            placeholder="Nom de la note (optionnel)"
                        />
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <input
                                    type="checkbox"
                                    id="edit_is_private"
                                    checked={editIsPrivate}
                                    onChange={(e) => setEditIsPrivate(e.target.checked)}
                                />
                                <label htmlFor="edit_is_private" className="text-sm font-medium cursor-pointer">Rendre cette note privée</label>
                            </div>
                            <input
                                type="password"
                                placeholder="Mot de passe (optionnel)"
                                value={editPassword}
                                onChange={(e) => setEditPassword(e.target.value)}
                                className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3 py-1 text-sm text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={15}
                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                        required
                        placeholder="Votre texte ici..."
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 px-8 hover:bg-blue-700 transition font-medium"
                    >
                        Enregistrer
                    </button>
                </form>
            </main>
            <Footer />
        </div>
    );
}
