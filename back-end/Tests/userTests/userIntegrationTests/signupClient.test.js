const request=require('supertest');
const app= require('../../../app');

const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()


beforeEach(async ()=>{
    await prisma.planner.deleteMany({where: {}}) //delete posts first
    await prisma.client.deleteMany({where: {}}) //
})



test('Should sign up client with valid information', async () =>
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
})

test('Should not sign up client: invalid password', async () =>
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

test('Should not sign up client because of invalid email', async () =>
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