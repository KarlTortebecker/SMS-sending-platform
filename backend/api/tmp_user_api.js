const TmpUsers = require('../models/tmpUsers')
const Users = require('../models/users')
const autoCatch = require('../lib/auto-catch').autoCatch
const auth = require('../auth')

module.exports = {
    createTmpUser: autoCatch(createTmpUser),
    confirmPhoneNumber: autoCatch(confirmPhoneNumber)
}

//handle the create temporary user request
async function createTmpUser(req, res, next){
    
    const tmpUser = await TmpUsers.create(req.body)

    //construction of the token that will be used for the phone number validation
    const token = await auth.sign({username: tmpUser.username}, auth.jwt_confirm_phoneNumber_Opts)
    
    //construction of the object that will be returned in the response
    const {username, email, phoneNumber, validationCode} = tmpUser 

    //send the validation code to the phone number
    //////////////////////////////////////////////

    res.json({username, email, phoneNumber, token})
}

//handle the confirm phone number request
async function confirmPhoneNumber(req, res, next){
    
    const jwtstring = req.headers.authorization || req.cookies.jwt

    const payload = await auth.verify(jwtstring)

    const tmpUser = await TmpUsers.get({username: payload.username})

    if(tmpUser && tmpUser.validationCode === req.body.code){
    
        const user = await Users.create({username: tmpUser.username, email: tmpUser.email, phoneNumber: tmpUser.phoneNumber, password: tmpUser.password})

        if(user){
            //delete the temporary user
            TmpUsers.remove(tmpUser._id)
        }

        res.json({success: true})
    }

    res.status(401).json({message: "wrong code"})
}

