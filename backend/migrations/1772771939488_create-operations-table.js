/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable("operations", {
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
        user_id: {
            type: "uuid",
            references: "users(id)",
            notNull: true,
        },
        base_version: {
            type: "integer",
            notNull: true,
        },
        result_version: {
            type: "integer",
            notNull: true,
        },
        type: {
            type: "text",
            notNull: true,
            comment: "insert or delete",
        },
        position: {
            type: "integer",
            notNull: true,
        },
        content: {
            type: "text",
            comment: "insert: content to be inserted",
        },
        length: {
            type: "integer",
            comment: "delete: length of content to be deleted",
        },
        created_at: {
            type: "timestamptz",
            default: pgm.func("NOW()"),
        },
    });

    pgm.createIndex("operations", ["note_id", "result_version"], {
        name: "idx_operations_note_result_version",
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropIndex("operations", ["note_id", "result_version"], { name: "idx_operations_note_result_version" });
    pgm.dropTable("operations");
};
