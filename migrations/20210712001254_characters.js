
exports.up = function (knex) {
    return knex.schema.createTable('characters', function (t) {
        t.increments()
        t.integer('accountId').references('id').inTable('accounts').notNullable();
        t.text("name");
        t.text("lastChecked");
        t.text("level");
        t.text("experience");
        t.text("league")
        t.integer("positionInLeague");
        t.text("class");
        t.text("ascendancy");
        t.boolean("isActive").defaultTo(true);
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('characters')

};
