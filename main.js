



var app = require('./app');

var server = require('http').createServer(app);

var io = require('socket.io').listen(server);


server.listen(3000,function(){
    console.log("Listening");
})

io.on('connection',function(socket){
    
    console.log( socket.id ,"connected");

    socket.emit("welcome",{message:"hello"})

});

