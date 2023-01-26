const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const user_api = require('./api/user_api')
const tmp_user_api = require('./api/tmp_user_api')
const contact_api = require('./api/contact_api')
const message_api = require('./api/message_api')
const discussion_api = require('./api/discussion_api')
const middleware = require('./middleware')
const auth = require('./auth')

const port = process.env.PORT || 1337

const app = express()

app.use(bodyParser.json())
app.use(middleware.cors)
app.use(cookieParser())
app.use(passport.initialize())

app.post('/users', user_api.createUser)
app.post('/confirmPhoneNumber', tmp_user_api.confirmPhoneNumber)

app.post('/login', auth.authenticate, auth.login)       

app.get('/users', auth.ensureUser, user_api.listUsers)
app.get('/users/:id', auth.ensureUser, user_api.getUser)
app.put('/users/:id', auth.ensureUser, user_api.editUser)
app.delete('/users/:id', auth.ensureUser, user_api.deleteUser)
app.post('/users/forgotPassword', user_api.forgotPassword)
app.post('/users/resetPasswordCode', user_api.handleResetPasswordCode)
app.post('/users/resetPassword', user_api.resetPassword)

app.post('/contacts', auth.ensureUser, contact_api.createContact)
app.get('/contacts', auth.ensureUser, contact_api.listContacts)
app.get('/contacts/:id', auth.ensureUser, contact_api.getContact)
app.get('/contacts/name/:phoneNumber', auth.ensureUser, contact_api.getContactName)
app.put('/contacts/:id', auth.ensureUser, contact_api.editContact)
app.delete('/contacts/:id', auth.ensureUser, contact_api.deleteContact)

app.post('/messages', auth.ensureUser, message_api.createMessage)
app.get('/messages/:id', auth.ensureUser, message_api.getMessage)
app.delete('/messages/:id', auth.ensureUser, message_api.deleteMessage)

app.get('/discussions/', auth.ensureUser, discussion_api.listDiscussions)
app.post('/discussions/', auth.ensureUser, discussion_api.createDiscussion)
app.get('/discussions/:id', auth.ensureUser, discussion_api.getDiscussion)

app.use(middleware.handleError)

app.listen(port, () => console.log(`Listening on port ${port}`)) 