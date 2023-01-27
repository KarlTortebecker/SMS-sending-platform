const cuid = require('cuid')
const bcrypt = require('bcrypt')
const {isAlphanumeric} = require('validator')
const mongoose = require('mongoose')

const db = require('../db')

const SALT_ROUNDS = 10
const CODE_LENGTH = 6;

const userSchema = mongoose.Schema({
    _id: {type: String, default: cuid},
    username: usernameSchema(),
    email: {type: String, default: undefined, validate:[
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
    resetPasswordCode: {type: String, default: undefined}, 
    isAdmin: {type: Boolean, default: false},
},{
    timestamps: true
})

const User = db.model('User', userSchema)

module.exports = { 
    create,
    list,
    get,
    edit,
    remove,
    model: User
}

//function to create a new user
async function create(fields){
    const user = new User(fields)

    await hashPassword(user)

    await user.save()

    return user
}

//function to get the list of users
async function list(opts ={}){
    const {offset = 0, limit = 25} = opts

    const users =  await User.find()
        .sort({ _id: 1})
        .skip(offset)
        .limit(limit)

    return users
}

//function to get a user
async function get(params = {}){
    const {id, phoneNumber, username, email} = params

    const user = await (
        id ? User.findById(id) : (
            phoneNumber ? User.findOne({phoneNumber: phoneNumber}) : (
                username ? User.findOne({username: username}) : (
                    email ? User.findOne({email: email}) : null
                )
            )
        )
    )

    return user
}

//function to update a user
async function edit(_id, change){
    const user = await get({id: _id})

    Object.keys(change).forEach(key => {user[key] = key !== "isAdmin" ? change[key] : false})

    if(change.password) await hashPassword(user)

    await user.save()

    return user
}

//function to delete a user
async function remove(_id){
    await User.deleteOne({_id})
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
                validator: function(username){ return isUnique(this, username)},
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

