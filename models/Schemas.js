const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    
    name: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
    Images: Joi.string().required(),
    price: Joi.number().min(10).required()

});


module.exports.reviewSchema = Joi.object({
    
    rating: Joi.number().min(1).max(5).required(),
    body: Joi.string().required(),

});

