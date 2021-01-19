const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

const AuthService = {
    getUsername(knex, username) {
        return knex.select('username').from('users_table').where('username', username)
        return knex.select('username').from('users_table').where('username', username)
    },
    comparePasswords(password, hash) {
        return bcrypt.compare(password, hash)
    },
    createJwt(subject, payload) {
             return jwt.sign(payload, config.JWT_SECRET, {
               subject,
               algorithm: 'HS256',
             })
           },

}

module.exports = AuthService