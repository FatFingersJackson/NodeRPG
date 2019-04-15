var app = require('./app');

var server = require('http').createServer(app);

var io = require('socket.io').listen(server);

let port  = 3000;

server.listen(port,function(){
    console.log("Listening on port " + port);
})

io.on('connection',function(socket){
    
    console.log( socket.id ,"connected");

    socket.emit("welcome",{message:"hello"})

});