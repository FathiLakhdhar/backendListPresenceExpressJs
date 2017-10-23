
exports.up = function(knex, Promise) {
    return knex.schema.createTable('presences', (t)=>{
        t.increments('presence_id');
        t.boolean('isPresent');
        t.date('datePresence').notNullable();
        t.time('timePresenceStart').notNullable();
        t.time('timePresenceEnd').notNullable();
        
        t.integer('user_id');
        t.integer('responsable_id');
        /** Foreign, Primary key */
        t.dropPrimary('presences_pkey');

        t.primary(['datePresence', 'timePresenceStart', 'timePresenceEnd', 'user_id', 'responsable_id']);
        t.foreign('user_id').references('users.user_id');
        t.foreign('responsable_id').references('users.user_id');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('presences');
};
