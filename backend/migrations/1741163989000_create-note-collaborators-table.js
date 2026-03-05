/**
 * @type {import('node-pg-migrate').ColumnDefinitions}
 */

exports.up = (pgm) => {
    // Create enum type for collaborator roles
    pgm.createType("collaborator_role", ["owner", "editor", "viewer"]);

    pgm.createTable("note_collaborators", {
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
        role: {
            type: "collaborator_role",
            default: "editor",
        },
        added_at: {
            type: "timestamp",
            default: pgm.func("NOW()"),
        },
    });

    pgm.addConstraint("note_collaborators", "note_collaborators_pkey", {
        primaryKey: ["note_id", "user_id"],
    });

    pgm.createIndex("note_collaborators", "user_id", {
        name: "idx_collab_user",
    });
};

exports.down = (pgm) => {
    pgm.dropIndex("note_collaborators", "user_id", { name: "idx_collab_user" });
    pgm.dropTable("note_collaborators");
    pgm.dropType("collaborator_role");
};
