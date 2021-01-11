const express = require('express')
const UsersRouter = express.Router()
const bodyParser = express.json()
const UsersService = require('./UsersService')
//const logger = require('../logger.js)
//const xss = require('xss')

UsersRouter
    .route('/api/users')
    .get( (req,res,next) => {
        UsersService.getAllUsers(req.app.get('db'))
            .then(data => {
                res.json(data)
            })
            .catch(next)
    })
    .get(bodyParser, (req,res,next) => {
        const { id } = req.body
        UsersService.getUser(req.app.get('db'), id)
            .then(data => {
                res.json(data)
            })
            .catch(next)
    })

module.exports = UsersRouter