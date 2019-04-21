const Map = require('./dbmodels/map');
const Connection = require('./dbmodels/userconnection');
const MapObject = require('./dbmodels/mapobject');
const userDB = require('./dboperations/playerdb');

class GameEngine
{


saveConnection(uname, connid)
{
    let timestamp = new Date();

    Connection.findOneAndUpdate(
        {username:uname},
        { $set: {username:uname ,connectionId: connid, 'connectTime': timestamp }},
        {new: true,upsert: true,},
        function(err,doc,res){

            if(err){return console.log(err);}
            
            // returns added object
            if(doc){
                console.log("connected", doc.connectionId, doc.username)
            };
            if(res)
            {
                //console.log("updated",uname, res);
            }
            else
            {
                //console.log("did not find anyone to update, so created new")
            }
        });
}

removeConnection(connId)
{

    let mapname = "testmap";    


    Connection.findOneAndDelete(
        { connectionId:connId },
        (err,res) => {
            if(err){return console.log("Error removing connection", err); }
            try{
                console.log("disconnected", res.connectionId,res.username);

                Map.findOneAndUpdate(
                    {mapname:mapname}, 
                    {
                        '$pull':{
                            'mapObjects':{ objectId : res.username }
                        }
                    },
                    (err,res)=>
                    {
                        if(err){return console.log(err);}

                        console.log("REMOVEUSER", res);
                    } 
                );



            }catch(err)
            { console.log(err, res);}
        })
}

async loadMap(mapname)
{
    let map = await Map.findOne({mapname:mapname});
    return map;
}

async updateMap(mapname,obj)
{
    mapname = "testmap";

    let res = null;

    try{
        res = await Map.findOneAndUpdate(
            {mapname:mapname, "mapObjects.objectId":obj.objectId },
            {$set:{"mapObjects.$": obj } },
            {new:true}
        );
    }catch(err)
    {
        console.log("Error updating map", err)
    }
    
    if(!res)
    {
        let newObj = MapObject(obj);
        console.log("No obj found","Spawning")
        try{
            res = await Map.findOneAndUpdate(
                {mapname:mapname},
                { $push: {mapObjects: newObj } },
                {new: true}
            );
            //res = quer.mapObjects;
        }catch(err)
        {
            console.log("Error updating map", err);
        }
    }

    console.log("Updated map");
    this.updateMapClients(res)
}

updateMapClients(update){
    // When more maps, you have to add map name and select the users that update maps
    this.io.sockets.emit("mapUpdate", {update:update})

}

movePlayer(data)
{
    /*
    mapname = "testmap"

    let objectId = data.objectId;
    let x = data.x;
    let y = data.y;
    console.log("Moving " + objectId + " player to " + x+","+y)

    Map.findOneAndUpdate(
        {mapname:mapname, "mapObjects.objectId":obj.objectId },
        {$inc: { views: 1}}
        )
    */
}

constructor(io)
{
    this.io = io;
    io.on('connection',(socket)=>{
        
        socket.on('registerConnection',async (data)=>{
            let uname = data.username;
            // Add player connection to the active connections list
            this.saveConnection(uname, socket.id);
            
            // Get this from players db
            
            let playerObject = userDB.loadPlayer(uname)

            
            
            // Load map for user
            let map =  await this.loadMap("testmap");
            socket.emit("loadMap", {map:map} )

            //Add user to the map
            this.updateMap("tesmap",playerObject);

            socket.on("movePlayer",this.movePlayer);

        })

        

        socket.on('disconnect',()=>{
            
            //Remove user from map
            
            // Remove user connection
            this.removeConnection(socket.id)

            
            
            
            
        })

    });
}

/*
    

   

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