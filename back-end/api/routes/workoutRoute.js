const express = require ('express');

const router = express.Router();

const workoutController = require("../controllers/workoutController")

router.post('/getworkoutbytitle', workoutController.getWorkoutByTitle);
router.post('/getexercisebytitle', workoutController.getExerciseByTitle);
router.post('/getworkoutbyplanner', workoutController.getWorkoutByPlanner);

module.exports = router;