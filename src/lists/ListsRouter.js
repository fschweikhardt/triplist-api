const express = require('express')
const ListsRouter = express.Router()
const bodyParser = express.json()
const ListsService = require('./ListsService')
//const logger = require('../logger.js)
//const xss = require('xss')

ListsRouter
    .route('/api/lists')
    .get( (req,res,next) => {
        ListsService.getAllLists(req.app.get('db'))
            .then(data => {
                res.json(data)
            })
            .catch(next)
    })
    .post(bodyParser, (req,res,next) => {
        const { title, user_id } = req.body
        const newList = { title, user_id }
        ListsService.addList(req.app.get('db'), newList)
            .then(data => {
                res.json(data).status(201)
            })
            .catch(next)
    })
    .delete(bodyParser, (req,res,next) => {
        const { id } = req.body
        const list = id 
        ListsService.deleteList(req.app.get('db'), list)
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })

module.exports = ListsRouter