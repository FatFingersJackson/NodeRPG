const Map = require('./dbmodels/map');

class GameEngine
{


constructor(io)
{
    
}

/*
    loadMap(mapName){

        // DEV PHASE
        // When player enters a map, map is loaded from file
        // then added to active list. When another player enters, 
        // changes are added into common memory
        // WHEN TESTED
        // move maps to db

        let sampleObjects = [
            {
                x: 2,
                y: 7,
                blocking : true,
                objectClass :"slime_red",
                type:"creature",
                id: "rls01", // TODO better id's. Autogenerate?
                name: "Red Slime"
            },
            {
                x: 3,
                y: 6,
                blocking : true,
                type: "terrain",
                objectClass : "water_deep",
                id: "water001",
                name: "Deep Water"   
            }
        ];
        
        var sampleMap = {
            height: 10,
            width: 10,
            terrain: "grass",
            mapObjects : sampleObjects, // <- for spawning
            tiles : [] // <- for gameplay queries
        }
        
        return sampleMap;
    } // <-- loadMap

    // TODO
    // later load from database
    loadPlayer(uname){
        
        let player = {
            
            id: uname,// Later id in database
            map_id: uname,
            username: uname,
            map: "testmap",
            avatar: "stiki.png"
        };


        return player;
    }

   

    constructor(io)
    {
        // TODO DEV store mapchanges here
        this.activeMaps = [];
        let map = this.loadMap();
        this.activeMaps["testmap"] = map;
        
        this.playerConnectionList = [];    
        // FIX 
        this.updatePlayer = (userObject, socket)=>{
            
            var existing = this.playerConnectionList.filter(obj => {
                return obj.username == userObject.username;
            });
            
            console.log("Existing",userObject.username,existing.length)
            if(existing.length > 0)
            {
                // iterate new values and update
            
            }
            else
            {
                this.playerConnectionList.push({socket:socket.id, username:userObject.username });
            }
            console.log("Connections", this.playerConnectionList)
            var update = {};

            // save player to db

            // update changes to client
        } // <- Update Player
        
       

        // The map parameter comes in play when there are multiple maps
        this.updateMap = function(obj, event, map)
        {
            // map where player is at the moment should actually be loaded from database.
            if(!map)
            {map == "testmap"}

            if(event == "spawn")
            {
                // Is player on map already?
                let index = this.activeMaps["testmap"]["mapObjects"].map(function(e){return e.username}).indexOf(obj.username);

                if( index >= 0 )
                {
                    console.log("player spawn", "already existed in index",index, "refresh")   
                    
                }
                else{
                    console.log("player spawn", "new player")   
                    this.activeMaps["testmap"]["mapObjects"].push( obj);
                }
            }
            else 
            {
                // iterate
            }

            // TODO
            io.sockets.emit("mapUpdate",{obj:obj,event:event})
        }

        // NOTE: use arrow functions so the inner this.-functions refer to the class
        io.on('connection',(socket)=>{
        
        // ADD player on the active list and fetch stats
        socket.on('playerSpawned', (data) => 
        {
            let uname = data.username;

            let player = this.loadPlayer(uname);

            // Add player to connection list
            this.updatePlayer(player,socket);
            
            // Add player to the server map -> all clients
            this.updateMap({id:uname,objectClass:"player", type:"player"}, "spawn");

            socket.emit("message",{message:"Hello " + uname + "!"} );
            
            // Load map to user
            // TODO, Get real map from user.location
            //let newMap = this.activeMaps[player.map];
            
            // Loading map
            Map.findOne({mapname: "testmap"},(err, res)=>{
                if(err) {return console.log(err);}
                else{
                    console.log("Loaded Map" , res)
                    //socket.emit('loadMap', { map: newMap });
                }
            });
            
            //console.log("load map",newMap)
            //
            
        });

        // Player updated on client. 
        socket.on('playerUpdated',(data)=>{
                this.updatePlayer(data, socket)
            });
        
            socket.on('disconnect',() => {
                let index = this.playerConnectionList.map(function(e){return e.socket}).indexOf(socket.id);
                
                if( index < 0 ){ console.log("Error removing player connection",socket.id) }
                else{
                    this.playerConnectionList.slice(index,1);
                    console.log("disconnected",socket.id, this.playerConnectionList[index].username );
                }
            })
        }); // io.on

    } // Constructor
*/
}

module.exports = GameEngine;