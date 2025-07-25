const Listing=require('../models/listing')
const Review=require("../models/reviews")
const ExpressError=require('../utils/ExpressError')

module.exports.creteReview=async(req,res)=>{
     console.log("req.params.id =>", req.params.id); 

    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }
    let newReview=new Review(req.body.review)
    newReview.author=req.user._id
    listing.reviews.push(newReview)

    await newReview.save()
    await listing.save()

    req.flash('success','New Review Created')


    res.redirect(`/listings/${listing._id}`)
}


module.exports.deleteReview=async(req,res)=>{
        let {id,reviewId}=req.params
        await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
        await Review.findByIdAndDelete(reviewId)
        req.flash('success','Review Deleted')

        res.redirect(`/listings/${id}`)
    }