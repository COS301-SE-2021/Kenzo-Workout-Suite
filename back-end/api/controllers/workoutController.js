const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const bcrypt= require('bcrypt');

exports.getWorkoutByTitle=async (req,res,next) =>
{
    const workouts = await prisma.workout.findMany({
        where: {
            workoutTitle: req.params.title
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
    const exercise = await prisma.exercise.findMany({
        where: {
            title : req.params.title
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
        data: exercise
    });
}

exports.getWorkoutByPlanner=async (req,res,next) =>
{
    const workouts = await prisma.workout.findMany({
        where: {
            planner_Email : req.params.email
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