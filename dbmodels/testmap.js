
const MapObject = require('./mapobject');
const Map = require('./map');

const testmapName = "testmap";

let slime = {

    'x':2,
    'y':7,
    'blocking': true,
    'objectClass': "slime_red",
    'type' : "creature",
    'objectName':"Red Slime",
    'description': "A red slime",
    'objectId':'drrp'
};

let water = {

    'x':3,
    'y':6,
    'blocking': true,
    'objectClass': "water_deep",
    'type' : "terrain",
    'objectName':"Deep Water",
    'description': "Very deep water. Perhaps there is fish?",
    'objectId':'splash01'
    
};

let map = {
    width: 10,
    height: 10,
    mapname: "testmap",
    terrain: "grass",
    mapObjects: [slime, water]
}

Map.create(map, function(err,res){

    if(err){return console.log(err);}

    console.log(res);

})

