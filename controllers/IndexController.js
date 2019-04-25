module.exports.login_get = function(req,res,next){
    
    // If logged in

    sess = req.session;
    
    res.render('login',{
        title:"login",
        errors: sess.errors
    })
};


module.exports.login_post = function(req,res,next){
    
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
    
    // Use regex for case-insensitive query with usernames
    //"/^"+uname+"$/i"
    User.findOne({username: new RegExp(uname,"i") }, function(err, user){
        
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
};


module.exports.root_get = function(req, res,next) {
    
    let sess = req.session;

    let title = "Game";
    let file = 'game.ejs'
    res.render('template',{
        title: title,
        file: file,
        username: req.session.username,
        socketurl: process.env.SOCKETURL
    });
};

module.exports.register_get = function(req,res,next){

    res.render('register',{
        errors: req.session.errors
    });
};

module.exports.register_post = function(req,res,next){
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
};

module.exports.logout_get = function(req,res){

    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("logged out");
            res.redirect('/'); //takaisin juureen eli kirjautumaan
        }
    });

};