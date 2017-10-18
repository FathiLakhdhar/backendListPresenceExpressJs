
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table){
    table.increments('user_id');
    table.string('firstname',30).notNullable();
    table.string('surname',30).notNullable();
    table.string('email',255).notNullable().unique();
    table.string('pwd',255).notNullable();
    table.boolean('isActive').notNullable();
    table.integer('age').notNullable();
    table.string('gender', 10).notNullable();
    table.dateTime('registeredAt').notNullable();
    table.string('phone', 30);
    table.text('adresse');
    table.text('about');
    table.text('picture');
    /* Foreign key */
    table.string('classe_name', 45);
    table.string('classe_year', 4);
    table.integer('classe_numGroup');
    table.foreign(['classe_name', 'classe_year', 'classe_numGroup']).references(['classes.name', 'classes.year', 'classes.numGroup']);

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
