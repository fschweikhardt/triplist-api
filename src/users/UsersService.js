const UsersService = {
    getAllUsers(knex) {
        return knex.select('*').from('users_table')
    },
    getUser(knex, id) {
        return knex.select('*').from('users_table').where('id', id)
    }

}

module.exports = UsersService