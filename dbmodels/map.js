var mongoose = require('../dbconnection')
const mapObjectModel = require('./mapobject');

var mapScheme = new mongoose.Schema({

        width: Number,
        height: Number,
        terrain: String,
        mapname: {type: String, unique: true},
        mapObjects: [mapObjectModel.schema]
})



mongoose.model('map',mapScheme);
var mapModel = mongoose.model('map');

module.exports =  mapModel;


