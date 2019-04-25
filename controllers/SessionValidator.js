require('dotenv').config();
const jwt = require('jsonwebtoken');



function checkSession(req,res,next)
{
    let session = req.session;
    let token = session.token;
    
    if(!token){return res.redirect('/login'); }
    else{
        jwt.verify(token, process.env.JWTSECRET ,function(err,decoded){
            if(err) 
            {
                return res.status(500).send({auth:false,message:'Failed to authenticate token'});
            }

            // OK
            session.username = decoded.username;
            next();
        })
    }

    next();
}

module.exports = checkSession;