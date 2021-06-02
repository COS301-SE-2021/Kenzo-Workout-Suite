const request=require('supertest');
const app= require('../../../app');

const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()


beforeEach(async ()=>{
    await prisma.planner.deleteMany({where: {}}) //delete posts first
    await prisma.client.deleteMany({where: {}}) //
})



test('Should sign up a planner', async () =>
{
    await request(app).post('/user/signUpClient')
        .send(
            {
                firstName: 'IntegrationTest',
                lastName: 'IntegrationTest',
                email: 'signupclient@gmail.com',
                password: 'Zelu2000#'
            }
        )
        .expect(201)

    const user= await prisma.client.findUnique(
        {
            where: {
                email:'signupclient@gmail.com'
            },
        })

    expect(user.firstName).toBe("IntegrationTest")
    expect(user.lastName).toBe("IntegrationTest")
    expect(user.email).toBe("signupclient@gmail.com")
})

test('Should sign up a planner', async () =>
{
    await request(app).post('/user/signUpClient')
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

test('Should sign up a planner', async () =>
{
    await request(app).post('/user/signUpClient')
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