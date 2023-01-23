const passport = require('passport')
const Strategy = require('passport-local').Strategy
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const jwtSecret = process.env.JWT_SECRET || "secret_token_should_be_strong_in_production"
const jwt_login_Opts = {algorithm: 'HS256', expiresIn:'30d'}
const CONFIRM_PHONE_NUMBER_TOKEN_VALIDITY_PERIOD = 60 * 60 * 1000;
const jwt_confirm_phoneNumber_Opts = {algorithm: 'HS256', expiresIn: CONFIRM_PHONE_NUMBER_TOKEN_VALIDITY_PERIOD.toString()}
const jwt_resetPassword_Opts = jwt_confirm_phoneNumber_Opts

const autoCatch = require('./lib/auto-catch').autoCatch
const Users = require('./models/users')

passport.use(adminStrategy())
const authenticate = passport.authenticate('local', {session: false})

module.exports = {
    authenticate,
    sign,
    jwt_confirm_phoneNumber_Opts,
    jwt_resetPassword_Opts,
    verify,
    ensureUser: autoCatch(ensureUser),
    login: autoCatch(login)
}

async function login(req, res, next){
    const token = await sign({id: req.user.id, phoneNumber: req.user.phoneNumber, isAdmin: req.user.isAdmin}, jwt_login_Opts)

    res.cookie = ('jwt', token, {httpOnly: true})

    res.json({success: true, token: token, user_id: req.user.id})
}

async function sign(payload, jwtOpts){
    const token = await jwt.sign(payload, jwtSecret, jwtOpts)

    return token
}

async function verify(jwtString = ''){
    jwtString = jwtString.replace(/^Bearer /i, '')

    try{
        const payload = await jwt.verify(jwtString, jwtSecret)
        return payload

    }catch(err){
        err.statusCode = 401
        throw err
    }
}

function adminStrategy(){
    return new Strategy(async function(login, password, cb){
       
        try{
            var user = await Users.get({"phoneNumber": login})
        
            if(!user){
                user = await Users.get({"username": login})
            }
          
            if(!user) return cb(null, false)

            const isUser = await bcrypt.compare(password, user.password)

            if(isUser){
                return cb(null, {id: user._id, phoneNumber: user.phoneNumber, isAdmin: user.isAdmin})
                //the second parameter is the user object that will be sent to the callback function, the callback function being the login function.
            }

            console.log("hi")

            return cb(null, false)

        }catch(err){
            console.log(err)
            return cb(null, false)
        }
    })
}

async function ensureUser(req, res, next){
    const jwtString = req.headers.authorization || req.cookies.jwt

    console.log(req.headers)

    const payload = await verify(jwtString)

    if(payload){
        req.user = payload

        return next()
    }

    const err = new Error('Unauthorized')
    err.statusCode = 401
    next(err)
}