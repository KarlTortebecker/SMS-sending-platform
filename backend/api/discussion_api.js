const Discussions = require('../models/discussions')
const autoCatch = require('../lib/auto-catch').autoCatch

module.exports = {
    createDiscussion: autoCatch(createDiscussion),
    listDiscussions: autoCatch(listDiscussions),
    getDiscussion: autoCatch(getDiscussion)
}


//handle create discussion request
async function createDiscussion(req, res, next){
    const discussion = await Discussions.create({sender: req.user.id, receiver: req.body.receiver})

    res.json(discussion)
}

//handle list discussions request
async function listDiscussions(req, res, next){
    const {offset = 0, limit = 25} = req.query

    const discussions = await Discussions.list({
        offset: Number(offset), 
        limit: Number(limit),
        sender: req.user.id
    })

    res.json(discussions)
}

//handle get discussion request
async function getDiscussion(req, res, next){
    const discussion = await Discussions.get({receiver: req.params.id, sender:req.user.id})

    if(!discussion) return next()

    res.json(discussion)
}