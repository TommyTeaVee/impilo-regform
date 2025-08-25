const express = require("express");
const Registration = require("./RegistrationRoute");
const router = express.Router();

// Get all registrations
// routes/admin.js
router.get("/registrations", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status, skill } = req.query;

    const query = {};

    if (search) {
      query.fullName = { $regex: search, $options: "i" };
    }

    if (status) {
      query.status = status;
    }

    if (skill) {
      query.visualArts = skill;
    }

    const registrations = await Registration.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Registration.countDocuments(query);

    res.json({
      registrations,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// Get single registration
router.get("/registrations/:id", async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ error: "Not found" });
    res.json(registration);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update registration status
router.patch("/registrations/:id", async (req, res) => {
  try {
    const { status } = req.body; // approved, rejected, pending
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(registration);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete registration
router.delete("/registrations/:id", async (req, res) => {
  try {
    await Registration.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
