const express = require('express');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const index = require('./routes/index')
var path = require('path');

app = express();



app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(express.cookieParser());
//app.use(express.session());
//app.use(app.router);

app.use(cookieParser());

app.use(session({
    secret: 'salausarvo',
    cookie: {
        maxAge: 60000
    },
    resave: true,
    saveUninitialized: true
}));


// Router for domain root
app.use('/', index);



module.exports = app;