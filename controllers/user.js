const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { createAccessToken } = require("../auth");

// Register
module.exports.registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).send({ message: "Email and password are required." });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).send({ message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    res.status(201).send({ message: "Registered Successfully." });
  } catch (err) {
    next(err);
  }
};

// Login
module.exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).send({ message: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).send({ message: "Invalid email or password." });

    const token = createAccessToken(user);
    res.status(200).send({ access: token });
  } catch (err) {
    next(err);
  }
};

// Get User Details
module.exports.getUserDetails = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password -isAdmin"); // exclude sensitive fields
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        res.status(200).send({ user});
    } catch (err) {
        next(err);
    }
};
