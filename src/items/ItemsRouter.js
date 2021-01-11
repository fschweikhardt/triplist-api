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
    .post(bodyParser, (req,res,next) => {
        const { name, list_id } = req.body
        const newItem = { name, list_id }
        ItemsService.addItem(req.app.get('db'), newItem)
            .then(data => {
                res.json(data).status(201)
            })
            .catch(next)
    })
    .delete(bodyParser, (req,res,next) => {
        const { id } = req.body
        const item = id  
        ItemsService.deleteItem(req.app.get('db'), item )
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })

module.exports = ItemsRouter