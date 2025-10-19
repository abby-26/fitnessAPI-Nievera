const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { errorHandler } = require("./auth");

dotenv.config();
const app = express();

app.use(express.json());

// Routes
const userRoutes = require("./routes/user");
const workoutRoutes = require("./routes/workout");

app.use("/users", userRoutes);
app.use("/workouts", workoutRoutes);

// Centralized error handler
app.use(errorHandler);

// DB + Server Start
mongoose.connect(process.env.MONGODB_STRING)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error("DB Connection Failed:", err));
