var playerScheme = new mongoose.Schema({
    'username':{type:String,required:true,unique:true},
    'map': String,
    'map-x':Number,
    'map-y': Number,
    //'connection-id':String
})

mongoose.model('player',playerScheme);
var userModel = mongoose.model('player');


module.exports =  userModel;