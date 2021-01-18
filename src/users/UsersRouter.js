const express = require('express')
const UsersRouter = express.Router()
const bodyParser = express.json()
const UsersService = require('./UsersService')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
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


UsersRouter
    .route('/api/register')
    .post(bodyParser, (req,res,next) => {
        const { email, username, password } = req.body
        const new_user = { email, username, password }
        console.log(new_user.username)
        //check if username exists
        UsersService.checkUsername(req.app.get('db'), new_user.username )
            .then(username => {
                console.log(username)
                if (username.length == 0 || username == undefined) {
                    //bcrypt password
                    bcrypt.hash(new_user.password, 4, function (err, hash) {
                        if (err) {
                            return next(err)
                        } else {
                            new_user.password = hash
                            console.log(new_user)
                        }
                    })
                    //insert new user here
                    UsersService.newUser(req.app.get('db'), new_user)
                        .then(user => {
                            res.json(user).status(201)
                            console.log(user)
                        })
                    //if the username already exists...
                }  else if (username) {
                        return res.status(404).json({
                            error: { message: `Username already exists` }
                    })  
                }
            })
            .catch(next)
        
            // .then(user => {
            //     res.json(user).status(201)
            //     console.log(user)
            // }) 
            //.catch(next)
        })
        //  if (check) {
        //      data => {
        //          res.json(data)
        //          console.log(data)
        //          //res.json(data).status(201).catch(next)
        //     }  else {
        //         return console.log('no user')
        //     }
        // })
        //does not exist
        //(!check) 

        // bcrypt.hash(new_user.password, 4, function (err, hash) {
        //     if (err) return next(err)
        //     new_user.password = hash
        //     console.log(new_user)
        //    })

        // UsersService.newUser(req.app.get('db'), new_user)
        //     .then(data => {
        //         res.json(data).status(201)
        //         console.log(data)
        //     })
        //     .catch(next)
    //})

UsersRouter
    .route('/api/login')
    .post(bodyParser, (req,res,next) => {
        const { username, password } = req.body
        req.app.get('db').select('username').from('users_table').where('password', password).andWhere('username', username)
        .then(data => {
            if (data === []) {
              return alert('try again')  
            } else {
            res.json(data)
            console.log(data)
        }
        })
        .catch(next)
    })

        // bcrypt.compareSync(password, hash) {
        //     // Passwords match
        //    } else {
        //     // Passwords don't match
        //    }) 

        // bcrypt.compareSync(password, hash)
        
    


        // const jwtKey = "my_secret_key"
        // const jwtExpirySeconds = 300

        // const { username, password } = req.body
       
        // if (!username || !password || users[username] !== password) {
		// // return 401 error is username or password doesn't exist, or if password does
		// // not match the password in our records
		// return res.status(401).end()
    	// }

        // // Create a new token with the username in the payload
        // // and which expires 300 seconds after issue
        // const token = jwt.sign({ username }, jwtKey, {
        //     algorithm: "HS256",
        //     expiresIn: jwtExpirySeconds,
        // })
        // console.log("token:", token)
        
        // // set the cookie as the token string, with a similar max age as the token
        // // here, the max age is in milliseconds, so we multiply by 1000
        // res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 })
        // res.end()
        // const { username, password } = req.body
        // UsersService.getUser(req.app.get('db'), username)
        //     .then(user => {
        //         res.json(user).status(201)
        //     })
        //     .catch(next)
   


module.exports = UsersRouter