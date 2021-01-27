const express = require('express')
const UsersRouter = express.Router()
const bodyParser = express.json()
const UsersService = require('./UsersService')
const AuthService = require('./AuthService')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//const logger = require('../logger.js)
//const xss = require('xss')

// const verifyToken = (req, res, next) => {
//     const token = req.headers.authorization;
//     jwt.verify(token, secret, function (err, decoded) {
//       if (err) {
//         return res.send(401);
//       }
//       console.log(decoded)
//       next();
//     });
//   }

// const verifyMiddleware = (req, res, next) => {
//     const jsonWebToken = req.headers['Authorization'];
//     jwt.verify(jsonWebToken, function (err, user) {
//         if(err) {
//           return res.status(401).send('Bad Auth');
//         } else {
//           req.user = user;
//           next();
//         }
//     })
// }

// function authenticateToken(req, res, next) {
//     // Gather the jwt access token from the request header
//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]
//     if (token == null) return res.sendStatus(401) // if there isn't any token
  
//     // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
//     //   console.log(err)
//     //   if (err) return res.sendStatus(403)
//     //   req.user = user
//     //   next() // pass the execution off to whatever request the client intended
//     // })
//   }

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
        const { username } = req.body
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

const checkToken = (req,res,next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    jwt.verify(token, 'tokensecret', (err, user) => {
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
        //console.log('.get', req.user.username)
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
        //check if username exists
        UsersService.checkUsername(req.app.get('db'), new_user.username )
            .then(username => {
                if (username.length == 0 || username == undefined) {
                    //bcrypt password
                    bcrypt.hash(new_user.password, 4, function (err, hash) {
                        if (err) {
                            return next(err)
                        } else {
                            new_user.password = hash
                            console.log(new_user)
                            //insert new user here
                            UsersService.newUser(req.app.get('db'), new_user)
                                .then(user => {
                                    res.json(user).status(201)
                                })
                                }
                            })
                    //if the username already exists...
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
    //------> bcrypt
        for (const [key, value] of Object.entries(login_user))
            if (value === null) 
                return res.status(400).json({error: `Missing '${key}' in request body`})
            AuthService.getUser(req.app.get('db'),login_user.username )
                .then(dbUser => {
                    if (!dbUser) 
                       return res.status(400).json({error: 'Incorrect username or password'})
                    return AuthService.comparePasswords(login_user.password, dbUser[0].password)
                    //----> JWT
                        .then(compareMatch => {
                            console.log(dbUser[0].username)
                            if (!compareMatch)
                                return res.status(400).json({error: 'Incorrect user_name or password',})
                            const subject = dbUser[0].username
                            const payload = { username: dbUser[0].username }
                            //res.json({ authToken: AuthService.createJwt(subject, payload) })
                            const token = jwt.sign( payload, 'tokensecret')
                            res.json({ authToken: token })
                            console.log( payload, token )
                        })
                        .catch(next)
                        })
                .catch(next)    
    })

module.exports = UsersRouter