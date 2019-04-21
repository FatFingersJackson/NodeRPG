

// Get this from players db

// TODO
// Load from DB later
module.exports.loadPlayer = function(uname){

    console.log("Load")

    
    if(uname == "hero")
    {
        return  {
            'x':0,
            'y':0,
            'blocking': true,
            'objectClass': "player",
            'type' : "player",
            'objectName':"Player " + uname,
            'description': "Player called " + uname,
            'objectId':uname,
            'avatar':"stiki.png"
        }
    }
    else{
        return {
            'x':0,
            'y':0,
            'blocking': true,
            'objectClass': "player",
            'type' : "player",
            'objectName':"Player " + uname,
            'description': "Player called " + uname,
            'objectId':uname,
            'avatar':"sepi.png"
        }
    }
    
};