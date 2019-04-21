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

removeConnection(connId, uname)
{

    let mapname = "testmap";
    let map = this.maps[mapname];

    var arr = map.mapObjects;
    
    let index = arr.findIndex(x => x.objectId === uname );
    let removed = [ arr[index] ]
    
    try{
        arr.splice(index,1);
        this.updateMapClients(map, removed);
    }catch(err)
    {
        console.log(err);
    }
    
    Connection.findOneAndDelete(
        { connectionId:connId },
        (err,res) => {
            if(err){return console.log("Error removing connection", err); }
            try{
            }catch(err)
            { console.log(err, res);}
         });
}

async loadMap(mapname)
{
    let map = await Map.findOne({mapname:mapname});
    this.maps["testmap"] = map;
    return map;
}

 updateMap(mapname,obj, remove = null)
{
    mapname = "testmap";
    let map = this.maps[mapname];

    var arr = map.mapObjects;
    
    let index = arr.findIndex(x=> x.objectId == obj.objectId);

    if(index < 0)
    { arr.push(obj); }
    else
    {
        arr[index] = obj;
    }

    
    this.updateMapClients( map  )
}

updateMapClients(update, remove){
    
    // When more maps, you have to add map name and select the users that update maps
    this.io.sockets.emit("mapUpdate", {update:update,remove:remove})

}

movePlayer(socket,data){

    let mapname = "testmap";
    let map = this.maps[mapname];

    let mw = map.width;
    let mh = map.height;

    var arr = map.mapObjects;
    let index = arr.findIndex(x=> x.objectId == socket.username);
    
    let player = arr[index];
    
    let px = player.x;
    let py = player.y;

    let dx = px + data.x;
    let dy = py + data.y;

    let blockIndex = arr.findIndex(x=> x.x === dx && x.y === dy);
    if( blockIndex >= 0 && arr[blockIndex].blocking === true)
    {
        console.log("blocked" )
    }
    else if (dx >= 0 && dy >= 0 && dy < mh && dx < mw  )
    {
        player.x = dx;
        player.y = dy;
        
        this.updateMapClients( map  )
    }else{
        console.log("out of bounds",dx,dy)
    }
    
}

saveMaps()
{
    // In case there were more maps
    let maps = this.maps;
    for(let key in maps)
    {
        // Save map to database
        // Check if there are no players in map -> remove from active memory
        if(map.hasOwnProperty(key))
        {

        }
    }
}

// Get map from active memory. If it does not exist there, load it frm db
async getMap(mapname)
{
    let map = this.maps[mapname];
    if(map == null)
    {
         map = await this.loadMap(mapname);
         this.maps[mapname] = map;
    }

    return map;
}

 constructor(io)
{
    this.io = io;

    // Store objects with mapnames
    this.maps = {};
    this.loadMap("testmap");
    this.saveMaps();

    io.on('connection',(socket)=>{
        
        socket.on('registerConnection',async (data)=>{
            let uname = data.username;
            // Add player connection to the active connections list
            this.saveConnection(uname, socket.id);
            
            socket.username = uname;
            // Get this from players db
            
            let playerObject = userDB.loadPlayer(uname)

            // Load map for user
            // Too heacy solution
            //let map =  await this.loadMap("testmap");
            let mapname = "testmap";
            let map = this.maps[mapname];
            socket.emit("loadMap", {map:map} )

            //Add user to the map
            // Too heavy method
            this.updateMap("testmap",playerObject);

            socket.on("movePlayer",(data)=>{this.movePlayer(socket,data)});
        })

        

        socket.on('disconnect',()=>{
            
            //Remove user from map
            // Remove user connection
            this.removeConnection(socket.id,socket.username)

            
        })

    });
}

}

module.exports = GameEngine;










//DEPRECATED FOR BEING TOO HEAVY
/*
movePlayer(data)
{

    console.log("MOVE",data)
    
    mapname = "testmap"

    let objectId = data.objectId;
    let x = data.x;
    let y = data.y;
    console.log("Moving " + objectId + " player to " + x+","+y)

    Map.findOneAndUpdate(
        {mapname:mapname, "mapObjects.objectId":obj.objectId },
        {$inc: { views: 1}}
        )
    
}*/


 /* UPDATEMAP
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
*/





/* DISCONNECT 

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
                        if(err){
                            // TODO
                            // force sockets to send new connection, then compare to list
                            // And remove those that did not answer
                            return console.log("CANNOT FIND CONNECTION",err);
                        }

                        console.log("REMOVEUSER", res);
                    } 
                );
            }catch(err)
            { console.log(err, res);}
        })
        */

