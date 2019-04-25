const express = require('express');
const router = express.Router();
require('dotenv').config();
const path = require('path')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const User = require("../dbmodels/user")

const indexController = require('../controllers/IndexController')

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
            session.username = decoded.username;
            next();
        })
    }

    next();
}

router.get('/login',indexController.login_get);

router.post('/login',indexController.login_post);

router.get('/', checkSession ,indexController.root_get);

router.get('/register', indexController.register_get);

router.post('/register', indexController.register_post);

router.get('/logout',indexController.logout_get);


module.exports = router;