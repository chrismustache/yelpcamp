const express = require('express')
const app = express()
const port = 3000;
const path = require('path');

const mongoose = require('mongoose');
const session = require('express-session');
const morgan = require('morgan');


const AppError = require('./utils/Error');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const flash = require('connect-flash');
var passport = require('passport');
const userDb = require('./models/users');
const {debugLog} = require("./utils/middleware")

//Cookie setup

app.use(session({
    secret: 'notsecret',
    resave: false,
    saveUninitialized: true
}))


app.use(flash());

// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());


//Passport strategy configuration

// use static authenticate method of model in LocalStrategy
passport.use(userDb.createStrategy());

 //use static serialize and deserialize of model for passport session support
passport.serializeUser(userDb.serializeUser());
passport.deserializeUser(userDb.deserializeUser());

// Connect Morgan
app.use(morgan('tiny'));


const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

// Connect Mongoose
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(() => {console.log("Connected to Database")})

app.use(methodOverride('_method'));
app.use( express.urlencoded({ extended: true, type:['application/x-www-form-urlencoded', 'multipart/form-data'] }))


// EJS setup

app.engine('ejs', engine);
app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname , 'views'))


app.use(express.static('public'));

app.use(debugLog);


//Set local variables for template rendering
app.use( (req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');

    next();
  });



app.get('/', (req , res, next)=>{
   res.render('home');
})


//Campground routes
app.use('/campgrounds' , campgroundRoutes);

//Review routes
app.use('/campgrounds/:id/reviews' , reviewRoutes);


//User routes
app.use('/' , userRoutes);


// Basic Error handling

app.use((err, req, res, next) => {
    if (err.kind === "ObjectId") err = new AppError(404, "Mongoose Error")
    next(err)
});

app.all('*', (req, res, next) => {
    next(new AppError(404 , "Page not found!"));
})

app.use((err, req, res, next) => {
   if (!err.statusCode) {
    res.render("error" , {err});
   } else {
   res.status(err.statusCode).render("error" , {err});  
   }
})


app.listen(port, () => {
    console.log(`Yelpcamp listening on port ${port}`)
  })

