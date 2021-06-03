const request=require('supertest');
const app= require('../../../app');

const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

beforeEach(async ()=>{

    await prisma.planner.deleteMany({where: {}});
    await prisma.client.deleteMany({where: {}});

    await request(app).post('/user/signupClient')
        .send(
            {
                firstName: 'IntegrationTest',
                lastName: 'IntegrationTest',
                email: 'signinclient@gmail.com',
                password: 'Zelu2000#'
            }
        )

    await request(app).post('/user/signupPlanner')
        .send(
            {
                firstName: 'IntegrationTest',
                lastName: 'IntegrationTest',
                email: 'signinplanner@gmail.com',
                password: 'Zelu2000#'
            }
        )
})


test('Should return error because of invalid email', async () =>
{
    await request(app).post('/user/signIn')
        .send(
            {
                email: 'signinplanner@gmail.com',
                password: 'Zelu2000'
            }
        )
        .expect(401)
})


test('Should return error because of invalid email', async () =>
{
    await request(app).post('/user/signIn')
        .send(
            {
                email: 'invalid@gmail.com',
                password: 'Zelu2000#'
            }
        )
        .expect(401)
})

test('Should return error because of empty email', async () =>
{
    await request(app).post('/user/signIn')
        .send(
            {
                email: '',
                password: 'Zelu2000#'
            }
        )
        .expect(400)
})