const http = require('http');
const app = require('./app')


const port = process.env.PORT || '3000'
app.set('port', port);


app.listen(port, () => console.log(`Listening on port ${port}`)) 



// Create HTTP server.
const server = http.createServer(app);
server.listen( () => console.log(`Listening on port ${port}`))