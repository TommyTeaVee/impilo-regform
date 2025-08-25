require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const registrationRoutes = require("./routes/registrationRoutes");


const app = express();
app.use(cors());
app.use(express.json());


//Admin Routes
const auth = require("../middleware/auth");
app.use("/api/admin", auth, require("./routes/admin"));

//Model routes
app.get("/", (_req, res) => res.send("Impilo API"));
app.use("/api/registration", registrationRoutes);


connectDB();
module.exports = app;