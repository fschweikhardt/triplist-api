const UsersService = {
    getAllUsers(knex) {
        return knex.select('*').from('users_table')
    }

}

module.exports = UsersService