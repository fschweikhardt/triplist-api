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
    seedUserLists(knex, username) {
        //const user_id = knex.select('id').from('users_table').where('username', username)
        return knex.select('*').from('lists_table').where('username', username)
    },
    seedUserItems(knex, username) {
        return knex.select('*').from('items_table').where('lists_table.username', username).join('lists_table', 'items_table.list_id', '=', 'lists_table.id')
    },
    newUser(knex, new_user) {
        return knex.insert(new_user).into('users_table').returning('*').then(rows => {
            return rows[0]
        })
    }

}

module.exports = UsersService