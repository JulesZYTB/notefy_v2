export async function islogin(require: boolean) {
    const token = getCookie("token");
    if (token && require) {
        const res = await fetch("/api/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        if (res.status === 401) {
            logout();
        } else {
            return true;
        }
    } else if (require) {
        logout();
    }
    return false;
}

export function getCookie(name: string) {
    const cookie = document.cookie
        .split("; ")
        .find(row => row.startsWith(name + "="))
        ?.split("=")[1];
    return cookie;
}

export function logout() {
    document.cookie = "token=; path=/; max-age=0";
    window.location.href = "/login";
}
