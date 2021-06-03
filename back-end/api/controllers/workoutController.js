const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()


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
exports.createExercise = async (req,res,next) =>{
    if(req.body.title === null || req.body.description === null || req.body.repRange === null || req.body.sets === null || req.body.Posedescription === null || req.body.restPeriod === null || req.body.wasSkipped === null || req.body.difficulty === null || req.body.duratime === null ){
        res.status(500).json(
            {
                error: "Required fields cannot be left empty."
            }
        );
    }else{
        try{
            await prisma.exercise.create({
                data: {
                    title: req.body.title,
                    description: req.body.description,
                    repRange: req.body.repRange,
                    sets: req.body.sets,
                    Posedescription: req.body.Posedescription,
                    restPeriod: req.body.restPeriod,
                    difficulty: req.body.difficulty,
                    duratime: req.body.duratime,
                    workout: req.body.workout,
                },
            })
            res.status(201).json(
                {
                    message: 'Workout Created'
                }
            )
        }catch(error){
            res.status(500).json(
                {
                    problem: error.name,
                    error: error.message
                }
            );
        }
    }


}

exports.createWorkout = async (req,res,next) =>{

    if(req.body.workoutTitle === null || req.body.workoutDescription === null || req.body.difficulty === null ){
        res.status(500).json(
            {
                error: "Required fields cannot be left empty."
            }
        );
    }else{
        try{
            await prisma.workout.create({
                data: {
                    workoutTitle: req.body.workoutTitle,
                    workoutDescription: req.body.workoutDescription,
                    exercises : req.body.exercises,
                    difficulty: req.body.difficulty,
                    planner: req.body.planner,
                    planner_Email: req.body.planner_Email
                },
            })
            res.status(201).json(
                {
                    message: 'Workout Created'
                }
            )
        }catch(error){
            res.status(500).json(
                {
                    problem: error.name,
                    error: error
                }
            );
        }
    }

}

exports.getWorkout=async (req,res,next) =>
{
    try{
        const workouts = await prisma.workout.findMany({//search for workouts that meet the requirement
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
                message: "Unsuccessful. No workouts in the database."
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
