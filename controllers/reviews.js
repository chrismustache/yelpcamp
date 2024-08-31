const wrapAsync = require('../utils/wrapAsync');

const campgroundsDb = require('../models/campgrounds');
const reviewsDb = require('../models/review');


module.exports. reviewUpdate = wrapAsync(async (req , res, next) => {
    const {review} = req.body;
    const {id} = req.params;
    const reviewNew = new reviewsDb(review);
    reviewNew.author = req.user._id;
    await reviewNew.save();
    const campground = await campgroundsDb.findById(id);
    campground.reviews.push(reviewNew._id);
    await campground.save();
    console.log("Review submitted!")

    res.redirect(`/campgrounds/${id}`);
})


module.exports.reviewDelete = async(req, res, next) => {
    const {id, reviewId} = req.params;
    await reviewsDb.findByIdAndRemove(reviewId);
    await campgroundsDb.findByIdAndUpdate(id , {$pull: {reviews: reviewId}} )
    res.redirect(`/campgrounds/${id}`);
} 