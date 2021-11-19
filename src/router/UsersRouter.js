const express = require('express')
const UsersRouter = express.Router()
const bodyParser = express.json()
const UsersService = require('./UsersService')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')
const logger = require('../logger.js')

const checkToken = (req,res,next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

UsersRouter
    .route('/test')
    .post(bodyParser, (req,res,next) => {
        const { username } = req.body
        UsersService.checkUsername(req.app.get('db'), username)
            .then(data => {
                console.log(data)
                if (Object.values(data).length === 0) {
                    logger.error('test error')
                    return res.status(404).send('no username')  
                }
                logger.info(`${username} on test`)
                res.status(201).json(data)
                
            })
            .catch(next)
    })
    .get(bodyParser, (req,res,next) => {
        res.status(200).send('working')
        next()
    })

UsersRouter
    .route('/register')
    .post(bodyParser, (req,res,next) => {
        const { username, password, email } = req.body
        const new_user = { username, password, email }
        
        for (const field of ['username', 'password', 'email'])
            if (!req.body[field])
                return res.status(400).json({
                  error: `Missing '${field}' field`
            })
        
        UsersService.checkUsername(req.app.get('db'), new_user.username)
            .then( user => { //if the username is availible
                if (user.length === 0) { //bcrypt new user
                   return bcrypt.hash(new_user.password, 4, function (err, hash) {
                        if (err) return next(err)
                        new_user.password = hash
                        return UsersService.newUser(req.app.get('db'), new_user)
                            .then(user => {
                                console.log(user)
                                logger.info(`${new_user.username} registered`)
                                return res.json(user).status(201)
                            })
                    })
                }
                if (user) { //if the username is taken
                    return res.status(404).json({
                        error: 'username already exists'
                    })
                }
            })
            .catch(next)
    })

UsersRouter
    .route('/login')
    .post(bodyParser, (req,res,next) => {
        const { username, password } = req.body
        const login_user = { username, password }
        
        for (const field of ['username', 'password'])
            if (!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' field`
                })
        
        UsersService.getUser(req.app.get('db'),login_user.username )
            .then(dbUser => {
                if (!dbUser) {
                    return res.status(401).json({
                        error: 'Incorrect username or password'})
                    }

                return UsersService.comparePasswords(login_user.password, dbUser[0].password)
                    .then(compareMatch => {
                        if (!compareMatch) {
                            logger.error('incorrect username or password')
                            return res.status(401).json({
                                error: 'Incorrect username or password'
                            })
                        }
                        const payload = { username: dbUser[0].username }
                        const token = jwt.sign( payload, JWT_SECRET )
                        logger.info(`${payload.username} logged in`)
                        console.log( payload, token )
                        return res.status(200).json({ authToken: token })
                        
                    })
                    .catch(next)
                    })
            .catch(next)    
    })

UsersRouter
    .route('/verifyId')
    .get(checkToken, (req,res,next) => {
        const { username } = req.user
        console.log('V-id', username)
        res.status(200).json(username)
        next()
    })

UsersRouter
    .route('/verifyLists')
    .get(checkToken, (req,res,next) => {
        const { username } = req.user
        console.log('V-lists', username)
        UsersService.seedUserLists(req.app.get('db'), username)
            .then(data => {
                console.log(data)
                if (!data) {
                    logger.error('verifyList err')
                    return res.status(400).json({
                        error: '!data on seedUserLists'
                    })
                }
                return res.status(200).json(data)
            })
            .catch(next)
    })

UsersRouter
    .route('/verifyItems')
    .get( checkToken, (req,res,next) => {
        const { username } = req.user
        console.log('V-items', username)
        UsersService.seedUserItems(req.app.get('db'), username)
            .then(data => {
                console.log(data)
                res.status(200).json(data)
            })
            .catch(next)
})

UsersRouter
    .route('/lists')
    .post(checkToken, bodyParser, (req,res,next) => {
        const { title } = req.body
        const { username } = req.user
        if (!title) {
            return res.status(400).json({
                error: 'no title'
            })
        }
        const newList = { title, username }
        return UsersService.addList(req.app.get('db'), newList)
            .then(data => {
                logger.info(`POST: ${newList.username}  ${newList.title}`)
                return res.status(201).json(data)
            })
            .catch(next)
    })
    .delete(checkToken, bodyParser, (req,res,next) => {
        const { id } = req.body
        const { username } = req.user
        if (!id) {
            return res.status(400).json({
                error: 'no id'
            })
        }
        return UsersService.deleteList(req.app.get('db'), id, username)
            .then(numRowsAffected => {
                logger.info(`DELETED: list ${id}`)
                return res.status(204).end()
            })
            .catch(next)
    })

UsersRouter
    .route('/items')
    .post(checkToken, bodyParser, (req,res,next) => {
        const { name, list_id } = req.body
        const { username } = req.user
        if (!name || !list_id) {
            logger.error('no name or list_id on items POST')
            return res.status(400).json({
                error: 'no list-id or name'
            })
        }
        const newItem = { name, list_id }
        return UsersService.addItem(req.app.get('db'), newItem, username)
            .then(data => {
                logger.info(`${username} new item: ${newItem.name} w/ listId: ${newItem.list_id}`)
                return res.status(201).json(data)
            })
            .catch(next)
    })
    .delete(checkToken, bodyParser, (req,res,next) => {
        const { item_id } = req.body
        const { username } = req.user
        if (!item_id) {
            logger.error('no item_id on items DELETE')
            return res.status(400).json({
                error: 'no item-id'
            })
        }
        return UsersService.deleteItemVerify(req.app.get('db'), item_id)
            .then(data => {
                if (data[0].username !== username) {
                    return res.status(404).json({
                        error: 'no access'
                    })
                }
                return UsersService.deleteItemFinish(req.app.get('db'), item_id)
                    .then(numRowsAffected => {
                        logger.info(`DELETED: item ${item_id}`)
                        return res.status(204).end()
                    })
                    .catch(next)
            })
            .catch(next)
    })

module.exports = UsersRouter