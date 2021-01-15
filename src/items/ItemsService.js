const ItemsService = {
    getAllItems(knex) {
        return knex.select('*').from('items_table')
    },
    addItem(knex, newItem) {
        return knex.insert(newItem).into('items_table').returning('*')
        .then(rows => {
            return rows[0]
        })
    },
    deleteItem(knex, item_id) {
        return knex.select('*').from('items_table').where('item_id', item_id).delete()
    }

}

module.exports = ItemsService