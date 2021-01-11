const ListsService = {
    getAllLists(knex) {
        return knex.select('*').from('lists_table')
    },
    addList(knex, newList) {
        return knex.insert(newList).into('lists_table').returning('*')
        .then(rows => {
            return rows[0]
        })
    },
    deleteList(knex, id) {
        return knex.select('*').from('lists_table').where('id', id).delete()
    }
}

module.exports = ListsService