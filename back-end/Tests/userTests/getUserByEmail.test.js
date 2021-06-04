const request=require('supertest');
const app= require('../../app');

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


test('Should not retrieve data about corresponding email because of non existent email.', async () =>
{
    await request(app).post('/user/getUserByEmail')
        .send(
            {
                email: 'incorrectemail@gmail.com'
            }
        )
        .expect(401)
})

test('Should not retrieve user email because of empty email.', async () =>
{
    await request(app).post('/user/getUserByEmail')
        .send(
            {
                email: ''
            }
        )
        .expect(400)
})
