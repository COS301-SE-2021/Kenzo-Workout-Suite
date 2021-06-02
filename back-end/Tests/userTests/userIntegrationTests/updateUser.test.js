const request=require('supertest');
const app= require('../../../app');

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

test('Should update users details', async () =>
{
    await request(app).post('/user/updateUser')
        .send(
            {
                firstName: 'updateTest1',
                lastName: 'updateTest',
                email: 'updatetest@gmail.com',
                dateOfBirth: null
            }
        )
        .expect(201)

    const user= await prisma.client.findUnique(
    {
        where: {
            email:'updatetest@gmail.com'
    },
    })

    expect(user.firstName).toBe('updateTest1');
})

test('Should update users details', async () =>
{
    await request(app).post('/user/updateUser')
        .send(
            {
                firstName: 'updateTest1',
                lastName: 'updateTest',
                email: 'invalidemail@gmail.com',
                dateOfBirth: null
            }
        )
        .expect(401)

    const user= await prisma.client.findUnique(
        {
            where: {
                email:'updatetest@gmail.com'
            },
        })

    expect(user.firstName).toBe('updateTest');

})

test('Should update users details', async () =>
{
    await request(app).post('/user/updateUser')
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
