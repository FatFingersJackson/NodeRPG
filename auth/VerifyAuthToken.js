var jwt  = require('jsonwebtoken');

require('dotenv').config();
let secret = process.env.JWTSECRET;


function verifyToken(req, res,next){
    //var token = req.headers['x-access-token']; // www-form-urlencoded

    console.log("Check token");
    
    var token = req.body.token
    if(!token) {return res.status(403).send({auth:false,message:'No token'});}

    jwt.verify(token, secret,function(err,decoded){
        if(err) {return res.status(500).send({auth:false,message:'Failed to authenticate token'});}

        

        // OK
        req.userId = decoded.id;
        next();
    })
}

module.exports = verifyToken;
