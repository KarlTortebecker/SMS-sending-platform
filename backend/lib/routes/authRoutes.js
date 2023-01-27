const express = require('express') 
const authRoute = express.Router()

const auth = require('./../controllers/auth_controller')



// POST REQUEST
authRoute.post('/login', auth.authenticate, auth.login)  



module.exports = authRoute