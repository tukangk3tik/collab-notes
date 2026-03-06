/**
 * @type {import('node-pg-migrate').ColumnDefinitions}
 */

exports.up = (pgm) => {
    pgm.createTable("notes", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()"),
        },
        title: {
            type: "text",
        },
        content: {
            type: "text",
            notNull: true,
        },
        owner_id: {
            type: "uuid",
            references: "users(id)",
        },
        version: {
            type: "integer",
            default: 0,
        },
        created_at: {
            type: "timestamptz",
            default: pgm.func("NOW()"),
        },
        updated_at: {
            type: "timestamptz",
            default: pgm.func("NOW()"),
        },
    });

    pgm.createIndex("notes", "owner_id", { name: "idx_notes_owner" });
};

exports.down = (pgm) => {
    pgm.dropIndex("notes", "owner_id", { name: "idx_notes_owner" });
    pgm.dropTable("notes");
};
