const express = require("express");
const router = express.Router();
const {
  addWorkout,
  getWorkouts,
  updateWorkout,
  deleteWorkout
} = require("../controllers/workout");
const { verify } = require("../auth");

// All routes protected
router.post("/", verify, addWorkout);
router.get("/", verify, getWorkouts);
router.patch("/:id", verify, updateWorkout);
router.delete("/:id", verify, deleteWorkout);

module.exports = router;
