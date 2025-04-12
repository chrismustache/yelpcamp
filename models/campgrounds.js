const mongoose = require('mongoose');
const reviewsDb = require('./review');

const { Schema } = mongoose

const ImageSchema = new Schema({
    filename: String,
    url: String
})

const campSchema =  new Schema({
    name: String,
    price: Number,
    location: String,
    description: String,
    Images: [ImageSchema],
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    author: {type: Schema.Types.ObjectId, ref: 'User'}
})

ImageSchema.virtual('thumbUrl').get(
    function () {

        return this.url.replace("/upload/" , "/upload/w_300/");
        
    }

)


campSchema.post('findOneAndDelete', async (doc) => {
    await reviewsDb.deleteMany({_id: {$in: doc.reviews}})
})

const campgrounds = new mongoose.model("Campground", campSchema)

module.exports = campgrounds

