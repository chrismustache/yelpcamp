const campgroundsDb = require('../models/campgrounds');

const wrapAsync = require('../utils/wrapAsync');

module.exports.campgroundsView = async (req , res, next) => {
    const campgrounds = await campgroundsDb.find();
    res.render('campgrounds' , {campgrounds} )
}


module.exports.campgroundsCreate = wrapAsync(async (req , res, next) => {
    const campgroundNew = new campgroundsDb(req.body.campground);
    campgroundNew.author = req.user._id;
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
    const {id} = req.params;
    
    await campgroundsDb.findByIdAndUpdate(id , req.body.campground );
    req.flash('success', 'Campground edited successfully!!!');
        
    
    res.redirect(`/campgrounds/${id}` );
})

module.exports.campgroundsDelete = async (req , res) => {
    const {id} = req.params;

    await campgroundsDb.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted successfully!!!');

    res.redirect('/campgrounds');
}