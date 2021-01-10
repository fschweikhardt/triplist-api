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

module.exports = ListsRouter