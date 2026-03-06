const userRepo = require("./userRepo");

exports.signIn = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "email is required" });
        }

        const user = await userRepo.getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.json(user);
    } catch (error) {
        next(error);
    }
};
