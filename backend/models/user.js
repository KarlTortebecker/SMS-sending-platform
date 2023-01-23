const cuid = require('cuid');
// Pour l'attribution des uuid

const controller = require("../controllers/UserController");

const mongoose = require('mongoose')


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





