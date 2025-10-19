const Workouts = require("../models/Workout");


// Add Workout
module.exports.addWorkout = async (req, res, next) => {
  try {
    const { name, duration, status } = req.body;

    if (!name || !duration)
      return res.status(400).send({ message: "Name and duration are required." });

    const workout = await Workout.create({
      name,
      duration,
      status: status || "pending",
      user: req.user.id
    });

    res.status(201).send({ userId: req.user.id,
      ...workout.toObject() });
  } catch (err) {
    next(err);
  }
};

// Get All Workouts for User
module.exports.getWorkouts = async (req, res, next) => {
  try {
    const workout = await Workout.find({ user: req.user.id });

    const reorderedWorkouts = workouts.map(w => ({
      _id: w._id,
      userId: w.user,
      name: w.name,
      duration: w.duration,
      status: w.status,
      dateAdded: w.dateAdded, 
      __v: w.__v
    }));

    return res.status(200).json({
      workouts: reorderedWorkouts
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error retrieving workouts"
    });
  }
};


// Update Workout
module.exports.updateWorkout = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Workout.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).send({ message: "Workout not found or unauthorized." });

    const reorderedWorkout = {
      _id: updated._id,
      userId: updated.user, 
      name: updated.name,
      duration: updated.duration,
      status: updated.status,
      dateAdded: updated.dateAdded,
      __v: updated.__v
    };

    res.status(200).send({
      message: "Workout updated successfully.",
      updatedWorkout: reorderedWorkout
    });
  } catch (err) {
    next(err);
  }
};


// Delete Workout
module.exports.deleteWorkout = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Workout.findOneAndDelete({ _id: id, user: req.user.id });

    if (!deleted)
      return res.status(404).send({ message: "Workout not found or unauthorized." });

    res.status(200).send({ message: "Workout deleted successfully." });
  } catch (err) {
    next(err);
  }
};
