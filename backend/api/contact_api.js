const Contacts = require('../models/contacts')
const Discussions = require('../models/discussions')
const autoCatch = require('../lib/auto-catch').autoCatch

module.exports = {
    createContact: autoCatch(createContact),
    listContacts: autoCatch(listContacts),
    getContact: autoCatch(getContact),
    editContact: autoCatch(editContact),
    deleteContact: autoCatch(deleteContact),
    getContactName: autoCatch(getContactName)
}

//handle the create contact request
async function createContact(req, res, next){
    const fields = req.body
    fields.owner = req.user.id

    const newContact = await Contacts.create(fields)
    
    res.json(newContact)
}

//handle list contacts request
async function listContacts(req, res, next){
    const {offset = 0, limit = 25} = req.query

    const contacts = await Contacts.list({
        offset: Number(offset), 
        limit: Number(limit),
        owner: req.user.id
    })

    res.json(contacts)
}  

//handle get contact request
async function getContact(req, res, next){
    const { id } = req.params

    const contact = await Contacts.get({id: id})

    if(!contact) { return next() }

    if(await checkOwner(contact._id, req.user.id)){
        res.json(contact) 
    }else{
        res.status(401).json({message: "Unauthorized"})
    }
}

//handle edit contact request
async function editContact(req, res, next){
    const change = req.body

    const tmpContact = await Contacts.get({name: req.body.name, owner: req.user.id})

    if(tmpContact){
        res.status(500).json({message: "You already have a contact with this name."})
    }else{
        if(await checkOwner(req.params.id, req.user.id)){
            const contact = await Contacts.edit(req.params.id, change)
    
            res.json(contact)
        }else{
            res.status(401).json({message: "Unauthorized"})
        }
    }
}   

//handle delete contact request
async function deleteContact(req, res, next){

    if(await checkOwner(req.params.id, req.user.id)){

        await Contacts.remove(req.params.id)

        res.json({success: true})

    }else{
        res.status(401).json({message: "Unauthorized"})
    }
}

//function to check the owner of a contact
async function checkOwner(contactId, userId){
    const contact = await Contacts.get({id: contactId})
    
    return (contact && contact.owner._id === userId)

}

//handle get contact name request from the phone number
async function getContactName(req, res, next){
    const contact = await Contacts.get({owner: req.user.id, phoneNumber: req.params.phoneNumber})

    if(contact){
        res.json({name: contact.name})
        
    }else{
        res.json({name: req.params.phoneNumber})
    }
}