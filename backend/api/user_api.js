const Users = require('../models/users')
const autoCatch = require('../lib/auto-catch').autoCatch
const auth = require('../auth')

const randomstring = require('randomstring')

const CODE_LENGTH = 6;

module.exports = {
    createUser: autoCatch(createUser),
    getUser: autoCatch(getUser),
    listUsers: autoCatch(listUsers),
    editUser: autoCatch(editUser),
    deleteUser: autoCatch(deleteUser),
    forgotPassword: autoCatch(forgotPassword),
    handleResetPasswordCode: autoCatch(handleResetPasswordCode),
    resetPassword: autoCatch(resetPassword)
}

//handle the create user request
async function createUser(req, res, next){
    const user = await Users.create(req.body)
    
    //construction of the object that will be returned in the response
    const {username, email, phoneNumber, isAdmin} = user 

    res.json({username, email, phoneNumber, isAdmin})
}

//handle the get users list request
async function listUsers(req, res, next){
    const {offset = 0, limit = 25} = req.query

    if(req.user.isAdmin){
        const users = await Users.list({
            offset: Number(offset),
            limit: Number(limit)
        })
    
        const filteredUsers = users.map(function (user){
            const {_id, username, email, phoneNumber, isAdmin} = user
            return {_id, username, email, phoneNumber, isAdmin}
         }) 
    
        res.json(filteredUsers)

    }else{
        const err = new Error('Unauthorized')
        err.statusCode = 401

        next(err)
    }  
}

//handle the get user request
async function getUser(req, res, next){
    const { id } = req.params

    if(req.user.isAdmin || req.user.id === id){
        const user = await Users.get({id: id})

        if(!user) return next()

        const {username, phoneNumber, isAdmin} = user 

        res.json({username, phoneNumber, isAdmin})

    }else{
        const err = new Error('Unauthorized')
        err.statusCode = 401

        next(err)
    }
}

//handle the edit user request
async function editUser(req, res, next){
    const change = req.body

    if(req.user.id === req.params.id){
        const user = await Users.edit(req.params.id, change)

        const {username, email, phoneNumber, isAdmin} = user 

        res.json({username, email, phoneNumber, isAdmin})

    }else{
        const err = new Error('Unauthorized')
        err.statusCode = 401

        next(err)
    }
}

//handle the delete user request
async function deleteUser(req, res, next){
    if(req.user.id === req.params.id){
        await Users.remove(req.params.id)

        res.json({success: true})

    }else{
        const err = new Error('Unauthorized')
        err.statusCode = 401

        next(err)
    }
}

//handle forgot password request
async function forgotPassword(req, res, next){
    const phoneNumber = req.body.phoneNumber

    //check if the phone number is valid
    const user = await Users.get({"phoneNumber": phoneNumber})

    if(user){
        //create the code for the password reset that will be sent to the phone number
        const resetPasswordCode = randomstring.generate(CODE_LENGTH)
        user.resetPasswordCode = resetPasswordCode

        await user.save();

        //send the code to the phone number
        //////////////////////////////////



        //create the token that will be sent in the response
        const token = await auth.sign({username: user.username}, auth.jwt_resetPassword_Opts)

        res.json({token: token})

    }else{
        res.status(404).json({message:"There is no account with this phone number."})
    }
}

//handle reset password code
async function handleResetPasswordCode(req, res, next){
    const jwtstring = req.headers.authorization || req.cookies.jwt

    const payload = await auth.verify(jwtstring)

    const user = await Users.get({username: payload.username})

    if(user && user.resetPasswordCode === req.body.code){
        //create the token that will be sent in the response
        const token = await auth.sign({username: user.username}, auth.jwt_resetPassword_Opts)

        res.json({success: true, token: token})

    }else{
        const err = new Error("Wrong code!")

        err.statusCode(401)

        next(err)
    }
}

//handle reset password request
async function resetPassword(req, res, next){
    const jwtstring = req.headers.authorization || req.cookies.jwt

    const payload = await auth.verify(jwtstring)

    const user = await Users.get({username: payload.username})

    if(user){
        const newUser = await Users.edit(user._id, {password: req.body.password})

        res.json({success: true})

    }else{
        const err = new Error('Unauthorized')
        err.statusCode(401)

        next(err)
    }
}