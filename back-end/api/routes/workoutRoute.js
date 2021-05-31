const express = require ('express');

const router = express.Router();

const workoutController=require("../controllers/workoutController")
/**
 * @swagger
 *  /createExercise:
 *  post:
 *      description: Creates a new entry for an exercise in the database
 *      parameters:
 *      -   name: title
 *          description:
 *          in: formData
 *          required: true
 *          type: string
 *      -   name: description
 *          description:
 *          in: formData
 *          required: true
 *          type: string
 *      -   name: repRange
 *          description:
 *          in: formData
 *          required: true
 *          type: string
 *      -   name: sets
 *          description:
 *          in: formData
 *          required: true
 *          type:
 *      -   name: Posedescription
 *          description:
 *          in: formData
 *          required: true
 *          type: string
 *      -   name: restPeriod
 *          description:
 *          in: formData
 *          required: true
 *          type: Int
 *      -   name: wasSkipped
 *          description:
 *          in: formData
 *          required: true
 *          type: boolean
 *      -   name: difficulty
 *          description:
 *          in: formData
 *          required: true
 *          type: enum
 *      -   name: duratime
 *          description:
 *          in: formData
 *          required: true
 *          type: Int
 *      -   name: workout
 *          description:
 *          in: formData
 *          required: false
 *          type: workout
 *          responses:
 *              201:
 *                  description: Success
 */
router.post('/createExercise', workoutController.createExercise);

router.post('/createWorkout', workoutController.createWorkout);

module.exports = router;