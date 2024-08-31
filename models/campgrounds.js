const mongoose = require('mongoose');
const reviewsDb = require('./review');

const { Schema } = mongoose

const campSchema =  new Schema({
    name: String,
    price: Number,
    location: String,
    description: String,
    Images: String,
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    author: {type: Schema.Types.ObjectId, ref: 'User'}
})


campSchema.post('findOneAndDelete', async (doc) => {
    await reviewsDb.deleteMany({_id: {$in: doc.reviews}})
})

const campgrounds = new mongoose.model("Campground", campSchema)

module.exports = campgrounds

