const mongoose = require('mongoose');

// TODO ota selvää
// require ('dotenv').config();


// -- CONNECT DATABASE -->

mongoose.connect('mongodb://localhost/noderpg', 
    {
        useNewUrlParser: true, 
        useFindAndModify: false,
        useCreateIndex: true,
    }, 
    function(err){
    if(err){throw err;}

    console.log("Connect to mongoose");
});

module.exports = mongoose;
