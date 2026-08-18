/**
 * Add verified column to user table for BubbaBlox verified checkmark system
 * @param {import('knex')} knex 
 */
exports.up = async (knex) => {
    await knex.schema.alterTable('user', (t) => {
        t.boolean('verified').notNullable().defaultTo(false);
    });
};

exports.down = async (knex) => {
    await knex.schema.alterTable('user', (t) => {
        t.dropColumn('verified');
    });
};
