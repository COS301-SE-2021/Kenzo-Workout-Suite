const request=require('supertest');
const app= require('../../../app');

const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

describe('Matching a given title to workouts', () => {

    beforeEach(async () => {
        await request(app).post('/user/signupClient')
            .send(
                {
                    firstName: 'emailTest',
                    lastName: 'emailTest',
                    email: 'emailTest@gmail.com',
                    password: '12345'
                }
            )
        await request(app).post('/workout/createWorkout')
            .send(
                {
                    workoutTitle: 'Cardio',
                    workoutDescription: 'Increasing heart fitness',
                    exercises : [],
                    difficulty: 'EASY',
                    planner_Email: 'emailTest@gmail.com'
                }
            )
    });

    test('Should recieve valid information about workout with corresponding title', async () => {
        await request(app).post('/workout/getworkoutbytitle')
            .send(
                {
                    email: 'emailTest@gmail.com'
                }
            )
            .expect(200)
    });

    test('Should not recieve valid information about workout with corresponding title as workout does not exist', async () => {
        await request(app).post('/workout/getworkoutbytitle')
            .send(
                {
                    email: ' '
                }
            )
            .expect(404)
    });
});