const mongoose = require('mongoose');


require('dotenv').config();
let connString = process.env.MONGOCONNECT;

// -- CONNECT DATABASE -->

mongoose.connect(connString, 
    {
        useNewUrlParser: true, 
        useFindAndModify: false,
        useCreateIndex: true,
    }, 
    function(err){
    if(err){throw err;}

    console.log("Connect to database");
});

module.exports = mongoose;
