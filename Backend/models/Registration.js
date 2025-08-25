const mongoose = require("mongoose");
const RegistrationSchema = new mongoose.Schema(
{
// Basic & identity
fullName: { type: String, required: true },
email: { type: String, required: true },
phone: { type: String, required: true },
dob: { type: String, required: true }, // YYYY-MM-DD
gender: { type: String, enum: ["Female","Male","Non-Binary","Other"], required: true },


// Model type
modelType: { type: String, enum: ["Featured","InHouse"], required: true },


// Physical attributes
height: Number,
weight: Number,
bust: Number,
waist: Number,
hips: Number,
eyeColor: String,
hairColor: String,
shoeSize: String,


// Location
country: String,
state: String,
city: String,
address: String,


// In-House requirements
bio: String,
visualArts: [{
type: String,
enum: ["Voice Over","Singing","Dancing","Sports","Drama","Painting","Poetry"],
}],
allergiesOrSkin: String,


// Featured optional
portfolioLink: String,
previousAgency: String,


// Core images
profileImage: String,
fullBodyImage: String,


// 9-slot grid images
fullDress: String,
fullShorts: String,
fullJeans: String,
closeForward: String,
closeLeft: String,
closeRight: String,
sportswear: String,
summerwear: String,
swimwear: String,
 status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true });


module.exports = mongoose.model("Registration", RegistrationSchema);