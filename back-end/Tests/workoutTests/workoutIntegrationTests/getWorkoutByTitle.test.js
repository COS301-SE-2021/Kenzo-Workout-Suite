const request=require('supertest');
const app= require('../../../app');

const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

describe('Matching a given title to workouts', () => {

    beforeEach(async () => {
        await request(app).post('/workout/createWorkout')
            .send(
                {
                    workoutTitle: 'Cardio',
                    workoutDescription: 'Increasing heart fitness',
                    difficulty: 'EASY',
                }
            )
    });

    test('Should recieve valid information about workout with corresponding title', async () => {
        await request(app).get('/workout/getworkoutbytitle/Push')
            .expect(200)
    });

    test('Should not recieve valid information about workout with corresponding title as workout does not exist', async () => {
        await request(app).get('/workout/getworkoutbytitle/ ')
            .expect(404)
    });
});