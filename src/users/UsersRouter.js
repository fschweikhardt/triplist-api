const express = require('express')
const UsersRouter = express.Router()
const bodyParser = express.json()
const UsersService = require('./UsersService')
const AuthService = require('./AuthService')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')
const logger = require('../logger.js')
//const xss = require('xss')

// UsersRouter
//     .route('/api/users')
//     .get( (req,res,next) => {
//         UsersService.getAllUsers(req.app.get('db'))
//             .then(data => {
//                 if (!data) {
//                     logger.error('users not found')
//                     return res.status(404).json({
//                         error: { message: `Users Not Found` }
//                     })
//                 }
//                 return res.json(data).status(200)
//             })
//             .catch(next)
//     })
//     .post(bodyParser, (req,res,next) => {
//         const { email, username, password } = req.body
//         if (!email || !username || !password) {
//             logger.error(`no title or username or padssword`)
//             return res.status(400).res.send('incomplete info')
//         }
//         const new_user = { email, username, password}
//         UsersService.newUser(req.app.get('db'), new_user)
//             .then(data => {
//                 logger.info(`POST: ${new_user}`)
//                 return res.json(data).status(201)
//             })
//             .catch(next)
//     })
  
// UsersRouter
//     .route('/api/user')
//     .post(bodyParser, (req,res,next) => {
//         const { username } = req.body
//         if (!username) {
//             logger.error(`no username `)
//             return res.status(400).res.send('incomplete info')
//         }
//         UsersService.getUser(req.app.get('db'), username)
//             .then(user => {
//                 return res.json(user).status(201)
//             })
//             .catch(next)
// })     

// UsersRouter
//     .route('/api/userLists')
//     .post(bodyParser, (req,res,next) => {
//         const { username } = req.body
//         UsersService.seedUserLists(req.app.get('db'), username)
//             .then(user => {
//                 res.json(user).status(201)
//             })
//             .catch(next)
//     })

// UsersRouter
//     .route('/api/userItems')
//     .post(bodyParser, (req,res,next) => {
//         const { username } = req.body
//         UsersService.seedUserItems(req.app.get('db'), username)
//             .then(user => {
//                 res.json(user).status(201)
//             })
//             .catch(next)
// })

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
    .route('/api/verifyId')
    .get( checkToken, (req,res,next) => {
        const { username } = req.user
        res.json(username).status(201)
        next()
    })

UsersRouter
    .route('/api/verifyLists')
    .get( checkToken, (req,res,next) => {
        const { username } = req.user
        UsersService.seedUserLists(req.app.get('db'), username)
            .then (data => {
                res.json(data).status(201)
                console.log(data)
            })
            .catch(next)
    })

UsersRouter
    .route('/api/verifyItems')
    .get( checkToken, (req,res,next) => {
        const { username } = req.user
        UsersService.seedUserItems(req.app.get('db'), username)
            .then(data => {
                res.json(data).status(201)
                console.log(data)
            })
            .catch(next)
})

UsersRouter
    .route('/api/register')
    .post(bodyParser, (req,res,next) => {
        const { email, username, password } = req.body
        const new_user = { email, username, password }
        UsersService.checkUsername(req.app.get('db'), new_user.username )
            .then(username => {
                if (username.length == 0 || username == undefined) {
                    bcrypt.hash(new_user.password, 4, function (err, hash) {
                        if (err) return next(err)
                        new_user.password = hash
                        UsersService.newUser(req.app.get('db'), new_user)
                            .then(user => {
                                logger.info(`${new_user.username} registered`)
                                res.json(user).status(201)
                            })
                        })
                }  else if (username) {
                        return res.status(404).json({
                            error: { message: `Username already exists` }
                    })  
                }
            })
            .catch(next)
        })

UsersRouter
    .route('/api/login')
    .post(bodyParser, (req,res,next) => {
        const { username, password } = req.body
        const login_user = { username, password }
        for (const [key, value] of Object.entries(login_user))
            if (value === null) {
                logger.error('missing username or password')
                return res.status(400).json({error: `Missing '${key}' in request body`})
            }
            AuthService.getUser(req.app.get('db'),login_user.username )
                .then(dbUser => {
                    if (!dbUser) {
                        logger.error('incorrect username or password')
                        return res.status(400).json({error: 'Incorrect username or password'})
                    }
                    return AuthService.comparePasswords(login_user.password, dbUser[0].password)
                        .then(compareMatch => {
                            if (!compareMatch) {
                                logger.error('incorrect username or password')
                                return res.status(400).json({error: 'Incorrect username or password',})
                            }
                            const payload = { username: dbUser[0].username }
                            //const subject = dbUser[0].username
                            //res.json({ authToken: AuthService.createJwt(subject, payload) })
                            const token = jwt.sign( payload, JWT_SECRET )
                            res.json({ authToken: token })
                            logger.info(`${payload.username} logged in`)
                            console.log( payload, token )
                        })
                        .catch(next)
                        })
                .catch(next)    
    })

module.exports = UsersRouter