const express = require('express');
const router = express.Router();
const path = require('path')
const user = require("../dbmodels/user")

let sess;

function checkSession(req,res,next)
{
    next();
}

router.get('/login',checkSession,function(req,res,next){
    res.render('login')
});
router.post('/login',checkSession,function(req,res,next){
    

    /*
    User.findOne({email:req.body.email}, function(err, user){
        
        if(err) return res.status(500).send('Error on the server');
        if(!user) return res.status(404).send('No user found')

        var passwordIsValid = bcrypt.compareSync(req.body.password,user.password);
        console.log("Password is valid " + passwordIsValid);
        if(!passwordIsValid) return res.status(401).send({auth:false,token:null});

        var token = jwt.sign({id:user._id},config.secret,{expiresIn:86400}); // Expires in 24h

        res.status(200).send({auth:true, token:token});

        */


});

router.get('/', checkSession ,function(req, res,next) {
    
    if( req.session.token )
    {

    }
    else{
        res.redirect('login')
    }

    //let sess = req.session;
    
    //res.redirect()
    
    sess.pass = ":)"
    
    //res.sendFile(__dirname + '../views/client.html');
    res.render('client')
});



// --  -- -- -- //
/*
router.get('/me', VerifyToken ,function(req, res,next){
    console.log("ME")

        User.findById(req.userId,
            {password:0}, 
            function(err, user){
                console.log("FOUND")
                if(err){return res.status(500).send("Problem finding user");}
                if(!user){ return res.status(404).send("No user found");}
                //res.status(200).send(user);
                next(user);
            });
    
})

router.use(function(user,req,res,next){
    res.status(200).send(user);
});

router.post('/login', function(req,res){
    User.findOne({email:req.body.email}, function(err, user){
        if(err) return res.status(500).send('Error on the server');
        if(!user) return res.status(404).send('No user found')

        var passwordIsValid = bcrypt.compareSync(req.body.password,user.password);
        console.log("Password is valid " + passwordIsValid);
        if(!passwordIsValid) return res.status(401).send({auth:false,token:null});

        var token = jwt.sign({id:user._id},config.secret,{expiresIn:86400}); // Expires in 24h

        res.status(200).send({auth:true, token:token});
    })
})

*/

module.exports = router;