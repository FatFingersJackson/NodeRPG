const express = require('express');
const router = express.Router();





const indexController = require('../controllers/IndexController')



const checkSession = require('../controllers/SessionValidator');

router.get('/login',indexController.login_get);

router.post('/login',indexController.login_post);

router.get('/', checkSession ,indexController.root_get);

router.get('/register', indexController.register_get);

router.post('/register', indexController.register_post);

router.get('/logout',indexController.logout_get);


module.exports = router;