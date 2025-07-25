const express=require("express")
const router=express.Router({mergeParams: true});
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/expressError.js")
const {reviewSchema}=require("../schema.js")
const Review=require("../models/reviews.js")
const listing=require("../models/listing.js")
const {validateReview, isLoggedIn, isreviewAuthor}=require("../middleware.js")

const reviewController=require("../controllers/reviews.js")

//Reviews route(post route)
router.post("/",validateReview,
    isLoggedIn,
    wrapAsync(reviewController.createReview))

//delete review route
router.delete("/:reviewId",
    isLoggedIn,
    isreviewAuthor,
    wrapAsync(reviewController.destroyReview))

module.exports=router;