var app = require('./app');

var server = require('http').createServer(app);

const io = require('socket.io').listen(server);
// Heroku setting
io.set('origins', '*:*');

const ge = require('./gameengine');
const GameEngine = new ge(io);

// Heroku app gets port from environmental variable
let port = process.env.PORT;
if(!port)
{ port  = 3000; }

server.listen(port,function(){
    console.log("Listening on port " + port);
})

