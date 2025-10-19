const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserDetails } = require("../controllers/user");
const { verify } = require("../auth");

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Route
router.get("/details", verify, getUserDetails);

module.exports = router;
