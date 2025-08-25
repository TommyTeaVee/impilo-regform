const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");


cloudinary.config({
cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
api_key: process.env.CLOUDINARY_API_KEY,
api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
cloudinary,
params: async (req, file) => {
const map = {
profileImage: "impilo/profile",
fullBodyImage: "impilo/fullbody",
fullDress: "impilo/fullbody",
fullShorts: "impilo/fullbody",
fullJeans: "impilo/fullbody",
closeForward: "impilo/closeups",
closeLeft: "impilo/closeups",
closeRight: "impilo/closeups",
sportswear: "impilo/outfits",
summerwear: "impilo/outfits",
swimwear: "impilo/outfits",
extraImages: "impilo/extra",
};
const folder = map[file.fieldname] || "impilo/misc";
return { folder, resource_type: "image" };
},
});


module.exports = { cloudinary, storage };