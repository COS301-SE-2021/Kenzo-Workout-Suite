const request = require('supertest');
const app = require('../../../app');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


beforeEach(async ()=>{

    await prisma.workout.deleteMany({where: {}});
    //keep in the event of needing uniqueness
    //await request(app).post('/workout/createWorkout')
    //    .send(
    //        {
    //            workoutTitle: "workoutIntTest",
    //            workoutDescription: "workoutIntTest",
    //            difficulty: "EASY"
    //        }
    //    )
})

test("Should create a new workout", async () =>{

    await request(app).post('/workout/createWorkout')
        .send({
            workoutTitle: "workoutTitleIntTest",
            workoutDescription: "workoutDescriptionIntTest",
            difficulty: "EASY"
        })
        .expect(201)
})

test("Should not create a new workout due to missing title", async () =>{

    await request(app).post('/workout/createWorkout')
        .send({
            workoutDescription: "workoutDescriptionIntTest",
            difficulty: "EASY"
        })
        .expect(500)
})

test("Should not create a new workout due to missing description", async () =>{

    await request(app).post('/workout/createWorkout')
        .send({
            workoutTitle: "workoutTitleIntTest",
            difficulty: "EASY"
        })
        .expect(500)
})



test("Should not create a new workout due to missing difficulty", async () =>{

    await request(app).post('/workout/createWorkout')
        .send({
            workoutTitle: "workoutTitleIntTest",
            workoutDescription: "workoutDescriptionIntTest"
        })
        .expect(500)
})

