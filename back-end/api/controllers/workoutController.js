const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const bcrypt= require('bcrypt');

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

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
    if(validateEmail(req.params.email)==false){
        res.status(400).json({
            error:"Invalid email passed in."
        });
    }
    else{
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

        if(isEmptyObject(workouts)){
            res.status(404).json({
                message: "Unsuccessful. Planner does not exist in the database."
            });
        }
        else{
            res.status(200).json({
                message: "Successfully retrieved workouts.",
                data: workouts
            });
        }
    }
}