const crypto = require("crypto");
const noteRepo = require("./noteRepo");
const userRepo = require("../user/userRepo");

exports.createNote = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const ownerId = req.body.owner_id;

        const user = await userRepo.getUserById(ownerId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const note = await noteRepo.createNote({
            id: crypto.randomUUID(),
            title: title || null,
            content,
            ownerId,
        });

        return res.status(201).json(note);
    } catch (error) {
        next(error);
    }
};

exports.getNoteById = async (req, res, next) => {
    try {
        const note = await noteRepo.getNoteById(req.params.id);

        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        return res.json(note);
    } catch (error) {
        next(error);
    }
};

exports.getAllNotes = async (req, res, next) => {
    try {
        const ownerId = req.query.owner_id;

        if (!ownerId) {
            return res.status(400).json({ error: "owner_id query param is required" });
        }

        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;

        const notes = await noteRepo.getAllNotes({ ownerId, limit, offset });
        return res.json(notes);
    } catch (error) {
        next(error);
    }
};

exports.updateNote = async (req, res, next) => {
    try {
        const noteId = req.params.id;
        if (!noteId) {
            return res.status(400).json({ error: "id path param is required" });
        }

        const { user_id, title, content } = req.body;
        const note = await noteRepo.getNoteByIdWithRole(req.params.id, user_id);
        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        if (note.user_role != 'owner' && note.user_role != 'editor') {
            return res.status(403).json({ error: "You don't have an access to edit this note" });
        }

        const updateRes = await noteRepo.updateNote(noteId, { title, content });
        await noteRepo.addNoteVersion(noteId, { content: updateRes.content, version: updateRes.version, user_id });
        return res.json(updateRes);
    } catch (error) {
        next(error);
    }
}

exports.deleteNote = async (req, res, next) => {
    try {
        const deleted = await noteRepo.deleteNote(req.params.id);

        if (!deleted) {
            return res.status(404).json({ error: "Note not found" });
        }

        return res.status(204).end();
    } catch (error) {
        next(error);
    }
};

exports.addCollaborator = async (req, res, next) => {
    try {
        const note_id = req.params.id;
        const { email, role } = req.body;

        const note = await noteRepo.getNoteById(note_id);
        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        const user = await userRepo.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const collaborator = await noteRepo.addCollaborator(note_id, user.id, role);
        return res.status(201).json(collaborator);
    } catch (error) {
        next(error);
    }
};

exports.getSharedNotes = async (req, res, next) => {
    try {
        const collaboratorId = req.query.collaborator_id;

        if (!collaboratorId) {
            return res.status(400).json({ error: "collaborator_id query param is required" });
        }

        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;

        const notes = await noteRepo.getAllNotesByCollaboratorId({ collaboratorId, limit, offset });
        return res.json(notes);
    } catch (error) {
        next(error);
    }
};

exports.getNoteByIdWithRole = async (req, res, next) => {
    try {
        const userId = req.query.user_id;
        if (!userId) {
            return res.status(400).json({ error: "user_id query param is required" });
        }

        const note = await noteRepo.getNoteByIdWithRole(req.params.id, userId);
        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        return res.json(note);
    } catch (error) {
        next(error);
    }
}
