const request=require('supertest');
const app= require('../../app');

const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

describe('Retrieving all workouts - success', () => {

    beforeEach(async () => {
        await request(app).post('/workout/createWorkout')
            .send(
                {
                    workoutTitle: 'Strength training',
                    workoutDescription: 'Increasing strength',
                    difficulty: 'MEDIUM',
                }
            )
    });

    test('Should receive valid information about all workouts', async () => {
        await request(app).get('/workout/getworkout')
            .expect(200)
    });
});