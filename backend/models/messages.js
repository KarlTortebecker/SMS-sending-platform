const cuid = require('cuid')
const mongoose = require('mongoose')

const Discussions =  require('./discussions')

const db = require('../db')

const messageSchema = mongoose.Schema({
    _id: {type: String, default: cuid},
    sender: {type: String, ref:'User', index: true, required: true},
    receiver: {type: String, required: true},
    text: {type: String, required: true}
},{
    timestamps: true
})

const Message = db.model('Message', messageSchema)

module.exports = {
    create,
    get,
    remove,
    model: Message
}

//function to create a message
async function create(fields){
    const message = await new Message(fields).save()

    //create a discussion if there is no discussion with the current receiver
    const {sender, receiver} = fields

    const tmpDiscussion = await Discussions.get({sender: sender, receiver: receiver})

    if(!tmpDiscussion){
        const discussion = await Discussions.create({sender: sender, receiver: receiver})

        await Discussions.edit(discussion._id, message._id)

    }else{
        await Discussions.edit(tmpDiscussion._id, message._id)
    }

    return message
}

//function to get a message
async function get(id){
    const message = await Message.findById(id).populate('sender').exec()

    return message
}

//function to delete a message
async function remove(id){
    await Message.deleteOne({id})
}