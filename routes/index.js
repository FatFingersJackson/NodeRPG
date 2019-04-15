const express = require('express');
const router = express.Router();
require('dotenv').config();
const path = require('path')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const User = require("../dbmodels/user")



let sess;

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
            console.log(decoded);
            next();
        })
    }

    next();
}

router.get('/login',function(req,res,next){
    
    // If logged in

    sess = req.session;
    
    res.render('login',{
        title:"login",
        errors: sess.errors
    })
});
router.post('/login',function(req,res,next){
    
    sess = req.session;
    
    req.checkBody('username', 'Username is required').notEmpty();
    //req.checkBody('username', 'Please enter a valid email').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    
    
    const errors = req.validationErrors();

    if(errors)
    {
        sess.errors = errors;
        console.log(errors)
        return res.redirect('/login');
    }
    
    // Don't pass empty username, might find anything
    var uname = req.body.username || "$";
    
    var pwd = req.body.password || "";
    
    User.findOne({username:uname}, function(err, user){
        
        if(err) return res.status(500).send('Error on the server');
        //if(!user) return res.status(404).send('No user found')
        var passwordIsValid = false;
        if( user )
        {
             passwordIsValid = bcrypt.compareSync(pwd,user.password);
        }

        if( !user || !passwordIsValid)
        {
            let error = {msg:"Username or password invalid"};
            sess.errors = [error]
            return res.redirect("/login");
        }
        

        var token = jwt.sign({id:user._id, username:user.username}, process.env.JWTSECRET ,{expiresIn:86400}); // Expires in 24h
        sess.token  = token;
        console.log("Authentication successfull!");
        
        res.redirect("/");
    });
});

router.get('/', checkSession ,function(req, res,next) {
    
    let sess = req.session;

    if( sess.token )
    {

    }
    else{
        return res.redirect('login')
    }

    //sess.pass = ":)"
    
    res.render('client')
});

router.get('/register', function(req,res,next){

    res.render('register',{
        errors: req.session.errors
    });
});


router.post('/register', function(req,res,next){
    let sess = req.session;

    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('username','Only letters and numbers allowed in username').isAlphanumeric();

    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password', 'Password has to be atleast 5 letters').isLength({min: 5});

    const errors = req.validationErrors();

    if(errors)
    {
        sess.errors = errors;
        console.log(errors)
        return res.redirect('/register');
    }

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    console.log("Hashed", hashedPassword);
    User.create({
        username: req.body.username,
        password: hashedPassword
    },
    function(err, user){
        if(err) {
            // TODO 
            console.log("ERROR CREATING USER", err)
            return res.status(500).send("Could not register user");
        }
        // Create token
        var token = jwt.sign({id:user._id, username:user.username}, process.env.JWTSECRET, {expiresIn:86400});
        req.session.token = token;
        
        res.redirect('/');
    });



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