const express = require('express');
const app = express(); 
const router = express.Router();

var passport = require('passport');

const Users =require('../controllers/users')

flash = require('connect-flash');

const {storePrevPath} = require('../utils/middleware');


app.use(passport.session());

router.route('/login')
    .get(Users.usersLogin)


router.route('/register')
    .get(Users.usersRegister)
    .post(Users.usersCreate)


router.post('/login', storePrevPath, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true}), Users.usersAuth);


router.post('/logout', Users.usersLogout)

module.exports = router