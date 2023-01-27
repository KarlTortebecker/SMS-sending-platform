const cuid = require('cuid')
const bcrypt = require('bcrypt')
const {isAlphanumeric} = require('validator')
const mongoose = require('mongoose')
const crypto = require("crypto")
const randomstring = require('randomstring')

const db = require('../db')

const SALT_ROUNDS = 10
const CODE_LENGTH = 6;

const tmpUserSchema = mongoose.Schema({
    _id: {type: String, default: cuid},
    username: usernameSchema(),
    email: {type: String, required: true, unique: true, validate:[
        {
            validator: function(email){ return isUnique(this, {email: email})},
            message: props => `${props.value} email is taken`
        }
    ]},
    password: {type: String, maxLength: 120, required: true},
    phoneNumber: {type: String, required: true, unique: true, validate:[
        {
            validator: function(phoneNumber){ return isUnique(this, {phoneNumber: phoneNumber})},
            message: props => `${props.value} phone number is taken`
        }
    ]},
    validationCode:{type: String, required: true, unique: true}
},{
    timestamps: true
})

const TmpUser = db.model('TmpUser', tmpUserSchema)

module.exports = { 
    create,
    get,
    remove,
    model: TmpUser
}

//function to create a new temporary user
async function create(fields){
    const tmpUser = new TmpUser(fields)

    await hashPassword(tmpUser)

    setValidationCode(tmpUser)

    await tmpUser.save()

    return tmpUser
}

//function to get a temporary user
async function get(params = {}){
    const {id, phoneNumber, username, email} = params

    const tmpUser = await (
        id ? TmpUser.findById(id) : (
            phoneNumber ? TmpUser.findOne({phoneNumber: phoneNumber}) : (
                username ? TmpUser.findOne({username: username}) : (
                    email ? TmpUser.findOne({email: email}) : null
                )
            )
        )
    )

    return tmpUser
}

//function to delete a temporary user
async function remove(_id){
    await TmpUser.deleteOne({_id})
}

function usernameSchema(){
    return{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minLength: 3,
        maxLength: 16,
        validate:[
            {
                validator: isAlphanumeric,
                message: props => `${props.value} contains special characters`
            },{
                validator: function(username){ return isUnique(this, {username: username})},
                message: props => `${props.value} username is taken`
            }
        ]
    }
}

//function to check the unicity of the username
async function isUnique(doc, params={}){
    const {username, phoneNumber, email} = params

    var existing = false

    if(username){
        existing = await get({username: username})

    }else if(phoneNumber){
        existing = await get({phoneNumber: phoneNumber})

    }else if(email){
        existing = await get({email: email})
    }
        
    return !existing || doc._id === existing._id
 }

//function to hash the password of a user
async function hashPassword(tmpUser){
    if(!tmpUser.password) throw tmpUser.invalidate('password', 'password is required')

    if(tmpUser.password.length < 6) throw tmpUser.invalidate('password', 'password must be at least 6 characters')

    tmpUser.password = await bcrypt.hash(tmpUser.password, SALT_ROUNDS)
}

//function to create and set a validation code for a temporary user
function setValidationCode(tmpUser){
    //create and set the code validation that will be sent to the user
    const validationCode = randomstring.generate(CODE_LENGTH)

    tmpUser.validationCode = validationCode
}