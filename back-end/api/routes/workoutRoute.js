const express = require ('express');

const router = express.Router();


const workoutController = require("../controllers/workoutController")

/**
 * @swagger
 *  /workout/getworkoutbytitle/{title}:
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
 */
router.get('/getworkoutbytitle/:title', workoutController.getWorkoutByTitle);

/**
 * @swagger
 * /workout/getexercisebytitle/{title}:
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
 *                                       type: integer
 *                                       format: int64
 *                                       example: 15 (seconds)
 *                                   difficulty:
 *                                      type: string
 *                                      example: EASY/MEDIUM/HARD/EXTREME
 *                                   duratime:
 *                                      type: integer
 *                                      format: int64
 *                                      example: 30 (seconds)
 *                                   workout_id:
 *                                      type: string
 *                                      example: 1
 *              400:
 *                   description: The specified title is invalid.
 *              404:
 *                   description: An exercise with the specified title was not found.
 *              default:
 *                   description: Unexpected error
 */
router.get('/getexercisebytitle/:title', workoutController.getExerciseByTitle);

/**
 * @swagger
 * /workout/getworkoutbyplanner/{email}:
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
router.get('/getworkoutbyplanner/:email', workoutController.getWorkoutByPlanner);

/**
 * @swagger
 *  /workout/createExercise:
 *      post:
 *          summary: Creates a new Exercise.
 *          consumes:
 *              - application/json
 *          parameters:
 *            - in: body
 *              name: user
 *              description: This use case creates a new Exercise
 *              schema:
 *                  type: object
 *                  required:
 *                      - title
 *                      - description
 *                      - repRange
 *                      - sets
 *                      - Posedescription
 *                      - restPeriod
 *                      - difficulty
 *                      - duratime
 *                  properties:
 *                      title:
 *                          type: string
 *                      description:
 *                          type: string
 *                      repRange:
 *                          type: string
 *                      sets:
 *                          type: integer
 *                      Posedescription:
 *                          type: string
 *                      restPeriod:
 *                          type: integer
 *                      difficulty:
 *                          type: string
 *                          enum: ["EASY", "MEDIUM", "HARD", "EXTREME"]
 *                      duratime:
 *                          type: integer
 *          responses:
 *              201:
 *                  description: Created
 *              500:
 *                  description: Creation failed
 */
router.post('/createExercise', workoutController.createExercise);
/**
 * @swagger
 *  /workout/createWorkout:
 *      post:
 *          summary: Creates a new Workout.
 *          consumes:
 *              - application/json
 *          parameters:
 *            - in: body
 *              name: user
 *              description: This use case creates a new Exercise
 *              schema:
 *                  type: object
 *                  required:
 *                      - workoutTitle
 *                      - workoutDescription
 *                      - difficulty
 *                  properties:
 *                      workoutTitle:
 *                          type: string
 *                      workoutDescription:
 *                          type: string
 *                      difficulty:
 *                          type: string
 *                          enum: ["EASY", "MEDIUM", "HARD", "EXTREME"]
 *          responses:
 *              201:
 *                  description: Workout Created
 *              500:
 *                  description: Creation failed
 */
router.post('/createWorkout', workoutController.createWorkout);

/**
 * @swagger
 *  /workout/getworkout:
 *      get:
 *          summary: Returns a list of workouts
 *          description: Gets all the workouts in the database
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
 *              404:
 *                   description: No workouts were found in the database.
 *              default:
 *                   description: Unexpected error
 *
 */
router.get('/getworkout', workoutController.getWorkout);


module.exports = router;