const express = require('express') 
const conversationRoute = express.Router()

const auth = require('../controllers/auth_controller') 
const conversation_controller = require('../controllers/conversation_controller')

// GET REQUEST
conversationRoute.get('', auth.ensureUser, conversation_controller.listDiscussions)
conversationRoute.get('/:id', auth.ensureUser, conversation_controller.getDiscussion)


// POST REQUEST
conversationRoute.post('', auth.ensureUser, conversation_controller.createDiscussion)

module.exports = conversationRoute