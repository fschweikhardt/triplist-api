const express = require('express')
const ItemsRouter = express.Router()
const bodyParser = express.json()
const ItemsService = require('./ItemsService')
//const logger = require('../logger.js)
//const xss = require('xss')

ItemsRouter
    .route('/api/items')
    .get( (req,res,next) => {
        ItemsService.getAllItems(req.app.get('db'))
            .then(data => {
                res.json(data)
            })
            .catch(next)
    })

module.exports = ItemsRouter