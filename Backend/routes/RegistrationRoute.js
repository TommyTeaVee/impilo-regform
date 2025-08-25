const express = require("express");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const Registration = require("../models/Registration");


const router = express.Router();
const upload = multer({ storage });


function validateBody(b) {
const required = ["fullName","email","phone","dob","gender","modelType"];
for (const k of required) if (!b[k]) return `Missing required field: ${k}`;
if (!["Featured","InHouse"].includes(b.modelType)) return "modelType must be 'Featured' or 'InHouse'";
if (b.modelType === "InHouse") {
if (!b.bio) return "InHouse requires bio";
if (!b.allergiesOrSkin) return "InHouse requires allergies/skin info";
}
return null;
}


// Fields map for the 9 placeholders + core images
const fieldDefs = [
{ name: "profileImage", maxCount: 1 },
{ name: "fullBodyImage", maxCount: 1 },
{ name: "fullDress", maxCount: 1 },
{ name: "fullShorts", maxCount: 1 },
{ name: "fullJeans", maxCount: 1 },
{ name: "closeForward", maxCount: 1 },
{ name: "closeLeft", maxCount: 1 },
{ name: "closeRight", maxCount: 1 },
{ name: "sportswear", maxCount: 1 },
{ name: "summerwear", maxCount: 1 },
{ name: "swimwear", maxCount: 1 },
{ name: "extraImages", maxCount: 10 },
];
router.post(
"/",
upload.fields(fieldDefs),
async (req, res) => {
try {
// Normalize visualArts (checkboxes)
let visualArts = req.body.visualArts;
if (typeof visualArts === "string") visualArts = [visualArts];
if (!visualArts) visualArts = [];


const body = { ...req.body, visualArts };
const err = validateBody(body);
if (err) return res.status(400).json({ error: err });


// Collect image URLs by field name (multer-storage-cloudinary sets file.path)
const pick = (name) => req.files?.[name]?.[0]?.path || undefined;
const extras = (req.files?.extraImages || []).map(f => f.path);


const doc = new Registration({
...body,
height: +body.height || undefined,
weight: +body.weight || undefined,
bust: +body.bust || undefined,
waist: +body.waist || undefined,
hips: +body.hips || undefined,
profileImage: pick("profileImage"),
fullBodyImage: pick("fullBodyImage"),
fullDress: pick("fullDress"),
fullShorts: pick("fullShorts"),
fullJeans: pick("fullJeans"),
closeForward: pick("closeForward"),
closeLeft: pick("closeLeft"),
closeRight: pick("closeRight"),
sportswear: pick("sportswear"),
summerwear: pick("summerwear"),
swimwear: pick("swimwear"),
extraImages: extras,
});


await doc.save();
res.status(201).json({ message: "Registration saved", registration: doc });
} catch (e) {
console.error(e);
res.status(500).json({ error: "Server error", details: e.message });
}
}
);


router.get("/", async (_req, res) => {
try {
const docs = await Registration.find().sort({ createdAt: -1 });
res.json(docs);
} catch (e) {
res.status(500).json({ error: "Server error" });
}
});


module.exports = router;