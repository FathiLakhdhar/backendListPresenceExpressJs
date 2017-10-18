
exports.up = function (knex, Promise) {
    return knex.schema.createTable('users_has_roles', (t) => {
        t.increments('user_id');
        t.string('role_id', 45);
        /* foreign + primary key */
        t.dropPrimary('users_has_roles_pkey');
        t.primary(['user_id', 'role_id']);
        t.foreign(['user_id', 'role_id']).references(['users.user_is', 'roles.role_id']);
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('users_has_roles');
};
