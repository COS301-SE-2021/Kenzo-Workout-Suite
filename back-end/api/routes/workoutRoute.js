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
 */
router.post('/createExercise', workoutController.createExercise);

router.post('/createWorkout', workoutController.createWorkout);

module.exports = router;