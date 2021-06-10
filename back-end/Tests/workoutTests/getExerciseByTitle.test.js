const request=require('supertest');
const app= require('../../app');

const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

describe('Matching a given title to exercises - success',  () => {

    beforeEach(async () => {
        await request(app).post('/workout/createExercise')
            .send(
                {
                    title: 'Deadlift',
                    description: 'Lift barbell from ground',
                    repRange: '5-10',
                    sets: 4,
                    Posedescription: 'default',
                    restPeriod: 120,
                    difficulty: 'HARD',
                    duratime: 30
                }
            )
    });

    test('Should recieve valid information about exercise with corresponding title', async () => {
        await request(app).get('/workout/getexercisebytitle/Deadlift')
            .expect(200)
    });
});

describe('Matching a given title to exercises - failure', () => {
    test('Should not recieve valid information about exercise with corresponding title as workout does not exist', async () => {
        await request(app).get('/workout/getexercisebytitle/ ')
            .expect(404)
    });
});