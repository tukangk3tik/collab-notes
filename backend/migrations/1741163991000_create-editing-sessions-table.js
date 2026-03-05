/**
 * @type {import('node-pg-migrate').ColumnDefinitions}
 */

exports.up = (pgm) => {
    pgm.createTable("editing_sessions", {
        id: {
            type: "uuid",
            primaryKey: true,
        },
        note_id: {
            type: "uuid",
            references: "notes(id)",
            onDelete: "CASCADE",
            notNull: true,
        },
        user_id: {
            type: "uuid",
            references: "users(id)",
            notNull: true,
        },
        last_active: {
            type: "timestamp",
            default: pgm.func("NOW()"),
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable("editing_sessions");
};
