/**
 * @type {import('node-pg-migrate').ColumnDefinitions}
 */

exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
    },
    name: {
      type: "text",
      notNull: true,
    },
    email: {
      type: "text",
      notNull: true,
      unique: true,
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("NOW()"),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("users");
};
