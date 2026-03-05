const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/config");
const noteService = require("./notes/noteService");
const userService = require("./user/userService");

const app = express();
const appPort = 3001;

app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (_, res) => {
    res.send("Collab Notes API");
});

// Notes CRUD
app.post("/notes", noteService.createNote);
app.get("/notes", noteService.getAllNotes);
app.get("/notes/:id", noteService.getNoteById);
app.put("/notes/:id", noteService.updateNote);
app.delete("/notes/:id", noteService.deleteNote);

// Users CRUD
app.post("/users", userService.createUser);
app.get("/users", userService.getAllUsers);
app.get("/users/:id", userService.getUserById);
app.put("/users/:id", userService.updateUser);
app.delete("/users/:id", userService.deleteUser);

// Global error handler
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
});

app.listen(appPort, () => {
    console.log(`Server started on port ${appPort}`);
});