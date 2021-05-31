const express = require ('express');

const router = express.Router();

const workoutController = require("../controllers/workoutController")

/**
 * @swagger
 *  /getworkoutbytitle:
 *      get:
 *          description: Gets all the workouts in the database that have the same title provided
 *          parameters:
 *          - title: title of the workout
 *
 *          responses:
 *              200:
 *                  description: Success
 */
router.get('/getworkoutbytitle/:title', workoutController.getWorkoutByTitle);
router.get('/getexercisebytitle/:title', workoutController.getExerciseByTitle);
router.get('/getworkoutbyplanner/:email', workoutController.getWorkoutByPlanner);

module.exports = router;