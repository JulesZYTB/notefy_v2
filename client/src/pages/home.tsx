import { useState, useEffect } from "react";
import { Link } from "react-router";
import type { Note } from "../types";
import { useTheme } from "../utils/theme";
import NoteCreate from "../components/Note/NoteCreate";
import { getCookie, islogin, logout } from "../utils/auth";
import Footer from "../components/Footer";

export default function Home() {
    const { theme, toggleTheme } = useTheme();
    const [notes, setNotes] = useState<Note[]>([]);
    const [favorites, setFavorites] = useState<Note[]>([]);
    const token = getCookie("token");

    useEffect(() => {
        islogin(false);
        if (token) checkFavorite();
        fetchNotes();
    }, [token]);

    const fetchNotes = async () => {
        try {
            const response = await fetch("/api/notes", {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (response.ok) {
                const data = await response.json();
                setNotes(data);
            }
        } catch (err) {
            console.error(err);
        }
    };


    const checkFavorite = async () => {
        try {
            const response = await fetch("/api/favorites", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 401) {
                handleLogout();
                return;
            }
            if (response.ok) {
                const data = await response.json();
                setFavorites(data);
                console.log("Favorites fetched successfully");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notefy</h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                console.log("Theme button clicked");
                                toggleTheme();
                            }}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition relative z-10"
                            title={theme === "light" ? "Mode sombre" : "Mode clair"}
                        >
                            {theme === "light" ? "🌙" : "☀️"}
                        </button>
                        {token ? (
                            <button
                                onClick={handleLogout}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium"
                            >
                                Déconnexion
                            </button>
                        ) : (
                            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                                Connexion
                            </Link>
                        )}
                    </div>
                </header>

                <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-3">
                        {token ? (
                            <NoteCreate token={token} onSuccess={fetchNotes} />
                        ) : (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-6 rounded-lg text-center">
                                <p className="text-blue-800 dark:text-blue-300 font-medium mb-4">Rejoignez-nous pour créer vos propres notes privées !</p>
                                <Link to="/register" className="bg-blue-600 text-white py-2 px-8 hover:bg-blue-700 transition inline-block font-medium">
                                    S'inscrire
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-1">
                        <h2 className="text-xl font-semibold mb-4 dark:text-white">{token ? "Mes Notes" : "Notes Publiques"}</h2>
                        <div className="space-y-2">
                            {notes.length === 0 && <p className="text-gray-500 dark:text-gray-400 text-sm italic">Aucune note à afficher.</p>}
                            {notes.map((note) => (
                                <Link
                                    key={note.id}
                                    to={`/note/${note.slug}`}
                                    className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition shadow-sm"
                                >
                                    <div className="flex justify-between items-start">
                                        <p className="font-medium truncate text-gray-900 dark:text-white">{note.name || "Sans titre"}</p>
                                        <div className="flex gap-1">
                                            {note.is_private ? <span className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">PRIVE</span> : null}
                                            {note.hasPassword ? <span className="text-[10px] bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-1.5 py-0.5 rounded">🔒</span> : null}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{note.slug}</p>
                                </Link>
                            )) || <div className="text-gray-500 dark:text-gray-400 text-sm italic">Aucune note à afficher.</div>}
                        </div>
                    </div>

                    {token && (
                        <div className="md:col-span-1">
                            <h2 className="text-xl font-semibold mb-4 dark:text-white">Mes Favoris</h2>
                            <div className="space-y-2">
                                {favorites.length === 0 && <p className="text-gray-500 dark:text-gray-400 text-sm italic">Aucune note à afficher.</p>}
                                {favorites.map((note) => (
                                    <Link
                                        key={note.id}
                                        to={`/note/${note.slug}`}
                                        className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition shadow-sm"
                                    >
                                        <div className="flex justify-between items-start">
                                            <p className="font-medium truncate text-gray-900 dark:text-white">{note.name || "Sans titre"}</p>
                                            <div className="flex gap-1">
                                                {note.is_private ? <span className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">PRIVE</span> : null}
                                                {note.hasPassword ? <span className="text-[10px] bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-1.5 py-0.5 rounded">🔒</span> : null}
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{note.slug}</p>
                                    </Link>
                                )) || <div className="text-gray-500 dark:text-gray-400 text-sm italic">Aucune note à afficher.</div>}
                            </div>
                        </div>
                    )}
                </main>
                <Footer />
            </div>
        </div>
    );
}
