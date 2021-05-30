const express = require ('express');

const router = express.Router();

const workoutController = require("../controllers/workoutController")

router.get('/getworkoutbytitle/:title', workoutController.getWorkoutByTitle);
router.get('/getexercisebytitle/:title', workoutController.getExerciseByTitle);
router.get('/getworkoutbyplanner/:email', workoutController.getWorkoutByPlanner);

module.exports = router;