
exports.up = function (knex, Promise) {
    return knex.schema.createTable('roles', (t) => {
        t.string('role_id', 45).notNullable().unique().primary();
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('roles');
};
