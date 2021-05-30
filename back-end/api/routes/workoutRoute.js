const express = require ('express');

const router = express.Router();

const workoutController = require("../controllers/workoutController")

router.get('/getworkoutbytitle', workoutController.getWorkoutByTitle);
router.get('/getexercisebytitle', workoutController.getExerciseByTitle);
router.get('/getworkoutbyplanner', workoutController.getWorkoutByPlanner);

module.exports = router;