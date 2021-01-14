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
    .post(bodyParser, (req,res,next) => {
        const { email, username, password } = req.body
        const new_user = { email, username, password}
        UsersService.newUser(req.app.get('db'), new_user)
            .then(data => {
                res.json(data).status(201)
            })
            .catch(next)
    })
  
UsersRouter
    .route('/api/user')
    .post(bodyParser, (req,res,next) => {
        const { username, password } = req.body
        UsersService.getUser(req.app.get('db'), username)
            .then(user => {
                res.json(user).status(201)
            })
            .catch(next)
})      
UsersRouter
    .route('/api/userLists')
    .post(bodyParser, (req,res,next) => {
        const { username } = req.body
        UsersService.seedUserLists(req.app.get('db'), username)
            .then(user => {
                res.json(user).status(201)
            })
            .catch(next)
    })

UsersRouter
    .route('/api/userItems')
    .post(bodyParser, (req,res,next) => {
        const { username } = req.body
        UsersService.seedUserItems(req.app.get('db'), username)
            .then(user => {
                res.json(user).status(201)
            })
            .catch(next)
})

module.exports = UsersRouter