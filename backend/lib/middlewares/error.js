const { STATUS_CODES } = require('http')



//middleware to handle the errors
function handleError(err, req, res, next){
    console.error(err)

    if(res.headerSent) return next(err)
    
    const statusCode = err.statusCode || 500
    const errorMessage = err.message || STATUS_CODES[statusCode] || 'Internal Error'
    
    res.status(statusCode).json({ error: errorMessage })
}

module.exports =  handleError
 