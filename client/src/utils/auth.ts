export function islogin(require: boolean) {
    const token = getCookie("token");
    console.log("token", token);
    if (!token || token === null) return require ? logout() : false;

    try {
        const { exp } = JSON.parse(atob(token.split('.')[1]));
        if (Date.now() >= exp * 1000) return logout();
    } catch {
        return logout();
    }
}

export function getCookie(name: string) {
    const cookie = document.cookie
        .split("; ")
        .find(row => row.startsWith(name + "="))
        ?.split("=")[1];
    return cookie;
}

export function logout() {
    /* document.cookie = "token=; path=/; max-age=0";
    window.location.href = "/login" */;
}
