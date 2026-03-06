/**
 * @type {import('node-pg-migrate').ColumnDefinitions}
 */

exports.up = (pgm) => {
    pgm.createTable("note_versions", {
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
        content: {
            type: "text",
            notNull: true,
        },
        version: {
            type: "integer",
            notNull: true,
        },
        is_checkpoint: {
            type: "boolean",
            default: false,
        },
        created_by: {
            type: "uuid",
            references: "users(id)",
        },
        created_at: {
            type: "timestamptz",
            default: pgm.func("NOW()"),
        },
    });

    pgm.createIndex("note_versions", ["note_id", "version"], {
        name: "idx_versions_note_version",
    });
};

exports.down = (pgm) => {
    pgm.dropIndex("note_versions", ["note_id", "version"], { name: "idx_versions_note_version" });
    pgm.dropTable("note_versions");
};
