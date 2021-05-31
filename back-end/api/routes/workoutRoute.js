const express = require ('express');

const router = express.Router();

const workoutController=require("../controllers/workoutController")
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
 *                      - wasSkipped
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
 *                      wasSkipped:
 *                          type: boolean
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
 *                      exercises:
 *                          type: Exercises
 *                      difficulty:
 *                          type: string
 *                          enum: ["EASY", "MEDIUM", "HARD", "EXTREME"]
 *                      planner:
 *                          type: Planner
 *                      planner_Email:
 *                          type: string
 *          responses:
 *              201:
 *                  description: Workout Created
 *              500:
 *                  description: Creation failed
 */
router.post('/createWorkout', workoutController.createWorkout);

module.exports = router;