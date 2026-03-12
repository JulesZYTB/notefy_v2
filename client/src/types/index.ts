export interface User {
    id: number;
    email: string;
    firstname?: string;
    lastname?: string;
    role: string;
}

export interface Note {
    id: number;
    name: string;
    slug: string;
    is_private: boolean;
    linkshare: boolean;
    user_id?: number;
    content?: string;
    created_at?: string;
    hasPassword?: boolean;
    auth?: boolean;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface NoteResponse {
    insertId: number;
    slug: string;
}
