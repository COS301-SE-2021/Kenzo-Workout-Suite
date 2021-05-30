const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const bcrypt= require('bcrypt');

exports.getWorkoutByTitle=async (req,res,next) =>
{
    const workouts = await prisma.workout.findMany({
        select: {
            workoutTitle: true,
            workoutDescription: true,
            exercises: true, //STILL NEED TO TEST
            difficulty: true,
            planner_Email: true
        },
        where: {
            title : req.body.title
        }
    });

    res.status(200).json({
        message: "Successfully retrieved workouts",
        data: workouts
    });
}

exports.getExerciseByTitle=async (req,res,next) =>
{

}

exports.getWorkoutByPlanner=async (req,res,next) =>
{

}