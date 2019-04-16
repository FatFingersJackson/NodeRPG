class GameEngine
{

    constructor(io)
    {
        this.playerList = [];    

        this.updatePlayer = (userObject)=>{
            
            var socket = null;

            var existing = this.playerList.filter(obj => {
                return obj.username == userObject.username;
            })[0];

            if(existing)
            {
                // iterate new values and update
                socket = existing.socket;

            }else
            {
                // push new object
                socket = userObject.socket;
            }

            // save player to db

            // update changes to client
        }

        // NOTE: use arrow functions so the inner this.-functions refer to the class
        io.on('connection',(socket)=>{
            
        socket.on('playerUpdated',(data)=>{
                
                let uname = data.username;
                this.updatePlayer({username: uname, socket:socket.id})
                socket.emit("message",{message:"Hello " + uname + "!"} );
                
            });
        
            socket.on('disconnect',function(){
                console.log(socket.id, "disconnected")
            })
        
        }); // io.on

    } // Constructor

    
    



}

module.exports = GameEngine;