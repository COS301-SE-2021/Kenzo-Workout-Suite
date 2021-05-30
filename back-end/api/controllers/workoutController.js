const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const bcrypt= require('bcrypt');

exports.getWorkoutByTitle=async (req,res,next) =>
{
    const workouts = await prisma.workout.findMany({
        where: {
            workoutTitle: req.body.title
        },
        select: {
            workoutTitle: true,
            workoutDescription: true,
            exercises: true,
            difficulty: true,
            planner_Email: true
        }
    });

    res.status(200).json({
        message: "Successfully retrieved workouts",
        data: workouts
    });
}

exports.getExerciseByTitle=async (req,res,next) =>
{
    const workouts = await prisma.exercise.findMany({
        where: {
            title : req.body.title
        },
        select: {
            title: true,
            description: true,
            repRange: true,
            sets: true,
            Posedescription: true,
            restPeriod: true,
            wasSkipped: true,
            difficulty: true,
            duratime: true,
            workout_id: true
        }
    });

    res.status(200).json({
        message: "Successfully retrieved exercise",
        data: workouts
    });
}

exports.getWorkoutByPlanner=async (req,res,next) =>
{

}