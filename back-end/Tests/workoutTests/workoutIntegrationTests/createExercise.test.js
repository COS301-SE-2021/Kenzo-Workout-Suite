const request = require('supertest');
const app = require('../../../app');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


beforeEach(async ()=>{

    await prisma.exercise.deleteMany({where: {}});
    //keep in the event of needing uniqueness
    //await request(app).post('/workout/createWorkout')
    //    .send(
    //        {
    //            title: req.body.title,
    //            description: req.body.description,
    //            repRange: req.body.repRange,
    //            sets: req.body.sets,
    //            Posedescription: req.body.Posedescription,
    //            restPeriod: req.body.restPeriod,
    //            difficulty: req.body.difficulty,
    //            duratime: req.body.duratime
    //        }
    //    )
})

test("Should create a new exercise", async () =>{

    await request(app).post('/workout/createExercise')
        .send({
            title: "titleIntTest",
            description: "descriptionIntTest",
            repRange: "2-4IntTest",
            sets: 3,
            Posedescription: "poseDescIntTest",
            restPeriod: 30,
            difficulty: "MEDIUM",
            duratime: 120
        })
        .expect(201)
})

test("Should not create a new exercise because of missing title", async () =>{

    await request(app).post('/workout/createExercise')
        .send({
            description: "descriptionIntTest",
            repRange: "2-4IntTest",
            sets: 3,
            Posedescription: "poseDescIntTest",
            restPeriod: 30,
            difficulty: "MEDIUM",
            duratime: 120
        })
        .expect(500)
})

test("Should not create a new exercise because of missing description", async () =>{

    await request(app).post('/workout/createExercise')
        .send({
            title: "titleIntTest",
            repRange: "2-4IntTest",
            sets: 3,
            Posedescription: "poseDescIntTest",
            restPeriod: 30,
            difficulty: "MEDIUM",
            duratime: 120
        })
        .expect(500)
})

test("Should not create a new exercise because of missing rep range", async () =>{

    await request(app).post('/workout/createExercise')
        .send({
            title: "titleIntTest",
            description: "descriptionIntTest",
            sets: 3,
            Posedescription: "poseDescIntTest",
            restPeriod: 30,
            difficulty: "MEDIUM",
            duratime: 120
        })
        .expect(500)
})

test("Should not create a new exercise because of missing sets", async () =>{

    await request(app).post('/workout/createExercise')
        .send({
            title: "titleIntTest",
            description: "descriptionIntTest",
            repRange: "2-4IntTest",
            Posedescription: "poseDescIntTest",
            restPeriod: 30,
            difficulty: "MEDIUM",
            duratime: 120
        })
        .expect(500)
})

test("Should not create a new exercise because of missing pose description", async () =>{

    await request(app).post('/workout/createExercise')
        .send({
            title: "titleIntTest",
            description: "descriptionIntTest",
            repRange: "2-4IntTest",
            sets: 3,
            restPeriod: 30,
            difficulty: "MEDIUM",
            duratime: 120
        })
        .expect(500)
})

test("Should not create a new exercise because of missing rest period", async () =>{

    await request(app).post('/workout/createExercise')
        .send({
            title: "titleIntTest",
            description: "descriptionIntTest",
            repRange: "2-4IntTest",
            sets: 3,
            Posedescription: "poseDescIntTest",
            difficulty: "MEDIUM",
            duratime: 120
        })
        .expect(500)
})

test("Should not create a new exercise because of missing difficulty", async () =>{

    await request(app).post('/workout/createExercise')
        .send({
            title: "titleIntTest",
            description: "descriptionIntTest",
            repRange: "2-4IntTest",
            sets: 3,
            Posedescription: "poseDescIntTest",
            restPeriod: 30,
            duratime: 120
        })
        .expect(500)
})

test("Should not create a new exercise because of missing duratime", async () =>{

    await request(app).post('/workout/createExercise')
        .send({
            title: "titleIntTest",
            description: "descriptionIntTest",
            repRange: "2-4IntTest",
            sets: 3,
            Posedescription: "poseDescIntTest",
            restPeriod: 30,
            difficulty: "MEDIUM",
        })
        .expect(500)
})



