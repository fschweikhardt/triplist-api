const express = require('express')
const ListsRouter = express.Router()
const bodyParser = express.json()
const ListsService = require('./ListsService')
const logger = require('../logger.js')
//const xss = require('xss')

ListsRouter
    .route('/api/lists')
    .get((req,res,next) => {
        ListsService.getAllLists(req.app.get('db'))
            .then(data => {
                if (!data) {
                    logger.error('no lists')
                    return res.status(404).json({
                        error: { message: `Lists Not Found` }
                    })
                }
                return res.json(data).status(200)
            })
            .catch(next)
    })
    .post(bodyParser, (req,res,next) => {
        const { title, username } = req.body
        if (!title || !username) {
            logger.error(`no title or username`)
            return res.status(400).res.send('incomplete info')
        }
        const newList = { title, username }
        ListsService.addList(req.app.get('db'), newList)
            .then(data => {
                logger.info(`POST: ${newList}`)
                return res.json(data).status(201)
            })
            .catch(next)
    })
    .delete(bodyParser, (req,res,next) => {
        const { id } = req.body
        if (!id) {
            logger.error('no listId')
            return res.status(400).res.send('incomplete info')
        }
        ListsService.deleteList(req.app.get('db'), id)
        .then(numRowsAffected => {
            logger.info(`list ${id} deleted`)
            return res.status(204).end()
        })
        .catch(next)
    })

module.exports = ListsRouter