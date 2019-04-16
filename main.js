var app = require('./app');

var server = require('http').createServer(app);

const io = require('socket.io').listen(server);

const ge = require('./gameengine');
const GameEngine = new ge(io);

let port  = 3000;

server.listen(port,function(){
    console.log("Listening on port " + port);
})

