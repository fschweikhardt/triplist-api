const ItemsService = {
    getAllItems(knex) {
        return knex().select('*').from('items_table')
    }
}

module.exports = ItemsService