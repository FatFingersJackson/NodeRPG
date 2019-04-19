var mongoose = require('../dbconnection');

var connectionScheme = new mongoose.Schema({
    'username': {type: String, unique: true},
    'connectionId':String,
    'connectTime':Date
});

mongoose.model('userConnection', connectionScheme );
const connectionModel = mongoose.model('userConnection');

module.exports = connectionModel;