require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const index = require('./routes/index')
var path = require('path');
const validator = require('express-validator');

app = express();




app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));





// The order to work-->
//app.use(express.cookieParser());
//app.use(express.session());
//app.use(app.router);

app.use(cookieParser());

let sessionSecret = process.env.SESSIONSECRET;

app.use(session({
    secret: sessionSecret,
    cookie: {
        maxAge: 60000
    },
    resave: true,
    saveUninitialized: true
}));

app.use(validator());

// Router for domain root
app.use('/', index);



module.exports = app;