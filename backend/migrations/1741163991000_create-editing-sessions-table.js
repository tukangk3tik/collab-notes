/**
 * @type {import('node-pg-migrate').ColumnDefinitions}
 */

exports.up = (pgm) => {
    pgm.createTable("editing_sessions", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()"),
        },
        note_id: {
            type: "uuid",
            references: "notes(id)",
            onDelete: "CASCADE",
            notNull: true,
        },
        last_acknowledged_version: {
            type: "integer",
            notNull: true,
        },
        user_id: {
            type: "uuid",
            references: "users(id)",
            notNull: true,
        },
        last_active: {
            type: "timestamptz",
            default: pgm.func("NOW()"),
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable("editing_sessions");
};
