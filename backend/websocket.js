const WebSocket = require("ws");
const { randomUUID } = require("crypto");

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server });
    const rooms = new Map();

    wss.on("connection", (ws) => {
        ws.id = randomUUID();
        console.log('Client connected with id: ', ws.id);

        ws.on("message", (message) => {
            const data = JSON.parse(message);
            switch (data.type) {
                case "join":
                    if (!rooms.has(data.note_id)) {
                        rooms.set(data.note_id, new Set());
                    }

                    rooms.get(data.note_id).add(ws);
                    break;

                case "edit":
                    const room = rooms.get(data.note_id);
                    room.forEach((client) => {
                        if (client !== ws && client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                ...data,
                                sender_id: ws.id
                            }));
                        }
                    });
                    break;
                default:
                    console.log("event type not found: ", data.type);
                    break;
            }
        });

        ws.on("close", () => {
            if (ws.note_id && rooms.has(ws.note_id)) {
                rooms.get(ws.note_id).delete(ws);
                console.log("Client disconnected");
            }
        });
    });
}

module.exports = setupWebSocket;

