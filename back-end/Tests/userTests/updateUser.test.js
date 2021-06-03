const request=require('supertest');
const app= require('../../app');

const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

beforeEach(async ()=>{

    await prisma.planner.deleteMany({where: {}})
    await prisma.client.deleteMany({where: {}})
    await request(app).post('/user/signupClient')
        .send(
            {
                firstName: 'updateTest',
                lastName: 'updateTest',
                email: 'updatetest@gmail.com',
                password: 'Zelu2000#'
            }
        )
})


test('Should not update users details because of invalid email', async () =>
{
    await request(app).put('/user/updateUser')
        .send(
            {
                firstName: 'updateTest1',
                lastName: 'updateTest',
                email: 'invalidemail@gmail.com',
                dateOfBirth: null
            }
        )
        .expect(401)
})

test('Should not update due to null value passed in ', async () =>
{
    await request(app).put('/user/updateUser')
        .send(
            {
                firstName: '',
                lastName: '',
                email: 'invalidemail@gmail.com',
                dateOfBirth: null
            }
        )
        .expect(400)
})
