const request=require('supertest');
const userController= require('../../../../back-end/api/controllers/userController');

test('Should not retrieve data about corresponding email because of non existent email.', async () =>
{
    req= {
        firstName: 'emailTest',
        lastName: 'emailTest',
        email: 'emailTest@gmail.com',
        password: 'Zelu2000#'
    }

    await userController.signUpClient(req)
})

