const request=require('supertest');
const app= require('../../../app');

const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

beforeEach(async ()=>{
    await request(app).post('/user/signupClient')
        .send(
            {
                firstName: 'emailTest',
                lastName: 'emailTest',
                email: 'emailTest@gmail.com',
                password: 'Zelu2000#'
            }
        )
})

test('Sould retrieve valid detail about user with corresponding email', async () =>
{
    await request(app).post('/user/getUserByEmail')
        .send(
            {
                email: 'emailTest@gmail.com'
            }
        )
        .expect(201)
})

test('Should not retrieve data about corresponding email', async () =>
{
    await request(app).post('/user/getUserByEmail')
        .send(
            {
                email: 'incorrectemail@gmail.com'
            }
        )
        .expect(401)
})

test('Passing in empty string into getUserByEmail', async () =>
{
    await request(app).post('/user/getUserByEmail')
        .send(
            {
                email: ''
            }
        )
        .expect(400)
})
