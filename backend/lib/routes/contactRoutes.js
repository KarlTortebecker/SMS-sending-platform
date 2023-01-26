const express = require('express') 
const contactRoute = express.Router()

const auth = require('../controllers/auth_controller')
const contact = require('../controllers/contact_controller')


// POST REQUEST
contactRoute.post('/', auth.ensureUser, contact.createContact)

// GET REQUEST
contactRoute.get('/', auth.ensureUser, contact.listContacts)
contactRoute.get('/:id', auth.ensureUser, contact.getContact)
contactRoute.get('/name/:phoneNumber', auth.ensureUser, contact.getContactName)


// PUT REQUEST
contactRoute.put('/:id', auth.ensureUser, contact.editContact)

// DELETE REQUEST
contactRoute.delete('/:id', auth.ensureUser, contact.deleteContact)

module.exports = contactRoute

