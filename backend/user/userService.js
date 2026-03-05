const crypto = require("crypto");
const userRepo = require("./userRepo");

exports.createUser = async (req, res, next) => {
    try {
        const { name, email } = req.body;

        if (!name) {
            return res.status(400).json({ error: "name is required" });
        }
        if (!email) {
            return res.status(400).json({ error: "email is required" });
        }

        const existing = await userRepo.getUserByEmail(email);
        if (existing) {
            return res.status(409).json({ error: "Email already in use" });
        }

        const user = await userRepo.createUser({
            id: crypto.randomUUID(),
            name,
            email,
        });

        return res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const user = await userRepo.getUserById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.json(user);
    } catch (error) {
        next(error);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;

        const users = await userRepo.getAllUsers({ limit, offset });
        return res.json(users);
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const { name, email } = req.body;

        if (email) {
            const existing = await userRepo.getUserByEmail(email);
            if (existing && existing.id !== req.params.id) {
                return res.status(409).json({ error: "Email already in use" });
            }
        }

        const user = await userRepo.updateUser(req.params.id, { name, email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.json(user);
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const deleted = await userRepo.deleteUser(req.params.id);

        if (!deleted) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(204).end();
    } catch (error) {
        next(error);
    }
};
