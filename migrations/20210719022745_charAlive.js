
exports.up = function (knex) {
    return knex.schema.table("characters", (table) => {
        table.boolean("isAlive").defaultTo(true);
    })
};

exports.down = function (knex) {
    return knex.schema.table('characters'), (table) => {
        table.dropColumn("isAlive")
    }
};
