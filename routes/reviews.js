const express = require('express')
const router = express.Router({mergeParams:true})

const {reviewUpdate, reviewDelete} = require('../controllers/reviews')

const {validateReview, requireLogin} = require('../utils/middleware');


router.post('/' , requireLogin, validateReview , reviewUpdate);

router.delete('/:reviewId', requireLogin, reviewDelete)

module.exports = router