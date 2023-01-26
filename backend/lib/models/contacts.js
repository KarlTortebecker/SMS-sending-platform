const cuid = require('cuid')
const mongoose = require('mongoose')

const db = require('../db')

const contactSchema = mongoose.Schema({
    _id: {type: String, default: cuid},
    name: nameSchema(),
    phoneNumber: {type: String, required: true},
    owner: {type: String, ref:'User', index: true, required: true}
},{
    timestamps: true
})

const Contact = db.model('Contact', contactSchema)

module.exports = { 
    create,
    list,
    get,
    edit,
    remove,
    model: Contact
}

//function to get a contact
async function get(params = {}){
    const {name, owner, id, phoneNumber} = params

    const contact = await (
        (name && owner) ? Contact.findOne({name: name, owner: owner}).populate('owner').exec() :
        (id ? Contact.findById(id).populate('owner').exec() : 
        (owner && phoneNumber ? Contact.findOne({owner: owner, phoneNumber: phoneNumber}) : null))
    )

    return contact
}

//function to create a contact
async function create(fields){
    const contact = await new Contact(fields).save()
    
    return contact
}

function nameSchema(){
    return{
        type: String,
        required: true,
        maxLength: 30
    }
}

//function to list contacts
async function list(opts = {}){
    const {offset = 0, limit = 25, owner} = opts

    const contacts =  await Contact.find({owner: owner})
        .sort({_id: 1})
        .skip(offset)
        .limit(limit)

    return contacts
}

//function to edit a contact
async function edit(_id, change){
    const contact = await get({id: _id})

    Object.keys(change).forEach(key => {contact[key] = change[key]})

    await contact.save()

    return contact
}

//function to delete a contact
async function remove(_id){
    await Contact.deleteOne({_id})
}