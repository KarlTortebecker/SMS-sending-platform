const express = require('express') 
const messageRoute = express.Router()

const auth = require('../controllers/auth_controller')
const message_controller = require('../controllers/message_controller')
 
// POST REQUEST
messageRoute.post('', auth.ensureUser, message_controller.createMessage)

//GET REQUEST
messageRoute.get('/:id', auth.ensureUser, message_controller.getMessage)

//DELETE REQUEST
messageRoute.delete('/:id', auth.ensureUser, message_controller.deleteMessage)


module.exports = messageRoute