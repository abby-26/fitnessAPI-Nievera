const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET_KEY = process.env.JWT_SECRET || "FitnessTrackerSecret";

// [SECTION] Token Creation
module.exports.createAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin || false
  };

  return jwt.sign(data, JWT_SECRET_KEY, { expiresIn: "1d" });
};

// [SECTION] Token Verification
module.exports.verify = (req, res, next) => {
  let token = req.headers.authorization;

  if (typeof token === "undefined") {
    return res.status(401).send({ auth: "Failed", message: "No token provided" });
  } else {
    // Bearer tokenstring
    token = token.slice(7, token.length);

    jwt.verify(token, JWT_SECRET_KEY, (err, decodedToken) => {
      if (err) {
        return res.status(403).send({
          auth: "Failed",
          message: err.message
        });
      } else {
        req.user = decodedToken;
        next();
      }
    });
  }
};

// [SECTION] Verify Admin
module.exports.verifyAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).send({
      auth: "Failed",
      message: "Admin access only"
    });
  }
};

// [SECTION] Error Handler
module.exports.errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.status || 500;
  const errorMessage = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: {
      message: errorMessage,
      errorCode: err.code || "SERVER_ERROR",
      details: err.details
    }
  });
};

// [SECTION] Middleware to Check if User is Authenticated
module.exports.isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};
