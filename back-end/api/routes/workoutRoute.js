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
 *
 * /getexercisebytitle:
 *      get:
 *          summary: Returns a list of exercises
 *          description: Gets all the exercises in the database that have the same title provided
 *          parameters:
 *              - name: title
 *                in: path
 *                required: true
 *                description: The title of the exercise
 *                schema:
 *                      type: string
 *                example: Bicep curl's
 *
 *          responses:
 *              200:
 *                   description: An exercise object.
 *                   content:
 *                       application/json:
 *                           schema:
 *                               type: object
 *                               properties:
 *                                   title:
 *                                       type: string
 *                                       example: Bicep curl's
 *                                   description:
 *                                       type: string
 *                                       example: Curl the bicep
 *                                   repRange:
 *                                       type: string
 *                                       example: 8-12
 *                                   sets:
 *                                       type: integer
 *                                       format: int64
 *                                       example: 4
 *                                   Posedescription:
 *                                       type: string
 *                                       example: default
 *                                   restPeriod:
 *                                       type: string
 *                                       example: YYYY-MM-DD hh:mm:ss
 *                                   wasSkipped:
 *                                       type: boolean
 *                                       example: true/false
 *                                   difficulty:
 *                                      type: string
 *                                      example: EASY/MEDIUM/HARD/EXTREME
 *                                   duratime:
 *                                      type: string
 *                                      example: YYYY-MM-DD hh:mm:ss
 *                                   workout_id:
 *                                      type: string
 *                                      example: 1
 *              400:
 *                   description: The specified title is invalid.
 *              404:
 *                   description: An exercise with the specified title was not found.
 *              default:
 *                   description: Unexpected error
 *
 * /getworkoutbyplanner:
 *      get:
 *          summary: Returns a list of workouts
 *          description: Gets all the workouts in the database that have been created by the same planner, using the email provided
 *          parameters:
 *              - name: email
 *                in: path
 *                required: true
 *                description: The email of the planner
 *                schema:
 *                      type: string
 *                example: planner@email.com
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
 *                   description: The specified email is invalid.
 *              404:
 *                   description: A workout with the specified email was not found.
 *              default:
 *                   description: Unexpected error
 */
router.get('/getworkoutbytitle/:title', workoutController.getWorkoutByTitle);
router.get('/getexercisebytitle/:title', workoutController.getExerciseByTitle);
router.get('/getworkoutbyplanner/:email', workoutController.getWorkoutByPlanner);

module.exports = router;