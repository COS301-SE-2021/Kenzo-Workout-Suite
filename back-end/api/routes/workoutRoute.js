const express = require ('express');

const router = express.Router();

const workoutController = require("../controllers/workoutController")

/**
 * @swagger
 *  /getworkoutbytitle:
 *      get:
 *          summary: Returns a list of workouts
 *          description: Gets all the workouts in the database that have the same title provided
 *          parameters:
 *              - name: title
 *                in: path
 *                required: true
 *                description: The title of the workout
 *                schema:
 *                      type: string
 *                example: Push/Pull
 *
 *          responses:
 *              200:
*                   description: A workout object.
*                   content:
*                       application/json:
*                           schema:
*                               type: object
*                               properties:
*                                   workoutTitle:
*                                       type: string
*                                       example: Push/Pull
*                                   workoutDescription:
*                                       type: string
*                                       example: Exercises that focus on pushing the weight
*                                   exercises:
*                                       type: array
*                                   difficulty:
*                                      type: string
*                                      example: EASY/MEDIUM/HARD/EXTREME
*                                   planner_Email:
*                                      type: string
*                                      example: planner@email.com
*              400:
*                   description: The specified title is invalid.
*              404:
*                   description: A workout with the specified title was not found.
*              default:
*                   description: Unexpected error
 */
router.get('/getworkoutbytitle/:title', workoutController.getWorkoutByTitle);
router.get('/getexercisebytitle/:title', workoutController.getExerciseByTitle);
router.get('/getworkoutbyplanner/:email', workoutController.getWorkoutByPlanner);

module.exports = router;