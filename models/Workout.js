const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  dateAdded: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Workouts", workoutSchema);
