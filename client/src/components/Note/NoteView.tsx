import { Link } from "react-router";
import type { Note } from "../../types";
import Footer from "../Footer";

interface NoteViewProps {
    note: Note;
    token: string | null;
    isFavorited: boolean;
    showCopied: boolean;
    onToggleFavorite: () => void;
    onShare: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export default function NoteView({
    note,
    token,
    isFavorited,
    showCopied,
    onToggleFavorite,
    onShare,
    onEdit,
    onDelete
}: NoteViewProps) {
    return (
        <div className="max-w-4xl mx-auto">
            <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-4 gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{note.name || "Sans titre"}</h1>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Slug: {note.slug}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    {token && note.auth && (
                        <>
                            <button
                                onClick={onToggleFavorite}
                                className={`px-4 py-2 text-sm font-medium transition border ${isFavorited ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/50' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            >
                                {isFavorited ? "★ Retirer des favoris" : "☆ Favori"}
                            </button>
                            <button
                                onClick={onEdit}
                                className="bg-gray-800 dark:bg-gray-700 text-white px-4 py-2 hover:bg-gray-900 dark:hover:bg-gray-600 transition text-sm font-medium"
                            >
                                Modifier
                            </button>
                            <button
                                onClick={onDelete}
                                className="bg-red-800 dark:bg-red-700 text-white px-4 py-2 hover:bg-red-900 dark:hover:bg-red-600 transition text-sm font-medium"
                            >
                                Supprimer
                            </button>
                        </>
                    )}
                    <button
                        onClick={onShare}
                        className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm font-medium relative"
                    >
                        Partager
                        {showCopied && (
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-black text-white text-[10px] px-2 py-1 rounded">
                                Lien copié !
                            </span>
                        )}
                    </button>
                    <Link
                        to="/"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                    >
                        ← Notefy
                    </Link>
                </div>
            </header>

            <main className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200 bg-gray-50/50 dark:bg-gray-900/50 p-6 border border-gray-100 dark:border-gray-700 min-h-[400px]">
                    {note.content}
                </pre>
            </main>
            <Footer />
        </div>
    );
}
