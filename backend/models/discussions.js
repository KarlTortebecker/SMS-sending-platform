const cuid = require('cuid')
const res = require('express/lib/response')
const mongoose = require('mongoose')

const db = require('../db')

const discussionSchema = mongoose.Schema({
    _id: {type: String, default: cuid},
    sender: {type: String, ref:'User', index: true, required: true},
    receiver: {type: String, ref:'Contact', index:true, required: true},
    messages: [
        {
            type: String, ref:'Message', index: true, default: undefined
        }
    ]
},{
    timestamps: true
})

const Discussion = db.model('Discussion', discussionSchema)

module.exports = {
    create,
    get,
    list,
    edit,
    remove,
    model: Discussion
}

//function to create a new discussion
async function create(fields){
    y
    const discussion = await new Discussion(fields).save()

    return discussion
}

//function to get a discussion
async function get(params = {}){
    const {sender, receiver, id} = params

    const discussion = (sender && receiver) ? await Discussion.findOne({sender: sender, receiver: receiver}).populate('messages').populate('receiver').exec() : (
        id ? await Discussion.findById(id).populate('messages').populate('receiver').exec() : null
    )

    return discussion
}

//function to list discussions
async function list(opts = {}){
    const {offset = 0, limit = 25, sender} = opts

    const discussions =  await Discussion.find({sender: sender}).populate('messages').populate('receiver')
        .sort({_id: 1})
        .skip(offset)
        .limit(limit).exec()

    return discussions
}

//function to edit a discussion
async function edit(id, message_id){
    const discussion = await get({id: id})

    discussion.messages.push(message_id)

    await discussion.save()

    return discussion
}

async function remove(id){
    await Discussion.deleteOne({id})
}