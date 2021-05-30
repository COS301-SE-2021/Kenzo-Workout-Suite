const express = require ('express');

const router = express.Router();

const workoutController=require("../controllers/workoutController")

router.post('/createExercise', workoutController.createExercise);

module.exports = router;