var playerScheme = new mongoose.Schema({
    'username':{type:String,required:true,unique:true},
    'map': String,
    'map-x':Number,
    'map-y': Number,
    //'connection-id':String
})

mongoose.model('player',playerScheme);
var playerModel = mongoose.model('player');








module.exports =  playerModel;