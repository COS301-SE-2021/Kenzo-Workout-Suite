const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const bcrypt= require('bcrypt');

function validateEmail(email) {//function to validate an email
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function isEmptyObject(obj) {//function to check whether a JSON object is empty or not
    return !Object.keys(obj).length;
}

exports.getWorkoutByTitle=async (req,res,next) =>
{
    try{
        const workouts = await prisma.workout.findMany({//search for workouts that meet the requirement
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

        if(isEmptyObject(workouts)){//if JSON object is empty, send error code
            res.status(404).json({
                message: "Unsuccessful. Workout does not exist in the database."
            });
        }
        else{
            res.status(200).json({//else send retrieved workouts
                message: "Successfully retrieved workouts",
                data: workouts
            });
        }
    }
    catch(err){
        res.status(500).json({//database error
            error: err
        });
    }
}

exports.getExerciseByTitle=async (req,res,next) =>
{
    try{
        const exercise = await prisma.exercise.findMany({//search for exercises that meet the requirement
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
                difficulty: true,
                duratime: true,
                workoutWorkoutID: true
            }
        });

        if(isEmptyObject(exercise)){//if JSON object is empty, send error code
            res.status(404).json({
                message: "Unsuccessful. Exercise does not exist in the database."
            });
        }
        else{
            res.status(200).json({//else send retrieved workouts
                message: "Successfully retrieved exercise",
                data: exercise
            });
        }
    }
    catch(err){
        res.status(500).json({//database error
            error: err
        });
    }
}

exports.getWorkoutByPlanner=async (req,res,next) =>
{
    if(validateEmail(req.params.email)==false){//first check if email passed is valid
        res.status(400).json({
            error:"Invalid email passed in."
        });
    }
    else{
        try{
            const workouts = await prisma.workout.findMany({//search for workouts that meet the requirement
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

            if(isEmptyObject(workouts)){//if JSON object is empty, send error code
                res.status(404).json({
                    message: "Unsuccessful. Planner does not exist in the database."
                });
            }
            else{
                res.status(200).json({//else send retrieved workouts
                    message: "Successfully retrieved workouts.",
                    data: workouts
                });
            }
        }
        catch(err){
            res.status(500).json({//database error
                error: err
            });
        }
    }
}