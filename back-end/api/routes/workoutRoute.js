const express = require ('express');

const router = express.Router();

const workoutController=require("../controllers/workoutController")

router.post('/createExercise', workoutController.createExercise);
router.post('/createWorkout', workoutController.createWorkout);

module.exports = router;