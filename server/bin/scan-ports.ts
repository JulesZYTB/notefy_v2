import net from "node:net";

const ports = [3306, 3307, 3308, 33060];

const scan = async () => {
    console.log("Recherche d'un serveur MySQL actif...");
    for (const port of ports) {
        const promise = new Promise((resolve) => {
            const socket = new net.Socket();
            socket.setTimeout(500);
            socket.on("connect", () => {
                console.log(`[FOUND] Un service répond sur le port ${port} !`);
                socket.destroy();
                resolve(true);
            });
            socket.on("timeout", () => { socket.destroy(); resolve(false); });
            socket.on("error", () => { socket.destroy(); resolve(false); });
            socket.connect(port, "127.0.0.1");
        });
        await promise;
    }
    console.log("Scan terminé.");
};

scan();
