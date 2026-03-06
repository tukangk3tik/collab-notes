/**
 * @type {import('node-pg-migrate').ColumnDefinitions}
 */

exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
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
      type: "timestamptz",
      default: pgm.func("NOW()"),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("users");
};
