
exports.up = function (knex) {
    return knex.schema.alterTable("accounts", (table) => {
        table.timestamp("lastFetched");
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('accounts')
};
