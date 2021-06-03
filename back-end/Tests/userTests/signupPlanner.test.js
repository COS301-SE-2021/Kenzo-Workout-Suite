const request=require('supertest');
const app= require('../../app');

const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

beforeEach(async ()=>{
    await prisma.planner.deleteMany({where: {}}) //delete posts first
    await prisma.client.deleteMany({where: {}}) //
})


test('Should sign up a planner with valid details', async () =>
{
    await request(app).post('/user/signupPlanner')
        .send(
            {
                firstName: 'IntegrationTest',
                lastName: 'IntegrationTest',
                email: 'planner@gmail.com',
                password: 'Zelu2000#'
            }
        )
        .expect(201)

    const user= await prisma.planner.findUnique(
        {
            where: {
                email:'planner@gmail.com'
            },
        })

    expect(user.firstName).toBe("IntegrationTest")
    expect(user.lastName).toBe("IntegrationTest")
    expect(user.email).toBe("planner@gmail.com")
})

test('Should not sign up planner because of invalid email', async () =>
{
    await request(app).post('/user/signUpPlanner')
        .send(
            {
                firstName: 'IntegrationTest',
                lastName: 'IntegrationTest',
                email: 'signupclient.com',
                password: 'Zelu2000#'
            }
        )
        .expect(400)

})

test('Should not sign up planner: invalid password', async () =>
{
    await request(app).post('/user/signUpPlanner')
        .send(
            {
                firstName: 'IntegrationTest',
                lastName: 'IntegrationTest',
                email: 'signupclient@gmail.com',
                password: 'Zelu2000'
            }
        )
        .expect(400)

})


