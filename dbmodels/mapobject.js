var mongoose = require('../dbconnection')

let mapObjectScheme = new mongoose.Schema({
    'x':Number,
    'y':Number,
    'blocking': Boolean,
    'objectClass': String,
    'type':String,
    'objectName':String,
    'description':String,
    'image':String,
    'objectId':String,
    'avatar': String
}); 

mongoose.model("mapObject", mapObjectScheme);

const mapObjectModel = mongoose.model("mapObject");

module.exports = mapObjectModel;