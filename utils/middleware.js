const express = require('express');
const app = express();

const session = require('express-session');

const campgroundsDb = require('../models/campgrounds');

const Schemas = require('../models/Schemas');

const AppError = require('../utils/Error');

app.use(session({
    secret: 'notsecret',
    resave: false,
    saveUninitialized: true
}))

module.exports.requireLogin = (req,res,next) => {
    if(!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in');
        req.session.prevPath = req.originalUrl;
        return res.redirect('/login')
    } 
    next();
}

module.exports.storePrevPath = (req, res, next) => {
    if (req.session.prevPath) {
        res.locals.prevPath = req.session.prevPath;
    }
    next();
}


module.exports.validateCampground = (req, res, next) => {
    const { error, value } = Schemas.campgroundSchema.validate(req.body.campground);
    if (error) next (new AppError(400, error.details[0].message));
    next();
}


module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const campground = await campgroundsDb.findById(id);

    if (!campground.author._id.equals(req.user._id)) {
        req.flash('error' , 'No permission to do that!' );
        return res.redirect(`/campgrounds/${id}` );
        }
    next();
}


module.exports.validateReview = (req, res, next) => {
    const { error, value } = Schemas.reviewSchema.validate(req.body.review);
    if (error) next (new AppError(400, error.details[0].message));
    next();
}

/* module.exports.debugLog = (req, res, next) => {
    console.log("Request body", req.body)
    console.log(req.file)
    next();
} */