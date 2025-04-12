const campgroundsDb = require('../models/campgrounds');

const wrapAsync = require('../utils/wrapAsync');

const cloudinary = require('cloudinary').v2;

//const maptilerClient = require("@maptiler/client");

const maptilersdk = require ('@maptiler/sdk');

maptilersdk.config.apiKey = 'GJiDKh5YqRadS8RdbasI';

const map = new maptilersdk.Map({
    container: 'map', // container's id or the HTML element in which SDK will render the map
    style: maptilersdk.MapStyle.STREETS,
    center: [16.62662018, 49.2125578], // starting position [lng, lat]
    zoom: 14 // starting zoom
});

module.exports.campgroundsView = async (req , res, next) => {
    const campgrounds = await campgroundsDb.find();
    res.render('campgrounds' , {campgrounds} )
}


module.exports.campgroundsCreate = wrapAsync(async (req , res, next) => {
    
    const campgroundNew = new campgroundsDb(req.body.campground);
    campgroundNew.Images = req.files.map((f) => ({filename:f.filename, url: f.path}));  
    campgroundNew.author = req.user._id;
    console.log(campgroundNew);
    await campgroundNew.save();
    req.flash('success', 'Campground submitted successfully!!!');
    res.redirect('/campgrounds')
    })

module.exports.campgroundsNew = async (req , res) => {
    res.render('campground_new')}

module.exports.campgroundsSingle = wrapAsync(async (req , res , next) => {
    const {id} = req.params;
    let campground = await campgroundsDb.findById(id).populate({path:'reviews' , populate: { path: 'author'}}).populate('author')

    if (!campground) { 
        req.flash('error' , 'Campground not found!' )
        return res.redirect('/campgrounds');
    }
    res.render('campground_single' , {campground} )

    const result = await maptilersdk.geocoding.forward('St. Clair Shores, Michigan' , {limit: 1});

    console.log(result);

    res.send(result);

})

module.exports.campgroundsEdit = wrapAsync(async (req , res) => {

    const {id} = req.params;
    const campground = await campgroundsDb.findById(id);

        if (!campground) { 
            req.flash('error' , 'Campground not found!' )
            return res.redirect(`/campgrounds/${id}` );
        } 
       
    res.render('campground_edit' , {campground} )
})

module.exports.campgroundsUpdate = wrapAsync(async (req , res) => {
    console.log(req.body)
    const {id} = req.params;
    const campground = await campgroundsDb.findById(id);
    console.log("This runs");
    campground.Images.push(...req.files.map((f) => ({filename:f.filename, url: f.path})));
            const {campgroundDeletedImages} = req.body;
    if(campgroundDeletedImages) {
        cloudinary.api.delete_resources(campgroundDeletedImages).then(
            console.log("Images deleted from cloudinary!")
        )  
        for (let img of campgroundDeletedImages) {
            for (let i=0; i < campground.Images.length ; i++ ) {
                if(img === campground.Images[i].filename) {
                    campground.Images.splice(i, 1);
                }
            }
        }
    }
    campground.save();
    
    req.flash('success', 'Campground edited successfully!!!');
        
    
    res.redirect(`/campgrounds/${id}` );
})

module.exports.campgroundsDelete = async (req , res) => {
    const {id} = req.params;
    const campground = await campgroundsDb.findById(id);
    console.log(campground.Images.map((f)=>(f.filename)));
    cloudinary.api.delete_resources(campground.Images.map((f)=>(f.filename))).then(
        console.log("Images deleted from cloudinary along with campground!")
    ) 
    await campgroundsDb.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted successfully!!!');

    res.redirect('/campgrounds');
}