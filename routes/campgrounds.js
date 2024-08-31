const express = require('express');
const router = express.Router();

const {campgroundsView, campgroundsCreate, campgroundsNew, campgroundsSingle, campgroundsEdit, campgroundsUpdate, campgroundsDelete} = require('../controllers/campgrounds')

var passport = require('passport');

const {storePrevPath, validateCampground, isAuthor, requireLogin} = require('../utils/middleware');

const session = require('express-session');

const multer  = require('multer')
  
const upload = multer({ dest: '../public/uploads' })

router.use(session({
    secret: 'notsecret',
    resave: false,
    saveUninitialized: true
}))

router.use(passport.session());

router.use(storePrevPath);

router.route('/')
    .get(campgroundsView )
   // .post(requireLogin, validateCampground , upload.single("campground[Images]") , campgroundsCreate)
   .post(upload.single("campground[Images]"),(req,res) => {
        res.send("IT WORKED!!")})


router.get('/new' , requireLogin , campgroundsNew)

router.route('/:id')
    .get(campgroundsSingle)
    .put(requireLogin , isAuthor, validateCampground , campgroundsUpdate)
    .delete(campgroundsDelete)


router.get('/:id/edit', requireLogin , isAuthor,  campgroundsEdit)

module.exports = router