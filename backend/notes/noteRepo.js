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
    const result = await pool.query(`
        SELECT * FROM notes WHERE id = $1
    `, [id]);
    return result.rows[0] || null;
};

exports.getAllNotes = async ({ ownerId, limit = 20, offset = 0 }) => {
    const result = await pool.query(
        `SELECT id, title, content, version, updated_at FROM notes
     WHERE owner_id = $1
     ORDER BY updated_at DESC
     LIMIT $2 OFFSET $3`,
        [ownerId, limit, offset]
    );
    return result.rows;
};

exports.getAllNotesByCollaboratorId = async ({ collaboratorId, limit = 20, offset = 0 }) => {
    console.log(collaboratorId, ': repo');
    const result = await pool.query(
        `SELECT a.id, a.title, a.content, a.version, a.updated_at, 
        (SELECT COUNT(user_id) FROM note_collaborators WHERE note_id = a.id) as collaborators
        FROM notes a
     JOIN note_collaborators b ON a.id = b.note_id
     WHERE b.user_id = $1
     ORDER BY a.updated_at DESC
     LIMIT $2 OFFSET $3`,
        [collaboratorId, limit, offset]
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

exports.addCollaborator = async (noteId, userId, role) => {
    const result = await pool.query(
        `INSERT INTO note_collaborators (note_id, user_id, role)
     VALUES ($1, $2, $3)
     RETURNING *`,
        [noteId, userId, role]
    );
    return result.rows[0];
};

exports.getNoteByIdWithRole = async (id, userId) => {
    const result = await pool.query(`
        SELECT a.*, 
        CASE
            WHEN a.owner_id = $2 THEN 'owner'
            ELSE b.role
        END AS user_role FROM notes a 
        LEFT JOIN note_collaborators b ON b.note_id = a.id AND b.user_id = $2
        WHERE a.id = $1
        AND (
            a.owner_id = $2
            OR b.role IS NOT NULL 
        )
    `, [id, userId]);
    return result.rows[0] || null;
};