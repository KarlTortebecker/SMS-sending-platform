const mongoose = require('mongoose')

mongoose.connect(
    "mongodb://127.0.0.1:27017/pgweb"
).then(()=>{
    console.log('db server connected')
}).catch((e) => {
    console.log(e)
})


module.exports = mongoose   
