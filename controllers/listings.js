const listing=require("../models/listing.js")
const axios = require("axios");

module.exports.index=async(req,res)=>{
  const allListings=  await listing.find({})
  res.render("listings/index.ejs",{allListings})
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs")
};

module.exports.showListing=async (req,res)=>{
    let { id }= req.params;
    const list = await listing.findById(id)
    .populate({path:"reviews",populate:{
        path:"author"
    }})
    .populate("owner");
    if(!list){
    req.flash("error","listing you requested for does not exist")
    return res.redirect("/listings")
    }
    res.render("listings/show.ejs",{ list})
};

module.exports.createListing = async (req, res, next) => {
    const { location } = req.body.listing;

    const geoResponse = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
            q: location,
            format: "json",
            limit: 1,
        },
        headers: {
            'User-Agent': 'vagaHost-app/1.0'
        }
    });

    let latitude = 0, longitude = 0;
    if (geoResponse.data.length > 0) {
        latitude = geoResponse.data[0].lat;
        longitude = geoResponse.data[0].lon;
    }

    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {
        url: req.file.path,
        filename: req.file.filename
    };
    newListing.latitude = latitude;
    newListing.longitude = longitude;

    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
};

module.exports.renderEditForm=async (req,res)=>{
    let { id }= req.params;
    const list = await listing.findById(id);
    if(!list){
    req.flash("error","listing you requested for does not exist")
    return res.redirect("/listings")
    }
    console.log(list)   
    let originalImageUrl=list.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs",{list,originalImageUrl})
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const Listing = await listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file) {
        const url = req.file.path;
        const filename = req.file.filename;
        Listing.image = { url, filename };
    }

    const locationString = req.body.listing.location;

    try {
        const geoResponse = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: {
                q: locationString,
                format: "json",
                limit: 1
            },
            headers: { "User-Agent": "vagaHostApp/1.0" }
        });

        if (geoResponse.data && geoResponse.data.length > 0) {
            Listing.latitude = geoResponse.data[0].lat;
            Listing.longitude = geoResponse.data[0].lon;
        }
    } catch (e) {
        console.error("Geocoding failed:", e.message);
    }

    await Listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async(req,res)=>{
    let { id }= req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","listing Deleted!")
    res.redirect("/listings")
};
