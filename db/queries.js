const knex = require("./knex");


module.exports = {
    getAllGeneric(objectType) {
        return knex(objectType);
    },
    getOneGeneric(objectType, id) {
        return knex(objectType).where("id", id).first();
    },
    createGeneric(objectType, object) {
        return knex(objectType).insert(object, "*");
    },
    updateGeneric(objectType, id, object) {
        return knex(objectType).where("id", id).update(object, "*");
    },
    deleteGeneric(objectType, id) {
        return knex(objectType).where("id", id).del();
    },
    getCharactersByUserID(id) {
        return knex("characters").where("accountId", id);
    }
}