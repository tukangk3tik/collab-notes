const pool = require("../db");

exports.createNote = async ({ id, title, content, ownerId }) => {
    const result = await pool.query(
        `INSERT INTO notes (id, title, content, owner_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
        [id, title, content, ownerId]
    );
    return result.rows[0];
};

exports.getNoteById = async (id) => {
    const result = await pool.query(`SELECT * FROM notes WHERE id = $1`, [id]);
    return result.rows[0] || null;
};

exports.getAllNotes = async ({ ownerId, limit = 20, offset = 0 }) => {
    const result = await pool.query(
        `SELECT * FROM notes
     WHERE owner_id = $1
     ORDER BY updated_at DESC
     LIMIT $2 OFFSET $3`,
        [ownerId, limit, offset]
    );
    return result.rows;
};

exports.updateNote = async (id, { title, content }) => {
    const result = await pool.query(
        `UPDATE notes
     SET title = COALESCE($1, title),
         content = COALESCE($2, content),
         version = version + 1,
         updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
        [title, content, id]
    );
    return result.rows[0] || null;
};

exports.deleteNote = async (id) => {
    const result = await pool.query(
        `DELETE FROM notes WHERE id = $1 RETURNING id`,
        [id]
    );
    return result.rowCount > 0;
};