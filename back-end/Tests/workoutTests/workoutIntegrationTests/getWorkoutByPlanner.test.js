const request=require('supertest');
const app= require('../../../app');

const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

describe('Matching a given email to workouts planner', () => {

    beforeEach(async () => {
        await request(app).post('/user/signupPlanner') //not working
            .send(
                {
                    firstName: "test",
                    lastName: "test",
                    email: "testing@gmail.com",
                    password: "test2000#"
                }
            )
        await request(app).post('/workout/createWorkout')
            .send(
                {
                    workoutTitle: 'Pullups',
                    workoutDescription: 'Working muscle on the back',
                    difficulty: 'MEDIUM',
                }
            )
    });

    test('Should receive valid information about workout with corresponding planner', async () => {
        await request(app).get('/workout/getworkoutbyplanner/planner@email.com')
            .expect(200)
    });

    test('Should receive error for invalid email', async () => {
        await request(app).get('/workout/getworkoutbyplanner/invalid')
            .expect(400)
    });

    test('Should not receive valid information about workout with corresponding planner as workout does not exist', async () => {
        await request(app).get('/workout/getworkoutbyplanner/ ')
            .expect(404)
    });

});