module.exports =  cors 
 

//middleware to manage the cross origin authorisations
function cors(req, res, next){
    const origin = req.headers.origin

    res.setHeader('Access-Control-Allow-Origin', origin || '*')
    res.setHeader(
        'Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS, XMODIFY'
    )
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Max-Age', '86400')
    res.setHeader(
        'Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Origin, Authorization'
    )

    next()
}

 