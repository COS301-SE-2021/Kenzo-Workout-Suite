const request=require('supertest');
const app= require('../../../app');

const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

describe('Matching a given email to workouts planner - success', () => {

    beforeEach(async () => {
        await request(app).post('/user/signupPlanner')
            .send(
                {
                    firstName: "test",
                    lastName: "test",
                    email: "testing2@gmail.com",
                    password: "Test2000#"
                }
            )
        await request(app).post('/workout/createWorkout')
            .send(
                {
                    workoutTitle: 'Pull-ups',
                    workoutDescription: 'Working muscle on the back',
                    difficulty: 'MEDIUM',
                    planner_Email: 'testing2@gmail.com'
                }
            )
    });

    test('Should receive valid information about workout with corresponding planner', async () => {
        await request(app).get('/workout/getworkoutbyplanner/testing2@gmail.com')
            .expect(200)
    });

});

describe('Matching a given email to workouts planner - failure', () => {
    test('Should receive error for invalid email', async () => {
        await request(app).get('/workout/getworkoutbyplanner/invalid')
            .expect(400)
    });

    test('Should not receive valid information about workout with corresponding planner as workout does not exist', async () => {
        await request(app).get('/workout/getworkoutbyplanner/ ')
            .expect(404)
    });
});