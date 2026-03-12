import { useState, useEffect, Suspense } from "react";
import { useParams, useNavigate } from "react-router";
import type { Note } from "../types";
import { lazy } from "react";
import { getCookie, islogin, logout } from "../utils/auth";
import Loading from "../components/Loading";

const NoteView = lazy(() => import("../components/Note/NoteView"));
const NoteEdit = lazy(() => import("../components/Note/NoteEdit"));

export default function NotePage() {
    const { slug } = useParams();
    const [note, setNote] = useState<Note | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const [passwordInput, setPasswordInput] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isFavorited, setIsFavorited] = useState(false);
    const [showCopied, setShowCopied] = useState(false);

    const navigate = useNavigate();
    const token = getCookie("token");

    const handleLogout = () => {
        logout();
    };

    useEffect(() => {
        islogin(false);
        fetchNote();
        if (token) {
            checkFavorite();
        }
    }, [slug, token]);

    const fetchNote = async () => {
        try {
            const response = await fetch(`/api/notes/${slug}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (response.status === 401) {
                // islogin(true);
                return;
            }
            if (response.ok) {
                const data = await response.json();
                setNote(data);
            } else {
                navigate("/");
            }
        } catch (err) {
            console.error(err);
            navigate("/");
        }
    };

    const checkFavorite = async () => {
        try {
            const response = await fetch("/api/favorites", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 401) {
                // islogin(true);
                return;
            }
            if (response.ok) {
                const favorites = await response.json();
                const isFav = favorites.some((f: any) => f.slug === slug);
                setIsFavorited(isFav);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleVerifyPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/notes/${slug}/verify-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: passwordInput })
            });

            if (response.ok) {
                const data = await response.json();
                setNote(data);
                setPasswordError("");
            } else {
                setPasswordError("Mot de passe invalide");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggleFavorite = async () => {
        if (!token || !note) return;
        try {
            if (isFavorited) {
                const response = await fetch(`/api/favorites/${note.id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.status === 401) {
                    islogin(true);
                    return;
                }
                if (response.ok) setIsFavorited(false);
            } else {
                const response = await fetch("/api/favorites", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ noteId: note.id })
                });
                if (response.status === 401) {
                    islogin(true);
                    return;
                }
                if (response.ok) setIsFavorited(true);
            }
        } catch (err) {
            console.error(err);
        }
    };



    const handleDelete = async () => {
        if (!token || !note) return;
        try {
            const response = await fetch(`/api/notes/${note.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 401) {
                islogin(true);
                return;
            }
            if (response.ok) navigate("/");
        } catch (err) {
            console.error(err);
        }
    };

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
    };

    if (!note) return null;

    if (note.hasPassword && note.content === null) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm p-8 max-w-md w-full">
                    <h2 className="text-xl font-bold mb-4 text-center dark:text-white">Cette note est protégée par un mot de passe</h2>
                    <form onSubmit={handleVerifyPassword} className="space-y-4">
                        <input
                            type="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
                            placeholder="Entrez le mot de passe"
                            autoFocus
                        />
                        {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 hover:bg-blue-700 transition font-medium">
                            Vérifier
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (isEditing) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors">
                <Suspense fallback={<Loading />}>
                    <NoteEdit
                        note={note}
                        token={token}
                        onCancel={() => setIsEditing(false)}
                        onUpdateSuccess={() => { setIsEditing(false); fetchNote(); }}
                    />
                </Suspense>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors">
            <Suspense fallback={<Loading />}>
                <NoteView
                    note={note}
                    token={token}
                    isFavorited={isFavorited}
                    showCopied={showCopied}
                    onToggleFavorite={handleToggleFavorite}
                    onShare={handleShare}
                    onEdit={() => setIsEditing(true)}
                    onDelete={handleDelete}
                />
            </Suspense>
        </div>
    );
}
