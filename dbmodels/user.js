var mongoose = require('../dbconnection')

var userScheme = new mongoose.Schema({
    'username':{type:String,required:true,unique:true},
    'password':String
})

mongoose.model('user',userScheme);
var userModel = mongoose.model('user');

/*
userModel.create({
    username:'Esko',
    password:'pass1'
});
*/

module.exports =  userModel;