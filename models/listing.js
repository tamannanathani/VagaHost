const mongoose= require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./reviews.js");
const { findOneAndDelete } = require("./reviews");

const listingSchema= new Schema({
    title:{
        type:String,
    },
    description:{
        type:String,
        required: true
    },
    image:{
        url:String,
        filename:String
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[
        {type: Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    latitude: Number, 
    longitude: Number,


});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}})
    }
})

const listing= new mongoose.model("listing",listingSchema);

module.exports= listing;
