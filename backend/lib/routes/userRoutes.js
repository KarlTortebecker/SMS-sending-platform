const express = require('express') 
const userRoute = express.Router()

const auth = require('../controllers/auth_controller')
const user_controller = require('../controllers/user_controller')
const tmp_user_controller = require('../controllers/tmp_user_controller')


// POST REQUEST
userRoute.post('', user_controller.createUser)
userRoute.post('/confirmPhoneNumber', tmp_user_controller.confirmPhoneNumber)
userRoute.post('/login', auth.authenticate, auth.login)  
userRoute.post('/forgotPassword', user_controller.forgotPassword)
userRoute.post('/resetPasswordCode', user_controller.handleResetPasswordCode)
userRoute.post('/resetPassword', user_controller.resetPassword)     



// GET REQUEST
userRoute.get('', auth.ensureUser, user_controller.listUsers)
userRoute.get('/:id', auth.ensureUser, user_controller.getUser)

// PUT REQUEST
userRoute.put('/:id', auth.ensureUser, user_controller.editUser)



// DELETE REQUEST
userRoute.delete('/:id', auth.ensureUser, user_controller.deleteUser)

 
module.exports = userRoute
