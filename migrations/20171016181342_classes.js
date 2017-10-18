
exports.up = function(knex, Promise) {
  return knex.schema.createTable('classes', function(t){
    t.increments('classe_id');
    t.string('name',45).notNullable();
    t.string('year',4).notNullable();
    t.integer('numGroup').notNullable();
    t.boolean('archive');

    /* Primary key */
    t.dropPrimary('classes_pkey');
    t.primary(['name','year','numGroup']); 
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('classes');
};
