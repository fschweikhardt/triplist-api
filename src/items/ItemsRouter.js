const express = require('express')
const ItemsRouter = express.Router()
const bodyParser = express.json()
const ItemsService = require('./ItemsService')
const logger = require('../logger.js')
//const xss = require('xss')

ItemsRouter
    .route('/api/itemsz')
    .get((req,res,next) => {
        ItemsService.getAllItems(req.app.get('db'))
            .then(data => {
                if (!data) {
                    logger.error('items not found')
                    return res.status(404).json({
                        error: { message: `Items Not Found` }
                    })
                }
                return res.json(data).status(200)
            })
            .catch(next)
    })

    .post(bodyParser, (req,res,next) => {
        const { name, list_id } = req.body
        if (!name || !list_id) {
            logger.error('no name or list_id on items POST')
            return res.status(400).send('incomplete info')
        }
        const newItem = { name, list_id }
        ItemsService.addItem(req.app.get('db'), newItem)
            .then(data => {
                logger.info(`new item: ${newItem.name} w/ listId: ${newItem.list_id}`)
                return res.json(data).status(201)
            })
            .catch(next)
    })

    .delete(bodyParser, (req,res,next) => {
        const { item_id } = req.body
        if (!item_id) {
            logger.error('no item_id on items DELETE')
            return res.status(400).send('incomplete info')
        }
        ItemsService.deleteItem(req.app.get('db'), item_id )
        .then(numRowsAffected => {
            logger.info(`item ${item_id} deleted`)
            return res.status(204).end()
        })
        .catch(next)
    })

module.exports = ItemsRouter