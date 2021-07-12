
exports.up = function (knex) {
    return knex.schema.createTable("accounts", (table) => {
        table.increments();
        table.text("accountName");
        table.text("position");
        table.boolean("isActive").defaultTo(true);
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('accounts')
};
