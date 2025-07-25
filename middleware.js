const listing=require("./models/listing")
const Review=require("./models/reviews.js")
const ExpressError=require("./utils/expressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirect url
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be Logged in!")
        return res.redirect("/login")
    }
    next()
}

module.exports.saveRedirecturl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let Listing =await listing.findById(id);
    if(!Listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing")
       return res.redirect(`/listings/${id}`);
    }
    next()
}

module.exports.isreviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review =await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review")
       return res.redirect(`/listings/${id}`);
    }
    next()
}

module.exports.validateListing=(req,res,next)=>{
    let { err }= listingSchema.validate(req.body);

   if(err){
    let errMsg=err.details.map((el)=>el.message).join(",")
    throw new ExpressError(400,errMsg);
   }else{next();
   }
};

module.exports.validateReview=(req,res,next)=>{
    let { error }= reviewSchema.validate(req.body);
   if(error){
    let errMsg=error.details.map((el)=>el.message).join(",")
    throw new ExpressError(400,errMsg);
   }else{next();
   }
}