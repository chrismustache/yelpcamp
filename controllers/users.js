const wrapAsync = require('../utils/wrapAsync');
const userDb = require('../models/users');

module.exports.usersRegister = (req, res ) => {
    res.render('register_form')
}

module.exports.usersLogin = (req, res ) => {
    res.render('login_form')
}

module.exports.usersCreate = wrapAsync(async (req, res, next ) => {
   
    try {
        registeredUser = await userDb.register(new userDb({username: req.body.username, email:req.body.email}), req.body.password);
        console.log('user registered!');
    
        req.login(registeredUser, (err) => {
            if(err) {next(err)}
            req.flash("success" , "Welcome to Yelcamp")
            res.redirect('/');
        });
    } catch(e) {
        req.flash("error" , "Error while registering");
        res.redirect('register');
        console.log(e);
    }
              
})

module.exports.usersAuth = (req, res) => {
    req.flash('success', 'Logged in successfully!');
    res.redirect(res.locals.prevPath || "campgrounds");
}

module.exports.usersLogout = (req, res ) => {
    req.logout(function(err) {
        req.flash('success' , 'Logged out!');
        if (err) { return next(err); }
        res.redirect('/');
      });
}