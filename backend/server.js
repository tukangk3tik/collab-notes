require('dotenv').config();

const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/config");
const noteService = require("./notes/noteService");
const userService = require("./user/userService");
const authService = require("./user/authService");
const validateMiddleware = require("./common/middleware/validation-middleware");
const postNoteSchema = require("./notes/schema/post-note.schema");
const postCollaboratorSchema = require("./notes/schema/post-collaborator.schema");

const app = express();
const appPort = 3001;

app.use(cors());
app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (_, res) => {
    res.send("Collab Notes API");
});

// Notes CRUD
app.post("/notes", validateMiddleware(postNoteSchema), noteService.createNote);
app.get("/notes", noteService.getAllNotes);
app.get("/notes/:id", noteService.getNoteByIdWithRole);
app.delete("/notes/:id", noteService.deleteNote);
app.post("/notes/:id/collaborators", validateMiddleware(postCollaboratorSchema), noteService.addCollaborator);
app.get("/shared-notes", noteService.getSharedNotes);

// Users CRUD
app.post("/users", userService.createUser);
app.get("/users", userService.getAllUsers);
app.get("/users/:id", userService.getUserById);
app.delete("/users/:id", userService.deleteUser);

// Auth
app.post("/auth/signin", authService.signIn);

// Collaborators
// app.delete("/notes/:id/collaborators/:userId", noteService.removeCollaborator);
// app.get("/notes/:id/collaborators", noteService.getCollaborators);
// 
// // Operations
// app.post("/notes/:id/operations", noteService.applyOperation);
// app.get("/notes/:id/operations", noteService.getOperations);

// Global error handler
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
});

app.listen(appPort, () => {
    console.log(`Timezone set: ${process.env.TZ}`);
    console.log(`Server started on port: ${appPort}`);
});