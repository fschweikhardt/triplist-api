const ListsService = {
    getAllLists(knex) {
        return knex().select('*').from('lists_table')
    }
}

module.exports = ListsService