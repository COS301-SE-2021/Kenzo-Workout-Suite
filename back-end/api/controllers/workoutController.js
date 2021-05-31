const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

exports.createExercise = async (req,res,next) =>{
    //console.log(req.body);
    try{
        await prisma.exercise.create({
            data: {
                title: req.body.title,
                description: req.body.description,
                repRange: req.body.repRange,
                sets: req.body.sets,
                Posedescription: req.body.Posedescription,
                restPeriod: req.body.restPeriod,
                wasSkipped: req.body.wasSkipped,
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
        //console.log(error);
        res.status(500).json(
            {
                problem: error.name,
                error: error.message
            }
        );
    }

}

exports.createWorkout = async (req,res,next) =>{

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
        //console.log(error.body);
        res.status(500).json(
            {
                problem: error.name,
                error: error.message,
            }
        );
    }

}
