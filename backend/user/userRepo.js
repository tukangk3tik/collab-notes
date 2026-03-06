const pool = require("../db");

exports.createUser = async ({ id, name, email }) => {
    const result = await pool.query(
        `INSERT INTO users (id, name, email)
     VALUES ($1, $2, $3)
     RETURNING *`,
        [id, name, email]
    );
    return result.rows[0];
};

exports.getUserById = async (id) => {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    return result.rows[0] || null;
};

exports.getUserByEmail = async (email) => {
    const result = await pool.query(`SELECT id, name, email FROM users WHERE email = $1`, [
        email,
    ]);
    return result.rows[0] || null;
};

exports.getAllUsers = async ({ limit = 20, offset = 0 }) => {
    const result = await pool.query(
        `SELECT * FROM users
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
        [limit, offset]
    );
    return result.rows;
};

exports.updateUser = async (id, { name, email }) => {
    const result = await pool.query(
        `UPDATE users
     SET name = COALESCE($1, name),
         email = COALESCE($2, email)
     WHERE id = $3
     RETURNING *`,
        [name, email, id]
    );
    return result.rows[0] || null;
};

exports.deleteUser = async (id) => {
    const result = await pool.query(
        `DELETE FROM users WHERE id = $1 RETURNING id`,
        [id]
    );
    return result.rowCount > 0;
};
