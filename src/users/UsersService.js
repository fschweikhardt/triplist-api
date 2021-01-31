const bcrypt = require('bcryptjs')

const UsersService = {
    getAllUsers(knex) {
        return knex.select('*').from('users_table')
    },
    getUser(knex, username) {
        return knex.select('username').from('users_table').where('username', username)
    },
    checkUsername(knex, username) {
        return knex.select('username').from('users_table').where('username', username)
    },
    getPassword(knex, password) {
        return knex.select('password').from('users_table').where('password', password)
    },
    checkLogin(knex, username, password) {
        return knex.select('username').from('users_table').where('password', password).andWhere('username', username)
    },
    checkPassword(knex, username, password) {
        return knex.select('password').from('users_table').where('password', password).andWhere('username', username)
    },
    comparePasswords(password, hash) {
        return bcrypt.compare(password, hash)
    },
    seedUserLists(knex, username) {
        return knex.select('*').from('lists_table').where('username', username)
    },
    seedUserItems(knex, username) {
        return knex.select('*').from('items_table').where('lists_table.username', username).join('lists_table', 'items_table.list_id', '=', 'lists_table.id')
    },
    newUser(knex, new_user) {
        return knex.insert(new_user).into('users_table').returning('*').then(rows => {
            return rows[0]
        })
    },
    getUser(knex, username) {
        return knex.select('*').from('users_table').where('username', username)
    },
    addList(knex, newList) {
        return knex.insert(newList).into('lists_table').returning('*')
        .then(rows => {
            return rows[0]
        })
    },
    deleteList(knex, id, username) {
        return knex.select('*').from('lists_table').where('id', id).andWhere('username', username).delete()
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

module.exports = UsersService