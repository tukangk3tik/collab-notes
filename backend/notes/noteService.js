const crypto = require("crypto");
const noteRepo = require("./noteRepo");

exports.createNote = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const ownerId = req.body.owner_id;

        if (!content) {
            return res.status(400).json({ error: "content is required" });
        }
        if (!ownerId) {
            return res.status(400).json({ error: "owner_id is required" });
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
        const { title, content } = req.body;

        const note = await noteRepo.updateNote(req.params.id, { title, content });

        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        return res.json(note);
    } catch (error) {
        next(error);
    }
};

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
